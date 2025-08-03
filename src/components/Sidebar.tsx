import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useResponsive } from '../hooks/useResponsive';
import { buttonStyles } from '../theme/buttonStyles';
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
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  MusicNote as MusicNoteIcon,
  Image as ImageIcon,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  Smartphone as SmartphoneIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  KeyboardArrowLeft as CollapseIcon,
  KeyboardArrowRight as ExpandIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

const navigationItems = [
  { 
    to: '/', 
    label: 'Dashboard', 
    icon: <DashboardIcon />,
    color: '#7f5fff',
    description: 'Panel principal con estadísticas y métricas'
  },
  { 
    to: '/users', 
    label: 'Usuarios', 
    icon: <PeopleIcon />,
    color: '#ff6b6b',
    description: 'Gestión de usuarios del sistema'
  },
  { 
    to: '/events', 
    label: 'Eventos', 
    icon: <EventIcon />,
    color: '#ff2eec',
    description: 'Administración de eventos y conciertos'
  },
  { 
    to: '/musician-requests', 
    label: 'Solicitudes', 
    icon: <MusicNoteIcon />,
    color: '#b993d6',
    description: 'Solicitudes de músicos pendientes'
  },
  { 
    to: '/images', 
    label: 'Imágenes', 
    icon: <ImageIcon />,
    color: '#00fff7',
    description: 'Gestión de galería de imágenes'
  },
  { 
    to: '/musicians', 
    label: 'Músicos', 
    icon: <PeopleIcon />,
    color: '#ff6b35',
    description: 'Perfiles y gestión de músicos'
  },
  { 
    to: '/mobile-users', 
    label: 'Usuarios Móviles', 
    icon: <SmartphoneIcon />,
    color: '#43cea2',
    description: 'Usuarios de la aplicación móvil'
  },
  { 
    to: '/search', 
    label: 'Búsqueda', 
    icon: <SearchIcon />,
    color: '#00ff88',
    description: 'Búsqueda avanzada en toda la plataforma'
  },
  { 
    to: '/analytics', 
    label: 'Analytics', 
    icon: <AnalyticsIcon />,
    color: '#ff6b35',
    description: 'Dashboard de analytics y métricas'
  },
  { 
    to: '/chat', 
    label: 'Chat', 
    icon: <ChatIcon />,
    color: '#4CAF50',
    description: 'Sistema de mensajería y comunicación'
  },
  { 
    to: '/payments', 
    label: 'Pagos', 
    icon: <PaymentIcon />,
    color: '#FFD700',
    description: 'Sistema de pagos y verificación de depósitos'
  },
  { 
    to: '/admin', 
    label: 'Admin', 
    icon: <AdminIcon />,
    color: '#8ca6db',
    description: 'Herramientas de administración avanzada'
  },
  { 
    to: '/mobile-payments', 
    label: 'Verificar Pagos', 
    icon: <SettingsIcon />,
    color: '#ff6b35',
    description: 'Verificación de pagos móviles'
  },
];

const Sidebar: React.FC<{ onLogout: () => void }> = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useResponsive();
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

  const handleKeyPress = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box 
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      role="navigation"
      aria-label="Navegación principal"
    >
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
              aria-label="Logo de MussikOn"
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
          <Tooltip 
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            placement="right"
          >
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menú de navegación" : "Contraer menú de navegación"}
              sx={buttonStyles.sidebarIcon}
            >
              {collapsed ? <ExpandIcon /> : <CollapseIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation */}
      <List 
        sx={{ flexGrow: 1, py: 1 }}
        role="list"
        aria-label="Enlaces de navegación"
      >
        {navigationItems.map((item) => {
          const isItemActive = isActive(item.to);
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip 
                title={collapsed ? item.label : item.description}
                placement="right"
                disableHoverListener={!collapsed}
              >
                <ListItemButton
                  onClick={() => handleNavigation(item.to)}
                  onKeyPress={(e) => handleKeyPress(e, item.to)}
                  role="menuitem"
                  aria-label={`${item.label} - ${item.description}`}
                  aria-current={isItemActive ? 'page' : undefined}
                  tabIndex={0}
                  sx={{
                    mx: 1,
                    borderRadius: 3,
                    minHeight: 52,
                    background: isItemActive 
                      ? `linear-gradient(135deg, ${item.color}25 0%, ${item.color}15 100%)`
                      : 'transparent',
                    border: isItemActive 
                      ? `2px solid ${item.color}50`
                      : '2px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${item.color}10 0%, transparent 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                      border: `2px solid ${item.color}40`,
                      transform: 'translateX(6px) scale(1.02)',
                      boxShadow: `0 4px 12px ${item.color}20`,
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    '&:focus': {
                      outline: '2px solid',
                      outlineColor: item.color,
                      outlineOffset: '2px',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: item.color,
                      outlineOffset: '2px',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 44,
                      color: isItemActive ? item.color : 'text.secondary',
                      transition: 'all 0.3s ease',
                      '& .MuiSvgIcon-root': {
                        fontSize: collapsed ? '1.5rem' : '1.375rem',
                        filter: isItemActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                        transition: 'all 0.3s ease',
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
                          fontWeight: isItemActive ? 700 : 500,
                          color: isItemActive ? item.color : 'text.primary',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          textShadow: isItemActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
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
          aria-label="Abrir menú de navegación"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            ...buttonStyles.sidebarMobile,
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
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  // Tablet drawer - responsive behavior
  if (isTablet) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedDrawerWidth : Math.min(drawerWidth, 240),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedDrawerWidth : Math.min(drawerWidth, 240),
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