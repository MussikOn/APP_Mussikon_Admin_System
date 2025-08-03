import React from 'react';
import { Card, CardContent, CardActions, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { componentStyles, transitions } from '../../theme/designSystem';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'base' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  actions?: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  className?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'base',
  padding = 'md',
  spacing = 'md',
  actions,
  onClick,
  sx = {},
  className,
}) => {
  const getCardStyles = () => {
    const baseStyles = componentStyles.card[variant];
    const clickableStyles = onClick ? {
      cursor: 'pointer',
      '&:active': {
        transform: 'translateY(0px)',
        transition: `all ${transitions.duration.fast} ${transitions.easing.ease}`,
      }
    } : {};

    return {
      ...baseStyles,
      ...clickableStyles,
      ...sx,
    };
  };

  const getPaddingStyles = () => {
    const paddingMap = {
      none: 0,
      sm: 1,
      md: 2,
      lg: 3,
    };
    return paddingMap[padding];
  };

  const getSpacingStyles = () => {
    const spacingMap = {
      none: 0,
      sm: 1,
      md: 2,
      lg: 3,
    };
    return spacingMap[spacing];
  };

  return (
    <Card
      sx={getCardStyles()}
      onClick={onClick}
      className={className}
      elevation={0}
    >
      <CardContent sx={{ p: getPaddingStyles() }}>
        <Box sx={{ '& > * + *': { mt: getSpacingStyles() } }}>
          {children}
        </Box>
      </CardContent>
      {actions && (
        <CardActions sx={{ p: getPaddingStyles(), pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default ModernCard; 