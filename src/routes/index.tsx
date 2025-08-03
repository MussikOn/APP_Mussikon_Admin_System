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
import MobileUsers from '../features/mobileUsers';
import Search from '../features/search';
import Analytics from '../features/analytics';
import Chat from '../features/chat';
import Payments from '../features/payments';
import MobilePayments from '../features/mobilePayments';
import { useAuth } from '../hooks/useAuth';
import PrivateLayout from '../components/PrivateLayout';
import LoadingScreen from '../components/LoadingScreen';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  
  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    console.log('🔐 Usuario no autenticado, redirigiendo al login');
    return <Navigate to="/login" replace />;
  }
  
  // Log del rol del usuario para debugging
  console.log('🔍 Usuario autenticado con rol:', user.roll);
  
  // Verificar si el usuario es superadmin (tiene acceso a todo)
  const isSuperAdmin = user.roll === 'superadmin' || user.roll === 'superAdmin' || user.roll === 'super_admin';
  
  if (isSuperAdmin) {
    console.log('👑 Usuario es superadmin - acceso total permitido');
    return <PrivateLayout>{children}</PrivateLayout>;
  }
  
  // Si no es superadmin, verificar roles específicos
  if (allowedRoles) {
    console.log('🔍 Roles permitidos:', allowedRoles);
    console.log('🔍 ¿Usuario tiene rol permitido?', allowedRoles.includes(user.roll));
    
    // Si hay roles específicos requeridos y el usuario no los tiene
    if (!allowedRoles.includes(user.roll)) {
      console.log(`🚫 Usuario ${user.roll} no tiene permisos para esta ruta, redirigiendo al dashboard`);
      return <Navigate to="/" replace />;
    }
  }
  
  // Usuario autenticado y autorizado
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
      <Route path="/mobile-users" element={<PrivateRoute><MobileUsers /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute allowedRoles={['admin']}><Payments /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminTools /></PrivateRoute>} />
      <Route path="/mobile-payments" element={<PrivateRoute allowedRoles={['admin']}><MobilePayments /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes; 