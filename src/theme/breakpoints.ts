// Sistema de Breakpoints Unificado - MussikOn Admin System

export const breakpoints = {
  xs: 0,    // 0px - 599px (Mobile)
  sm: 600,  // 600px - 899px (Large Mobile/Small Tablet)
  md: 900,  // 900px - 1199px (Tablet)
  lg: 1200, // 1200px - 1535px (Desktop)
  xl: 1536  // 1536px+ (Large Desktop)
};

// Valores responsivos para tipografía
export const responsiveTypography = {
  h1: { 
    xs: '1.5rem', 
    sm: '1.8rem', 
    md: '2rem', 
    lg: '2.5rem',
    xl: '3rem'
  },
  h2: { 
    xs: '1.25rem', 
    sm: '1.5rem', 
    md: '1.75rem', 
    lg: '2rem',
    xl: '2.25rem'
  },
  h3: { 
    xs: '1.125rem', 
    sm: '1.25rem', 
    md: '1.5rem', 
    lg: '1.75rem',
    xl: '2rem'
  },
  h4: { 
    xs: '1rem', 
    sm: '1.125rem', 
    md: '1.25rem', 
    lg: '1.5rem',
    xl: '1.75rem'
  },
  h5: { 
    xs: '0.875rem', 
    sm: '1rem', 
    md: '1.125rem', 
    lg: '1.25rem',
    xl: '1.5rem'
  },
  h6: { 
    xs: '0.75rem', 
    sm: '0.875rem', 
    md: '1rem', 
    lg: '1.125rem',
    xl: '1.25rem'
  },
  body1: { 
    xs: '0.875rem', 
    sm: '1rem', 
    md: '1rem', 
    lg: '1rem',
    xl: '1.125rem'
  },
  body2: { 
    xs: '0.75rem', 
    sm: '0.875rem', 
    md: '0.875rem', 
    lg: '0.875rem',
    xl: '1rem'
  },
  caption: { 
    xs: '0.625rem', 
    sm: '0.75rem', 
    md: '0.75rem', 
    lg: '0.75rem',
    xl: '0.875rem'
  }
};

// Valores responsivos para espaciado
export const responsiveSpacing = {
  container: { 
    xs: 2, 
    sm: 3, 
    md: 4, 
    lg: 5,
    xl: 6
  },
  section: { 
    xs: 3, 
    sm: 4, 
    md: 5, 
    lg: 6,
    xl: 8
  },
  card: { 
    xs: 2, 
    sm: 3, 
    md: 3, 
    lg: 4,
    xl: 4
  },
  button: { 
    xs: 1.5, 
    sm: 2, 
    md: 2, 
    lg: 2.5,
    xl: 3
  }
};

// Configuración de grids responsivos
export const responsiveGrids = {
  // Grid para cards de métricas
  metrics: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 4,
    xl: 4
  },
  // Grid para listas de elementos
  list: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },
  // Grid para formularios
  form: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 2
  },
  // Grid para filtros
  filters: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },
  // Grid para dashboard
  dashboard: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4
  }
};

// Configuración de layouts responsivos
export const responsiveLayouts = {
  // Layout principal
  main: {
    padding: responsiveSpacing.container,
    maxWidth: '100%'
  },
  // Layout de sidebar
  sidebar: {
    width: {
      xs: '100%',
      sm: '280px',
      md: '280px',
      lg: '280px',
      xl: '320px'
    },
    collapsedWidth: {
      xs: '70px',
      sm: '70px',
      md: '70px',
      lg: '70px',
      xl: '80px'
    }
  },
  // Layout de contenido
  content: {
    marginLeft: {
      xs: 0,
      sm: '280px',
      md: '280px',
      lg: '280px',
      xl: '320px'
    }
  }
};

// Configuración de componentes responsivos
export const responsiveComponents = {
  // Botones
  button: {
    minHeight: {
      xs: '44px',
      sm: '44px',
      md: '48px',
      lg: '48px',
      xl: '52px'
    },
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  // Inputs
  input: {
    height: {
      xs: '44px',
      sm: '48px',
      md: '48px',
      lg: '52px',
      xl: '56px'
    },
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  },
  // Cards
  card: {
    padding: {
      xs: 2,
      sm: 3,
      md: 3,
      lg: 4,
      xl: 4
    },
    borderRadius: {
      xs: 2,
      sm: 3,
      md: 3,
      lg: 4,
      xl: 4
    }
  },
  // Modales
  modal: {
    maxWidth: {
      xs: '95%',
      sm: '90%',
      md: '80%',
      lg: '70%',
      xl: '60%'
    },
    padding: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 4,
      xl: 5
    }
  }
};

// Utilidades para breakpoints
export const breakpointUtils = {
  // Verificar si es móvil
  isMobile: (width: number) => width < breakpoints.sm,
  
  // Verificar si es tablet
  isTablet: (width: number) => width >= breakpoints.sm && width < breakpoints.lg,
  
  // Verificar si es desktop
  isDesktop: (width: number) => width >= breakpoints.lg,
  
  // Obtener breakpoint actual
  getCurrentBreakpoint: (width: number) => {
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    return 'xl';
  },
  
  // Obtener valor responsivo
  getResponsiveValue: <T>(
    values: { xs: T; sm?: T; md?: T; lg?: T; xl?: T },
    currentBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  ): T => {
    const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i] as keyof typeof values;
      if (values[breakpoint] !== undefined) {
        return values[breakpoint]!;
      }
    }
    
    return values.xs;
  }
};

// Hook personalizado para valores responsivos
export const useResponsiveValue = <T>(
  values: { xs: T; sm?: T; md?: T; lg?: T; xl?: T }
) => {
  const [currentValue, setCurrentValue] = React.useState<T>(values.xs);
  
  React.useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth;
      const breakpoint = breakpointUtils.getCurrentBreakpoint(width);
      const value = breakpointUtils.getResponsiveValue(values, breakpoint);
      setCurrentValue(value);
    };
    
    updateValue();
    window.addEventListener('resize', updateValue);
    
    return () => window.removeEventListener('resize', updateValue);
  }, [values]);
  
  return currentValue;
};

export default {
  breakpoints,
  responsiveTypography,
  responsiveSpacing,
  responsiveGrids,
  responsiveLayouts,
  responsiveComponents,
  breakpointUtils,
  useResponsiveValue
}; 