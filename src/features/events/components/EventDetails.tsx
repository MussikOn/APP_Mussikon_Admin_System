import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import { Close, Edit, Delete, LocationOn, Event as EventIcon, Person, AttachMoney, Group } from '@mui/icons-material';
import type { Event } from '../../../services/eventsService';

interface EventDetailsProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  open,
  onClose,
  onEdit,
  onDelete,
  loading = false
}) => {
  if (!event) return null;

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'musician_assigned':
        return 'success';
      case 'pending_musician':
        return 'warning';
      case 'cancelled':
      case 'musician_cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'musician_assigned':
        return 'Músico Asignado';
      case 'pending_musician':
        return 'Pendiente de Músico';
      case 'cancelled':
        return 'Cancelado';
      case 'musician_cancelled':
        return 'Cancelado por Músico';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const formatCreatedDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ FUNCIÓN SEGURA: Manejar location como string u objeto
  const formatLocation = (location: any): string => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location !== null) {
      // Si es un objeto con address, usar address
      if (location.address) {
        return location.address;
      }
      // Si tiene city, usar city
      if (location.city) {
        return location.city;
      }
      // Si tiene coordenadas, formatear
      if (location.latitude && location.longitude) {
        return `${location.latitude}, ${location.longitude}`;
      }
      // Si no hay nada útil, devolver string vacío
      return '';
    }
    return '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: '#00fff7',
        fontWeight: 600
      }}>
        <Typography variant="h5" component="h2">
          {event.eventName}
        </Typography>
        <Chip
          label={getStatusLabel(event.status)}
          color={getStatusColor(event.status) as any}
          sx={{ minWidth: 100 }}
        />
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          {/* Imagen del evento */}
          {event.flyerUrl && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                borderRadius: 2,
                overflow: 'hidden',
                backgroundImage: `url(${event.flyerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }} />
            </Box>
          )}

          {/* Información principal */}
          <Box>
            {event.eventType && (
              <Typography variant="h6" sx={{ mb: 2, color: '#b0b8c1' }}>
                {event.eventType}
              </Typography>
            )}

            {event.comment && (
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {event.comment}
              </Typography>
            )}

            {/* Detalles del evento */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EventIcon sx={{ color: '#00fff7' }} />
                <Typography variant="body1">
                  {formatDate(event.date)}
                </Typography>
              </Box>

              {event.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: '#00fff7' }} />
                  <Typography variant="body1">
                    {formatLocation(event.location)}
                  </Typography>
                </Box>
              )}

              {event.user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person sx={{ color: '#00fff7' }} />
                  <Typography variant="body1">
                    Organizado por: {event.user}
                  </Typography>
                </Box>
              )}

              {event.instrument && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#00fff7' }}>
                    🎵
                  </Avatar>
                  <Typography variant="body1">
                    Instrumento: {event.instrument}
                  </Typography>
                </Box>
              )}

              {event.duration && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Group sx={{ color: '#00fff7' }} />
                  <Typography variant="body1">
                    Duración: {event.duration}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoney sx={{ color: '#00fff7' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Presupuesto: {event.budget ? `$${event.budget.toLocaleString()}` : 'Gratis'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Información adicional */}
          <Box>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#00fff7' }}>
                Información Adicional
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                  <strong>Creado:</strong> {formatCreatedDate(event.createdAt)}
                </Typography>
                
                {event.updatedAt && event.updatedAt !== event.createdAt && (
                  <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                    <strong>Actualizado:</strong> {formatCreatedDate(event.updatedAt)}
                  </Typography>
                )}
                
                <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                  <strong>ID:</strong> {event.id}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          startIcon={<Close />}
          sx={{ color: '#b0b8c1' }}
        >
          Cerrar
        </Button>
        
        <Button
          onClick={() => onEdit(event)}
          startIcon={<Edit />}
          disabled={loading}
          sx={{ 
            color: '#ff9800',
            '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' }
          }}
        >
          Editar
        </Button>
        
        <Button
          onClick={() => onDelete(event.id)}
          startIcon={<Delete />}
          disabled={loading}
          color="error"
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetails; 