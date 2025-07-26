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
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import type { RequestFilters } from '../types/request';
import { EVENT_TYPES, INSTRUMENTS, REQUEST_STATUSES } from '../types/request';

interface RequestFiltersProps {
  onFilterChange: (filters: RequestFilters) => void;
  onClearFilters: () => void;
}

const RequestFilters: React.FC<RequestFiltersProps> = ({
  onFilterChange,
  onClearFilters
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<RequestFilters>({
    search: '',
    status: undefined,
    eventType: '',
    instrument: '',
    dateRange: undefined
  });

  const handleFilterChange = (field: keyof RequestFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      eventType: '',
      instrument: '',
      dateRange: undefined
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setExpanded(!expanded)}
          sx={{ 
            borderColor: '#00fff7',
            color: '#00fff7',
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              borderColor: '#00ff88',
              backgroundColor: 'rgba(0, 255, 247, 0.1)',
              boxShadow: '0 0 10px rgba(0, 255, 247, 0.3)'
            }
          }}
        >
          FILTROS
        </Button>
        
        {hasActiveFilters && (
          <Chip
            label="Filtros activos"
            color="primary"
            onDelete={handleClearFilters}
            deleteIcon={<Clear />}
            sx={{ 
              backgroundColor: '#00ff88',
              color: '#000',
              fontWeight: 600,
              '& .MuiChip-deleteIcon': {
                color: '#000'
              }
            }}
          />
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 2,
          p: 3,
          background: 'rgba(0, 255, 247, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 255, 247, 0.2)',
          '& .MuiTextField-root, & .MuiFormControl-root': {
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 255, 247, 0.2)',
              '&:hover': {
                border: '1px solid rgba(0, 255, 247, 0.4)',
                boxShadow: '0 0 10px rgba(0, 255, 247, 0.2)'
              },
              '&.Mui-focused': {
                border: '1px solid #00fff7',
                boxShadow: '0 0 15px rgba(0, 255, 247, 0.3)'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiInputLabel-root': {
                color: '#b0b8c1',
                '&.Mui-focused': {
                  color: '#00fff7'
                }
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': {
                  color: '#888',
                  opacity: 1
                }
              }
            },
            '& .MuiSelect-icon': {
              color: '#00fff7'
            }
          }
        }}>
          <TextField
            label="Buscar"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Buscar solicitudes..."
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              label="Estado"
            >
              <MenuItem value="" sx={{ color: '#fff' }}>Todos</MenuItem>
              {REQUEST_STATUSES.map((status) => (
                <MenuItem key={status.value} value={status.value} sx={{ color: '#fff' }}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tipo de Evento</InputLabel>
            <Select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              label="Tipo de Evento"
            >
              <MenuItem value="" sx={{ color: '#fff' }}>Todos</MenuItem>
              {EVENT_TYPES.map((type) => (
                <MenuItem key={type} value={type} sx={{ color: '#fff' }}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Instrumento</InputLabel>
            <Select
              value={filters.instrument}
              onChange={(e) => handleFilterChange('instrument', e.target.value)}
              label="Instrumento"
            >
              <MenuItem value="" sx={{ color: '#fff' }}>Todos</MenuItem>
              {INSTRUMENTS.map((instrument) => (
                <MenuItem key={instrument} value={instrument} sx={{ color: '#fff' }}>
                  {instrument}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
};

export default RequestFilters; 