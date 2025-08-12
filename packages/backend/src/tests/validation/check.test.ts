/**
 * Tests for the validation utilities (src/validation/check.ts).
 * The tests call validateLoginData which is used by the auth route.
 * Comments in English.
 */

import { validateLoginData } from '../../validation/check';

describe('Validation - validateLoginData', () => {
  it('should NOT throw for valid email and password', () => {
    expect(() => validateLoginData('user1@example.com', '1111')).not.toThrow();
  });

  it('should throw for invalid email', () => {
    expect(() => validateLoginData('not-an-email', '1111')).toThrow();
  });

  it('should throw for short password', () => {
    expect(() => validateLoginData('user1@example.com', '1')).toThrow();
  });
});
