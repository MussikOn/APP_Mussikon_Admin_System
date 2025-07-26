import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Edit, Delete, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import type { MusicianRequest } from '../types/request';

interface RequestCardProps {
  request: MusicianRequest;
  onEdit: (request: MusicianRequest) => void;
  onDelete: (id: string) => void;
  onView: (request: MusicianRequest) => void;
  onAccept: (requestId: string, musicianId: string) => void;
  onCancel: (requestId: string) => void;
  loading?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onEdit, 
  onDelete, 
  onView, 
  onAccept, 
  onCancel, 
  loading = false 
}) => {
  const getStatusColor = (status: MusicianRequest['status']) => {
    switch (status) {
      case 'pending':
        return '#ffaa00';
      case 'assigned':
        return '#00ff88';
      case 'unassigned':
        return '#ff4444';
      case 'cancelled':
        return '#888888';
      case 'completed':
        return '#00fff7';
      default:
        return '#888888';
    }
  };

  const getStatusLabel = (status: MusicianRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'PENDIENTE';
      case 'assigned':
        return 'ASIGNADA';
      case 'unassigned':
        return 'NO ASIGNADA';
      case 'cancelled':
        return 'CANCELADA';
      case 'completed':
        return 'COMPLETADA';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return `$${budget.toLocaleString()}`;
  };

  const handleAccept = () => {
    const musicianId = 'current-user-id'; // En un caso real, esto vendría del contexto de autenticación
    onAccept(request._id!, musicianId);
  };

  const handleCancel = () => {
    onCancel(request._id!);
  };

  return (
    <Card 
      className="request-card" 
      sx={{ 
        minHeight: 320,
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
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1, pt: 2 }}>
        {/* Header con tipo de evento y estado */}
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
            {request.eventType.toUpperCase()}
          </Typography>
          <Chip 
            label={getStatusLabel(request.status)} 
            sx={{ 
              backgroundColor: getStatusColor(request.status),
              color: '#000',
              fontWeight: 700,
              fontSize: '0.7rem',
              minWidth: 80,
              height: 24,
              boxShadow: `0 0 10px ${getStatusColor(request.status)}`,
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        </Box>

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
              {formatDate(request.date)} - {request.time}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: '#888',
              boxShadow: '0 0 6px #888'
            }} />
            <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
              {request.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: '#ffaa00',
              boxShadow: '0 0 6px #ffaa00'
            }} />
            <Typography variant="body2" sx={{ color: '#b0b8c1', fontSize: '0.75rem' }}>
              {request.instrument}
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#00ff88', 
              fontWeight: 700, 
              fontSize: '0.9rem',
              textShadow: '0 0 8px rgba(0, 255, 136, 0.5)'
            }}
          >
            {formatBudget(request.budget)}
          </Typography>
          
          {request.comments && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#b0b8c1',
                lineHeight: 1.4,
                fontSize: '0.8rem',
                opacity: 0.8,
                fontStyle: 'italic'
              }}
            >
              "{request.comments}"
            </Typography>
          )}
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
            onClick={() => onView(request)}
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
            onClick={() => onEdit(request)}
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
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {request.status === 'pending' && (
            <Button
              size="small"
              startIcon={<CheckCircle />}
              onClick={handleAccept}
              disabled={loading}
              sx={{ 
                color: '#00ff88',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
                }
              }}
            >
              ACEPTAR
            </Button>
          )}
          
          {request.status !== 'cancelled' && request.status !== 'completed' && (
            <Button
              size="small"
              startIcon={<Cancel />}
              onClick={handleCancel}
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
              CANCELAR
            </Button>
          )}
          
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => onDelete(request._id!)}
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
        </Box>
      </CardActions>
    </Card>
  );
};

export default RequestCard; 