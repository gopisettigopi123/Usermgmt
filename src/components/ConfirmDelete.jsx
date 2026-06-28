import React, { useEffect, useState } from 'react';

/**
 * ConfirmDelete Component
 * A safety dialog prompting users to confirm deletion actions.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Is the modal visible
 * @param {function} props.onClose - Modal close handler
 * @param {function} props.onConfirm - Action confirmation handler
 * @param {Object|null} props.user - The user targeted for deletion
 */
export default function ConfirmDelete({ isOpen, onClose, onConfirm, user }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset deleting state when modal visibility changes
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

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

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      console.error('Failed to confirm deletion:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="glass-card modal-content" style={{ maxWidth: '400px', backgroundColor: 'var(--panel-bg)', backdropFilter: 'blur(20px)' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 id="delete-modal-title" className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Confirm Deletion
          </h2>
          <button 
            type="button" 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            Are you sure you want to delete the user profile for{' '}
            <strong style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
              {user.firstName} {user.lastName}
            </strong>
            ?
          </p>
          
          {user.email && (
            <div style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--panel-border)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Department:</strong> {user.department}</div>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Warning: This action will purge the local user details state. This operation is irreversible.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{ minWidth: '110px' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>

      </div>
    </div>
  );
}
