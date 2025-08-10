import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  Chip
} from '@mui/material';
import type { SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onApplyFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onApplyFilters }) => {
  const handleChange = (field: keyof SearchFilters, value: any) => {
    onFilterChange({ [field]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filtros Avanzados
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Instrumento"
            placeholder="Ej: guitarra, piano, batería"
            value={filters.instruments?.join(', ') || ''}
            onChange={(e) => handleChange('instruments', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Género Musical"
            placeholder="Ej: jazz, rock, clásica"
            value={filters.genres?.join(', ') || ''}
            onChange={(e) => handleChange('genres', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Nivel de Experiencia</InputLabel>
            <Select
              value={filters.experience?.[0] || ''}
              onChange={(e) => handleChange('experience', [e.target.value])}
              label="Nivel de Experiencia"
            >
              <MenuItem value="beginner">Principiante</MenuItem>
              <MenuItem value="intermediate">Intermedio</MenuItem>
              <MenuItem value="advanced">Avanzado</MenuItem>
              <MenuItem value="professional">Profesional</MenuItem>
              <MenuItem value="expert">Experto</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Disponibilidad</InputLabel>
            <Select
              value={filters.availability?.[0] || ''}
              onChange={(e) => handleChange('availability', [e.target.value])}
              label="Disponibilidad"
            >
              <MenuItem value="available">Disponible</MenuItem>
              <MenuItem value="partially_available">Parcialmente Disponible</MenuItem>
              <MenuItem value="busy">Ocupado</MenuItem>
              <MenuItem value="unavailable">No Disponible</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Precio por Hora (USD)</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={[filters.hourlyRate?.min || 0, filters.hourlyRate?.max || 200]}
              onChange={(_, value) => {
                const [min, max] = value as number[];
                handleChange('hourlyRate', { min, max });
              }}
              min={0}
              max={200}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">${filters.hourlyRate?.min || 0}</Typography>
            <Typography variant="caption">${filters.hourlyRate?.max || 200}</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Radio de Búsqueda (km)"
            type="number"
            value={filters.radius || 50}
            onChange={(e) => handleChange('radius', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 500 }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => onFilterChange({})}
            >
              Limpiar Filtros
            </Button>
            <Button
              variant="contained"
              onClick={onApplyFilters}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilters;
