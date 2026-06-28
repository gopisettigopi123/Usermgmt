/**
 * Validate user form data.
 * @param {Object} formData - Object containing firstName, lastName, email, department
 * @returns {Object} Errors object, empty if validation passes
 */
export const validateForm = (formData) => {
  const errors = {};

  // First name validation
  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  // Last name validation
  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }

  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    // Robust email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g., name@example.com).';
    }
  }

  // Department validation
  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Department is required.';
  }

  return errors;
};
