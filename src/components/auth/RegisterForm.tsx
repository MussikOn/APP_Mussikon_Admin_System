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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { RegisterForm as RegisterFormType } from '../../types/backend';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormType) => void;
  isLoading?: boolean;
  error?: string;
  onBackToLogin?: () => void;
}

const steps = ['Información Personal', 'Credenciales', 'Confirmación'];

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onBackToLogin
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RegisterFormType>({
    name: '',
    lastName: '',
    userEmail: '',
    userPassword: '',
    phone: '',
    roll: 'eventCreator'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormType & { confirmPassword: string }>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<RegisterFormType & { confirmPassword: string }> = {};

    switch (step) {
      case 0: // Información Personal
        if (!formData.name.trim()) {
          newErrors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 2) {
          newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.lastName.trim()) {
          newErrors.lastName = 'El apellido es requerido';
        } else if (formData.lastName.trim().length < 2) {
          newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        if (!formData.phone.trim()) {
          newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = 'El teléfono no es válido';
        }
        break;

      case 1: // Credenciales
        if (!formData.userEmail) {
          newErrors.userEmail = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
          newErrors.userEmail = 'El email no es válido';
        }

        if (!formData.userPassword) {
          newErrors.userPassword = 'La contraseña es requerida';
        } else if (formData.userPassword.length < 6) {
          newErrors.userPassword = 'La contraseña debe tener al menos 6 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.userPassword)) {
          newErrors.userPassword = 'La contraseña debe contener mayúsculas, minúsculas y números';
        }

        if (!confirmPassword) {
          newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.userPassword !== confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        break;

      case 2: // Confirmación
        if (!formData.roll) {
          newErrors.roll = 'Selecciona tu rol';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof RegisterFormType) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = typeof e.target.value === 'string' ? e.target.value : String(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: undefined
      }));
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+34 600 000 000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.userEmail}
                onChange={handleInputChange('userEmail')}
                error={!!errors.userEmail}
                helperText={errors.userEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.userPassword}
                onChange={handleInputChange('userPassword')}
                error={!!errors.userPassword}
                helperText={errors.userPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de tu cuenta
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Nombre:</strong> {formData.name} {formData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {formData.userEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Teléfono:</strong> {formData.phone}
              </Typography>
            </Box>
            
            <FormControl fullWidth error={!!errors.roll}>
              <InputLabel>Rol en la plataforma</InputLabel>
              <Select
                value={formData.roll}
                label="Rol en la plataforma"
                onChange={handleInputChange('roll')}
              >
                <MenuItem value="eventCreator">Creador de Eventos</MenuItem>
                <MenuItem value="musician">Músico</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="superadmin">Super Administrador</MenuItem>
              </Select>
              {errors.roll && (
                <Typography variant="caption" color="error">
                  {errors.roll}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
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
          {onBackToLogin && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToLogin}
              sx={{
                color: 'white',
                mb: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Volver al login
            </Button>
          )}

          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Crear Cuenta
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Únete a MussikOn y comienza a crear eventos o ofrecer tus servicios musicales
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, color: 'white' }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: 'white' }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Atrás
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
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
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      backgroundColor: 'white',
                      color: '#667eea',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;
