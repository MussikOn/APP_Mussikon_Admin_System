import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#181c24' }}>
      <Sidebar onLogout={handleLogout} />
      <main style={{ marginLeft: 220, flex: 1, padding: 0, minHeight: '100vh', background: '#202534' }}>
        {children}
      </main>
    </div>
  );
};

export default PrivateLayout; 