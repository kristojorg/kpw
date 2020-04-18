import { useHistory } from "react-router-dom";
import * as React from "react";
import useTypedSelector from "./useTypedSelector";
import { useActions } from "opds-web-client/lib/components/context/ActionsContext";
import useCatalogLink from "./useCatalogLink";

/**
 * Will get auth data from cookies and make sure it's saved to redux
 * and will also provide auth data from the redux store, as well as
 * the calculated isSignedIn value
 */
function useAuth() {
  const authState = useTypedSelector(state => state.auth);
  const isSignedIn = !!authState?.credentials;
  const { fetcher, actions, dispatch } = useActions();
  const history = useHistory();
  const homeUrl = useCatalogLink(undefined, undefined);

  const signOut = () => dispatch(actions.clearAuthCredentials());
  const signOutAndGoHome = () => {
    signOut();
    history.push(homeUrl);
  };
  /**
   * On mount, we need to check for auth data in cookies. This used
   * to be done in componentWillMount of Root in OPDS
   */
  React.useEffect(() => {
    // get the credentials
    const credentials = fetcher.getAuthCredentials();
    // save the credentials if they exist
    if (credentials) {
      dispatch(actions.saveAuthCredentials(credentials));
    }
  }, [dispatch, actions, fetcher]);

  return { isSignedIn, signOut, signOutAndGoHome, ...authState };
}

export default useAuth;
