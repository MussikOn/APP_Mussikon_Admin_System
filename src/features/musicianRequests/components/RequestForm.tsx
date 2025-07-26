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
import type { MusicianRequest, CreateRequestData } from '../types/request';
import { EVENT_TYPES, INSTRUMENTS } from '../types/request';

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (requestData: CreateRequestData) => Promise<void>;
  request?: MusicianRequest | null;
  loading?: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({
  open,
  onClose,
  onSubmit,
  request,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateRequestData>({
    userId: 'admin@mussikon.com', // En un caso real, esto vendría del contexto de autenticación
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    instrument: '',
    budget: 0,
    comments: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (request) {
      setFormData({
        userId: request.userId,
        eventType: request.eventType,
        date: request.date,
        startTime: request.time.split(' - ')[0] || '',
        endTime: request.time.split(' - ')[1] || '',
        location: request.location,
        instrument: request.instrument,
        budget: request.budget,
        comments: request.comments || ''
      });
    } else {
      setFormData({
        userId: 'admin@mussikon.com',
        eventType: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        instrument: '',
        budget: 0,
        comments: ''
      });
    }
    setErrors({});
  }, [request, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventType.trim()) {
      newErrors.eventType = 'El tipo de evento es requerido';
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

    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es requerida';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'La hora de fin es requerida';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.instrument.trim()) {
      newErrors.instrument = 'El instrumento es requerido';
    }

    if (formData.budget < 0) {
      newErrors.budget = 'El presupuesto no puede ser negativo';
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

  const handleChange = (field: keyof CreateRequestData, value: any) => {
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
        {request ? 'EDITAR SOLICITUD' : 'CREAR NUEVA SOLICITUD'}
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
            <FormControl fullWidth sx={{ gridColumn: 'span 2' }}>
              <InputLabel>Tipo de Evento</InputLabel>
              <Select
                value={formData.eventType}
                onChange={(e) => handleChange('eventType', e.target.value)}
                label="Tipo de Evento"
                error={!!errors.eventType}
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
              label="Fecha"
              type="date"
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
              error={!!errors.location}
              helperText={errors.location}
              fullWidth
              required
            />

            <TextField
              label="Hora de Inicio"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              error={!!errors.startTime}
              helperText={errors.startTime}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Hora de Fin"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              error={!!errors.endTime}
              helperText={errors.endTime}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Instrumento</InputLabel>
              <Select
                value={formData.instrument}
                onChange={(e) => handleChange('instrument', e.target.value)}
                label="Instrumento"
                error={!!errors.instrument}
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#00fff7'
                  }
                }}
              >
                {INSTRUMENTS.map((instrument) => (
                  <MenuItem key={instrument} value={instrument} sx={{ color: '#fff' }}>
                    {instrument}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Presupuesto"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
              error={!!errors.budget}
              helperText={errors.budget}
              fullWidth
              required
            />

            <TextField
              label="Comentarios (Opcional)"
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              multiline
              rows={3}
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
            {loading ? 'GUARDANDO...' : (request ? 'ACTUALIZAR' : 'CREAR')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestForm; 