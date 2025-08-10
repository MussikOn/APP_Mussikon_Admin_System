import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Collapse,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Event,
  LocationOn,
  AttachMoney,
  Description,
  MusicNote,
  Schedule,
  ExpandMore,
  ExpandLess,
  Message,
  Phone,
  Email,
  Edit,
  Delete,
  Star,
  PriorityHigh,
  Negotiation,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { HiringRequest, EventType, BudgetRange, UrgencyLevel, RequestStatus } from '../types';

interface HiringRequestCardProps {
  request: HiringRequest;
  onEdit?: (request: HiringRequest) => void;
  onDelete?: (requestId: string) => void;
  onContact?: (requestId: string) => void;
  onStatusChange?: (requestId: string, status: RequestStatus) => void;
  isOwner?: boolean;
}

const HiringRequestCard: React.FC<HiringRequestCardProps> = ({
  request,
  onEdit,
  onDelete,
  onContact,
  onStatusChange,
  isOwner = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contactDialog, setContactDialog] = useState(false);

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case EventType.WEDDING:
        return 'primary';
      case EventType.CORPORATE:
        return 'secondary';
      case EventType.PARTY:
        return 'success';
      case EventType.CONCERT:
        return 'warning';
      case EventType.FESTIVAL:
        return 'info';
      default:
        return 'default';
    }
  };

  const getBudgetColor = (budget: BudgetRange) => {
    switch (budget) {
      case BudgetRange.LOW:
        return 'success';
      case BudgetRange.MEDIUM:
        return 'info';
      case BudgetRange.HIGH:
        return 'warning';
      case BudgetRange.PREMIUM:
        return 'error';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.LOW:
        return 'success';
      case UrgencyLevel.NORMAL:
        return 'info';
      case UrgencyLevel.HIGH:
        return 'warning';
      case UrgencyLevel.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.OPEN:
        return 'success';
      case RequestStatus.IN_PROGRESS:
        return 'info';
      case RequestStatus.COMPLETED:
        return 'default';
      case RequestStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: Date | string) => {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return timeObj.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBudgetLabel = (budget: BudgetRange) => {
    switch (budget) {
      case BudgetRange.LOW:
        return '€50-150';
      case BudgetRange.MEDIUM:
        return '€150-500';
      case BudgetRange.HIGH:
        return '€500-1000';
      case BudgetRange.PREMIUM:
        return '+€1000';
      default:
        return 'No especificado';
    }
  };

  const handleContact = () => {
    setContactDialog(true);
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header */}
          <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Event />
            </Avatar>
            
            <Box flexGrow={1}>
              <Typography variant="h6" gutterBottom>
                {request.title}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Chip
                  label={request.eventType}
                  size="small"
                  color={getEventTypeColor(request.eventType)}
                  variant="outlined"
                />
                <Chip
                  label={request.status}
                  size="small"
                  color={getStatusColor(request.status)}
                />
                {request.isUrgent && (
                  <Chip
                    icon={<PriorityHigh />}
                    label="Urgente"
                    size="small"
                    color="error"
                  />
                )}
              </Box>
            </Box>
            
            {isOwner && (
              <Box display="flex" gap={1}>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => onEdit?.(request)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete?.(request.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Basic Info */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(request.date)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatTime(request.time)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {request.duration} horas
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {getBudgetLabel(request.budget)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Location */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="subtitle2">Ubicación</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {request.location}
            </Typography>
          </Box>

          {/* Instruments */}
          {request.instruments && request.instruments.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Instrumentos requeridos
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {request.instruments.map((instrument) => (
                  <Chip
                    key={instrument}
                    label={instrument}
                    size="small"
                    icon={<MusicNote />}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {request.description}
          </Typography>

          {/* Expandable Content */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            {/* Additional Requirements */}
            {request.requirements && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Requisitos adicionales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.requirements}
                </Typography>
              </Box>
            )}

            {/* Budget and Urgency Details */}
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Presupuesto
                </Typography>
                <Chip
                  label={getBudgetLabel(request.budget)}
                  color={getBudgetColor(request.budget)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Urgencia
                </Typography>
                <Chip
                  label={request.urgency}
                  color={getUrgencyColor(request.urgency)}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Negotiation */}
            {request.allowNegotiation && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Negotiation color="success" />
                <Typography variant="body2" color="success.main">
                  Negociación de precio permitida
                </Typography>
              </Box>
            )}

            {/* Status Management for Owners */}
            {isOwner && request.status === RequestStatus.OPEN && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Cambiar estado
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStatusChange(RequestStatus.IN_PROGRESS)}
                  >
                    En Progreso
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStatusChange(RequestStatus.COMPLETED)}
                  >
                    Completado
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange(RequestStatus.CANCELLED)}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}
          </Collapse>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          >
            {expanded ? 'Menos' : 'Más'}
          </Button>
          
          <Box display="flex" gap={1}>
            {!isOwner && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Message />}
                onClick={handleContact}
              >
                Contactar
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              startIcon={<Event />}
              onClick={() => {/* Navigate to event details */}}
            >
              Ver Detalles
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contactar sobre: {request.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para contactar sobre esta solicitud, puedes usar los siguientes métodos:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary="enviar email a la dirección registrada"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Teléfono"
                secondary="llamar al número registrado"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Message color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Mensaje interno"
                secondary="enviar mensaje a través del sistema"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cerrar</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setContactDialog(false);
              onContact?.(request.id);
            }}
          >
            Contactar Ahora
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HiringRequestCard;

