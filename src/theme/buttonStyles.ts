// Sistema centralizado de estilos para botones - MussikOn Admin System
// Este archivo utiliza el sistema centralizado de colores, sombras, espaciado y transiciones

import { colors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { transitions } from './transitions';

// Función helper para obtener estilos según el tema
const getThemeStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.background.dark : colors.background.light;
  const themeShadows = isDark ? shadows.components.button.dark : shadows.components.button.light;
  const themeShadowHover = isDark ? shadows.components.button.hover.dark : shadows.components.button.hover.light;
  
  return {
    background: themeColors,
    shadow: themeShadows,
    shadowHover: themeShadowHover,
  };
};

export const buttonStyles = {
  // Botón primario con gradiente
  primary: {
    background: colors.gradients.primary,
    borderRadius: spacing.borderRadius.md,
    px: spacing.padding.lg,
    py: spacing.padding.md,
    fontWeight: 600,
    textTransform: 'none' as const,
    boxShadow: shadows.components.button.light,
    transition: transitions.components.button.hover,
    color: colors.primary.contrastText,
    '&:hover': {
      background: colors.gradients.secondary,
      transform: 'translateY(-1px)',
      boxShadow: shadows.components.button.hover.light,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.components.button.light,
    },
    '&:focus': {
      outline: `2px solid ${colors.primary.main}40`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      background: colors.alpha.primary(0.3),
      transform: 'none',
      boxShadow: shadows.none,
      cursor: 'not-allowed',
    }
  },

  // Botón secundario
  secondary: {
    background: colors.alpha.secondary(0.1),
    color: colors.secondary.main,
    border: `1px solid ${colors.alpha.secondary(0.3)}`,
    borderRadius: spacing.borderRadius.md,
    px: spacing.padding.lg,
    py: spacing.padding.md,
    fontWeight: 6,
    textTransform: 'none' as const,
    transition: transitions.components.button.hover,
    '&:hover': {
      background: colors.alpha.secondary(0.2),
      border: `1px solid ${colors.alpha.secondary(0.5)}`,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      outline: `2px solid ${colors.secondary.main}40`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      background: colors.alpha.secondary(0.05),
      color: colors.alpha.secondary(0.5),
      transform: 'none',
      cursor: 'not-allowed',
    }
  },

  // Botón de peligro
  danger: {
    background: colors.gradients.danger,
    borderRadius: spacing.borderRadius.md,
    px: spacing.padding.lg,
    py: spacing.padding.md,
    fontWeight: 600,
    textTransform: 'none' as const,
    boxShadow: shadows.components.button.light,
    transition: transitions.components.button.hover,
    color: colors.error.contrastText,
    '&:hover': {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff2eec 100%)',
      transform: 'translateY(-1px)',
      boxShadow: shadows.components.button.hover.light,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.components.button.light,
    },
    '&:focus': {
      outline: `2px solid ${colors.error.main}40`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      background: colors.alpha.error(0.3),
      transform: 'none',
      boxShadow: shadows.none,
      cursor: 'not-allowed',
    }
  },

  // Botón de texto (sin fondo)
  text: {
    color: colors.text.light.secondary,
    textTransform: 'none' as const,
    transition: transitions.components.button.hover,
    '&:hover': {
      background: colors.action.light.hover,
    },
    '&:focus': {
      outline: `2px solid ${colors.primary.main}40`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      color: colors.text.light.disabled,
      background: 'transparent',
      cursor: 'not-allowed',
    }
  },

  // Botón pequeño
  small: {
    px: spacing.padding.md,
    py: spacing.padding.sm,
    fontSize: '0.875rem',
    borderRadius: spacing.borderRadius.sm,
    boxShadow: shadows.components.button.light,
    transition: transitions.components.button.hover,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: shadows.components.button.hover.light,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.components.button.light,
    }
  },

  // Botón de icono
  icon: {
    minWidth: 'auto',
    width: spacing.components.button.padding.md,
    height: spacing.components.button.padding.md,
    borderRadius: spacing.borderRadius.round,
    p: 0,
    transition: transitions.components.button.hover,
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(1)',
    }
  },

  // Botón de icono del sidebar (sin sombras excesivas)
  sidebarIcon: {
    color: colors.text.light.secondary,
    boxShadow: shadows.none,
    transition: transitions.components.sidebar.item,
    '&:hover': { 
      background: colors.action.light.hover,
      transform: 'none',
      boxShadow: shadows.none
    },
    '&:active': {
      transform: 'none',
      boxShadow: shadows.none
    },
    '&:focus': {
      boxShadow: shadows.none
    },
    '&:focus-visible': {
      boxShadow: shadows.none
    }
  },

  // Botón móvil del sidebar (hamburger menu)
  sidebarMobile: {
    position: 'fixed',
    top: spacing.component.md,
    left: spacing.component.md,
    zIndex: 1200,
    boxShadow: shadows.none,
    transition: transitions.components.sidebar.toggle,
    '&:hover': {
      transform: 'none',
      boxShadow: shadows.none
    },
    '&:active': {
      transform: 'none',
      boxShadow: shadows.none
    },
    '&:focus': {
      boxShadow: shadows.none
    },
    '&:focus-visible': {
      boxShadow: shadows.none
    }
  },

  // Botón del navbar (para evitar interferencias entre botones cercanos)
  navbar: {
    borderRadius: spacing.borderRadius.round,
    minWidth: 40,
    minHeight: 40,
    padding: spacing.padding.sm,
    margin: spacing.component.xs,
    transition: transitions.components.navbar.item,
    position: 'relative',
    zIndex: 1,
    boxShadow: shadows.none,
    '&:hover': { 
      background: colors.action.light.hover,
      transform: 'scale(1.05)',
      boxShadow: shadows.none,
      zIndex: 2,
    },
    '&:active': {
      transform: 'scale(1)',
      boxShadow: shadows.none,
      zIndex: 3,
    },
    '&:focus': {
      outline: `2px solid ${colors.alpha.white(0.3)}`,
      outlineOffset: '2px',
      boxShadow: shadows.none,
      zIndex: 2,
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.alpha.white(0.3)}`,
      outlineOffset: '2px',
      boxShadow: shadows.none,
      zIndex: 2,
    }
  },

  // Botón del ThemeToggle (compatible con otros botones del navbar)
  themeToggle: {
    borderRadius: spacing.borderRadius.round,
    minWidth: 40,
    minHeight: 40,
    padding: spacing.padding.sm,
    margin: spacing.component.xs,
    transition: transitions.components.navbar.item,
    position: 'relative',
    zIndex: 1,
    boxShadow: shadows.none,
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: shadows.none,
      zIndex: 2,
    },
    '&:active': {
      transform: 'scale(1)',
      boxShadow: shadows.none,
      zIndex: 3,
    },
    '&:focus': {
      outline: `2px solid ${colors.alpha.white(0.5)}`,
      outlineOffset: '2px',
      boxShadow: shadows.none,
      zIndex: 2,
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.alpha.white(0.5)}`,
      outlineOffset: '2px',
      boxShadow: shadows.none,
      zIndex: 2,
    }
  }
};

// Estilos para chips (etiquetas)
export const chipStyles = {
  primary: {
    background: colors.alpha.primary(0.1),
    color: colors.primary.main,
    fontWeight: 600,
    border: `1px solid ${colors.alpha.primary(0.2)}`,
    transition: transitions.components.chip.base,
    '&:hover': {
      background: colors.alpha.primary(0.2),
      transform: 'scale(1.05)',
    }
  },
  secondary: {
    background: colors.alpha.secondary(0.1),
    color: colors.secondary.main,
    fontWeight: 600,
    border: `1px solid ${colors.alpha.secondary(0.2)}`,
    transition: transitions.components.chip.base,
    '&:hover': {
      background: colors.alpha.secondary(0.2),
      transform: 'scale(1.05)',
    }
  },
  success: {
    background: colors.alpha.success(0.1),
    color: colors.success.main,
    fontWeight: 600,
    border: `1px solid ${colors.alpha.success(0.2)}`,
    transition: transitions.components.chip.base,
    '&:hover': {
      background: colors.alpha.success(0.2),
      transform: 'scale(1.05)',
    }
  },
  warning: {
    background: colors.alpha.warning(0.1),
    color: colors.warning.main,
    fontWeight: 600,
    border: `1px solid ${colors.alpha.warning(0.2)}`,
    transition: transitions.components.chip.base,
    '&:hover': {
      background: colors.alpha.warning(0.2),
      transform: 'scale(1.05)',
    }
  },
  error: {
    background: colors.alpha.error(0.1),
    color: colors.error.main,
    fontWeight: 600,
    border: `1px solid ${colors.alpha.error(0.2)}`,
    transition: transitions.components.chip.base,
    '&:hover': {
      background: colors.alpha.error(0.2),
      transform: 'scale(1.05)',
    }
  }
};

// Estilos para cards
export const cardStyles = {
  default: {
    background: colors.background.light.paper,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border.light.primary}`,
    borderRadius: spacing.borderRadius.lg,
    boxShadow: shadows.components.card.light,
    transition: transitions.components.card.hover,
    '&:hover': {
      boxShadow: shadows.components.card.hover.light,
      transform: 'translateY(-1px)',
    }
  },
  dark: {
    background: colors.background.dark.paper,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border.dark.primary}`,
    borderRadius: spacing.borderRadius.lg,
    boxShadow: shadows.components.card.dark,
    transition: transitions.components.card.hover,
    '&:hover': {
      boxShadow: shadows.components.card.hover.dark,
      transform: 'translateY(-1px)',
    }
  }
};

// Función helper para obtener estilos de botón según el tema
export const getButtonStyles = (isDark: boolean) => {
  const themeStyles = getThemeStyles(isDark);
  
  return {
    ...buttonStyles,
    primary: {
      ...buttonStyles.primary,
      boxShadow: themeStyles.shadow,
      '&:hover': {
        ...buttonStyles.primary['&:hover'],
        boxShadow: themeStyles.shadowHover,
      },
      '&:active': {
        ...buttonStyles.primary['&:active'],
        boxShadow: themeStyles.shadow,
      }
    },
    secondary: {
      ...buttonStyles.secondary,
      '&:hover': {
        ...buttonStyles.secondary['&:hover'],
      }
    },
    danger: {
      ...buttonStyles.danger,
      boxShadow: themeStyles.shadow,
      '&:hover': {
        ...buttonStyles.danger['&:hover'],
        boxShadow: themeStyles.shadowHover,
      },
      '&:active': {
        ...buttonStyles.danger['&:active'],
        boxShadow: themeStyles.shadow,
      }
    }
  };
};

// Función helper para obtener estilos de chip según el tema
export const getChipStyles = (_isDark: boolean) => {
  return {
    ...chipStyles,
    // Los chips mantienen sus colores específicos independientemente del tema
  };
};

// Función helper para obtener estilos de card según el tema
export const getCardStyles = (isDark: boolean) => {
  return isDark ? cardStyles.dark : cardStyles.default;
};

export default buttonStyles; 