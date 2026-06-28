import { describe, it, expect } from 'vitest';
import { validateForm } from './validators';

describe('validateForm', () => {
  it('should pass with empty errors object when form data is valid', () => {
    const validData = {
      firstName: 'Leanne',
      lastName: 'Graham',
      email: 'Sincere@april.biz',
      department: 'Engineering'
    };

    const errors = validateForm(validData);
    expect(errors).toEqual({});
  });

  it('should require first name and flag short inputs', () => {
    const invalidData = {
      firstName: '',
      lastName: 'Graham',
      email: 'Sincere@april.biz',
      department: 'Engineering'
    };
    let errors = validateForm(invalidData);
    expect(errors.firstName).toBeDefined();
    expect(errors.firstName).toContain('required');

    const shortData = { ...invalidData, firstName: 'A' };
    errors = validateForm(shortData);
    expect(errors.firstName).toBeDefined();
    expect(errors.firstName).toContain('at least 2 characters');
  });

  it('should require last name and flag short inputs', () => {
    const invalidData = {
      firstName: 'Leanne',
      lastName: ' ',
      email: 'Sincere@april.biz',
      department: 'Engineering'
    };
    let errors = validateForm(invalidData);
    expect(errors.lastName).toBeDefined();
    expect(errors.lastName).toContain('required');

    const shortData = { ...invalidData, lastName: 'B' };
    errors = validateForm(shortData);
    expect(errors.lastName).toBeDefined();
    expect(errors.lastName).toContain('at least 2 characters');
  });

  it('should validate email format correctness', () => {
    const emptyEmail = {
      firstName: 'Leanne',
      lastName: 'Graham',
      email: '',
      department: 'Engineering'
    };
    let errors = validateForm(emptyEmail);
    expect(errors.email).toBeDefined();
    expect(errors.email).toContain('required');

    const badFormat = { ...emptyEmail, email: 'leanne.graham' };
    errors = validateForm(badFormat);
    expect(errors.email).toBeDefined();
    expect(errors.email).toContain('valid email address');
  });

  it('should require a department selection', () => {
    const emptyDept = {
      firstName: 'Leanne',
      lastName: 'Graham',
      email: 'Sincere@april.biz',
      department: ''
    };
    const errors = validateForm(emptyDept);
    expect(errors.department).toBeDefined();
    expect(errors.department).toContain('required');
  });
});
