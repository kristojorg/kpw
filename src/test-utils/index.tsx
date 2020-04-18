import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "theme-ui";
import theme from "../theme";
import ContextProvider from "../components/context/ContextProvider";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import library from "./fixtures/library";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import BasicAuthPlugin from "../auth/basicAuthPlugin";
import buildStore from "opds-web-client/lib/store";
import { State } from "opds-web-client/lib/state";
import { LibraryData } from "../interfaces";
import "./mockScrollTo";
import * as fixtures from "./fixtures";
import ActionsCreator from "opds-web-client/lib/actions";
import DataFetcher from "opds-web-client/lib/DataFetcher";
import { adapter } from "opds-web-client/lib/OPDSDataAdapter";
import serializer from "jest-emotion";

expect.addSnapshotSerializer(serializer);

/**
 * uncomment this if you would like console errors to to
 * error the test. Useful if you don't know where a console
 * error is coming from.
 */
// const consoleErrorSpy = jest.spyOn(global.console, "error");
// consoleErrorSpy.mockImplementation((msg, ...opts) => {
//   console.warn(msg, ...opts);
//   throw new Error(msg);
// });

export { fixtures };

configure({ adapter: new Adapter() });

/**
 * mock out the window.URL.createObjectURL since it isn't
 * available on jsdom
 */
const mockCreateObjectURL = jest.fn();
global["URL"].createObjectURL = mockCreateObjectURL;

/**
 * We create the actions and fetcher here so that they can
 * be imported by our test file and spied on using:
 * jest.spyOn(actions, "fetchSearchDescription")
 * and then asserted against
 */
export const fetcher = new DataFetcher({ adapter });
export const actions = new ActionsCreator(fetcher);

type CustomRenderOptions = Parameters<typeof render>[1] & {
  route?: string;
  initialState?: State;
  library?: LibraryData;
};
const customRender = (ui: any, options?: CustomRenderOptions) => {
  const pathFor = jest
    .fn()
    .mockImplementation((collectionUrl?: string, bookUrl?: string) =>
      `/${collectionUrl}` + bookUrl ? `/${bookUrl}` : ""
    );

  const store = buildStore(options?.initialState, [BasicAuthPlugin], pathFor);

  // spy on dispatch by default
  const origDispatch = store.dispatch;
  const mockDispatch: jest.Mock<typeof origDispatch> = jest
    .fn()
    .mockImplementation(origDispatch);
  store.dispatch = mockDispatch as typeof origDispatch;
  // const dispatch = jest.spyOn(store, "dispatch");

  const history = createMemoryHistory({
    initialEntries: [options?.route ?? "/"]
  });
  const AllTheProviders = ({ children }) => {
    return (
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <ContextProvider
            library={options?.library ?? library}
            shortenUrls
            helmetContext={{}}
            initialState={options?.initialState}
            store={store}
            fetcher={fetcher}
            actions={actions}
          >
            {children}
          </ContextProvider>
        </ThemeProvider>
      </Router>
    );
  };

  return {
    ...render(ui, { wrapper: AllTheProviders, ...options }),
    // we pass our mocks along so they can be used in assertions
    store,
    history,
    dispatch: mockDispatch
  };
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
