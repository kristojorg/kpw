import * as React from "react";
import { shallow } from "enzyme";
import { renderHook } from "@testing-library/react-hooks";
import AppContextProvider from "../ContextProvider";
import buildStore from "opds-web-client/lib/store";
import { usePathFor } from "opds-web-client/lib/components/context/PathForContext";
import { LibraryData } from "interfaces";
import { State } from "opds-web-client/lib/state";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import useLibraryContext from "../LibraryContext";

const TestComponent: React.FC = () => <div>test child</div>;

const testLibrary: LibraryData = {
  id: "TEST",
  catalogUrl: "http://example.com/home",
  catalogName: "Example",
  libraryLinks: {}
};

type MakeContextConfig = {
  library?: LibraryData;
  initialState?: State;
  shortenUrls?: boolean;
  route?: string;
};

const makeContextWrapper = (config: MakeContextConfig = {}) => ({
  children
}) => {
  const {
    library = testLibrary,
    initialState,
    shortenUrls = false,
    route = "/"
  } = config;
  const history = createMemoryHistory({
    initialEntries: [route]
  });
  return (
    <Router history={history}>
      <AppContextProvider
        library={library}
        initialState={initialState}
        shortenUrls={shortenUrls}
      >
        {children}
      </AppContextProvider>
    </Router>
  );
};

describe("ContextProvider", () => {
  test("provides pathFor in context", () => {
    const { result } = renderHook(() => usePathFor(), {
      wrapper: makeContextWrapper()
    });

    expect(typeof result.current).toBe("function");
  });

  test("provides library in context", () => {
    const { result } = renderHook(() => useLibraryContext(), {
      wrapper: makeContextWrapper()
    });
    expect(result.current).toEqual(testLibrary);
  });

  test("renders child", () => {
    const store = buildStore();
    const wrapper = shallow(
      <AppContextProvider
        library={testLibrary}
        initialState={store.getState()}
        shortenUrls
      >
        <TestComponent />
      </AppContextProvider>
    );
    const children = wrapper.find(TestComponent);
    expect(children.length).toBe(1);
  });

  describe("pathFor", () => {
    const collectionUrl = "collection/url";
    const bookUrl = "book/url";

    test("returns a path with collection and book", () => {
      const { result } = renderHook(() => usePathFor(), {
        wrapper: makeContextWrapper()
      });
      const path = result.current(collectionUrl, bookUrl);
      expect(path).toMatchInlineSnapshot(
        `"/TEST/collection/collection%2Furl/book/book%2Furl"`
      );
    });

    test("returns a path with only collection", () => {
      const { result } = renderHook(() => usePathFor(), {
        wrapper: makeContextWrapper()
      });
      const path = result.current(collectionUrl, null);
      expect(path).toMatchInlineSnapshot(`"/TEST/collection/collection%2Furl"`);
    });

    test("returns a path with only book", () => {
      const { result } = renderHook(() => usePathFor(), {
        wrapper: makeContextWrapper()
      });
      const path = result.current(null, bookUrl);
      expect(path).toMatchInlineSnapshot(`"/TEST/book/book%2Furl"`);
    });

    test("returns a path with no collection or book", () => {
      const { result } = renderHook(() => usePathFor(), {
        wrapper: makeContextWrapper()
      });
      const path = result.current(null, null);
      expect(path).toMatchInlineSnapshot(`"/TEST"`);
    });

    test("returns a path with no collection or book and no library id", () => {
      const libraryWithoutId: LibraryData = {
        libraryLinks: {},
        id: undefined,
        catalogUrl: "http://example.com/home",
        catalogName: "Example"
      };
      const { result } = renderHook(() => usePathFor(), {
        wrapper: makeContextWrapper({ library: libraryWithoutId })
      });
      const path = result.current(null, null);
      expect(path).toBe("/");
    });
  });
});
