import React from 'react';
import { useUserStore } from '../store/useUserStore';

/**
 * ToastContainer Component
 * Renders stacking success and error toast cards that slide in from the top-right.
 */
export default function ToastContainer() {
  const toasts = useUserStore((state) => state.toasts);
  const removeToast = useUserStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type === 'danger' ? 'toast-danger' : 'toast-success'}`}
          role="alert"
        >
          {/* Status Icon */}
          {toast.type === 'danger' ? (
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--danger)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          ) : (
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--success)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ flexShrink: 0 }}
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}

          {/* Action Message Text */}
          <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.4' }}>
            {toast.message}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease',
              marginLeft: '0.5rem'
            }}
            title="Dismiss toast"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
