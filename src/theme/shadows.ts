// Sistema centralizado de sombras para MussikOn Admin System
// Este archivo contiene todas las definiciones de sombras del proyecto

import { colors } from './colors';

export const shadows = {
  // Sombras básicas
  none: 'none',
  
  // Sombras sutiles
  subtle: {
    light: '0 2px 8px rgba(0, 0, 0, 0.1)',
    dark: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  
  // Sombras medias
  medium: {
    light: '0 4px 12px rgba(0, 0, 0, 0.15)',
    dark: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  
  // Sombras fuertes
  strong: {
    light: '0 8px 24px rgba(0, 0, 0, 0.2)',
    dark: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  
  // Sombras extra fuertes
  extra: {
    light: '0 16px 48px rgba(0, 0, 0, 0.25)',
    dark: '0 16px 48px rgba(0, 0, 0, 0.6)',
  },
  
  // Sombras de elevación (Material Design)
  elevation: {
    0: 'none',
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    6: '0 24px 48px rgba(0,0,0,0.35), 0 20px 14px rgba(0,0,0,0.22)',
    7: '0 29px 58px rgba(0,0,0,0.40), 0 25px 16px rgba(0,0,0,0.22)',
    8: '0 34px 68px rgba(0,0,0,0.45), 0 30px 18px rgba(0,0,0,0.22)',
    9: '0 39px 78px rgba(0,0,0,0.50), 0 35px 20px rgba(0,0,0,0.22)',
    10: '0 44px 88px rgba(0,0,0,0.55), 0 40px 22px rgba(0,0,0,0.22)',
    11: '0 49px 98px rgba(0,0,0,0.60), 0 45px 24px rgba(0,0,0,0.22)',
    12: '0 54px 108px rgba(0,0,0,0.65), 0 50px 26px rgba(0,0,0,0.22)',
    13: '0 59px 118px rgba(0,0,0,0.70), 0 55px 28px rgba(0,0,0,0.22)',
    14: '0 64px 128px rgba(0,0,0,0.75), 0 60px 30px rgba(0,0,0,0.22)',
    15: '0 69px 138px rgba(0,0,0,0.80), 0 65px 32px rgba(0,0,0,0.22)',
    16: '0 74px 148px rgba(0,0,0,0.85), 0 70px 34px rgba(0,0,0,0.22)',
    17: '0 79px 158px rgba(0,0,0,0.90), 0 75px 36px rgba(0,0,0,0.22)',
    18: '0 84px 168px rgba(0,0,0,0.95), 0 80px 38px rgba(0,0,0,0.22)',
    19: '0 89px 178px rgba(0,0,0,1.00), 0 85px 40px rgba(0,0,0,0.22)',
    20: '0 94px 188px rgba(0,0,0,1.00), 0 90px 42px rgba(0,0,0,0.22)',
    21: '0 99px 198px rgba(0,0,0,1.00), 0 95px 44px rgba(0,0,0,0.22)',
    22: '0 104px 208px rgba(0,0,0,1.00), 0 100px 46px rgba(0,0,0,0.22)',
    23: '0 109px 218px rgba(0,0,0,1.00), 0 105px 48px rgba(0,0,0,0.22)',
    24: '0 114px 228px rgba(0,0,0,1.00), 0 110px 50px rgba(0,0,0,0.22)',
  },
  
  // Sombras de marca (con colores MussikOn)
  brand: {
    primary: `0 4px 12px ${colors.primary.main}40`,
    secondary: `0 4px 12px ${colors.secondary.main}40`,
    accent: `0 4px 12px ${colors.accent.purple}40`,
    success: `0 4px 12px ${colors.success.main}40`,
    warning: `0 4px 12px ${colors.warning.main}40`,
    error: `0 4px 12px ${colors.error.main}40`,
    info: `0 4px 12px ${colors.info.main}40`,
  },
  
  // Sombras de hover
  hover: {
    light: '0 6px 16px rgba(0, 0, 0, 0.2)',
    dark: '0 6px 16px rgba(0, 0, 0, 0.5)',
    primary: `0 6px 16px ${colors.primary.main}50`,
    secondary: `0 6px 16px ${colors.secondary.main}50`,
    accent: `0 6px 16px ${colors.accent.purple}50`,
  },
  
  // Sombras de focus
  focus: {
    light: '0 0 0 2px rgba(127, 95, 255, 0.3)',
    dark: '0 0 0 2px rgba(127, 95, 255, 0.5)',
    primary: `0 0 0 2px ${colors.primary.main}40`,
    secondary: `0 0 0 2px ${colors.secondary.main}40`,
  },
  
  // Sombras de componentes específicos
  components: {
    card: {
      light: '0 8px 32px rgba(0, 0, 0, 0.12)',
      dark: '0 8px 32px rgba(0, 0, 0, 0.4)',
      hover: {
        light: '0 16px 48px rgba(0, 0, 0, 0.16)',
        dark: '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
    },
    button: {
      light: '0 2px 8px rgba(0, 0, 0, 0.1)',
      dark: '0 2px 8px rgba(0, 0, 0, 0.3)',
      hover: {
        light: '0 4px 12px rgba(0, 0, 0, 0.15)',
        dark: '0 4px 12px rgba(0, 0, 0, 0.4)',
      },
    },
    navbar: {
      light: '0 4px 20px rgba(0, 0, 0, 0.08)',
      dark: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },
    sidebar: {
      light: '2px 0 8px rgba(0, 0, 0, 0.1)',
      dark: '2px 0 8px rgba(0, 0, 0, 0.3)',
    },
    modal: {
      light: '0 20px 60px rgba(0, 0, 0, 0.2)',
      dark: '0 20px 60px rgba(0, 0, 0, 0.6)',
    },
    dropdown: {
      light: '0 8px 24px rgba(0, 0, 0, 0.15)',
      dark: '0 8px 24px rgba(0, 0, 0, 0.4)',
    },
    tooltip: {
      light: '0 4px 12px rgba(0, 0, 0, 0.2)',
      dark: '0 4px 12px rgba(0, 0, 0, 0.5)',
    },
  },
  
  // Sombras de texto
  text: {
    light: '0 2px 4px rgba(0, 0, 0, 0.3)',
    dark: '0 2px 4px rgba(0, 0, 0, 0.6)',
    primary: `0 2px 4px ${colors.primary.main}60`,
    secondary: `0 2px 4px ${colors.secondary.main}60`,
  },
  
  // Sombras de glassmorphism
  glass: {
    light: '0 8px 32px rgba(0, 0, 0, 0.1)',
    dark: '0 8px 32px rgba(0, 0, 0, 0.3)',
    primary: `0 8px 32px ${colors.primary.main}20`,
    secondary: `0 8px 32px ${colors.secondary.main}20`,
  },
};

// Función helper para obtener sombras según el tema
export const getThemeShadows = (isDark: boolean) => ({
  subtle: isDark ? shadows.subtle.dark : shadows.subtle.light,
  medium: isDark ? shadows.medium.dark : shadows.medium.light,
  strong: isDark ? shadows.strong.dark : shadows.strong.light,
  extra: isDark ? shadows.extra.dark : shadows.extra.light,
  hover: isDark ? shadows.hover.dark : shadows.hover.light,
  focus: isDark ? shadows.focus.dark : shadows.focus.light,
  card: {
    default: isDark ? shadows.components.card.dark : shadows.components.card.light,
    hover: isDark ? shadows.components.card.hover.dark : shadows.components.card.hover.light,
  },
  button: {
    default: isDark ? shadows.components.button.dark : shadows.components.button.light,
    hover: isDark ? shadows.components.button.hover.dark : shadows.components.button.hover.light,
  },
  navbar: isDark ? shadows.components.navbar.dark : shadows.components.navbar.light,
  sidebar: isDark ? shadows.components.sidebar.dark : shadows.components.sidebar.light,
  modal: isDark ? shadows.components.modal.dark : shadows.components.modal.light,
  dropdown: isDark ? shadows.components.dropdown.dark : shadows.components.dropdown.light,
  tooltip: isDark ? shadows.components.tooltip.dark : shadows.components.tooltip.light,
  text: isDark ? shadows.text.dark : shadows.text.light,
  glass: isDark ? shadows.glass.dark : shadows.glass.light,
});

// Función helper para crear sombras personalizadas
export const createShadow = (
  x: number = 0,
  y: number = 0,
  blur: number = 0,
  spread: number = 0,
  color: string = 'rgba(0, 0, 0, 0.1)'
) => {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
};

// Función helper para sombras con múltiples capas
export const createLayeredShadow = (shadows: string[]) => {
  return shadows.join(', ');
};

// Función helper para sombras de marca con opacidad
export const createBrandShadow = (
  color: keyof typeof colors.primary | keyof typeof colors.secondary | keyof typeof colors.accent,
  opacity: number = 0.4,
  x: number = 0,
  y: number = 4,
  blur: number = 12,
  spread: number = 0
) => {
  const colorValue = (colors as any)[color]?.main || colors.primary.main;
  const alphaColor = colorValue + Math.round(opacity * 255).toString(16).padStart(2, '0');
  return createShadow(x, y, blur, spread, alphaColor);
};

export default shadows; 