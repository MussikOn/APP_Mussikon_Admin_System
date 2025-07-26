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
import { Edit, Delete, CheckCircle, Cancel, MusicNote as MusicNoteIcon } from '@mui/icons-material';
import type { MusicianRequest } from '../types/request';

interface RequestDetailsProps {
  request: MusicianRequest | null;
  open: boolean;
  onClose: () => void;
  onEdit: (request: MusicianRequest) => void;
  onDelete: (id: string) => void;
  onAccept: (requestId: string, musicianId: string) => void;
  onCancel: (requestId: string) => void;
  loading?: boolean;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  open,
  onClose,
  onEdit,
  onDelete,
  onAccept,
  onCancel,
  loading = false
}) => {
  if (!request) return null;

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
      month: 'long',
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
    <Dialog 
      open={open} 
      onClose={onClose}
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
        DETALLES DE LA SOLICITUD
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header con estado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #00fff7, #00ff88)',
                color: '#000',
                width: 56,
                height: 56
              }}>
                <MusicNoteIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ 
                  color: '#00fff7', 
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(0, 255, 247, 0.5)'
                }}>
                  {request.eventType.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b8c1', mt: 0.5 }}>
                  ID: {request._id}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={getStatusLabel(request.status)} 
              sx={{ 
                backgroundColor: getStatusColor(request.status),
                color: '#000',
                fontWeight: 700,
                fontSize: '0.8rem',
                minWidth: 100,
                height: 32,
                boxShadow: `0 0 15px ${getStatusColor(request.status)}`
              }}
            />
          </Box>

          <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />

          {/* Información del evento */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  FECHA Y HORA
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                  {formatDate(request.date)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                  {request.time}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  UBICACIÓN
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                  {request.location}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  INSTRUMENTO REQUERIDO
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                  {request.instrument}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  PRESUPUESTO
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#00ff88', 
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                }}>
                  {formatBudget(request.budget)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  SOLICITANTE
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                  {request.userId}
                </Typography>
              </Box>

              {request.assignedMusicianId && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                    MÚSICO ASIGNADO
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#00ff88', fontWeight: 500 }}>
                    {request.assignedMusicianId}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  FECHAS
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                  Creado: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b8c1' }}>
                  Actualizado: {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Comentarios */}
          {request.comments && (
            <>
              <Divider sx={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#00fff7', fontWeight: 600, mb: 1 }}>
                  COMENTARIOS
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#b0b8c1',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  p: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 255, 247, 0.2)'
                }}>
                  "{request.comments}"
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 4, 
        pt: 0,
        gap: 2,
        justifyContent: 'center'
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#b0b8c1',
            border: '1px solid rgba(176, 184, 177, 0.3)',
            borderRadius: '12px',
            px: 3,
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
          CERRAR
        </Button>
        
        <Button
          startIcon={<Edit />}
          onClick={() => onEdit(request)}
          disabled={loading}
          sx={{ 
            color: '#ffaa00',
            border: '1px solid rgba(255, 170, 0, 0.3)',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              border: '1px solid rgba(255, 170, 0, 0.5)',
              backgroundColor: 'rgba(255, 170, 0, 0.1)',
              boxShadow: '0 0 10px rgba(255, 170, 0, 0.3)'
            }
          }}
        >
          EDITAR
        </Button>
        
        {request.status === 'pending' && (
          <Button
            startIcon={<CheckCircle />}
            onClick={handleAccept}
            disabled={loading}
            sx={{ 
              color: '#00ff88',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                border: '1px solid rgba(0, 255, 136, 0.5)',
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
            startIcon={<Cancel />}
            onClick={handleCancel}
            disabled={loading}
            sx={{ 
              color: '#ff4444',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                border: '1px solid rgba(255, 68, 68, 0.5)',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                boxShadow: '0 0 10px rgba(255, 68, 68, 0.3)'
              }
            }}
          >
            CANCELAR
          </Button>
        )}
        
        <Button
          startIcon={<Delete />}
          onClick={() => onDelete(request._id!)}
          disabled={loading}
          sx={{ 
            color: '#ff4444',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              border: '1px solid rgba(255, 68, 68, 0.5)',
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              boxShadow: '0 0 10px rgba(255, 68, 68, 0.3)'
            }
          }}
        >
          ELIMINAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDetails; 