// Sistema centralizado de estilos para botones - MussikOn Admin System
// Este archivo utiliza el sistema centralizado de colores, sombras, espaciado y transiciones

import { colors } from './colors';
import { spacing } from './spacing';

// Estilos centralizados para botones sin transiciones ni sombras
export const buttonStyles = {
  // Botón primario
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.primary.contrastText,
    border: `1px solid ${colors.primary.main}`,
    borderRadius: spacing.borderRadius.md,
    padding: `${spacing.padding.md} ${spacing.padding.lg}`,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primary.dark,
      borderColor: colors.primary.dark,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      backgroundColor: colors.primary.dark,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      outline: `2px solid ${colors.primary.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón secundario
  secondary: {
    backgroundColor: 'transparent',
    color: colors.primary.main,
    border: `1px solid ${colors.primary.main}`,
    borderRadius: spacing.borderRadius.md,
    padding: `${spacing.padding.md} ${spacing.padding.lg}`,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primary.light,
      color: colors.primary.contrastText,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      backgroundColor: colors.primary.main,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      outline: `2px solid ${colors.primary.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de peligro
  danger: {
    backgroundColor: colors.error.main,
    color: colors.error.contrastText,
    border: `1px solid ${colors.error.main}`,
    borderRadius: spacing.borderRadius.md,
    padding: `${spacing.padding.md} ${spacing.padding.lg}`,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.error.dark,
      borderColor: colors.error.dark,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      backgroundColor: colors.error.dark,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      outline: `2px solid ${colors.error.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.error.light}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón pequeño
  small: {
    padding: `${spacing.padding.sm} ${spacing.padding.md}`,
    fontSize: '0.75rem',
    borderRadius: spacing.borderRadius.sm,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de navbar
  navbar: {
    borderRadius: '50%',
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de toggle de tema
  themeToggle: {
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de sidebar
  sidebarIcon: {
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón móvil del sidebar
  sidebarMobile: {
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de icono (para compatibilidad)
  icon: {
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  },

  // Botón de texto (para compatibilidad)
  text: {
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus': {
      boxShadow: 'none',
      transition: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none',
      transition: 'none'
    }
  }
};

// Estilos centralizados para chips sin transiciones ni sombras
export const chipStyles = {
  primary: {
    backgroundColor: colors.primary.light,
    color: colors.primary.main,
    border: `1px solid ${colors.primary.main}`,
    borderRadius: spacing.borderRadius.round,
    padding: `${spacing.padding.sm} ${spacing.padding.md}`,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  secondary: {
    backgroundColor: colors.secondary.light,
    color: colors.secondary.main,
    border: `1px solid ${colors.secondary.main}`,
    borderRadius: spacing.borderRadius.round,
    padding: `${spacing.padding.sm} ${spacing.padding.md}`,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.secondary.main,
      color: colors.secondary.contrastText,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  error: {
    backgroundColor: colors.error.light,
    color: colors.error.main,
    border: `1px solid ${colors.error.main}`,
    borderRadius: spacing.borderRadius.round,
    padding: `${spacing.padding.sm} ${spacing.padding.md}`,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.error.main,
      color: colors.error.contrastText,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  success: {
    backgroundColor: colors.success.light,
    color: colors.success.main,
    border: `1px solid ${colors.success.main}`,
    borderRadius: spacing.borderRadius.round,
    padding: `${spacing.padding.sm} ${spacing.padding.md}`,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colors.success.main,
      color: colors.success.contrastText,
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  }
};

// Estilos centralizados para tarjetas sin transiciones ni sombras
export const cardStyles = {
  default: {
    backgroundColor: '#ffffff',
    border: `1px solid #e0e0e0`,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.padding.lg,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  },

  dark: {
    backgroundColor: '#2d2d2d',
    border: `1px solid #404040`,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.padding.lg,
    transition: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
      transition: 'none'
    }
  }
};

// Funciones helper simplificadas
export const getButtonStyles = (variant: keyof typeof buttonStyles) => {
  return buttonStyles[variant];
};

export const getChipStyles = (variant: keyof typeof chipStyles) => {
  return chipStyles[variant];
};

export const getCardStyles = (variant: keyof typeof cardStyles) => {
  return cardStyles[variant];
}; 