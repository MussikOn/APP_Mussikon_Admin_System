import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import type { TextFieldProps, SxProps, Theme } from '@mui/material';
import { componentStyles } from '../../theme/designSystem';

interface ModernInputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  variant?: 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const ModernInput: React.FC<ModernInputProps> = ({
  variant = 'outlined',
  size = 'md',
  startIcon,
  endIcon,
  sx = {},
  ...props
}) => {
  const getInputStyles = () => {
    const baseStyles = componentStyles.input.base;
    
    const sizeStyles = {
      sm: {
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem',
          minHeight: 36,
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
        },
      },
      md: {
        '& .MuiOutlinedInput-root': {
          fontSize: '1rem',
          minHeight: 40,
        },
        '& .MuiInputLabel-root': {
          fontSize: '1rem',
        },
      },
      lg: {
        '& .MuiOutlinedInput-root': {
          fontSize: '1.125rem',
          minHeight: 48,
        },
        '& .MuiInputLabel-root': {
          fontSize: '1.125rem',
        },
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      '& .MuiOutlinedInput-root': {
        ...baseStyles['& .MuiOutlinedInput-root'],
        ...sizeStyles[size]['& .MuiOutlinedInput-root'],
        backgroundColor: 'background.paper',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        '&.Mui-focused': {
          backgroundColor: 'background.paper',
        },
      },
      '& .MuiInputLabel-root': {
        ...sizeStyles[size]['& .MuiInputLabel-root'],
        color: 'text.secondary',
        '&.Mui-focused': {
          color: 'primary.main',
          fontWeight: 600,
        },
      },
      ...sx,
    };
  };

  const getInputProps = () => {
    const inputProps: any = {};
    
    if (startIcon) {
      inputProps.startAdornment = (
        <InputAdornment position="start">
          {startIcon}
        </InputAdornment>
      );
    }
    
    if (endIcon) {
      inputProps.endAdornment = (
        <InputAdornment position="end">
          {endIcon}
        </InputAdornment>
      );
    }
    
    return inputProps;
  };

  return (
    <TextField
      variant={variant}
      sx={getInputStyles()}
      InputProps={getInputProps()}
      {...props}
    />
  );
};

export default ModernInput; 