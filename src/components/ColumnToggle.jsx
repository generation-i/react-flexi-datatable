import { useState } from "react";
import PropTypes from "prop-types";

const ColumnToggle = ({
  columns = [],
  visibleColumns = [],
  setVisibleColumns,
  customTheme = {},
}) => {
  const [open, setOpen] = useState(false);

  const toggleColumn = (accessor) => {
    if (visibleColumns.includes(accessor)) {
      setVisibleColumns(visibleColumns.filter((c) => c !== accessor));
    } else {
      setVisibleColumns([...visibleColumns, accessor]);
    }
  };

  return (
    <div className="column-toggle" style={customTheme.columnToggle}>
      <button
        onClick={() => setOpen(!open)}
        className="column-btn"
        style={customTheme.columnBtn}
      >
        Select Columns ▼
      </button>

      {open && (
        <div className="column-dropdown" style={customTheme.columnDropdown}>
          {columns.map((col) => (
            <label key={col.accessor} style={customTheme.columnLabel}>
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.accessor)}
                onChange={() => toggleColumn(col.accessor)}
                style={customTheme.columnInput}
              />
              {col.header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

ColumnToggle.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    }),
  ).isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  setVisibleColumns: PropTypes.func.isRequired,
  customTheme: PropTypes.object,
};

export default ColumnToggle;
