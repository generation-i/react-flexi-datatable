import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useTable from "../hooks/useTable";
import useColumnDrag from "../hooks/useColumnDrag";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import ColumnToggle from "./ColumnToggle";
import exportCSV from "../utils/exportCSV";
import "../styles/table.css";

const DataTable = ({
  columns = [],
  data = [],
  page = 1,
  perPage = 10,
  onPageChange,
  onDelete,
  theme = "default",
  customTheme = {},
  isSearch = false,
  isCSV = false,
  isColumnToggle = false,
  isMassDelete = false,
  isRowPerPage = false,
  isPagination = false,
}) => {
  const { filteredData, search, setSearch, sortColumn, sortField, sortOrder } =
    useTable(data);

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.accessor),
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [rowsPerPage, setRowsPerPage] = useState(perPage);

  const { handleDragStart, handleDrop } = useColumnDrag(
    visibleColumns,
    setVisibleColumns,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, data]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const orderedColumns = columns
    .filter((c) => visibleColumns.includes(c.accessor))
    .sort(
      (a, b) =>
        visibleColumns.indexOf(a.accessor) -
        visibleColumns.indexOf(b.accessor),
    );

  const getSortIndicator = (col) => {
    if (!col.sortable) return null;
    if (sortField === col.accessor) {
      return sortOrder === "asc" ? " ▲" : " ▼";
    }
    return " ↕";
  };

  const toggleRow = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...filteredData]);
    }
  };

  const handleMassDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select rows to delete");
      return;
    }
    const confirmDelete = window.confirm("Delete selected rows?");
    if (!confirmDelete) return;
    if (onDelete) onDelete(selectedRows);
  };

  const handleRowsChange = (e) => {
    const value = Number(e.target.value);
    setRowsPerPage(value);
    if (onPageChange) onPageChange({ page: currentPage, rowsPerPage: value });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (onPageChange) onPageChange({ page: newPage, rowsPerPage });
  };

  return (
    <div
      className={`dt-container dt-theme-${theme}`}
      style={customTheme.container}
    >
      <div className="table-toolbar">
        {isSearch && (
          <SearchBar
            value={search}
            onChange={setSearch}
            customTheme={customTheme}
          />
        )}

        {isCSV && (
          <button
            onClick={() => exportCSV(filteredData)}
            style={customTheme.csvButton}
          >
            Export CSV
          </button>
        )}

        {isColumnToggle && (
          <ColumnToggle
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            customTheme={customTheme}
          />
        )}

        {isMassDelete && (
          <button onClick={handleMassDelete} style={customTheme.deleteButton}>
            Mass Delete
          </button>
        )}

        {isRowPerPage && (
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleRowsChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table style={customTheme.table}>
          <thead>
            <tr style={customTheme.headerRow}>
              <th style={customTheme.header}>
                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    selectedRows.length === filteredData.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {orderedColumns.map((col) => (
                <th
                  key={col.accessor}
                  draggable
                  onDragStart={() => handleDragStart(col.accessor)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(col.accessor)}
                  onClick={() => col.sortable && sortColumn(col.accessor)}
                  style={customTheme.header}
                >
                  {col.header}
                  {getSortIndicator(col)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length + 1}>No Data Found</td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr key={i} style={customTheme.row}>
                  <td style={customTheme.cell}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => toggleRow(row)}
                    />
                  </td>
                  {orderedColumns.map((col) => (
                    <td key={col.accessor} style={customTheme.cell}>
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isPagination && (
        <Pagination
          total={filteredData.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          customTheme={customTheme}
        />
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number,
  perPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onDelete: PropTypes.func,
  theme: PropTypes.oneOf(["default", "dark", "blue", "minimal"]),
  customTheme: PropTypes.object,
  isSearch: PropTypes.bool,
  isCSV: PropTypes.bool,
  isColumnToggle: PropTypes.bool,
  isMassDelete: PropTypes.bool,
  isRowPerPage: PropTypes.bool,
  isPagination: PropTypes.bool,
};

export default DataTable;
