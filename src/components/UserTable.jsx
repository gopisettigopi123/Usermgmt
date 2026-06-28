import React from 'react';
import UserRow from './UserRow';

/**
 * UserTable Component
 * Displays the list of users in a structured tabular grid format.
 * Supporting sorting of headers, loading skeleton indicators, and empty results messaging.
 * 
 * @param {Object} props
 * @param {Array} props.users - Mapped and paginated user list
 * @param {boolean} props.isLoading - Whether the data fetching is in progress
 * @param {string} props.sortField - Active sorting field
 * @param {string} props.sortOrder - Active sorting order ('asc' | 'desc')
 * @param {function} props.onSort - Toggle sorting callback
 * @param {function} props.onEdit - Edit action callback
 * @param {function} props.onDelete - Delete action callback
 */
export default function UserTable({
  users,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete
}) {
  // Sort indicator helper
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Skeleton Row Component for premium shimmer loading
  const SkeletonRow = () => (
    <tr>
      <td>
        <div className="skeleton-shimmer skeleton-text" style={{ width: '24px' }} />
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton-shimmer skeleton-avatar" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
            <div className="skeleton-shimmer skeleton-text" style={{ height: '0.875rem' }} />
            <div className="skeleton-shimmer skeleton-text" style={{ height: '0.65rem', width: '70px' }} />
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton-shimmer skeleton-text" style={{ width: '160px' }} />
      </td>
      <td>
        <div className="skeleton-shimmer skeleton-badge" />
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="skeleton-shimmer skeleton-text" style={{ height: '1.75rem', width: '54px', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton-shimmer skeleton-text" style={{ height: '1.75rem', width: '68px', borderRadius: 'var(--radius-sm)' }} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="glass-card" style={{ overflow: 'hidden', width: '100%', marginBottom: '1.5rem' }}>
      <div className="table-container">
        <table id="user-management-table" aria-label="User Management">
          <thead>
            <tr>
              <th
                id="th-id"
                className="sortable"
                onClick={() => onSort('id')}
                aria-sort={sortField === 'id' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                ID{renderSortIndicator('id')}
              </th>
              <th
                id="th-name"
                className="sortable"
                onClick={() => onSort('firstName')}
                aria-sort={sortField === 'firstName' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Name{renderSortIndicator('firstName')}
              </th>
              <th
                id="th-email"
                className="sortable"
                onClick={() => onSort('email')}
                aria-sort={sortField === 'email' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Email{renderSortIndicator('email')}
              </th>
              <th
                id="th-department"
                className="sortable"
                onClick={() => onSort('department')}
                aria-sort={sortField === 'department' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Department{renderSortIndicator('department')}
              </th>
              <th id="th-actions" style={{ cursor: 'default' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Show 5 skeleton loader rows while loading
              Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />)
            ) : users.length === 0 ? (
              // Empty state display
              <tr>
                <td colSpan="5" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>No Records Found</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      No users match your criteria. Try adjusting your search query or filters.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              // Render the rows
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
