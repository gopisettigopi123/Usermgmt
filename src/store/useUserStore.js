import { create } from 'zustand';
import * as userService from '../api/userService';
import { mapApiUser } from '../utils/helpers';
import { INITIAL_PAGE_SIZE } from '../utils/constants';

// Helper to determine initial theme setting
const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'light'; // Default theme is Light Mode
};

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: true,
  error: null,
  toasts: [], // Holds active toast alerts

  // Search & Filters
  searchQuery: '',
  filters: {
    department: '',
    email: '',
    firstName: '',
    lastName: ''
  },

  // Sorting
  sortField: 'id',
  sortOrder: 'asc',

  // Pagination
  currentPage: 1,
  pageSize: INITIAL_PAGE_SIZE,

  // Theme configuration
  theme: getInitialTheme(),

  // Actions
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },

  setError: (error) => set({ error }),

  // Toast Management Actions
  addToast: (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id)
  })),

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    currentPage: 1
  })),

  clearFilters: () => set({
    filters: { department: '', email: '', firstName: '', lastName: '' },
    currentPage: 1
  }),

  toggleSort: (field) => set((state) => {
    if (state.sortField === field) {
      return { sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' };
    } else {
      return { sortField: field, sortOrder: 'asc' };
    }
  }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  // CRUD Actions
  fetchUsers: async (forceRefetch = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUsers(forceRefetch);
      if (response && response.data) {
        // Map raw API objects into application structures
        const mapped = response.data.map((user, index) => mapApiUser(user, index));
        set({ users: mapped });
      }
    } catch (err) {
      console.error('Zustand store fetch error:', err);
      set({ error: 'Unable to fetch active users. Please check your network connection.' });
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (newUserData) => {
    set({ error: null });
    try {
      const response = await userService.createUser(newUserData);
      const currentUsers = get().users;

      // Handle duplicate ID collisions from JSONPlaceholder mock responses
      const generatedId = currentUsers.length > 0
        ? Math.max(...currentUsers.map((u) => Number(u.id))) + 1
        : 11;

      const createdUser = {
        ...newUserData,
        id: response.data.id === 11 ? generatedId : response.data.id
      };

      set({ users: [createdUser, ...currentUsers] });
      
      // Trigger success notification toast
      get().addToast(`User ${createdUser.firstName} ${createdUser.lastName} created successfully!`, 'success');
      return { success: true };
    } catch (err) {
      console.error('Zustand store add error:', err);
      set({ error: 'Failed to create new user. Please check your connection.' });
      get().addToast('Failed to create user. Network or validation error.', 'danger');
      return { success: false, error: err.message };
    }
  },

  editUser: async (id, updatedUserData) => {
    set({ error: null });
    try {
      try {
        await userService.updateUser(id, updatedUserData);
      } catch (networkErr) {
        console.warn(`Network PUT failed (expected for mocked ID): ${networkErr.message}`);
      }

      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUserData } : u))
      }));

      // Trigger success notification toast
      get().addToast(`User ${updatedUserData.firstName} ${updatedUserData.lastName} updated successfully!`, 'success');
      return { success: true };
    } catch (err) {
      console.error('Zustand store edit error:', err);
      set({ error: 'Failed to update user profile. Please try again.' });
      get().addToast('Failed to update user. Try again later.', 'danger');
      return { success: false, error: err.message };
    }
  },

  deleteUser: async (id) => {
    set({ error: null });
    // Find the user name before deleting for toast feedback
    const targetUser = get().users.find((u) => u.id === id);
    const userName = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : `ID #${id}`;

    try {
      try {
        await userService.deleteUser(id);
      } catch (networkErr) {
        console.warn(`Network DELETE failed (expected for mocked ID): ${networkErr.message}`);
      }

      set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      }));

      // Trigger success notification toast
      get().addToast(`User ${userName} deleted successfully!`, 'success');
      return { success: true };
    } catch (err) {
      console.error('Zustand store delete error:', err);
      set({ error: 'Failed to delete user account. Please try again.' });
      get().addToast(`Failed to delete user ${userName}.`, 'danger');
      return { success: false, error: err.message };
    }
  }
}));
