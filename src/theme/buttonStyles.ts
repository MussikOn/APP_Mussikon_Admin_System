// Estilos optimizados para botones - Elimina sombras excesivas y parpadeos

// Sistema centralizado de sombras sutiles
export const shadowStyles = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
  strong: '0 8px 24px rgba(0, 0, 0, 0.2)',
  colored: (color: string, opacity: number = 0.2) => `0 4px 12px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  hover: (color: string, opacity: number = 0.3) => `0 6px 16px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  none: 'none'
};

export const buttonStyles = {
  // Botón primario con gradiente
  primary: {
    background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
    borderRadius: 2,
    px: 3,
    py: 1.5,
    fontWeight: 600,
    textTransform: 'none' as const,
    boxShadow: shadowStyles.subtle,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
      transform: 'translateY(-1px)',
      boxShadow: shadowStyles.medium,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadowStyles.subtle,
    },
    '&:disabled': {
      background: 'rgba(127, 95, 255, 0.3)',
      transform: 'none',
      boxShadow: shadowStyles.none,
    }
  },

  // Botón secundario
  secondary: {
    background: 'rgba(0, 224, 255, 0.1)',
    color: '#00e0ff',
    border: '1px solid rgba(0, 224, 255, 0.3)',
    borderRadius: 2,
    px: 3,
    py: 1.5,
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(0, 224, 255, 0.2)',
      border: '1px solid rgba(0, 224, 255, 0.5)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      background: 'rgba(0, 224, 255, 0.05)',
      color: 'rgba(0, 224, 255, 0.5)',
      transform: 'none',
    }
  },

  // Botón de peligro
  danger: {
    background: 'linear-gradient(135deg, #ff2eec 0%, #ff6b6b 100%)',
    borderRadius: 2,
    px: 3,
    py: 1.5,
    fontWeight: 600,
    textTransform: 'none' as const,
    boxShadow: shadowStyles.subtle,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff2eec 100%)',
      transform: 'translateY(-1px)',
      boxShadow: shadowStyles.medium,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadowStyles.subtle,
    },
    '&:disabled': {
      background: 'rgba(255, 46, 236, 0.3)',
      transform: 'none',
      boxShadow: shadowStyles.none,
    }
  },

  // Botón de texto (sin fondo)
  text: {
    color: 'text.secondary',
    textTransform: 'none' as const,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(0,0,0,0.04)',
    },
    '&:disabled': {
      color: 'text.disabled',
      background: 'transparent',
    }
  },

  // Botón pequeño
  small: {
    px: 2,
    py: 1,
    fontSize: '0.875rem',
    borderRadius: 1.5,
    boxShadow: shadowStyles.subtle,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: shadowStyles.medium,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadowStyles.subtle,
    }
  },

  // Botón de icono
  icon: {
    minWidth: 'auto',
    width: 40,
    height: 40,
    borderRadius: '50%',
    p: 0,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(1)',
    }
  },

  // Botón de icono del sidebar (sin sombras excesivas)
  sidebarIcon: {
    color: 'text.secondary',
    boxShadow: 'none',
    transition: 'all 0.2s ease',
    '&:hover': { 
      background: 'rgba(255,255,255,0.1)',
      transform: 'none',
      boxShadow: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none'
    },
    '&:focus': {
      boxShadow: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none'
    }
  },

  // Botón móvil del sidebar (hamburger menu)
  sidebarMobile: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1200,
    boxShadow: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    },
    '&:active': {
      transform: 'none',
      boxShadow: 'none'
    },
    '&:focus': {
      boxShadow: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none'
    }
  },

  // Botón del navbar (para evitar interferencias entre botones cercanos)
  navbar: {
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    '&:hover': { 
      background: 'rgba(255,255,255,0.1)',
      transform: 'scale(1.05)'
    },
    '&:active': {
      transform: 'scale(1)',
    },
    '&:focus': {
      outline: '2px solid rgba(255, 255, 255, 0.3)',
      outlineOffset: '2px',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(255, 255, 255, 0.3)',
      outlineOffset: '2px',
    }
  }
};

// Estilos para chips (etiquetas)
export const chipStyles = {
  primary: {
    background: 'rgba(127, 95, 255, 0.1)',
    color: '#7f5fff',
    fontWeight: 600,
    border: '1px solid rgba(127, 95, 255, 0.2)',
  },
  secondary: {
    background: 'rgba(0, 224, 255, 0.1)',
    color: '#00e0ff',
    fontWeight: 600,
    border: '1px solid rgba(0, 224, 255, 0.2)',
  },
  success: {
    background: 'rgba(0, 230, 118, 0.1)',
    color: '#00e676',
    fontWeight: 600,
    border: '1px solid rgba(0, 230, 118, 0.2)',
  },
  warning: {
    background: 'rgba(255, 152, 0, 0.1)',
    color: '#ff9800',
    fontWeight: 600,
    border: '1px solid rgba(255, 152, 0, 0.2)',
  },
  error: {
    background: 'rgba(255, 68, 68, 0.1)',
    color: '#ff4444',
    fontWeight: 600,
    border: '1px solid rgba(255, 68, 68, 0.2)',
  }
};

// Estilos para cards
export const cardStyles = {
  default: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 3,
    boxShadow: shadowStyles.subtle,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: shadowStyles.medium,
      transform: 'translateY(-1px)',
    }
  },
  dark: {
    background: 'rgba(31, 38, 135, 0.15)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 3,
    boxShadow: shadowStyles.subtle,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: shadowStyles.medium,
      transform: 'translateY(-1px)',
    }
  }
}; 