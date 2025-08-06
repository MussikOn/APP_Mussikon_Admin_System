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
import { FilterList, Clear, ExpandMore, ExpandLess } from '@mui/icons-material';
import type { Event } from '../../../services/eventsService';

// Constantes para los filtros
const EVENT_STATUSES = [
  'pending_musician',
  'musician_assigned', 
  'completed',
  'cancelled',
  'musician_cancelled'
];

const EVENT_TYPES = [
  'Boda',
  'Cumpleaños',
  'Evento Corporativo',
  'Fiesta Privada',
  'Concierto',
  'Otro'
];

interface EventFiltersProps {
  onApply: (filters: any) => void;
  onCancel: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = () => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as Event['status'] | 'all',
    type: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const newDateRange = { ...filters.dateRange, [field]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
  };



  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all' as Event['status'] | 'all',
      type: '',
      dateRange: { start: '', end: '' }
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.status !== 'all' || 
           filters.type || 
           filters.dateRange.start || 
           filters.dateRange.end;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: '#00fff7' }} />
          <Typography variant="h6" sx={{ color: '#00fff7', fontWeight: 600 }}>
            Filtros
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasActiveFilters() && (
            <Chip
              label="Filtros activos"
              color="primary"
              size="small"
              sx={{ backgroundColor: '#00fff7', color: '#000' }}
            />
          )}
          
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#00fff7' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(200px, 1fr))' },
          gap: 2,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <TextField
            label="Buscar eventos"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Nombre, descripción..."
            fullWidth
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Estado"
            >
              <MenuItem value="all">Todos los estados</MenuItem>
                              {EVENT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Evento</InputLabel>
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              label="Tipo de Evento"
            >
              <MenuItem value="">Todos los tipos</MenuItem>
              {EVENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha desde"
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
              disabled={!hasActiveFilters()}
              sx={{ 
                borderColor: '#ff5252',
                color: '#ff5252',
                '&:hover': {
                  borderColor: '#ff1744',
                  backgroundColor: 'rgba(255, 82, 82, 0.1)'
                }
              }}
            >
              Limpiar
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EventFilters; 