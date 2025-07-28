import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Typography
} from '@mui/material';
import {
  FilterList,
  Clear,
  Search,
  LocationOn,
  MusicNote
} from '@mui/icons-material';
import { USER_ROLES, USER_STATUSES, INSTRUMENTS } from '../types/mobileUser';

interface MobileUserFiltersProps {
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const MobileUserFilters: React.FC<MobileUserFiltersProps> = ({
  onFilterChange,
  onClearFilters
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    roll: '',
    location: '',
    instrument: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      roll: '',
      location: '',
      instrument: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Paper sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(0, 255, 247, 0.2)',
      backdropFilter: 'blur(10px)',
      mb: 3,
      overflow: 'hidden'
    }}>
      {/* Header de filtros */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        background: 'rgba(0, 255, 247, 0.05)',
        borderBottom: '1px solid rgba(0, 255, 247, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: '#00fff7' }} />
          <Box sx={{ color: '#ffffff', fontWeight: 600 }}>
            Filtros
            {hasActiveFilters && (
              <Chip
                label={Object.values(filters).filter(v => v !== '').length}
                size="small"
                sx={{
                  ml: 1,
                  background: '#00fff7',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              sx={{
                borderColor: '#ff4444',
                color: '#ff4444',
                borderRadius: '8px',
                fontSize: '0.8rem',
                '&:hover': {
                  borderColor: '#ff6666',
                  backgroundColor: 'rgba(255, 68, 68, 0.1)'
                }
              }}
            >
              Limpiar
            </Button>
          )}

          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: '#00fff7',
              '&:hover': {
                background: 'rgba(0, 255, 247, 0.1)'
              }
            }}
          >
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Contenido de filtros */}
      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: 2
          }}>
            {/* Búsqueda por texto */}
            <TextField
              label="Buscar usuarios"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Nombre, email, ubicación..."
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ color: '#00fff7', mr: 1, fontSize: 20 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
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
                  '&.Mui-focused': {
                    color: '#00fff7',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  '&::placeholder': {
                    color: '#888888',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Filtro por estado */}
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Estado</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Estado"
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
                <MenuItem value="">
                  <em>Todos los estados</em>
                </MenuItem>
                {USER_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: status.color
                      }} />
                      {status.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por rol */}
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Rol</InputLabel>
              <Select
                value={filters.roll}
                onChange={(e) => handleFilterChange('roll', e.target.value)}
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
                <MenuItem value="">
                  <em>Todos los roles</em>
                </MenuItem>
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

            {/* Filtro por ubicación */}
            <TextField
              label="Ubicación"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Ciudad, provincia..."
              size="small"
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#00fff7', mr: 1, fontSize: 20 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
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
                  '&.Mui-focused': {
                    color: '#00fff7',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  '&::placeholder': {
                    color: '#888888',
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Filtro por instrumento */}
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: '#b0b8c1' }}>Instrumento</InputLabel>
              <Select
                value={filters.instrument}
                onChange={(e) => handleFilterChange('instrument', e.target.value)}
                label="Instrumento"
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
                <MenuItem value="">
                  <em>Todos los instrumentos</em>
                </MenuItem>
                {INSTRUMENTS.map((instrument) => (
                  <MenuItem key={instrument} value={instrument}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MusicNote sx={{ color: '#ffd700', fontSize: 16 }} />
                      {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Filtros activos */}
          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: '#b0b8c1', display: 'flex', alignItems: 'center' }}>
                Filtros activos:
              </Typography>
              
              {filters.search && (
                <Chip
                  label={`Búsqueda: "${filters.search}"`}
                  onDelete={() => handleFilterChange('search', '')}
                  size="small"
                  sx={{
                    background: 'rgba(0, 255, 247, 0.2)',
                    color: '#00fff7',
                    '& .MuiChip-deleteIcon': {
                      color: '#00fff7',
                    },
                  }}
                />
              )}
              
              {filters.status && (
                <Chip
                  label={`Estado: ${USER_STATUSES.find(s => s.value === filters.status)?.label}`}
                  onDelete={() => handleFilterChange('status', '')}
                  size="small"
                  sx={{
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    '& .MuiChip-deleteIcon': {
                      color: '#00ff88',
                    },
                  }}
                />
              )}
              
              {filters.roll && (
                <Chip
                  label={`Rol: ${USER_ROLES.find(r => r.value === filters.roll)?.label}`}
                  onDelete={() => handleFilterChange('roll', '')}
                  size="small"
                  sx={{
                    background: 'rgba(138, 43, 226, 0.2)',
                    color: '#8a2be2',
                    '& .MuiChip-deleteIcon': {
                      color: '#8a2be2',
                    },
                  }}
                />
              )}
              
              {filters.location && (
                <Chip
                  label={`Ubicación: "${filters.location}"`}
                  onDelete={() => handleFilterChange('location', '')}
                  size="small"
                  sx={{
                    background: 'rgba(255, 170, 0, 0.2)',
                    color: '#ffaa00',
                    '& .MuiChip-deleteIcon': {
                      color: '#ffaa00',
                    },
                  }}
                />
              )}
              
              {filters.instrument && (
                <Chip
                  label={`Instrumento: ${filters.instrument}`}
                  onDelete={() => handleFilterChange('instrument', '')}
                  size="small"
                  sx={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#ffd700',
                    '& .MuiChip-deleteIcon': {
                      color: '#ffd700',
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MobileUserFilters; 