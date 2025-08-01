import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { responsiveGrids } from '../theme/breakpoints';

interface ResponsiveGridProps extends Omit<BoxProps, 'columns'> {
  children: React.ReactNode;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  type?: 'metrics' | 'list' | 'form' | 'filters' | 'dashboard';
  autoFit?: boolean;
  minColumnWidth?: string;
}

/**
 * Componente de grid responsivo que se adapta automáticamente
 * a diferentes tamaños de pantalla
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  columns,
  gap = 3,
  type,
  autoFit = false,
  minColumnWidth = '250px',
  sx,
  ...props
}) => {
  const getGridTemplateColumns = () => {
    // Si se especifica un tipo, usar la configuración predefinida
    if (type && responsiveGrids[type]) {
      const gridConfig = responsiveGrids[type];
      return {
        xs: `repeat(${gridConfig.xs}, 1fr)`,
        sm: `repeat(${gridConfig.sm}, 1fr)`,
        md: `repeat(${gridConfig.md}, 1fr)`,
        lg: `repeat(${gridConfig.lg}, 1fr)`,
        xl: `repeat(${gridConfig.xl}, 1fr)`
      };
    }

    // Si se especifican columnas personalizadas
    if (columns) {
      return {
        xs: `repeat(${columns.xs || 1}, 1fr)`,
        sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
        md: `repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        lg: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        xl: `repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`
      };
    }

    // Grid por defecto
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
      xl: 'repeat(5, 1fr)'
    };
  };

  const gridTemplateColumns = getGridTemplateColumns();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: autoFit 
          ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
          : gridTemplateColumns,
        gap,
        width: '100%',
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveGrid; 