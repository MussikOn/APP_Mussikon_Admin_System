import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { 
  LightMode as LightModeIcon, 
  DarkMode as DarkModeIcon 
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Tooltip title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          borderRadius: '50%',
          background: isDark 
            ? 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)'
            : 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
          color: '#ffffff',
          width: 40,
          height: 40,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg) scale(1.1)',
          },
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 