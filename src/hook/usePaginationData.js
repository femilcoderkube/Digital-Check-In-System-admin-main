import React, { useEffect, useState } from "react";

const usePaginationData = (meta) => {
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 50);
  const [rowsPerPageOptions] = useState([50,100]);
  const totalPage = meta?.total;

  const handlePageChange = (index) => setCurrentPage(index);

  const handleRowsPerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
    // setCurrentPage(1);
  };
  return {
    currentPage,
    setCurrentPage,
    perPage,
    handleRowsPerPageChange,
    rowsPerPageOptions,
    handlePageChange,
    totalPage,
  };
};

export default usePaginationData;
