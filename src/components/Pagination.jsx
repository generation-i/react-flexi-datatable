import PropTypes from "prop-types";

const Pagination = ({
  total,
  currentPage,
  rowsPerPage,
  onPageChange,
  customTheme = {},
}) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="dt-pagination" style={customTheme.pagiContainer}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={customTheme.prevButton}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active-page" : ""}
          onClick={() => onPageChange(i + 1)}
          style={customTheme.pageButton}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={customTheme.nextButton}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  customTheme: PropTypes.object,
};

export default Pagination;
