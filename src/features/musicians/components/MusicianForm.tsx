import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Divider,
  CircularProgress,
  FormHelperText
} from '@mui/material';

import {
  Close,
  Add,
  MusicNote,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import type { Musician, CreateMusicianData } from '../types/musician';

interface MusicianFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMusicianData) => Promise<void>;
  musician?: Musician | null;
  loading?: boolean;
}

const MusicianForm: React.FC<MusicianFormProps> = ({
  open,
  onClose,
  onSubmit,
  musician,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateMusicianData>({
    userId: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
    instruments: [],
    genres: [],
    experience: 0,
    hourlyRate: 0,
    location: {
      city: '',
      state: '',
      country: ''
    },
    availability: [],
    specializations: [],
    socialMedia: {
      instagram: '',
      youtube: '',
      spotify: '',
      website: ''
    }
  });

  const [newInstrument, setNewInstrument] = useState({
    name: '',
    level: 'intermediate' as const,
    yearsOfExperience: 1,
    isPrimary: false
  });

  const [newGenre, setNewGenre] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Instrumentos disponibles
  const availableInstruments = [
    'Guitarra', 'Piano', 'Bajo', 'Batería', 'Saxofón', 'Trompeta', 
    'Violín', 'Canto', 'Teclado', 'Flauta', 'Clarinete', 'Acordeón',
    'Harmónica', 'Ukelele', 'Banjo', 'Mandolina', 'Cello', 'Viola'
  ];

  // Géneros disponibles
  const availableGenres = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Clásica', 'Folk', 'Country',
    'Reggae', 'Hip Hop', 'R&B', 'Soul', 'Funk', 'Disco', 'Electrónica',
    'Metal', 'Punk', 'Indie', 'Alternativo', 'Latino', 'Flamenco'
  ];

  // Niveles de experiencia
  const experienceLevels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'expert', label: 'Experto' }
  ];

  // Cargar datos del músico si está en modo edición
  useEffect(() => {
    if (musician) {
      setFormData({
        userId: musician.userId,
        name: musician.name,
        email: musician.email,
        phone: musician.phone || '',
        bio: musician.bio || '',
        instruments: musician.instruments,
        genres: musician.genres,
        experience: musician.experience,
        hourlyRate: musician.hourlyRate,
        location: musician.location,
        availability: musician.availability,
        specializations: musician.specializations,
        socialMedia: musician.socialMedia
      });
    } else {
      // Reset form
      setFormData({
        userId: '',
        name: '',
        email: '',
        phone: '',
        bio: '',
        instruments: [],
        genres: [],
        experience: 0,
        hourlyRate: 0,
        location: {
          city: '',
          state: '',
          country: ''
        },
        availability: [],
        specializations: [],
        socialMedia: {
          instagram: '',
          youtube: '',
          spotify: '',
          website: ''
        }
      });
    }
    setErrors({});
  }, [musician, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.location.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.location.state.trim()) {
      newErrors.state = 'El estado es requerido';
    }

    if (!formData.location.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    if (formData.instruments.length === 0) {
      newErrors.instruments = 'Al menos un instrumento es requerido';
    }

    if (formData.genres.length === 0) {
      newErrors.genres = 'Al menos un género es requerido';
    }

    if (formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'La tarifa por hora debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value
      }
    }));
  };

  const addInstrument = () => {
    if (newInstrument.name.trim()) {
      setFormData(prev => ({
        ...prev,
        instruments: [...prev.instruments, { ...newInstrument }]
      }));
      setNewInstrument({
        name: '',
        level: 'intermediate',
        yearsOfExperience: 1,
        isPrimary: false
      });
    }
  };

  const removeInstrument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index)
    }));
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre]
      }));
      setNewGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 247, 0.2)',
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#00fff7', 
        borderBottom: '1px solid rgba(0, 255, 247, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography component="div" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {musician ? 'Editar Músico' : 'Nuevo Músico'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#00fff7' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Información Básica
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre completo *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Años de experiencia"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                InputProps={{
                  inputProps: { min: 0, max: 50 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografía"
                multiline
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Ubicación
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ciudad *"
                value={formData.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estado/Provincia *"
                value={formData.location.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="País *"
                value={formData.location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                error={!!errors.country}
                helperText={errors.country}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Instrumentos */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
                Instrumentos *
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b8c1' }}>Instrumento</InputLabel>
                <Select
                  value={newInstrument.name}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, name: e.target.value }))}
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
                  }}
                >
                  {availableInstruments.map((instrument) => (
                    <MenuItem key={instrument} value={instrument}>
                      {instrument}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b8c1' }}>Nivel</InputLabel>
                <Select
                  value={newInstrument.level}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, level: e.target.value as any }))}
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
                  }}
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Años"
                type="number"
                value={newInstrument.yearsOfExperience}
                onChange={(e) => setNewInstrument(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 1 }))}
                InputProps={{
                  inputProps: { min: 1, max: 50 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                  Principal
                </Typography>
                <input
                  type="checkbox"
                  checked={newInstrument.isPrimary}
                  onChange={(e) => setNewInstrument(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  style={{
                    marginLeft: '8px',
                    accentColor: '#00fff7'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addInstrument}
                disabled={!newInstrument.name}
                sx={{
                  borderColor: '#00fff7',
                  color: '#00fff7',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 247, 0.1)',
                  },
                }}
              >
                Agregar Instrumento
              </Button>
            </Grid>

            {/* Instrumentos agregados */}
            {formData.instruments.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.instruments.map((instrument, index) => (
                    <Chip
                      key={index}
                      label={`${instrument.name} (${instrument.level}) - ${instrument.yearsOfExperience} años${instrument.isPrimary ? ' - Principal' : ''}`}
                      onDelete={() => removeInstrument(index)}
                      sx={{
                        backgroundColor: instrument.isPrimary ? 'rgba(0, 255, 247, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: instrument.isPrimary ? '#00fff7' : '#b0b8c1',
                        '& .MuiChip-deleteIcon': {
                          color: '#ff4444',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {errors.instruments && (
              <Grid item xs={12}>
                <FormHelperText error sx={{ color: '#ff4444' }}>
                  {errors.instruments}
                </FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Géneros */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Géneros Musicales *
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b8c1' }}>Género</InputLabel>
                <Select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
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
                  }}
                >
                  {availableGenres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addGenre}
                disabled={!newGenre}
                fullWidth
                sx={{
                  borderColor: '#00fff7',
                  color: '#00fff7',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 247, 0.1)',
                  },
                }}
              >
                Agregar Género
              </Button>
            </Grid>

            {/* Géneros agregados */}
            {formData.genres.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onDelete={() => removeGenre(genre)}
                      sx={{
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        '& .MuiChip-deleteIcon': {
                          color: '#ff4444',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {errors.genres && (
              <Grid item xs={12}>
                <FormHelperText error sx={{ color: '#ff4444' }}>
                  {errors.genres}
                </FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Especializaciones */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Especializaciones
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Especialización"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addSpecialization}
                disabled={!newSpecialization}
                fullWidth
                sx={{
                  borderColor: '#00fff7',
                  color: '#00fff7',
                  '&:hover': {
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 247, 0.1)',
                  },
                }}
              >
                Agregar Especialización
              </Button>
            </Grid>

            {/* Especializaciones agregadas */}
            {formData.specializations.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.specializations.map((specialization) => (
                    <Chip
                      key={specialization}
                      label={specialization}
                      onDelete={() => removeSpecialization(specialization)}
                      sx={{
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        color: '#ffc107',
                        '& .MuiChip-deleteIcon': {
                          color: '#ff4444',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Tarifa por hora */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tarifa por Hora *
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                {formatCurrency(formData.hourlyRate)}
              </Typography>
              <Slider
                value={formData.hourlyRate}
                onChange={(_, value) => handleInputChange('hourlyRate', value)}
                min={10}
                max={500}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
                sx={{
                  color: '#00fff7',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00fff7',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00fff7',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>

            {errors.hourlyRate && (
              <Grid item xs={12}>
                <FormHelperText error sx={{ color: '#ff4444' }}>
                  {errors.hourlyRate}
                </FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)', my: 2 }} />
            </Grid>

            {/* Redes sociales */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Redes Sociales
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="YouTube"
                value={formData.socialMedia.youtube}
                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Spotify"
                value={formData.socialMedia.spotify}
                onChange={(e) => handleSocialMediaChange('spotify', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sitio Web"
                value={formData.socialMedia.website}
                onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 255, 247, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00fff7',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b8c1',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid rgba(0, 255, 247, 0.2)',
          gap: 2
        }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#b0b8c1',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              color: '#000',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #00ff88, #00fff7)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {loading ? 'Guardando...' : (musician ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MusicianForm; 