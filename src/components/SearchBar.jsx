import React from 'react';

/**
 * SearchBar Component
 * Renders the search text input with clear actions.
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - The active search text query
 * @param {function} props.setSearchQuery - Callback function to update the query state
 */
export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-wrapper" style={{ flex: '1', minWidth: '260px' }}>
      <span className="search-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <input
        id="search-users-input"
        type="text"
        className="form-control search-input"
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search users"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          style={{
            position: 'absolute',
            right: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem',
            borderRadius: '50%'
          }}
          title="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
