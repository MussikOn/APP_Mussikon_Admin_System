// Sistema de Diseño Unificado - MussikOn Admin System
// Proporciona estilos consistentes y modernos para toda la aplicación

import type { Theme } from '@mui/material/styles';

// Paleta de colores moderna
export const colors = {
  // Colores primarios
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Colores secundarios
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  
  // Colores de estado
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Colores neutros
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Colores de marca
  brand: {
    purple: '#7f5fff',
    cyan: '#00fff7',
    pink: '#ff2eec',
    orange: '#ff6b35',
    green: '#00ff88',
    blue: '#00e0ff',
  }
};

// Espaciado consistente
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  xxl: '3rem',      // 48px
  xxxl: '4rem',     // 64px
};

// Tipografía mejorada
export const typography = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};

// Bordes y radios
export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  width: {
    none: '0',
    thin: '1px',
    thick: '2px',
    thicker: '4px',
  }
};

// Sombras modernas
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Transiciones suaves
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

// Breakpoints responsivos
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};

// Estilos de componentes base
export const componentStyles = {
  // Cards modernos
  card: {
    base: {
      borderRadius: borders.radius.lg,
      boxShadow: shadows.base,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      overflow: 'hidden',
      '&:hover': {
        boxShadow: shadows.lg,
        transform: 'translateY(-2px)',
      }
    },
    
    elevated: {
      borderRadius: borders.radius.xl,
      boxShadow: shadows.lg,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      overflow: 'hidden',
      '&:hover': {
        boxShadow: shadows.xl,
        transform: 'translateY(-4px)',
      }
    },
    
    flat: {
      borderRadius: borders.radius.md,
      border: `${borders.width.thin} solid`,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        borderColor: 'primary.main',
      }
    }
  },
  
  // Botones modernos
  button: {
    primary: {
      borderRadius: borders.radius.md,
      fontWeight: typography.fontWeight.semibold,
      textTransform: 'none',
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: shadows.md,
      }
    },
    
    secondary: {
      borderRadius: borders.radius.md,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        transform: 'translateY(-1px)',
      }
    },
    
    ghost: {
      borderRadius: borders.radius.md,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      }
    }
  },
  
  // Inputs modernos
  input: {
    base: {
      borderRadius: borders.radius.md,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '& .MuiOutlinedInput-root': {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
          borderWidth: borders.width.thick,
        }
      }
    }
  },
  
  // Chips modernos
  chip: {
    base: {
      borderRadius: borders.radius.full,
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.sm,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        transform: 'scale(1.05)',
      }
    }
  },
  
  // Avatars modernos
  avatar: {
    base: {
      borderRadius: borders.radius.full,
      transition: `all ${transitions.duration.normal} ${transitions.easing.ease}`,
      '&:hover': {
        transform: 'scale(1.1)',
      }
    }
  }
};

// Gradientes modernos
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  error: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  dark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  light: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  
  // Gradientes de marca
  brand: {
    purple: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
    cyan: 'linear-gradient(135deg, #00fff7 0%, #7f5fff 100%)',
    pink: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
    orange: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    green: 'linear-gradient(135deg, #00ff88 0%, #00e0ff 100%)',
  }
};

// Utilidades para temas
export const createThemeStyles = (theme: Theme) => ({
  // Fondo con gradiente
  gradientBackground: {
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #0a0a23 0%, #181c3a 50%, #1a1a2e 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
  },
  
  // Glassmorphism
  glass: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(31, 38, 135, 0.15)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
  },
  
  // Sombra de texto
  textShadow: {
    textShadow: theme.palette.mode === 'dark'
      ? '0 2px 4px rgba(0,0,0,0.5)'
      : '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  // Scrollbar personalizada
  customScrollbar: {
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f1f1f1',
      borderRadius: borders.radius.full,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.mode === 'dark' ? '#667eea' : '#cbd5e1',
      borderRadius: borders.radius.full,
      '&:hover': {
        background: theme.palette.mode === 'dark' ? '#764ba2' : '#94a3b8',
      },
    },
  }
});

// Exportar todo el sistema de diseño
export const designSystem = {
  colors,
  spacing,
  typography,
  borders,
  shadows,
  transitions,
  breakpoints,
  componentStyles,
  gradients,
  createThemeStyles,
};

export default designSystem; 