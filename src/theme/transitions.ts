// Sistema centralizado de transiciones para MussikOn Admin System
// Este archivo contiene todas las definiciones de transiciones del proyecto

export const transitions = {
  // Duración de transiciones
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 800,
  },
  
  // Funciones de timing
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    cubicBezier: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  // Transiciones predefinidas
  presets: {
    // Transiciones básicas
    fade: {
      in: 'opacity 0.2s ease-in-out',
      out: 'opacity 0.2s ease-in-out',
    },
    slide: {
      up: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      down: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      left: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      right: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    scale: {
      in: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    rotate: {
      in: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Transiciones de componentes
    button: {
      hover: 'all 0.2s ease-in-out',
      active: 'all 0.1s ease-in-out',
      focus: 'all 0.2s ease-in-out',
    },
    card: {
      hover: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      focus: 'all 0.2s ease-in-out',
    },
    input: {
      focus: 'all 0.2s ease-in-out',
      blur: 'all 0.2s ease-in-out',
    },
    modal: {
      in: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'all 0.2s cubic-bezier(0.4, 0, 0.6, 1)',
    },
    dropdown: {
      in: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'all 0.15s cubic-bezier(0.4, 0, 0.6, 1)',
    },
    tooltip: {
      in: 'all 0.2s ease-in-out',
      out: 'all 0.15s ease-in-out',
    },
    sidebar: {
      in: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)',
    },
    navbar: {
      scroll: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Transiciones de estado
    state: {
      loading: 'all 0.3s ease-in-out',
      error: 'all 0.2s ease-in-out',
      success: 'all 0.2s ease-in-out',
      warning: 'all 0.2s ease-in-out',
    },
    
    // Transiciones de animación
    animation: {
      bounce: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      spring: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
  
  // Transiciones de propiedades específicas
  properties: {
    // Propiedades de transformación
    transform: {
      hover: 'transform 0.2s ease-in-out',
      active: 'transform 0.1s ease-in-out',
      focus: 'transform 0.2s ease-in-out',
    },
    
    // Propiedades de color
    color: {
      hover: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
      focus: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
    },
    
    // Propiedades de sombra
    shadow: {
      hover: 'box-shadow 0.2s ease-in-out',
      focus: 'box-shadow 0.2s ease-in-out',
    },
    
    // Propiedades de borde
    border: {
      focus: 'border-color 0.2s ease-in-out, outline 0.2s ease-in-out',
    },
    
    // Propiedades de opacidad
    opacity: {
      fade: 'opacity 0.2s ease-in-out',
      loading: 'opacity 0.3s ease-in-out',
    },
    
    // Propiedades de tamaño
    size: {
      scale: 'width 0.2s ease-in-out, height 0.2s ease-in-out',
      expand: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      collapse: 'max-height 0.2s cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  // Transiciones de componentes específicos
  components: {
    // Botones
    button: {
      base: 'all 0.2s ease-in-out',
      hover: 'all 0.2s ease-in-out',
      active: 'all 0.1s ease-in-out',
      focus: 'all 0.2s ease-in-out',
      disabled: 'all 0.2s ease-in-out',
    },
    
    // Cards
    card: {
      base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      hover: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      focus: 'all 0.2s ease-in-out',
      loading: 'all 0.3s ease-in-out',
    },
    
    // Inputs
    input: {
      base: 'all 0.2s ease-in-out',
      focus: 'all 0.2s ease-in-out',
      blur: 'all 0.2s ease-in-out',
      error: 'all 0.2s ease-in-out',
      success: 'all 0.2s ease-in-out',
    },
    
    // Modales
    modal: {
      backdrop: 'opacity 0.3s ease-in-out',
      content: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Dropdowns
    dropdown: {
      menu: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      item: 'all 0.15s ease-in-out',
    },
    
    // Tooltips
    tooltip: {
      base: 'all 0.2s ease-in-out',
      show: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
      hide: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    },
    
    // Sidebar
    sidebar: {
      base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      toggle: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      item: 'all 0.2s ease-in-out',
    },
    
    // Navbar
    navbar: {
      base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      scroll: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      item: 'all 0.2s ease-in-out',
    },
    
    // Chips
    chip: {
      base: 'all 0.2s ease-in-out',
      hover: 'all 0.2s ease-in-out',
      focus: 'all 0.2s ease-in-out',
    },
    
    // Avatars
    avatar: {
      base: 'all 0.2s ease-in-out',
      hover: 'all 0.2s ease-in-out',
      focus: 'all 0.2s ease-in-out',
    },
    
    // Badges
    badge: {
      base: 'all 0.2s ease-in-out',
      pulse: 'all 0.6s ease-in-out infinite',
    },
  },
};

// Función helper para crear transiciones personalizadas
export const createTransition = (
  properties: string | string[],
  duration: number = transitions.duration.normal,
  easing: string = transitions.easing.cubicBezier.smooth,
  delay: number = 0
) => {
  const props = Array.isArray(properties) ? properties.join(', ') : properties;
  return `${props} ${duration}ms ${easing} ${delay}ms`;
};

// Función helper para transiciones de hover
export const createHoverTransition = (
  properties: string | string[],
  duration: number = transitions.duration.normal
) => {
  return createTransition(properties, duration, transitions.easing.cubicBezier.smooth);
};

// Función helper para transiciones de focus
export const createFocusTransition = (
  properties: string | string[],
  duration: number = transitions.duration.normal
) => {
  return createTransition(properties, duration, transitions.easing.cubicBezier.smooth);
};

// Función helper para transiciones de active
export const createActiveTransition = (
  properties: string | string[],
  duration: number = transitions.duration.fast
) => {
  return createTransition(properties, duration, transitions.easing.cubicBezier.smooth);
};

// Función helper para transiciones de componentes
export const getComponentTransition = (
  component: keyof typeof transitions.components,
  state: keyof typeof transitions.components.button
) => {
  return (transitions.components as any)[component][state];
};

// Función helper para transiciones de propiedades
export const getPropertyTransition = (
  property: keyof typeof transitions.properties,
  state: keyof typeof transitions.properties.transform
) => {
  return (transitions.properties as any)[property][state];
};

// Función helper para transiciones predefinidas
export const getPresetTransition = (
  preset: keyof typeof transitions.presets,
  state: keyof typeof transitions.presets.fade
) => {
  return (transitions.presets as any)[preset][state];
};

// Función helper para transiciones de duración
export const getDuration = (type: keyof typeof transitions.duration) => {
  return transitions.duration[type];
};

// Función helper para funciones de easing
export const getEasing = (type: keyof typeof transitions.easing) => {
  return transitions.easing[type];
};

export default transitions; 