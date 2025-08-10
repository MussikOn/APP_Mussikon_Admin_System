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
        background: 'var(--color-gradient-1)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s ease',
        },
        '&:hover': {
          background: 'var(--color-gradient-2)',
          transform: 'translateY(-2px)',
          boxShadow: 'var(--color-glow-shadow)',
          '&::before': {
            left: '100%',
          },
        },
        '&:disabled': {
          background: 'var(--color-text-disabled)',
          color: 'rgba(255, 255, 255, 0.7)',
          transform: 'none',
        },
      },
      secondary: {
        background: 'var(--color-glass)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        backdropFilter: 'blur(12px)',
        '&:hover': {
          background: 'var(--color-glass-strong)',
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary)',
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          background: 'var(--color-glass)',
          color: 'var(--color-text-disabled)',
          transform: 'none',
        },
      },
      ghost: {
        background: 'transparent',
        color: 'var(--color-text)',
        '&:hover': {
          background: 'var(--color-glass)',
          color: 'var(--color-primary)',
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          background: 'transparent',
          color: 'var(--color-text-disabled)',
          transform: 'none',
        },
      },
      outline: {
        background: 'transparent',
        border: '2px solid var(--color-primary)',
        color: 'var(--color-primary)',
        '&:hover': {
          background: 'var(--color-primary)',
          color: 'white',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 16px var(--color-primary)44',
        },
        '&:disabled': {
          borderColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-disabled)',
          transform: 'none',
        },
      },
      danger: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s ease',
        },
        '&:hover': {
          background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(255, 107, 107, 0.5)',
          '&::before': {
            left: '100%',
          },
        },
        '&:disabled': {
          background: 'var(--color-text-disabled)',
          color: 'rgba(255, 255, 255, 0.7)',
          transform: 'none',
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