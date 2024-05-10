import React from 'react';

function Pagination({ currentPage, setCurrentPage, totalItems, itemsPerPage }) {
  if (!totalItems || totalItems === 0) {
    return null; 
  }
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
    <ul className="pagination justify-content-center my-5">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => handleClick(currentPage - 1)}
        >
          &laquo;
        </button>
      </li>
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <li
            key={pageNumber}
            className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
          >
            <button onClick={() => handleClick(pageNumber)} className="page-link">
              {pageNumber}
            </button>
          </li>
        );
      })}
      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handleClick(currentPage + 1)}
        >
          &raquo;
        </button>
      </li>
    </ul>
    </>
  );
}

export default Pagination;
