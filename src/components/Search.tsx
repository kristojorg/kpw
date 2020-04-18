/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import TextInput from "./TextInput";
import Button from "./Button";
import { useActions } from "opds-web-client/lib/components/context/ActionsContext";
import { useHistory } from "react-router-dom";
import useTypedSelector from "../hooks/useTypedSelector";
import { usePathFor } from "opds-web-client/lib/components/context/PathForContext";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Search component providing input and
 * search button with styles and defaults. Relies on OWC
 * searchData and fetchSearchDescription
 *
 * 1. fetchSearchDescription whenever the url changes to get searchData
 * 2. use searchData to populate the title and placeholder
 */
const Search: React.FC<SearchProps> = ({ ...props }) => {
  const [value, setValue] = React.useState("");
  const history = useHistory();
  const searchData = useTypedSelector(state => state?.collection?.data?.search);
  const { actions, dispatch } = useActions();
  const pathFor = usePathFor();

  React.useEffect(() => {
    // fetch the search description
    if (searchData?.url) {
      dispatch(actions.fetchSearchDescription(searchData?.url));
    }
  }, [actions, dispatch, searchData]);

  // handle the search
  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerms = encodeURIComponent(value);
    const url = searchData?.searchData?.template(searchTerms);
    history.push(pathFor(url, null));
  };

  return (
    <form
      sx={{
        display: "inline-block"
      }}
      onSubmit={onSearch}
      role="search"
    >
      <TextInput
        type="search"
        name="search"
        title={searchData?.searchData?.shortName}
        placeholder={searchData?.searchData?.shortName}
        aria-label="Enter search keyword or keywords"
        value={value}
        onChange={e => setValue(e.target.value)}
        {...props}
      />
      <Button type="submit" sx={{ m: 1 }}>
        Search
      </Button>
    </form>
  );
};

export default Search;
