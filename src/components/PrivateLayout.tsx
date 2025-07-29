import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile page
  };

  const handleSettings = () => {
    handleClose();
    // Navigate to settings page
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0a23 0%, #181c3a 50%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        minHeight: '100vh',
      }}>
        
        {/* Top App Bar */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: isDark 
              ? 'rgba(31, 38, 135, 0.15)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                MussikOn Admin
              </Typography>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Tooltip title="Notificaciones">
                <IconButton 
                  color="inherit"
                  sx={{ 
                    borderRadius: '50%',
                    '&:hover': { background: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              <Tooltip title="Menú de usuario">
                <IconButton
                  onClick={handleMenu}
                  sx={{ 
                    borderRadius: '50%',
                    '&:hover': { background: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* User Menu Dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    background: isDark 
                      ? 'rgba(31, 38, 135, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                  <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user?.name || user?.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.roll || 'Usuario'}
                    </Typography>
                  </Box>
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
                  <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                  Configuración
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout; 