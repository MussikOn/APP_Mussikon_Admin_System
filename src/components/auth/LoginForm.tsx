import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { LoginForm as LoginFormType } from '../../types/backend';

interface LoginFormProps {
  onSubmit: (data: LoginFormType) => void;
  isLoading?: boolean;
  error?: string;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onGoogleLogin,
  onForgotPassword,
  onRegister
}) => {
  const [formData, setFormData] = useState<LoginFormType>({
    userEmail: '',
    userPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormType>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormType> = {};

    if (!formData.userEmail) {
      newErrors.userEmail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = 'El email no es válido';
    }

    if (!formData.userPassword) {
      newErrors.userPassword = 'La contraseña es requerida';
    } else if (formData.userPassword.length < 6) {
      newErrors.userPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LoginFormType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido a MussikOn
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Inicia sesión para acceder a tu cuenta
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, color: 'white' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.userEmail}
              onChange={handleInputChange('userEmail')}
              error={!!errors.userEmail}
              helperText={errors.userEmail}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.userPassword}
              onChange={handleInputChange('userPassword')}
              error={!!errors.userPassword}
              helperText={errors.userPassword}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'rgba(102, 126, 234, 0.5)',
                }
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            {onGoogleLogin && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    O continúa con
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={onGoogleLogin}
                  startIcon={<GoogleIcon />}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Continuar con Google
                </Button>
              </>
            )}
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {onForgotPassword && (
              <Link
                component="button"
                variant="body2"
                onClick={onForgotPassword}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            )}

            {onRegister && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  ¿No tienes una cuenta?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={onRegister}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Regístrate aquí
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
