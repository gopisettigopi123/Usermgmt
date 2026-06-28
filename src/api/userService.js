import axios from 'axios';
import { ENDPOINTS } from './endpoints';

// In-memory cache for repeated users API calls
let usersCache = null;

/**
 * Fetch all users from the external REST API.
 * Uses in-memory caching to prevent repeated network requests.
 * 
 * @param {boolean} forceRefetch - Skip cache and force network load
 * @returns {Promise} Resolves to object containing user data
 */
export const getUsers = async (forceRefetch = false) => {
  if (usersCache && !forceRefetch) {
    console.log('[Cache] Serving users list from in-memory cache');
    // Return a clone to prevent accidental outside reference mutations
    return { data: JSON.parse(JSON.stringify(usersCache)) };
  }

  console.log('[Network API] Fetching users list from server');
  const response = await axios.get(ENDPOINTS.USERS);
  usersCache = response.data;
  return response;
};

/**
 * Send a POST request to simulate user creation and updates the in-memory cache.
 * @param {Object} userData - The user data to create
 * @returns {Promise} Axios response promise
 */
export const createUser = async (userData) => {
  const response = await axios.post(ENDPOINTS.USERS, userData);
  
  // Sync memory cache
  if (usersCache) {
    usersCache = [response.data, ...usersCache];
  }
  
  return response;
};

/**
 * Send a PUT request to simulate user update and updates the in-memory cache.
 * @param {number|string} id - The user ID
 * @param {Object} userData - The updated user data
 * @returns {Promise} Axios response promise
 */
export const updateUser = async (id, userData) => {
  const response = await axios.put(ENDPOINTS.USER_BY_ID(id), userData);
  
  // Sync memory cache
  if (usersCache) {
    usersCache = usersCache.map((user) => 
      user.id === id ? { ...user, ...userData } : user
    );
  }
  
  return response;
};

/**
 * Send a DELETE request to simulate user deletion and updates the in-memory cache.
 * @param {number|string} id - The user ID
 * @returns {Promise} Axios response promise
 */
export const deleteUser = async (id) => {
  const response = await axios.delete(ENDPOINTS.USER_BY_ID(id));
  
  // Sync memory cache
  if (usersCache) {
    usersCache = usersCache.filter((user) => user.id !== id);
  }
  
  return response;
};

/**
 * Helper to manually clear or invalidate the memory cache.
 */
export const clearUserCache = () => {
  usersCache = null;
  console.log('[Cache] Memory cache cleared successfully');
};
