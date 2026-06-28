import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import Header from './Header';
import SearchBar from './SearchBar';
import FilterPopup from './FilterPopup';
import UserTable from './UserTable';
import Pagination from './Pagination';
import ConfirmDelete from './ConfirmDelete';

/**
 * DashboardPage Component
 * Host the dashboard panel view containing users list grid, filters, sorting, and delete safety validations.
 */
export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    sortField,
    sortOrder,
    toggleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    deleteUser,
    theme,
    setTheme,
    fetchUsers
  } = useUserStore();

  // Load users from API/cache on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Deletion modal safety trigger states
  const [deleteState, setDeleteState] = useState({ isOpen: false, user: null });

  // Dashboard quick analytics
  const totalUsers = users.length;
  const departmentCount = useMemo(() => {
    const depts = users.map((u) => u.department).filter(Boolean);
    return new Set(depts).size;
  }, [users]);

  // Derived filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // search query
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = query === '' ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      if (!matchesQuery) return false;

      // department
      if (filters.department && user.department !== filters.department) {
        return false;
      }

      // email
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      // first name
      if (filters.firstName && !user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) {
        return false;
      }

      // last name
      if (filters.lastName && !user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, filters]);

  // Derived sorting logic
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    if (!sortField) return sorted;

    sorted.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      const strA = (valA !== undefined && valA !== null) ? valA.toString().toLowerCase() : '';
      const strB = (valB !== undefined && valB !== null) ? valB.toString().toLowerCase() : '';

      if (sortField === 'id') {
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
      }

      const comparison = strA.localeCompare(strB);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredUsers, sortField, sortOrder]);

  // Derived active page pagination slice
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedUsers.slice(startIndex, startIndex + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  }, [sortedUsers.length, pageSize]);

  return (
    <>
      {/* Brand Header */}
      <Header
        totalUsers={totalUsers}
        departmentCount={departmentCount}
        onAddClick={() => navigate('/user/add')}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />

      {/* Controls Container */}
      <div 
        className="dashboard-controls" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap'
        }}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <FilterPopup
          filters={filters}
          setFilters={setFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Main relational grid */}
      <UserTable
        users={paginatedUsers}
        isLoading={isLoading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
        onEdit={(user) => navigate(`/user/edit/${user.id}`)}
        onDelete={(user) => setDeleteState({ isOpen: true, user })}
      />

      {/* Pagination panel */}
      {!isLoading && sortedUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={sortedUsers.length}
        />
      )}

      {/* Safety delete verification modal */}
      <ConfirmDelete
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, user: null })}
        onConfirm={deleteUser}
        user={deleteState.user}
      />
    </>
  );
}
