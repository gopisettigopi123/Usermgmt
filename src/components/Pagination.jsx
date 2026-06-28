import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';

/**
 * Pagination Component
 * Navigation controls for switching dataset pages and page dimensions.
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Active index page (1-indexed)
 * @param {number} props.pageSize - Number of items displayed per page
 * @param {function} props.setPageSize - Callback to change page size
 * @param {function} props.setCurrentPage - Callback to change active page
 * @param {number} props.totalPages - Total pages count
 * @param {number} props.totalItems - Total active records count in filtered dataset
 */
export default function Pagination({
  currentPage,
  pageSize,
  setPageSize,
  setCurrentPage,
  totalPages,
  totalItems
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper to generate list of page numbers to render
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="glass-card pagination-container" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.25rem',
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.3)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Page Size Selection & Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Show</span>
          <select
            id="page-size-select"
            className="form-control"
            style={{
              padding: '0.375rem 1.75rem 0.375rem 0.625rem',
              width: '70px',
              fontSize: '0.8125rem',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '0.875rem'
            }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>entries</span>
        </div>

        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}</strong> to{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> entries
        </span>
      </div>

      {/* Page Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        {/* Previous Button */}
        <button
          id="prev-page-btn"
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Prev
        </button>

        {/* Page Numbers */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {pageNumbers.map(page => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                className="btn btn-sm"
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  minWidth: '32px',
                  padding: '0.4rem 0',
                  backgroundColor: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--panel-border)',
                  boxShadow: isActive ? '0 0 10px rgba(124, 58, 237, 0.3)' : 'none',
                  fontWeight: '700'
                }}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          id="next-page-btn"
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
