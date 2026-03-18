import PropTypes from "prop-types";

const SearchBar = ({ value, onChange, customTheme = {} }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="table-search"
      style={customTheme.searchBar}
    />
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  customTheme: PropTypes.object,
};

export default SearchBar;
