// Sistema centralizado de espaciado para MussikOn Admin System
// Este archivo contiene todas las definiciones de espaciado del proyecto

export const spacing = {
  // Espaciado base (en píxeles)
  base: 8,
  
  // Espaciado de componentes
  component: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48,  // 48px
  },
  
  // Espaciado de layout
  layout: {
    xs: 8,    // 8px
    sm: 16,   // 16px
    md: 24,   // 24px
    lg: 32,   // 32px
    xl: 48,   // 48px
    xxl: 64,  // 64px
  },
  
  // Espaciado de secciones
  section: {
    xs: 16,   // 16px
    sm: 24,   // 24px
    md: 32,   // 32px
    lg: 48,   // 48px
    xl: 64,   // 64px
    xxl: 96,  // 96px
  },
  
  // Espaciado de página
  page: {
    xs: 16,   // 16px
    sm: 24,   // 24px
    md: 32,   // 32px
    lg: 48,   // 48px
    xl: 64,   // 64px
    xxl: 96,  // 96px
  },
  
  // Espaciado de grid
  grid: {
    xs: 8,    // 8px
    sm: 16,   // 16px
    md: 24,   // 24px
    lg: 32,   // 32px
    xl: 48,   // 48px
  },
  
  // Espaciado de gap
  gap: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48,  // 48px
  },
  
  // Espaciado de padding
  padding: {
    xs: 8,    // 8px
    sm: 12,   // 12px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48,  // 48px
  },
  
  // Espaciado de margin
  margin: {
    xs: 8,    // 8px
    sm: 12,   // 12px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48,  // 48px
  },
  
  // Espaciado de border radius
  borderRadius: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 12,   // 12px
    lg: 16,   // 16px
    xl: 24,   // 24px
    xxl: 32,  // 32px
    round: '50%',
  },
  
  // Espaciado de componentes específicos
  components: {
    button: {
      padding: {
        xs: '4px 8px',
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 30px',
        xl: '20px 40px',
      },
      borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
      },
    },
    card: {
      padding: {
        xs: 12,
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
      },
      borderRadius: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
      },
    },
    input: {
      padding: {
        xs: '8px 12px',
        sm: '12px 16px',
        md: '16px 20px',
        lg: '20px 24px',
        xl: '24px 28px',
      },
      borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
      },
    },
    modal: {
      padding: {
        xs: 16,
        sm: 24,
        md: 32,
        lg: 48,
        xl: 64,
      },
      borderRadius: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
      },
    },
    navbar: {
      padding: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
      },
      height: {
        xs: 48,
        sm: 56,
        md: 64,
        lg: 72,
        xl: 80,
      },
    },
    sidebar: {
      width: {
        xs: 240,
        sm: 280,
        md: 320,
        lg: 360,
        xl: 400,
      },
      padding: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
      },
    },
  },
  
  // Espaciado responsive
  responsive: {
    xs: {
      component: 4,
      layout: 8,
      section: 16,
      page: 16,
      grid: 8,
      gap: 4,
    },
    sm: {
      component: 8,
      layout: 16,
      section: 24,
      page: 24,
      grid: 16,
      gap: 8,
    },
    md: {
      component: 16,
      layout: 24,
      section: 32,
      page: 32,
      grid: 24,
      gap: 16,
    },
    lg: {
      component: 24,
      layout: 32,
      section: 48,
      page: 48,
      grid: 32,
      gap: 24,
    },
    xl: {
      component: 32,
      layout: 48,
      section: 64,
      page: 64,
      grid: 48,
      gap: 32,
    },
  },
};

// Función helper para obtener espaciado según breakpoint
export const getResponsiveSpacing = (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  return spacing.responsive[breakpoint];
};

// Función helper para crear espaciado personalizado
export const createSpacing = (multiplier: number = 1) => {
  return spacing.base * multiplier;
};

// Función helper para espaciado de componentes
export const getComponentSpacing = (size: keyof typeof spacing.component) => {
  return spacing.component[size];
};

// Función helper para espaciado de layout
export const getLayoutSpacing = (size: keyof typeof spacing.layout) => {
  return spacing.layout[size];
};

// Función helper para espaciado de secciones
export const getSectionSpacing = (size: keyof typeof spacing.section) => {
  return spacing.section[size];
};

// Función helper para espaciado de página
export const getPageSpacing = (size: keyof typeof spacing.page) => {
  return spacing.page[size];
};

// Función helper para espaciado de grid
export const getGridSpacing = (size: keyof typeof spacing.grid) => {
  return spacing.grid[size];
};

// Función helper para espaciado de gap
export const getGapSpacing = (size: keyof typeof spacing.gap) => {
  return spacing.gap[size];
};

// Función helper para espaciado de padding
export const getPaddingSpacing = (size: keyof typeof spacing.padding) => {
  return spacing.padding[size];
};

// Función helper para espaciado de margin
export const getMarginSpacing = (size: keyof typeof spacing.margin) => {
  return spacing.margin[size];
};

// Función helper para border radius
export const getBorderRadius = (size: keyof typeof spacing.borderRadius) => {
  return spacing.borderRadius[size];
};

// Función helper para espaciado de componentes específicos
export const getComponentSpecificSpacing = (
  component: keyof typeof spacing.components,
  property: keyof typeof spacing.components.button,
  size: keyof typeof spacing.components.button.padding
) => {
  return (spacing.components as any)[component][property][size];
};

export default spacing; 