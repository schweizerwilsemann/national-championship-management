import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import '@/App.css';
import LoginPage from '@/pages/login.page';
import DashboardPage from '@/pages/dashboard.page';
import { useAuth } from '@/context/auth.context';
import { Spin } from 'antd';
import React from 'react';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin>
          <div className="p-12 bg-white rounded-lg shadow-md">
            <div className="text-center text-gray-500 mt-4">Loading...</div>
          </div>
        </Spin>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect on initial auth determination
  useEffect(() => {
    if (!loading && authChecked) {  // Đợi authChecked hoàn tất
      const path = location.pathname;

      if (path === '/login' && isAuthenticated) {
        navigate('/dashboard');
      } else if (!path.includes('/login') && !isAuthenticated && !path.includes('/signup')) {
        navigate('/login');
      }
    }
  }, [loading, isAuthenticated, authChecked]);  // Thêm authChecked vào dependency


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin>
          <div className="p-12 bg-white rounded-lg shadow-md">
            <div className="text-center text-gray-500 mt-4">Loading...</div>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
export default App;