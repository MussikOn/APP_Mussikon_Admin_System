import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../contexts/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import './Sidebar.css';

const links = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/users', label: 'Usuarios', icon: <PeopleIcon /> },
  { to: '/events', label: 'Eventos', icon: <EventIcon /> },
  { to: '/musician-requests', label: 'Solicitudes', icon: <LibraryMusicIcon /> },
  { to: '/images', label: 'Imágenes', icon: <ImageIcon /> },
  { to: '/musicians', label: 'Músicos', icon: <PersonIcon /> },
  { to: '/mobile-users', label: 'Usuarios Móviles', icon: <SmartphoneIcon /> },
  { to: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon /> },
];

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();

  // Detecta si es móvil/tablet
  // const isMobile = window.innerWidth <= 900; // This line is removed as per edit hint

  // Menú circular para móvil/tablet
  if (isMobile) {
    const total = links.length + 2;
    return (
      <>
        <button
          className={`circular-menu-btn${open ? ' open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className={`circular-menu-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
        <div className={`circular-menu${open ? ' open' : ''}`} style={{ background: open ? 'rgba(32,37,52,0.7)' : 'none' }}>
          {links.map((link, i) => (
            <button
              key={link.to}
              className="circular-menu-item"
              style={{
                '--i': i,
                '--total': total,
                '--radius': '110px',
              } as React.CSSProperties}
              onClick={() => { setOpen(false); navigate(link.to); }}
              aria-label={link.label}
            >
              <span className="sidebar-icon">{link.icon}</span>
            </button>
          ))}
          <button className="circular-menu-item" style={{ '--i': links.length, '--total': total, '--radius': '110px' } as React.CSSProperties} onClick={() => { setOpen(false); onLogout(); }} aria-label="Cerrar sesión">
            <LogoutIcon />
          </button>
          <button className="circular-menu-item" style={{ '--i': links.length + 1, '--total': total, '--radius': '110px' } as React.CSSProperties} onClick={() => { setOpen(false); toggleTheme(); }} aria-label="Cambiar tema">
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
        </div>
      </>
    );
  }

  // Sidebar tradicional para desktop
  return (
    <>
      <aside className={`sidebar`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">🎵</span>
          <span className="sidebar-title">MussikOn Admin</span>
        </div>
        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
              end={link.to === '/'}
              onClick={() => navigate(link.to)}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-link-text">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />} {theme === 'dark' ? 'Claro' : 'Oscuro'}
        </button>
        <button className="sidebar-logout" onClick={onLogout}>
          <LogoutIcon style={{ marginRight: 8 }} /> Cerrar sesión
        </button>
      </aside>
    </>
  );
};

export default Sidebar; 