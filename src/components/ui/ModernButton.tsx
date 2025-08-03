import React from 'react';
import { Button, Box } from '@mui/material';
import type { ButtonProps, SxProps, Theme } from '@mui/material';
import { componentStyles } from '../../theme/designSystem';

interface ModernButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  sx = {},
  ...props
}) => {
  const getButtonStyles = (): SxProps<Theme> => {
    const baseStyles = componentStyles.button[variant === 'outline' ? 'secondary' : variant === 'danger' ? 'primary' : variant];
    
    const sizeStyles = {
      sm: {
        px: 2,
        py: 0.75,
        fontSize: '0.875rem',
        minHeight: 32,
      },
      md: {
        px: 3,
        py: 1,
        fontSize: '1rem',
        minHeight: 40,
      },
      lg: {
        px: 4,
        py: 1.25,
        fontSize: '1.125rem',
        minHeight: 48,
      },
    };

    const variantStyles = {
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
        },
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.26)',
        },
      },
      secondary: {
        background: 'rgba(0, 0, 0, 0.04)',
        color: 'text.primary',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.08)',
        },
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.26)',
        },
      },
      ghost: {
        background: 'transparent',
        color: 'text.primary',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.04)',
        },
        '&:disabled': {
          background: 'transparent',
          color: 'rgba(0, 0, 0, 0.26)',
        },
      },
      outline: {
        background: 'transparent',
        border: '2px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          background: 'primary.main',
          color: 'white',
        },
        '&:disabled': {
          borderColor: 'rgba(0, 0, 0, 0.26)',
          color: 'rgba(0, 0, 0, 0.26)',
        },
      },
      danger: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
        },
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.26)',
        },
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...sx,
    } as SxProps<Theme>;
  };

  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      sx={getButtonStyles()}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          Cargando...
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

export default ModernButton; 