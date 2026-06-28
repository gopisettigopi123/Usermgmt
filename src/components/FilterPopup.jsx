import React, { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../utils/constants';

/**
 * FilterPopup Component
 * Renders an interactive filtering dialog modal centered on screen.
 * 
 * @param {Object} props
 * @param {Object} props.filters - Global active filters
 * @param {function} props.setFilters - Callback to apply filters
 * @param {function} props.onClearFilters - Callback to clear all active filters
 */
export default function FilterPopup({ filters, setFilters, onClearFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Sync local filters when global filters change
  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset local state to last applied filters
    setLocalFilters({ ...filters });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        id="filter-toggle-btn"
        type="button"
        className="btn btn-secondary"
        onClick={() => setIsOpen(true)}
        style={{
          borderColor: activeFiltersCount > 0 ? 'var(--primary)' : 'var(--panel-border)',
          backgroundColor: activeFiltersCount > 0 ? 'rgba(124, 58, 237, 0.08)' : 'rgba(255, 255, 255, 0.4)'
        }}
        aria-label="Open filters modal"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Filters
        {activeFiltersCount > 0 && (
          <span style={{
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '700',
            marginLeft: '0.25rem'
          }}>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
          <div className="glass-card modal-content" style={{ backgroundColor: 'var(--panel-bg)', backdropFilter: 'blur(20px)' }}>
            
            {/* Header */}
            <div className="modal-header">
              <h2 id="filter-modal-title" className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filter Dataset
              </h2>
              <button 
                type="button" 
                className="modal-close" 
                onClick={handleClose}
                aria-label="Close filters modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleApply}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="filter-first-name">First Name</label>
                  <input
                    id="filter-first-name"
                    type="text"
                    className="form-control"
                    placeholder="Filter by first name..."
                    value={localFilters.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="filter-last-name">Last Name</label>
                  <input
                    id="filter-last-name"
                    type="text"
                    className="form-control"
                    placeholder="Filter by last name..."
                    value={localFilters.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="filter-email">Email</label>
                  <input
                    id="filter-email"
                    type="text"
                    className="form-control"
                    placeholder="Filter by email address..."
                    value={localFilters.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="filter-department">Department</label>
                  <select
                    id="filter-department"
                    className="form-control"
                    style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.875rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                    value={localFilters.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="modal-footer">
                <button
                  id="filter-clear-btn"
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClear}
                >
                  Clear Filters
                </button>
                <button
                  id="filter-apply-btn"
                  type="submit"
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
