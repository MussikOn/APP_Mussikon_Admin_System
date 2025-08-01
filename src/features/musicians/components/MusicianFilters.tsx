import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  Grid,
  Divider,
  Collapse
} from '@mui/material';

import {
  FilterList,
  Clear,
  Search,
  LocationOn,
  MusicNote,
  AccessTime,
  Star
} from '@mui/icons-material';
import type { MusicianFilters } from '../types/musician';

interface MusicianFiltersProps {
  onFilterChange: (filters: MusicianFilters) => void;
  onClearFilters: () => void;
}

const MusicianFiltersComponent: React.FC<MusicianFiltersProps> = ({
  onFilterChange,
  onClearFilters
}) => {
  const [filters, setFilters] = useState<MusicianFilters>({
    search: '',
    instruments: [],
    genres: [],
    location: {
      city: '',
      state: '',
      country: '',
      radius: 50
    },
    experience: {
      min: 0,
      max: 50
    },
    hourlyRate: {
      min: 10,
      max: 500
    },
    rating: {
      min: 0,
      max: 5
    },
    isActive: undefined,
    isVerified: undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [expanded, setExpanded] = useState(true);

  // Opciones disponibles
  const availableInstruments = [
    'Guitarra', 'Piano', 'Bajo', 'Batería', 'Saxofón', 'Trompeta', 
    'Violín', 'Canto', 'Teclado', 'Flauta', 'Clarinete', 'Acordeón',
    'Harmónica', 'Ukelele', 'Banjo', 'Mandolina', 'Cello', 'Viola'
  ];

  const availableGenres = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Clásica', 'Folk', 'Country',
    'Reggae', 'Hip Hop', 'R&B', 'Soul', 'Funk', 'Disco', 'Electrónica',
    'Metal', 'Punk', 'Indie', 'Alternativo', 'Latino', 'Flamenco'
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'experience', label: 'Experiencia' },
    { value: 'rating', label: 'Calificación' },
    { value: 'hourlyRate', label: 'Tarifa' },
    { value: 'createdAt', label: 'Fecha de registro' }
  ];

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof MusicianFilters;
      const parentValue = newFilters[parentKey] as any;
      newFilters[parentKey] = {
        ...parentValue,
        [child]: value
      };
    } else {
      newFilters[field as keyof MusicianFilters] = value;
    }
    
    setFilters(newFilters);
  };

  const handleInstrumentToggle = (instrument: string) => {
    const newInstruments = filters.instruments?.includes(instrument)
      ? filters.instruments.filter(i => i !== instrument)
      : [...(filters.instruments || []), instrument];
    
    handleFilterChange('instruments', newInstruments);
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres?.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...(filters.genres || []), genre];
    
    handleFilterChange('genres', newGenres);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters: MusicianFilters = {
      search: '',
      instruments: [],
      genres: [],
      location: {
        city: '',
        state: '',
        country: '',
        radius: 50
      },
      experience: {
        min: 0,
        max: 50
      },
      hourlyRate: {
        min: 10,
        max: 500
      },
      rating: {
        min: 0,
        max: 5
      },
      isActive: undefined,
      isVerified: undefined,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    
    setFilters(clearedFilters);
    onClearFilters();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card sx={{ 
      mb: 3,
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 255, 247, 0.2)',
      borderRadius: '16px'
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ 
            color: '#00fff7', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <FilterList />
            Filtros Avanzados
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                borderColor: 'rgba(0, 255, 247, 0.3)',
                color: '#00fff7',
                '&:hover': {
                  borderColor: '#00fff7',
                  backgroundColor: 'rgba(0, 255, 247, 0.1)',
                },
              }}
            >
              {expanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Grid container spacing={3}>
            {/* Búsqueda general */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 1, fontWeight: 600 }}>
                <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
                Búsqueda General
              </Typography>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, email, instrumento..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
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
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Ubicación
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ciudad"
                value={filters.location?.city || ''}
                onChange={(e) => handleFilterChange('location.city', e.target.value)}
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
                label="Estado/Provincia"
                value={filters.location?.state || ''}
                onChange={(e) => handleFilterChange('location.state', e.target.value)}
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
                label="País"
                value={filters.location?.country || ''}
                onChange={(e) => handleFilterChange('location.country', e.target.value)}
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
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                Radio de búsqueda: {filters.location?.radius || 50} km
              </Typography>
              <Slider
                value={filters.location?.radius || 50}
                onChange={(_, value) => handleFilterChange('location.radius', value)}
                min={1}
                max={200}
                step={5}
                valueLabelDisplay="auto"
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

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
            </Grid>

            {/* Instrumentos */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
                Instrumentos
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableInstruments.map((instrument) => (
                  <Chip
                    key={instrument}
                    label={instrument}
                    onClick={() => handleInstrumentToggle(instrument)}
                    color={filters.instruments?.includes(instrument) ? 'primary' : 'default'}
                    variant={filters.instruments?.includes(instrument) ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: 'rgba(0, 255, 247, 0.3)',
                      color: filters.instruments?.includes(instrument) ? '#000' : '#00fff7',
                      backgroundColor: filters.instruments?.includes(instrument) 
                        ? '#00fff7' 
                        : 'transparent',
                      '&:hover': {
                        borderColor: '#00fff7',
                        backgroundColor: filters.instruments?.includes(instrument) 
                          ? '#00fff7' 
                          : 'rgba(0, 255, 247, 0.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
            </Grid>

            {/* Géneros */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Géneros Musicales
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableGenres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onClick={() => handleGenreToggle(genre)}
                    color={filters.genres?.includes(genre) ? 'primary' : 'default'}
                    variant={filters.genres?.includes(genre) ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: 'rgba(0, 255, 136, 0.3)',
                      color: filters.genres?.includes(genre) ? '#000' : '#00ff88',
                      backgroundColor: filters.genres?.includes(genre) 
                        ? '#00ff88' 
                        : 'transparent',
                      '&:hover': {
                        borderColor: '#00ff88',
                        backgroundColor: filters.genres?.includes(genre) 
                          ? '#00ff88' 
                          : 'rgba(0, 255, 136, 0.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
            </Grid>

            {/* Experiencia */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Años de Experiencia
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                {filters.experience?.min || 0} - {filters.experience?.max || 50} años
              </Typography>
              <Slider
                value={[filters.experience?.min || 0, filters.experience?.max || 50]}
                onChange={(_, value) => {
                  handleFilterChange('experience.min', (value as number[])[0]);
                  handleFilterChange('experience.max', (value as number[])[1]);
                }}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
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

            {/* Tarifa por hora */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tarifa por Hora
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                {formatCurrency(filters.hourlyRate?.min || 10)} - {formatCurrency(filters.hourlyRate?.max || 500)}
              </Typography>
              <Slider
                value={[filters.hourlyRate?.min || 10, filters.hourlyRate?.max || 500]}
                onChange={(_, value) => {
                  handleFilterChange('hourlyRate.min', (value as number[])[0]);
                  handleFilterChange('hourlyRate.max', (value as number[])[1]);
                }}
                min={10}
                max={500}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
                sx={{
                  color: '#00ff88',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00ff88',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00ff88',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>

            {/* Calificación */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                Calificación Mínima
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1 }}>
                {filters.rating?.min || 0} - {filters.rating?.max || 5} estrellas
              </Typography>
              <Slider
                value={[filters.rating?.min || 0, filters.rating?.max || 5]}
                onChange={(_, value) => {
                  handleFilterChange('rating.min', (value as number[])[0]);
                  handleFilterChange('rating.max', (value as number[])[1]);
                }}
                min={0}
                max={5}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{
                  color: '#ffd700',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#ffd700',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#ffd700',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>

            {/* Estado y verificación */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Estado
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b8c1' }}>Estado</InputLabel>
                    <Select
                      value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange('isActive', value === '' ? undefined : value === 'true');
                      }}
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
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="true">Activos</MenuItem>
                      <MenuItem value="false">Inactivos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b8c1' }}>Verificación</InputLabel>
                    <Select
                      value={filters.isVerified === undefined ? '' : filters.isVerified.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange('isVerified', value === '' ? undefined : value === 'true');
                      }}
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
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="true">Verificados</MenuItem>
                      <MenuItem value="false">No verificados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.2)' }} />
            </Grid>

            {/* Ordenamiento */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
                Ordenamiento
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b8c1' }}>Ordenar por</InputLabel>
                    <Select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b8c1' }}>Orden</InputLabel>
                    <Select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
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
                      <MenuItem value="asc">Ascendente</MenuItem>
                      <MenuItem value="desc">Descendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                height: '100%'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  sx={{
                    borderColor: 'rgba(255, 68, 68, 0.3)',
                    color: '#ff4444',
                    '&:hover': {
                      borderColor: '#ff4444',
                      backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    },
                  }}
                >
                  Limpiar
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                  sx={{
                    background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                    color: '#000',
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00ff88, #00fff7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Aplicar Filtros
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default MusicianFiltersComponent; 