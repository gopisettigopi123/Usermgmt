export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`
};
