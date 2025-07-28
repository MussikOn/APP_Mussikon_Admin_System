import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Close,
  Save,
  Person,
  Email,
  Phone,
  LocationOn,
  MusicNote,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import type { MobileUser, CreateUserData } from '../types/mobileUser';
import { USER_ROLES, INSTRUMENTS, LANGUAGES, THEMES } from '../types/mobileUser';

interface MobileUserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => void;
  user?: MobileUser | null;
  loading?: boolean;
}

const MobileUserForm: React.FC<MobileUserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    lastName: '',
    userEmail: '',
    userPassword: '',
    roll: 'usuario',
    status: true,
    phone: '',
    location: '',
    profileImage: '',
    bio: '',
    instruments: [],
    experience: '',
    preferences: {
      notifications: true,
      emailNotifications: true,
      pushNotifications: true,
      language: 'es',
      theme: 'light'
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        lastName: user.lastName,
        userEmail: user.userEmail,
        userPassword: '',
        roll: user.roll,
        status: user.status === 'active',
        phone: user.phone || '',
        location: user.location || '',
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        instruments: user.instruments || [],
        experience: user.experience || '',
        preferences: user.preferences || {
          notifications: true,
          emailNotifications: true,
          pushNotifications: true,
          language: 'es',
          theme: 'light'
        }
      });
    } else {
      setFormData({
        name: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        roll: 'usuario',
        status: true,
        phone: '',
        location: '',
        profileImage: '',
        bio: '',
        instruments: [],
        experience: '',
        preferences: {
          notifications: true,
          emailNotifications: true,
          pushNotifications: true,
          language: 'es',
          theme: 'light'
          }
      });
    }
    setErrors({});
  }, [user, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value
      }
    }));
  };

  const handleInstrumentToggle = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments?.includes(instrument)
        ? prev.instruments.filter(i => i !== instrument)
        : [...(prev.instruments || []), instrument]
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = 'El email no es válido';
    }

    if (!user && !formData.userPassword) {
      newErrors.userPassword = 'La contraseña es requerida';
    } else if (formData.userPassword && formData.userPassword.length < 6) {
      newErrors.userPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 255, 247, 0.3)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(0, 255, 136, 0.1))',
        borderBottom: '1px solid rgba(0, 255, 247, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            background: 'linear-gradient(135deg, #00fff7, #00ff88)',
            color: '#000'
          }}>
            <Person />
          </Avatar>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
            {user ? 'Editar Usuario Móvil' : 'Crear Nuevo Usuario Móvil'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#00fff7' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Información básica */}
          <Box>
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Información Básica
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff4444',
                },
              }}
            />

            <TextField
              fullWidth
              label="Apellido"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff4444',
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.userEmail}
              onChange={(e) => handleInputChange('userEmail', e.target.value)}
              error={!!errors.userEmail}
              helperText={errors.userEmail}
              InputProps={{
                startAdornment: <Email sx={{ color: '#00fff7', mr: 1, fontSize: 20 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff4444',
                },
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.userPassword}
              onChange={(e) => handleInputChange('userPassword', e.target.value)}
              error={!!errors.userPassword}
              helperText={errors.userPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: '#00fff7' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff4444',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Rol</InputLabel>
              <Select
                value={formData.roll}
                onChange={(e) => handleInputChange('roll', e.target.value)}
                label="Rol"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00fff7',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00fff7',
                  },
                }}
              >
                {USER_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: role.color
                      }} />
                      {role.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00ff88',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00ff88',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#ffffff' }}>
                  Usuario Activo
                </Typography>
              }
            />
          </Box>

          {/* Información de contacto */}
          <Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(0, 255, 247, 0.3)' }} />
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Información de Contacto
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              InputProps={{
                startAdornment: <Phone sx={{ color: '#00fff7', mr: 1, fontSize: 20 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
              }}
            />

            <TextField
              fullWidth
              label="Ubicación"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#00fff7', mr: 1, fontSize: 20 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                  '&.Mui-focused': { color: '#00fff7' },
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="URL de imagen de perfil"
            value={formData.profileImage}
            onChange={(e) => handleInputChange('profileImage', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#00fff7' },
              },
              '& .MuiInputLabel-root': {
                color: '#b0b8c1',
                '&.Mui-focused': { color: '#00fff7' },
              },
            }}
          />

          <TextField
            fullWidth
            label="Biografía"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#00fff7' },
              },
              '& .MuiInputLabel-root': {
                color: '#b0b8c1',
                '&.Mui-focused': { color: '#00fff7' },
              },
            }}
          />

          {/* Información de músico (solo si el rol es músico) */}
          {formData.roll === 'musico' && (
            <>
              <Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(0, 255, 247, 0.3)' }} />
                <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                  Información de Músico
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                  Instrumentos:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {INSTRUMENTS.map((instrument) => (
                    <Chip
                      key={instrument}
                      label={instrument}
                      onClick={() => handleInstrumentToggle(instrument)}
                      color={formData.instruments?.includes(instrument) ? 'primary' : 'default'}
                      sx={{
                        background: formData.instruments?.includes(instrument)
                          ? 'rgba(255, 215, 0, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: formData.instruments?.includes(instrument) ? '#ffd700' : '#b0b8c1',
                        '&:hover': {
                          background: 'rgba(255, 215, 0, 0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Experiencia"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Ej: 5 años tocando guitarra"
                InputProps={{
                  startAdornment: <MusicNote sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: 'rgba(0, 255, 247, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 247, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00fff7' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                    '&.Mui-focused': { color: '#00fff7' },
                  },
                }}
              />
            </>
          )}

          {/* Preferencias */}
          <Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(0, 255, 247, 0.3)' }} />
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              Preferencias
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Idioma</InputLabel>
              <Select
                value={formData.preferences?.language || 'es'}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                label="Idioma"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00fff7',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00fff7',
                  },
                }}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Tema</InputLabel>
              <Select
                value={formData.preferences?.theme || 'light'}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                label="Tema"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 247, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00fff7',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00fff7',
                  },
                }}
              >
                {THEMES.map((theme) => (
                  <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.preferences?.notifications || false}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00fff7',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00fff7',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  Notificaciones
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.preferences?.emailNotifications || false}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00ff88',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00ff88',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  Notificaciones por Email
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.preferences?.pushNotifications || false}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ffd700',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ffd700',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  Notificaciones Push
                </Typography>
              }
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        background: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(0, 255, 247, 0.2)'
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#b0b8c1',
            '&:hover': {
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={<Save />}
          sx={{
            background: 'linear-gradient(135deg, #00fff7, #00ff88)',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              background: 'linear-gradient(135deg, #00ff88, #00fff7)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#888888'
            }
          }}
        >
          {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileUserForm; 