import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '../features/auth';
import Dashboard from '../features/dashboard';
import Users from '../features/users';
import Events from '../features/events';
import MusicianRequests from '../features/musicianRequests';
import Images from '../features/images';
import Musicians from '../features/musicians';
import AdminTools from '../features/admin';
import { useAuth } from '../hooks/useAuth';
import PrivateLayout from '../components/PrivateLayout';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.roll)) {
    // Si el usuario no tiene el rol requerido, redirige al dashboard
    return <Navigate to="/" replace />;
  }
  return <PrivateLayout>{children}</PrivateLayout>;
}

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
      <Route path="/musician-requests" element={<PrivateRoute><MusicianRequests /></PrivateRoute>} />
      <Route path="/images" element={<PrivateRoute><Images /></PrivateRoute>} />
      <Route path="/musicians" element={<PrivateRoute><Musicians /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['superadmin']}><AdminTools /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes; 