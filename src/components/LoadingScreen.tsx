import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0a23 0%, #181c3a 50%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          mb: 2,
        }}
      >
        🎵
      </Box>
      
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: '#7f5fff',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mt: 2,
        }}
      >
        Cargando MussikOn...
      </Typography>
      
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        Preparando el sistema de administración
      </Typography>
    </Box>
  );
};

export default LoadingScreen; 