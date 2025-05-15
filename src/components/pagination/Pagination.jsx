import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationPage = ({
  currentPage,
  perPage,
  data,
  handleRowsPerPageChange,
  rowsPerPageOptions,
  handlePageChange,
  totalPage,
}) => {
  const getPaginationRange = () => {
    const range = [];
    const delta = 1;
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPage, currentPage + delta);
    if (currentPage === 1) {
      end = Math.min(3, totalPage);
    } else if (currentPage === totalPage) {
      start = Math.max(totalPage - 2, 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const pageNumbers = getPaginationRange();

  return (
    <div className="pagination">
      <div>
        <span className="pagination-item">Showing</span>{" "}
        {(currentPage - 1) * perPage + 1}–
        {Math.min(currentPage * perPage, data.length)} of {data.length}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label className="pagination-item">Rows per page: </label>
        <select
          className="form-select"
          style={{ display: "inline", width: "auto", height: "38px" }}
          aria-label="Rows per page"
          value={perPage}
          onChange={handleRowsPerPageChange}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Pagination style={{ margin: 0 }}>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pageNumbers.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
            className="d-none d-sm-inline"
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPage)}
          disabled={currentPage === totalPage}
        />
      </Pagination>
    </div>
  );
};

export default PaginationPage;
