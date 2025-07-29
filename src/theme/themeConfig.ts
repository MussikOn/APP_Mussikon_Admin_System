import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Paleta de colores MussikOn
const mussikOnColors = {
  // Colores primarios de la marca
  primary: {
    main: '#7f5fff',
    light: '#9b7dff',
    dark: '#5a3fd9',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#00e0ff',
    light: '#33e6ff',
    dark: '#00b3cc',
    contrastText: '#ffffff',
  },
  accent: {
    purple: '#b993d6',
    pink: '#ff2eec',
    cyan: '#00fff7',
    orange: '#ff6b35',
  },
  // Gradientes de marca
  gradients: {
    primary: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
    secondary: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
    accent: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
    success: 'linear-gradient(135deg, #00fff7 0%, #7f5fff 100%)',
  },
};

// Configuración base común
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Poppins, Inter, Arial, sans-serif',
    h1: { 
      fontWeight: 800, 
      letterSpacing: '-0.5px',
      fontSize: '2.5rem',
    },
    h2: { 
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: { 
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: { 
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: { 
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: { 
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    button: { 
      fontWeight: 700, 
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          padding: '12px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: mussikOnColors.gradients.primary,
          color: '#ffffff',
          '&:hover': {
            background: mussikOnColors.gradients.secondary,
          },
        },
        outlined: {
          borderColor: mussikOnColors.primary.main,
          color: mussikOnColors.primary.main,
          '&:hover': {
            background: 'rgba(127, 95, 255, 0.08)',
          },
        },
        text: {
          color: mussikOnColors.primary.main,
          '&:hover': {
            background: 'rgba(127, 95, 255, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
};

// Tema Oscuro (MussikOn Dark)
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: mussikOnColors.primary,
    secondary: mussikOnColors.secondary,
    background: {
      default: '#0a0a23',
      paper: 'rgba(24, 28, 58, 0.95)',
    },
    // Custom palette extensions
    // Note: These are not part of the standard MUI palette but can be used in sx props
    text: {
      primary: '#ffffff',
      secondary: '#b0b8c1',
      disabled: '#888888',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: mussikOnColors.primary.main,
      hover: 'rgba(127, 95, 255, 0.08)',
      selected: 'rgba(127, 95, 255, 0.16)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          background: 'rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          background: 'rgba(24, 28, 58, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            background: 'rgba(24, 28, 58, 0.7)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mussikOnColors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: mussikOnColors.primary.main,
            },
          },
        },
      },
    },
  },
});

// Tema Claro (MussikOn Light)
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: mussikOnColors.primary,
    secondary: mussikOnColors.secondary,
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    // Custom palette extensions
    // Note: These are not part of the standard MUI palette but can be used in sx props
    text: {
      primary: '#1a1a2e',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: mussikOnColors.primary.main,
      hover: 'rgba(127, 95, 255, 0.04)',
      selected: 'rgba(127, 95, 255, 0.08)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            background: '#f8fafc',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mussikOnColors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: mussikOnColors.primary.main,
            },
          },
        },
      },
    },
  },
});

// Exportar configuración de colores para uso en componentes
export { mussikOnColors }; 