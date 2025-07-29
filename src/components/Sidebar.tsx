import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  LibraryMusic as LibraryMusicIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Smartphone as SmartphoneIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

const navigationItems = [
  { 
    to: '/', 
    label: 'Dashboard', 
    icon: <DashboardIcon />,
    color: '#7f5fff'
  },
  { 
    to: '/users', 
    label: 'Usuarios', 
    icon: <PeopleIcon />,
    color: '#00e0ff'
  },
  { 
    to: '/events', 
    label: 'Eventos', 
    icon: <EventIcon />,
    color: '#ff2eec'
  },
  { 
    to: '/musician-requests', 
    label: 'Solicitudes', 
    icon: <LibraryMusicIcon />,
    color: '#b993d6'
  },
  { 
    to: '/images', 
    label: 'Imágenes', 
    icon: <ImageIcon />,
    color: '#00fff7'
  },
  { 
    to: '/musicians', 
    label: 'Músicos', 
    icon: <PersonIcon />,
    color: '#ff6b35'
  },
  { 
    to: '/mobile-users', 
    label: 'Usuarios Móviles', 
    icon: <SmartphoneIcon />,
    color: '#43cea2'
  },
  { 
    to: '/admin', 
    label: 'Admin', 
    icon: <AdminPanelSettingsIcon />,
    color: '#8ca6db'
  },
];

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout: _onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🎵
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MussikOn
            </Typography>
          </Box>
        )}
        
        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: 'text.secondary',
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            {collapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.to)}
              sx={{
                mx: 1,
                borderRadius: 2,
                minHeight: 48,
                background: isActive(item.to) 
                  ? `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
                  : 'transparent',
                border: isActive(item.to) 
                  ? `1px solid ${item.color}40`
                  : '1px solid transparent',
                '&:hover': {
                  background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                  border: `1px solid ${item.color}30`,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 'auto' : 40,
                  color: isActive(item.to) ? item.color : 'text.secondary',
                  '& .MuiSvgIcon-root': {
                    fontSize: collapsed ? '1.5rem' : '1.25rem',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive(item.to) ? 600 : 500,
                      color: isActive(item.to) ? item.color : 'text.primary',
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        <Divider sx={{ mb: 2 }} />
        
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              display: 'block',
              mb: 1,
            }}
          >
            Sistema de Administración
          </Typography>
        )}
        
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            textAlign: 'center',
            display: 'block',
            fontSize: '0.7rem',
          }}
        >
          v2.0.0
        </Typography>
      </Box>
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            background: isDark 
              ? 'rgba(31, 38, 135, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
            '&:hover': {
              background: isDark 
                ? 'rgba(31, 38, 135, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: isDark 
                ? 'rgba(31, 38, 135, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedDrawerWidth : drawerWidth,
          background: isDark 
            ? 'rgba(31, 38, 135, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 