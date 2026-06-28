import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { DEPARTMENTS } from '../utils/constants';
import { validateForm } from '../utils/validators';

/**
 * UserDetailsPage Component
 * Standalone page for adding a new user or editing an existing user profile details.
 */
export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    users,
    fetchUsers,
    isLoading: isStoreLoading,
    addUser,
    editUser,
    theme,
    setTheme
  } = useUserStore();

  const isEditMode = Boolean(id);
  
  // Find target user from store
  const user = useMemo(() => {
    if (!isEditMode) return null;
    return users.find((u) => u.id.toString() === id.toString());
  }, [users, id, isEditMode]);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: DEPARTMENTS[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const firstNameInputRef = useRef(null);

  // Reset scroll position to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch users if store is empty (supports deep links / page refresh)
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  // Populate form details once user data is loaded
  useEffect(() => {
    if (isEditMode) {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          department: user.department || DEPARTMENTS[0]
        });
      }
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: DEPARTMENTS[0]
      });
    }
    setErrors({});
    setIsSubmitting(false);

    // Auto focus first input
    const timer = setTimeout(() => {
      if (firstNameInputRef.current) {
        firstNameInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isEditMode, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isEditMode && user) {
        result = await editUser(user.id, {
          ...formData,
          id: user.id,
          username: user.username,
          website: user.website,
          companyName: user.companyName
        });
      } else {
        result = await addUser(formData);
      }

      if (result && result.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Submit form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Render loading state for deep links looking up user lists
  if (isEditMode && isStoreLoading && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <svg className="spinner" width="40" height="40" viewBox="0 0 50 50" style={{ color: 'var(--primary)' }}>
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="80, 200" strokeDashoffset="0"></circle>
        </svg>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Loading user details...</span>
      </div>
    );
  }

  // Handle resource not found
  if (isEditMode && !isStoreLoading && !user) {
    return (
      <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 style={{ fontSize: '1.25rem' }}>User Profile Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          We could not locate a user with ID #{id}. They may have been deleted or the link is incorrect.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '1.25rem auto 0 auto' }}>
      
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          id="back-to-dashboard-btn"
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/')}
          style={{ padding: '0.5rem 1rem' }}
          disabled={isSubmitting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Dashboard
        </button>

        <button
          id="details-theme-toggle-btn"
          type="button"
          className="theme-toggle-btn"
          onClick={handleThemeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label="Toggle theme switcher"
          disabled={isSubmitting}
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
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
      </div>

      {/* Main Glassmorphic Details Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M50 5L92 87H70L50 45L30 87H8L50 5Z" fill="url(#ajackus-details-gradient)" />
              <path d="M50 32L68 70H32L50 32Z" fill="var(--text-primary)" opacity="0.9" />
              <defs>
                <linearGradient id="ajackus-details-gradient" x1="8" y1="5" x2="92" y2="87" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#EA4335" />
                  <stop offset="100%" stopColor="#C5221F" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              Ajackus
            </span>
            <span style={{ color: 'var(--panel-border-hover)', fontSize: '0.8rem' }}>|</span>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-teal)', fontWeight: '700' }}>
              Details Console
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            {isEditMode ? 'Edit User details' : 'Create User Credentials'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {isEditMode ? 'Modify profile properties. Changes are synchronized to local memory cache.' : 'Enter account attributes below to register a new user locally.'}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* First Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="details-first-name">First Name *</label>
            <input
              id="details-first-name"
              ref={firstNameInputRef}
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="First name..."
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'details-first-name-error' : undefined}
            />
            {errors.firstName && (
              <span id="details-first-name-error" className="form-error" role="alert">
                {errors.firstName}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="details-last-name">Last Name *</label>
            <input
              id="details-last-name"
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Last name..."
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'details-last-name-error' : undefined}
            />
            {errors.lastName && (
              <span id="details-last-name-error" className="form-error" role="alert">
                {errors.lastName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="details-email">Email Address *</label>
            <input
              id="details-email"
              type="text"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@organization.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'details-email-error' : undefined}
            />
            {errors.email && (
              <span id="details-email-error" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="details-department">Department *</label>
            <select
              id="details-department"
              className={`form-control ${errors.department ? 'is-invalid' : ''}`}
              style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.875rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.department}
              aria-describedby={errors.department ? 'details-dept-error' : undefined}
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <span id="details-dept-error" className="form-error" role="alert">
                {errors.department}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button
              id="cancel-details-btn"
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="submit-details-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ minWidth: '120px' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="80, 200" strokeDashoffset="0"></circle>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
