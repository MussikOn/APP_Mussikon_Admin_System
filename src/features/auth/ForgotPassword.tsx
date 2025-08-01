import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { forgotPassword, verifyCode, resetPassword } from '../../services/authService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const steps = [
    'Solicitar Código',
    'Verificar Código',
    'Nueva Contraseña'
  ];

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    // Mínimo 6 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
  };

  const handleRequestCode = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await forgotPassword({ userEmail: email });
      
      if (response.success) {
        setSuccess('Código de verificación enviado a tu email');
        setStep(1);
        setSnackbar({
          open: true,
          message: 'Código enviado correctamente',
          severity: 'success'
        });
      } else {
        setError(response.message);
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch {
      setError('Error al enviar el código de verificación');
      setSnackbar({
        open: true,
        message: 'Error al enviar el código',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyCode({ userEmail: email, code });
      
      if (response.success) {
        setSuccess('Código verificado correctamente');
        setStep(2);
        setSnackbar({
          open: true,
          message: 'Código verificado',
          severity: 'success'
        });
      } else {
        setError(response.message);
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch {
      setError('Error al verificar el código');
      setSnackbar({
        open: true,
        message: 'Error al verificar código',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError('Por favor ingresa la nueva contraseña');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('La contraseña debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await resetPassword({ 
        userEmail: email, 
        code, 
        newPassword 
      });
      
      if (response.success) {
        setSuccess('Contraseña actualizada correctamente');
        setSnackbar({
          open: true,
          message: 'Contraseña actualizada correctamente',
          severity: 'success'
        });
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message);
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error'
        });
      }
    } catch {
      setError('Error al restablecer la contraseña');
      setSnackbar({
        open: true,
        message: 'Error al restablecer contraseña',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Recuperar Contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solo disponible para Super Administradores
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestCode}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Enviando...
                </Box>
              ) : (
                'Enviar Código de Verificación'
              )}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Verificar Código
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa el código de 6 dígitos enviado a {email}
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Código de Verificación"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ maxLength: 6 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Verificando...
                </Box>
              ) : (
                'Verificar Código'
              )}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <LockIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Nueva Contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa tu nueva contraseña
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Actualizando...
                </Box>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 2
    }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          background: isDark 
            ? 'rgba(31, 38, 135, 0.15)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header con botón de regreso */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={onBack}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  background: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
              Recuperar Contraseña
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Contenido del paso actual */}
          {renderStepContent()}

          {/* Mensajes de error y éxito */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword; 