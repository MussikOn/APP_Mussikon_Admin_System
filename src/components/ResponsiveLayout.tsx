import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { responsiveSpacing } from '../theme/breakpoints';

interface ResponsiveLayoutProps extends Omit<BoxProps, 'spacing'> {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  maxWidth?: boolean | string;
  centered?: boolean;
  fullHeight?: boolean;
  container?: boolean;
}

/**
 * Componente de layout responsivo que se adapta automáticamente
 * a diferentes tamaños de pantalla
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  spacing = 'md',
  maxWidth = true,
  centered = false,
  fullHeight = false,
  container = true,
  sx,
  ...props
}) => {
  const getSpacing = () => {
    switch (spacing) {
      case 'xs': return responsiveSpacing.container;
      case 'sm': return responsiveSpacing.section;
      case 'md': return responsiveSpacing.section;
      case 'lg': return responsiveSpacing.section;
      default: return responsiveSpacing.container;
    }
  };

  const getMaxWidth = () => {
    if (typeof maxWidth === 'string') return maxWidth;
    if (maxWidth === false) return 'none';
    return '100%';
  };

  return (
    <Box
      component={container ? 'main' : 'div'}
      sx={{
        p: getSpacing(),
        maxWidth: getMaxWidth(),
        mx: centered ? 'auto' : 0,
        minHeight: fullHeight ? '100vh' : 'auto',
        width: '100%',
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveLayout; 