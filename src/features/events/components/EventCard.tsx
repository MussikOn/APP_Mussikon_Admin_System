import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import type { Event } from '../../../services/eventsService';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onView: (event: Event) => void;
  loading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onView, 
  loading = false 
}) => {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'musician_assigned':
        return '#00ff88';
      case 'pending_musician':
        return '#ffaa00';
      case 'cancelled':
      case 'musician_cancelled':
        return '#ff4444';
      case 'completed':
        return '#00fff7';
      default:
        return '#888888';
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'musician_assigned':
        return 'MÚSICO ASIGNADO';
      case 'pending_musician':
        return 'PENDIENTE';
      case 'cancelled':
        return 'CANCELADO';
      case 'musician_cancelled':
        return 'CANCELADO POR MÚSICO';
      case 'completed':
        return 'COMPLETADO';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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
    <Card 
      className="event-card" 
      sx={{ 
        minHeight: 280,
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 247, 0.3)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00fff7, #00ff88, #00fff7)',
          transform: 'scaleX(0)',
          transition: 'transform 0.4s ease',
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0, 255, 247, 0.3)',
          border: '1px solid rgba(0, 255, 247, 0.6)',
          '&::before': {
            transform: 'scaleX(1)',
          },
        },
        '&:hover .event-image': {
          transform: 'scale(1.1)',
        }
      }}
    >
      {/* Imagen de fondo con overlay */}
      {event.flyerUrl && (
        <Box
          className="event-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            backgroundImage: `url(${event.flyerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.4s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
            }
          }}
        />
      )}

              <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1, pt: event.flyerUrl ? 8 : 2 }}>
        {/* Header con título y estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#00fff7',
              textShadow: '0 0 10px rgba(0, 255, 247, 0.5)',
              fontSize: '1.1rem',
              lineHeight: 1.2,
              flex: 1,
              mr: 1
            }}
          >
            {event.eventName}
          </Typography>
          <Chip 
            label={getStatusLabel(event.status)} 
            sx={{ 
              backgroundColor: getStatusColor(event.status),
              color: '#000',
              fontWeight: 700,
              fontSize: '0.7rem',
              minWidth: 80,
              height: 24,
              boxShadow: `0 0 10px ${getStatusColor(event.status)}`,
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        </Box>

        {/* Tipo de evento */}
        {event.eventType && (
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              color: '#b0b8c1',
              fontStyle: 'italic',
              fontSize: '0.85rem'
            }}
          >
            {event.eventType}
          </Typography>
        )}

        {/* Comentario */}
        {event.comment && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: '#b0b8c1',
              lineHeight: 1.4,
              fontSize: '0.8rem',
              opacity: 0.8
            }}
          >
            {event.comment.length > 80 
              ? `${event.comment.substring(0, 80)}...` 
              : event.comment
            }
          </Typography>
        )}

        {/* Información del evento */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: '#00fff7',
              boxShadow: '0 0 8px #00fff7'
            }} />
            <Typography variant="body2" sx={{ color: '#00fff7', fontWeight: 600, fontSize: '0.8rem' }}>
              {formatDate(event.date)}
            </Typography>
          </Box>
          
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: '#888',
                boxShadow: '0 0 6px #888'
              }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                {formatLocation(event.location)}
              </Typography>
            </Box>
          )}
          
          {event.instrument && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: '#ffaa00',
                boxShadow: '0 0 6px #ffaa00'
              }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                {event.instrument}
              </Typography>
            </Box>
          )}
          
          {event.duration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: '#00ff88',
                boxShadow: '0 0 6px #00ff88'
              }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                Duración: {event.duration}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#00ff88', 
              fontWeight: 700, 
              fontSize: '0.9rem',
              textShadow: '0 0 8px rgba(0, 255, 136, 0.5)'
            }}
          >
            {event.budget ? `$${event.budget.toLocaleString()}` : 'GRATIS'}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'space-between', 
        p: 2, 
        pt: 0,
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<Visibility />}
            onClick={() => onView(event)}
            disabled={loading}
            sx={{ 
              color: '#00fff7',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { 
                backgroundColor: 'rgba(0, 255, 247, 0.1)',
                boxShadow: '0 0 10px rgba(0, 255, 247, 0.3)'
              }
            }}
          >
            VER
          </Button>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => onEdit(event)}
            disabled={loading}
            sx={{ 
              color: '#ffaa00',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { 
                backgroundColor: 'rgba(255, 170, 0, 0.1)',
                boxShadow: '0 0 10px rgba(255, 170, 0, 0.3)'
              }
            }}
          >
            EDITAR
          </Button>
        </Box>
        <Button
          size="small"
          startIcon={<Delete />}
          onClick={() => onDelete(event.id)}
          disabled={loading}
          sx={{ 
            color: '#ff4444',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { 
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              boxShadow: '0 0 10px rgba(255, 68, 68, 0.3)'
            }
          }}
        >
          ELIMINAR
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard; 