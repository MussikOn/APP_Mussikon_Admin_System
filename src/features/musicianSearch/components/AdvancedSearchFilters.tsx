import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Collapse,
  Divider,
  Autocomplete
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  Search,
  LocationOn,
  MusicNote,
  AttachMoney,
  Star,
  Schedule
} from '@mui/icons-material';
import type { ExperienceLevel, ProficiencyLevel } from '../types';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export interface SearchFilters {
  location: string;
  radius: number;
  instruments: string[];
  genres: string[];
  experienceLevel: ExperienceLevel | '';
  proficiencyLevel: ProficiencyLevel | '';
  minRating: number;
  maxPrice: number;
  availability: string[];
  languages: string[];
  hasPortfolio: boolean;
  hasReviews: boolean;
  isVerified: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear
}) => {
  const [expanded, setExpanded] = useState(false);

  const experienceLevels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'professional', label: 'Profesional' }
  ];

  const proficiencyLevels = [
    { value: 'basic', label: 'Básico' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'expert', label: 'Experto' }
  ];

  const commonInstruments = [
    'Piano', 'Guitarra', 'Violín', 'Flauta', 'Saxofón', 'Batería',
    'Bajo', 'Trompeta', 'Trombón', 'Clarinete', 'Oboe', 'Fagot',
    'Arpa', 'Viola', 'Violonchelo', 'Contrabajo', 'Acordeón', 'Órgano'
  ];

  const commonGenres = [
    'Clásica', 'Jazz', 'Rock', 'Pop', 'Folk', 'Blues', 'Country',
    'Electrónica', 'Hip Hop', 'R&B', 'Reggae', 'Salsa', 'Flamenco',
    'Tango', 'Bossa Nova', 'Funk', 'Soul', 'Metal', 'Punk'
  ];

  const availabilityOptions = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
    'Mañana', 'Tarde', 'Noche', 'Fines de semana', 'Entre semana'
  ];

  const languageOptions = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués',
    'Catalán', 'Euskera', 'Gallego', 'Chino', 'Japonés', 'Árabe'
  ];

  const sortOptions = [
    { value: 'rating', label: 'Calificación' },
    { value: 'price', label: 'Precio' },
    { value: 'experience', label: 'Experiencia' },
    { value: 'distance', label: 'Distancia' },
    { value: 'reviews', label: 'Número de reseñas' }
  ];

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onClear();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.instruments.length > 0) count++;
    if (filters.genres.length > 0) count++;
    if (filters.experienceLevel) count++;
    if (filters.proficiencyLevel) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxPrice < 1000) count++;
    if (filters.availability.length > 0) count++;
    if (filters.languages.length > 0) count++;
    if (filters.hasPortfolio) count++;
    if (filters.hasReviews) count++;
    if (filters.isVerified) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <FilterList />
          Filtros Avanzados
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={getActiveFiltersCount()}
              color="primary"
              size="small"
            />
          )}
        </Typography>
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandMore /> : <ExpandMore />}
        >
          {expanded ? 'Ocultar' : 'Mostrar'}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Location and Radius */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ubicación
            </Typography>
            <TextField
              fullWidth
              placeholder="Ciudad, provincia o código postal"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              size="small"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Radio de búsqueda: {filters.radius} km
              </Typography>
              <Slider
                value={filters.radius}
                onChange={(_, value) => handleFilterChange('radius', value)}
                min={1}
                max={100}
                marks={[
                  { value: 1, label: '1km' },
                  { value: 25, label: '25km' },
                  { value: 50, label: '50km' },
                  { value: 100, label: '100km' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>

          {/* Instruments and Genres */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <MusicNote fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Instrumentos
            </Typography>
            <Autocomplete
              multiple
              options={commonInstruments}
              value={filters.instruments}
              onChange={(_, newValue) => handleFilterChange('instruments', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Selecciona instrumentos"
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                  />
                ))
              }
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Géneros musicales
              </Typography>
              <Autocomplete
                multiple
                options={commonGenres}
                value={filters.genres}
                onChange={(_, newValue) => handleFilterChange('genres', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecciona géneros"
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                    />
                  ))
                }
              />
            </Box>
          </Grid>

          {/* Experience and Proficiency */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <Star fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Nivel de experiencia
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Experiencia</InputLabel>
              <Select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                label="Experiencia"
              >
                <MenuItem value="">Cualquier nivel</MenuItem>
                {experienceLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Proficiencia</InputLabel>
                <Select
                  value={filters.proficiencyLevel}
                  onChange={(e) => handleFilterChange('proficiencyLevel', e.target.value)}
                  label="Proficiencia"
                >
                  <MenuItem value="">Cualquier nivel</MenuItem>
                  {proficiencyLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Rating and Price */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <Star fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Calificación mínima
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filters.minRating}
                onChange={(_, value) => handleFilterChange('minRating', value)}
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <AttachMoney fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Precio máximo por hora
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="€1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                size="small"
                InputProps={{
                  startAdornment: <Typography variant="body2">€</Typography>
                }}
              />
            </Box>
          </Grid>

          {/* Availability and Languages */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <Schedule fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Disponibilidad
            </Typography>
            <Autocomplete
              multiple
              options={availabilityOptions}
              value={filters.availability}
              onChange={(_, newValue) => handleFilterChange('availability', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Selecciona horarios"
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                  />
                ))
              }
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Idiomas
              </Typography>
              <Autocomplete
                multiple
                options={languageOptions}
                value={filters.languages}
                onChange={(_, newValue) => handleFilterChange('languages', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecciona idiomas"
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                    />
                  ))
                }
              />
            </Box>
          </Grid>

          {/* Additional Filters */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Filtros adicionales
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.hasPortfolio}
                    onChange={(e) => handleFilterChange('hasPortfolio', e.target.checked)}
                  />
                }
                label="Con portafolio"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.hasReviews}
                    onChange={(e) => handleFilterChange('hasReviews', e.target.checked)}
                  />
                }
                label="Con reseñas"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.isVerified}
                    onChange={(e) => handleFilterChange('isVerified', e.target.checked)}
                  />
                }
                label="Verificado"
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Ordenar por
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    >
                      <MenuItem value="asc">Ascendente</MenuItem>
                      <MenuItem value="desc">Descendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={onSearch}
          >
            Aplicar Filtros
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearchFilters;
