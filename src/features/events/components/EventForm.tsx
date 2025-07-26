import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import type { Event, CreateEventData } from '../types/event';
import { EVENT_TYPES, EVENT_STATUSES } from '../types/event';

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventData) => Promise<void>;
  event?: Event | null;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onSubmit,
  event,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateEventData>({
    name: '',
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'draft',
    type: '',
    capacity: 0,
    price: 0,
    organizer: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        location: event.location || '',
        status: event.status || 'draft',
        type: event.type || '',
        capacity: event.capacity || 0,
        price: event.price || 0,
        organizer: event.organizer || '',
        imageUrl: event.imageUrl || ''
      });
    } else {
      setFormData({
        name: '',
        title: '',
        description: '',
        date: '',
        location: '',
        status: 'draft',
        type: '',
        capacity: 0,
        price: 0,
        organizer: '',
        imageUrl: ''
      });
    }
    setErrors({});
  }, [event, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del evento es requerido';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.date = 'La fecha no puede ser en el pasado';
      }
    }

    if (formData.capacity && formData.capacity < 1) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
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
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 247, 0.3)',
          borderRadius: '20px',
          color: '#fff',
          boxShadow: '0 25px 50px rgba(0, 255, 247, 0.2)'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#00fff7', 
        fontWeight: 700,
        fontSize: '1.5rem',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(0, 255, 247, 0.5)',
        letterSpacing: '1px',
        pb: 1
      }}>
        {event ? 'EDITAR EVENTO' : 'CREAR NUEVO EVENTO'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 4, py: 2 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 3,
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
              '& .MuiFormHelperText-root': {
                color: '#ff4444',
                fontSize: '0.75rem'
              }
            }
          }}>
            <TextField
              label="Nombre del Evento"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              sx={{ gridColumn: 'span 2' }}
            />

            <TextField
              label="Título (Opcional)"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
            />

            <TextField
              label="Organizador"
              value={formData.organizer}
              onChange={(e) => handleChange('organizer', e.target.value)}
              fullWidth
            />

            <TextField
              label="Fecha y Hora"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Ubicación"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Tipo de Evento</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                label="Tipo de Evento"
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#00fff7'
                  }
                }}
              >
                {EVENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type} sx={{ color: '#fff' }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Capacidad"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
              error={!!errors.capacity}
              helperText={errors.capacity}
              fullWidth
            />

            <TextField
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Estado"
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#00fff7'
                  }
                }}
              >
                {EVENT_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value} sx={{ color: '#fff' }}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="URL de Imagen (Opcional)"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />

            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 4, 
          pt: 0,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            sx={{ 
              color: '#b0b8c1',
              border: '1px solid rgba(176, 184, 177, 0.3)',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                border: '1px solid rgba(176, 184, 177, 0.5)',
                backgroundColor: 'rgba(176, 184, 177, 0.1)'
              }
            }}
          >
            CANCELAR
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              color: '#000',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.9rem',
              boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00ff88, #00fff7)',
                boxShadow: '0 0 25px rgba(0, 255, 247, 0.6)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: 'rgba(0, 255, 247, 0.3)',
                color: '#666'
              }
            }}
          >
            {loading ? 'GUARDANDO...' : (event ? 'ACTUALIZAR' : 'CREAR')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 