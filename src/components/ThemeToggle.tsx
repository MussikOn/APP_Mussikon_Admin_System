import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { 
  LightMode as LightModeIcon, 
  DarkMode as DarkModeIcon 
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { buttonStyles } from '../theme/buttonStyles';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Tooltip title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          ...buttonStyles.themeToggle,
          background: isDark 
            ? 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)'
            : 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
          color: '#ffffff',
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 