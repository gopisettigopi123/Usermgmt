import { describe, it, expect } from 'vitest';
import { mapApiUser, getInitials, getAvatarColor } from './helpers';
import { DEPARTMENTS } from './constants';

describe('helpers.js unit tests', () => {
  
  describe('mapApiUser', () => {
    it('should split name with single space into first and last names', () => {
      const apiUser = {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        username: 'Bret',
        website: 'hildegard.org',
        company: { name: 'Romaguera-Crona' }
      };

      const mapped = mapApiUser(apiUser, 0);
      expect(mapped.firstName).toBe('Leanne');
      expect(mapped.lastName).toBe('Graham');
      expect(mapped.email).toBe('Sincere@april.biz');
      expect(mapped.id).toBe(1);
    });

    it('should split name with multiple spaces correctly', () => {
      const apiUser = {
        name: 'John von Neumann',
        email: 'john@princeton.edu'
      };

      const mapped = mapApiUser(apiUser, 0);
      expect(mapped.firstName).toBe('John');
      expect(mapped.lastName).toBe('von Neumann');
    });

    it('should handle name without spaces', () => {
      const apiUser = {
        name: 'Cher',
        email: 'cher@music.com'
      };

      const mapped = mapApiUser(apiUser, 0);
      expect(mapped.firstName).toBe('Cher');
      expect(mapped.lastName).toBe('');
    });

    it('should distribute departments based on index', () => {
      const apiUser1 = { name: 'User One' };
      const apiUser2 = { name: 'User Two' };
      const apiUser3 = { name: 'User Three' };
      const apiUser4 = { name: 'User Four' };

      expect(mapApiUser(apiUser1, 0).department).toBe(DEPARTMENTS[0]); // Engineering
      expect(mapApiUser(apiUser2, 1).department).toBe(DEPARTMENTS[1]); // Product Management
      expect(mapApiUser(apiUser3, 2).department).toBe(DEPARTMENTS[2]); // Design
      expect(mapApiUser(apiUser4, 3).department).toBe(DEPARTMENTS[3]); // Sales
    });
  });

  describe('getInitials', () => {
    it('should parse initials from first and last names', () => {
      expect(getInitials('Leanne', 'Graham')).toBe('LG');
      expect(getInitials('john', 'doe')).toBe('JD');
    });

    it('should handle empty name strings', () => {
      expect(getInitials('Cher', '')).toBe('C');
      expect(getInitials('', '')).toBe('?');
    });
  });

  describe('getAvatarColor', () => {
    it('should generate a stable HSL string', () => {
      const color1 = getAvatarColor('Sincere@april.biz');
      const color2 = getAvatarColor('Sincere@april.biz');
      const color3 = getAvatarColor('another@email.com');

      expect(color1).toBe(color2); // Same input, same color
      expect(color1).not.toBe(color3); // Different input, different color
      expect(color1).toContain('hsl(');
    });
  });

});
