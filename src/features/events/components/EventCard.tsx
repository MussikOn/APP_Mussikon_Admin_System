import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import type { Event } from '../types/event';

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
      case 'publicado':
        return '#00ff88';
      case 'borrador':
        return '#ffaa00';
      case 'cancelado':
        return '#ff4444';
      case 'completado':
        return '#00fff7';
      default:
        return '#888888';
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'publicado':
        return 'PUBLICADO';
      case 'borrador':
        return 'BORRADOR';
      case 'cancelado':
        return 'CANCELADO';
      case 'completado':
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
      {event.images && event.images.length > 0 && (
        <Box
          className="event-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            backgroundImage: `url(${event.images[0]})`,
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

              <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1, pt: event.images && event.images.length > 0 ? 8 : 2 }}>
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
            {event.title}
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

        {/* Título secundario */}
        {event.title && (
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              color: '#b0b8c1',
              fontStyle: 'italic',
              fontSize: '0.85rem'
            }}
          >
            {event.title}
          </Typography>
        )}

        {/* Descripción */}
        {event.description && (
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
            {event.description.length > 80 
              ? `${event.description.substring(0, 80)}...` 
              : event.description
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
                {event.location}
              </Typography>
            </Box>
          )}
          
          {event.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: '#ffaa00',
                boxShadow: '0 0 6px #ffaa00'
              }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                {event.category}
              </Typography>
            </Box>
          )}
          
          {event.maxAttendees && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                backgroundColor: '#00ff88',
                boxShadow: '0 0 6px #00ff88'
              }} />
              <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
                {event.maxAttendees} personas
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
          onClick={() => onDelete(event._id!)}
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