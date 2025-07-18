import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import './Pagination.css';

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  loading,
  onPageChange, 
  onPageSizeChange 
}) {
  const pageSizeOptions = [6, 12, 24, 48];
  
  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      
      // Add ellipsis if needed before current range
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after current range
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1 && !loading) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages && !loading) {
      onPageChange(totalPages);
    }
  };

  const handlePageSizeChange = (e) => {
    if (!loading) {
      onPageSizeChange(parseInt(e.target.value));
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no items
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <div className="items-info">
          Showing {startItem}-{endItem} of {totalItems} items
        </div>
        
        <div className="page-size-selector">
          <label>
            Items per page:
            <select 
              value={pageSize} 
              onChange={handlePageSizeChange}
              disabled={loading}
              className="page-size-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      
      <div className="pagination-controls">
        {loading && (
          <div className="pagination-loading">
            <Loader2 size={16} className="spinner" />
            Loading...
          </div>
        )}
        
        <div className={`pagination-buttons ${loading ? 'loading' : ''}`}>
          {/* First page button */}
          <button
            onClick={handleFirst}
            disabled={currentPage === 1 || loading}
            className="pagination-btn pagination-nav"
            title="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          
          {/* Previous page button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || loading}
            className="pagination-btn pagination-nav"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Page number buttons */}
          <div className="page-numbers">
            {visiblePages.map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                disabled={page === '...' || loading}
                className={`pagination-btn ${
                  page === currentPage ? 'active' : ''
                } ${page === '...' ? 'ellipsis' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          
          {/* Next page button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || loading}
            className="pagination-btn pagination-nav"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
          
          {/* Last page button */}
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages || loading}
            className="pagination-btn pagination-nav"
            title="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination; 