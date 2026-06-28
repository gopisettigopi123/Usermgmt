import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore } from './store/useUserStore';
import DashboardPage from './components/DashboardPage';
import UserDetailsPage from './components/UserDetailsPage';
import ToastContainer from './components/ToastContainer';

/**
 * App Component
 * Bootstraps the application routes (Dashboard and User Details Console) and handles global toasts container.
 */
export default function App() {
  const theme = useUserStore((state) => state.theme);

  // Sync global theme settings to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      {/* Global Success / Failure notification alerts container */}
      <ToastContainer />

      <div className="container" style={{ paddingTop: '1rem' }}>
        <Routes>
          {/* Main Dashboard Grid */}
          <Route path="/" element={<DashboardPage />} />
          
          {/* User Details Details / Form Page routes */}
          <Route path="/user/add" element={<UserDetailsPage />} />
          <Route path="/user/edit/:id" element={<UserDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
