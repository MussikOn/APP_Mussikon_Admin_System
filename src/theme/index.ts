// Sistema centralizado de estilos para MussikOn Admin System
// Este archivo exporta todos los módulos del sistema de estilos

// Exportar colores
export { colors, getThemeColors, getGradientWithOpacity, getStateColor } from './colors';

// Exportar sombras
export { shadows, getThemeShadows, createShadow, createLayeredShadow, createBrandShadow } from './shadows';

// Exportar espaciado
export { 
  spacing, 
  getResponsiveSpacing, 
  createSpacing, 
  getComponentSpacing as getSpacingComponentSpacing, 
  getLayoutSpacing, 
  getSectionSpacing, 
  getPageSpacing, 
  getGridSpacing, 
  getGapSpacing, 
  getPaddingSpacing, 
  getMarginSpacing, 
  getBorderRadius, 
  getComponentSpecificSpacing 
} from './spacing';

// Exportar transiciones
export { 
  transitions, 
  createTransition, 
  createHoverTransition, 
  createFocusTransition, 
  createActiveTransition, 
  getComponentTransition as getTransitionComponentTransition, 
  getPropertyTransition, 
  getPresetTransition, 
  getDuration, 
  getEasing 
} from './transitions';

// Exportar estilos de botones
export { 
  buttonStyles, 
  chipStyles, 
  cardStyles, 
  getButtonStyles, 
  getChipStyles, 
  getCardStyles 
} from './buttonStyles';

// Exportar breakpoints
export { 
  breakpoints, 
  responsiveTypography, 
  responsiveSpacing, 
  responsiveGrids, 
  responsiveLayouts, 
  responsiveComponents, 
  breakpointUtils, 
  useResponsiveValue 
} from './breakpoints';

// Exportar configuración del tema
export { darkTheme, lightTheme } from './themeConfig';

// Importar módulos para las funciones helper
import { getThemeColors, colors } from './colors';
import { getThemeShadows, shadows } from './shadows';
import { getButtonStyles, getChipStyles, getCardStyles } from './buttonStyles';
import { spacing } from './spacing';
import { transitions } from './transitions';
import { breakpoints } from './breakpoints';

// Función helper principal para obtener todos los estilos según el tema
export const getThemeSystem = (isDark: boolean) => {
  return {
    colors: getThemeColors(isDark),
    shadows: getThemeShadows(isDark),
    spacing,
    transitions,
    buttonStyles: getButtonStyles('primary'),
    chipStyles: getChipStyles('primary'),
    cardStyles: getCardStyles('default'),
    breakpoints,
  };
};

// Función helper para crear estilos personalizados
export const createCustomStyles = (
  component: string,
  variant: string,
  isDark: boolean = false,
  customProps: Record<string, any> = {}
) => {
  const baseStyles = getThemeSystem(isDark);
  
  return {
    ...baseStyles,
    ...customProps,
    component,
    variant,
    isDark,
  };
};

// Función helper para obtener estilos de componente específico
export const getComponentStyles = (
  component: 'button' | 'card' | 'chip' | 'input' | 'modal' | 'dropdown' | 'tooltip' | 'sidebar' | 'navbar',
  variant: string,
  isDark: boolean = false
) => {
  const themeSystem = getThemeSystem(isDark);
  
  switch (component) {
    case 'button':
      return themeSystem.buttonStyles[variant as keyof typeof themeSystem.buttonStyles];
    case 'card':
      return themeSystem.cardStyles;
    case 'chip':
      return themeSystem.chipStyles[variant as keyof typeof themeSystem.chipStyles];
    default:
      return {};
  }
};

// Función helper para obtener estilos de sombra según componente
export const getComponentShadow = (
  component: 'card' | 'button' | 'navbar' | 'sidebar' | 'modal' | 'dropdown' | 'tooltip',
  state: 'default' | 'hover' | 'focus' = 'default',
  isDark: boolean = false
) => {
  const themeShadows = getThemeShadows(isDark);
  
  if (component === 'card') {
    return state === 'hover' ? themeShadows.card.hover : themeShadows.card.default;
  }
  
  if (component === 'button') {
    return state === 'hover' ? themeShadows.button.hover : themeShadows.button.default;
  }
  
  return themeShadows[component as keyof typeof themeShadows];
};

// Función helper para obtener transiciones según componente
export const getComponentTransition = (
  component: 'button' | 'card' | 'input' | 'modal' | 'dropdown' | 'tooltip' | 'sidebar' | 'navbar' | 'chip' | 'avatar' | 'badge',
  state: 'base' | 'hover' | 'active' | 'focus' | 'disabled' = 'base',
  _isDark: boolean = false
) => {
  return (transitions.components as any)[component][state];
};

// Función helper para obtener espaciado según componente
export const getComponentSpacing = (
  component: 'button' | 'card' | 'input' | 'modal' | 'navbar' | 'sidebar',
  property: 'padding' | 'borderRadius' | 'height' | 'width',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => {
  return (spacing.components as any)[component][property][size];
};

// Exportar tipos principales
export type ThemeSystem = ReturnType<typeof getThemeSystem>;
export type CustomStyles = ReturnType<typeof createCustomStyles>;
export type ComponentStyles = ReturnType<typeof getComponentStyles>;

// Exportar constantes principales
export const THEME_CONSTANTS = {
  COLORS: colors,
  SHADOWS: shadows,
  SPACING: spacing,
  TRANSITIONS: transitions,
  BREAKPOINTS: breakpoints,
} as const;

export default THEME_CONSTANTS; 