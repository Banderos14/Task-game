import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { AcademicTasksPage } from './pages/AcademicTasksPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academic" element={<AcademicTasksPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;