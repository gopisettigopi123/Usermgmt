import React from 'react';
import { getInitials, getAvatarColor } from '../utils/helpers';

/**
 * UserRow Component
 * Renders a single row of user details.
 * 
 * @param {Object} props
 * @param {Object} props.user - The user data object
 * @param {function} props.onEdit - Edit button click handler
 * @param {function} props.onDelete - Delete button click handler
 */
export default function UserRow({ user, onEdit, onDelete }) {
  // Get department class
  const getDeptClass = (dept) => {
    switch (dept) {
      case 'Engineering':
        return 'badge-eng';
      case 'Product Management':
        return 'badge-prod';
      case 'Design':
        return 'badge-design';
      case 'Sales':
        return 'badge-sales';
      case 'Marketing':
        return 'badge-marketing';
      default:
        return 'badge-generic';
    }
  };

  const initials = getInitials(user.firstName, user.lastName);
  const avatarColor = getAvatarColor(user.email || `${user.firstName}${user.lastName}`);

  return (
    <tr id={`user-row-${user.id}`} style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <td>
        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: '600' }}>
          #{user.id}
        </span>
      </td>
      <td>
        <div className="user-profile-cell">
          <div className="avatar" style={{ backgroundColor: avatarColor }} aria-hidden="true">
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {user.firstName} {user.lastName}
            </div>
            {user.username && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                @{user.username}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <span style={{ color: 'var(--text-secondary)' }}>
          {user.email}
        </span>
      </td>
      <td>
        <span className={`badge ${getDeptClass(user.department)}`}>
          {user.department}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            id={`edit-user-${user.id}-btn`}
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(user)}
            aria-label={`Edit user ${user.firstName} ${user.lastName}`}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button
            id={`delete-user-${user.id}-btn`}
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(user)}
            aria-label={`Delete user ${user.firstName} ${user.lastName}`}
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
