// Sistema centralizado de colores para MussikOn Admin System
// Este archivo contiene todas las definiciones de colores del proyecto

export const colors = {
  // Colores primarios de la marca MussikOn
  primary: {
    main: '#7f5fff',
    light: '#9b7dff',
    dark: '#5a3fd9',
    contrastText: '#ffffff',
    50: '#f3f1ff',
    100: '#e5dfff',
    200: '#d1c7ff',
    300: '#b3a3ff',
    400: '#8f75ff',
    500: '#7f5fff',
    600: '#6b4de6',
    700: '#5a3fd9',
    800: '#4a35b3',
    900: '#3f2e8f',
  },
  
  secondary: {
    main: '#00e0ff',
    light: '#33e6ff',
    dark: '#00b3cc',
    contrastText: '#ffffff',
    50: '#e6ffff',
    100: '#b3ffff',
    200: '#80ffff',
    300: '#4dffff',
    400: '#1affff',
    500: '#00e0ff',
    600: '#00b3cc',
    700: '#008099',
    800: '#004d66',
    900: '#001a33',
  },

  // Colores de acento
  accent: {
    purple: '#b993d6',
    pink: '#ff2eec',
    cyan: '#00fff7',
    orange: '#ff6b35',
    yellow: '#ffd700',
    green: '#00e676',
    red: '#ff4444',
  },

  // Gradientes de marca
  gradients: {
    primary: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
    secondary: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
    accent: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
    success: 'linear-gradient(135deg, #00fff7 0%, #7f5fff 100%)',
    danger: 'linear-gradient(135deg, #ff2eec 0%, #ff6b6b 100%)',
    warning: 'linear-gradient(135deg, #ff6b35 0%, #ffd700 100%)',
    info: 'linear-gradient(135deg, #00e0ff 0%, #b993d6 100%)',
  },

  // Estados semánticos
  success: {
    main: '#00e676',
    light: '#66ffa6',
    dark: '#00b248',
    contrastText: '#ffffff',
    50: '#e6fff0',
    100: '#b3ffd9',
    200: '#80ffc2',
    300: '#4dffab',
    400: '#1aff94',
    500: '#00e676',
    600: '#00b248',
    700: '#00801a',
    800: '#004d00',
    900: '#001a00',
  },

  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#ffffff',
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#f57c00',
    700: '#ef6c00',
    800: '#e65100',
    900: '#ff3d00',
  },

  error: {
    main: '#ff4444',
    light: '#ff6b6b',
    dark: '#d32f2f',
    contrastText: '#ffffff',
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#ff4444',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },

  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#ffffff',
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Colores de fondo
  background: {
    light: {
      default: '#f8fafc',
      paper: '#ffffff',
      secondary: '#e2e8f0',
      tertiary: '#cbd5e1',
    },
    dark: {
      default: '#0a0a23',
      paper: 'rgba(24, 28, 58, 0.95)',
      secondary: '#181c3a',
      tertiary: '#1a1a2e',
    },
  },

  // Colores de texto
  text: {
    light: {
      primary: '#1a202c',
      secondary: '#4a5568',
      disabled: '#a0aec0',
      inverse: '#ffffff',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      disabled: '#a0a0a0',
      inverse: '#1a202c',
    },
  },

  // Colores de borde
  border: {
    light: {
      primary: 'rgba(0, 0, 0, 0.12)',
      secondary: 'rgba(0, 0, 0, 0.08)',
      tertiary: 'rgba(0, 0, 0, 0.04)',
    },
    dark: {
      primary: 'rgba(255, 255, 255, 0.2)',
      secondary: 'rgba(255, 255, 255, 0.12)',
      tertiary: 'rgba(255, 255, 255, 0.08)',
    },
  },

  // Colores de acción
  action: {
    light: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    dark: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },

  // Colores de sombra
  shadow: {
    light: {
      subtle: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      strong: 'rgba(0, 0, 0, 0.2)',
      colored: (color: string, opacity: number = 0.2) => 
        `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    },
    dark: {
      subtle: 'rgba(0, 0, 0, 0.3)',
      medium: 'rgba(0, 0, 0, 0.4)',
      strong: 'rgba(0, 0, 0, 0.5)',
      colored: (color: string, opacity: number = 0.3) => 
        `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    },
  },

  // Colores de transparencia
  alpha: {
    primary: (opacity: number) => `rgba(127, 95, 255, ${opacity})`,
    secondary: (opacity: number) => `rgba(0, 224, 255, ${opacity})`,
    success: (opacity: number) => `rgba(0, 230, 118, ${opacity})`,
    warning: (opacity: number) => `rgba(255, 152, 0, ${opacity})`,
    error: (opacity: number) => `rgba(255, 68, 68, ${opacity})`,
    info: (opacity: number) => `rgba(33, 150, 243, ${opacity})`,
    white: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    black: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  },
};

// Función helper para obtener colores según el tema
export const getThemeColors = (isDark: boolean) => ({
  background: isDark ? colors.background.dark : colors.background.light,
  text: isDark ? colors.text.dark : colors.text.light,
  border: isDark ? colors.border.dark : colors.border.light,
  action: isDark ? colors.action.dark : colors.action.light,
  shadow: isDark ? colors.shadow.dark : colors.shadow.light,
});

// Función helper para gradientes con opacidad
export const getGradientWithOpacity = (gradient: string, opacity: number = 1) => {
  return gradient.replace(/rgba?\([^)]+\)/g, (match) => {
    return match.replace(/[\d.]+\)$/, `${opacity})`);
  });
};

// Función helper para colores de estado
export const getStateColor = (state: 'success' | 'warning' | 'error' | 'info', _isDark: boolean = false) => {
  const stateColors = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  };
  
  return {
    main: stateColors[state].main,
    light: stateColors[state].light,
    dark: stateColors[state].dark,
    contrastText: stateColors[state].contrastText,
    alpha: (opacity: number) => colors.alpha[state](opacity),
  };
};

export default colors; 