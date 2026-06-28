import React from 'react';

/**
 * Header Component
 * Displays application title, user stats, Add User button, and Theme Toggle button.
 * 
 * @param {Object} props
 * @param {number} props.totalUsers - Total number of users currently in the list
 * @param {number} props.departmentCount - Total unique departments count
 * @param {function} props.onAddClick - Click handler to trigger Add User modal
 * @param {string} props.theme - Active theme name ('light' | 'dark')
 * @param {function} props.onThemeToggle - Callback when theme toggle button is clicked
 */
export default function Header({
  totalUsers,
  departmentCount,
  onAddClick,
  theme,
  onThemeToggle
}) {
  return (
    <header className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            {/* Styled Geometric SVG Logo representing Ajackus's clean identity */}
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M50 5L92 87H70L50 45L30 87H8L50 5Z" fill="url(#ajackus-header-gradient)" />
              <path d="M50 32L68 70H32L50 32Z" fill="var(--text-primary)" opacity="0.9" />
              <defs>
                <linearGradient id="ajackus-header-gradient" x1="8" y1="5" x2="92" y2="87" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#EA4335" />
                  <stop offset="100%" stopColor="#C5221F" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '0.02em', fontFamily: 'var(--font-heading)' }}>
              JACKUS
            </span>
            <span style={{ color: 'var(--panel-border-hover)', fontSize: '0.85rem' }}>|</span>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-teal)', fontWeight: '700' }}>
              Admin Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>
            User Management Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            Monitor and manage organization user credentials and permissions.
          </p>
        </div>

        {/* Action Buttons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Theme switcher toggle button */}
          <button
            id="theme-switcher-btn"
            type="button"
            className="theme-toggle-btn"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-label={`Toggle theme, current is ${theme}`}
          >
            {theme === 'light' ? (
              // Moon Icon for switching to dark mode
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              // Sun Icon for switching to light mode
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Add User button */}
          <button 
            id="add-user-btn"
            className="btn btn-primary"
            onClick={onAddClick}
            aria-label="Add New User"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Analytics widgets inside header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Users
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {totalUsers}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Departments
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {departmentCount}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Database Server
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.375rem', height: '100%' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            JSONPlaceholder Mock
          </span>
        </div>
      </div>
    </header>
  );
}
