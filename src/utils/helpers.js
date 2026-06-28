import { DEPARTMENTS } from './constants';

/**
 * Maps a JSONPlaceholder API user object into our application schema.
 * Splits full name into first and last, and assigns a default department.
 * 
 * @param {Object} apiUser - Raw user object from JSONPlaceholder
 * @param {number} index - Index in the user list to distribute departments evenly
 * @returns {Object} Clean mapped user object
 */
export const mapApiUser = (apiUser, index) => {
  const nameParts = (apiUser.name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Distribute departments dynamically based on user index
  const department = DEPARTMENTS[index % 4]; // Engineering, Product, Design, Sales

  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email || '',
    department,
    username: apiUser.username || '',
    website: apiUser.website || '',
    companyName: apiUser.company?.name || ''
  };
};

/**
 * Extracts initials from first and last names.
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns {string} Initials (e.g. "JD")
 */
export const getInitials = (firstName, lastName) => {
  const first = (firstName || '').trim().charAt(0).toUpperCase();
  const last = (lastName || '').trim().charAt(0).toUpperCase();
  return `${first}${last}` || '?';
};

/**
 * Generates a stable HSL color based on string content to use for avatars.
 * @param {string} str - A string (e.g., email or name)
 * @returns {string} HSL color string
 */
export const getAvatarColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Keep saturation and lightness in ranges that look good and are legible in dark mode
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 45%)`;
};
