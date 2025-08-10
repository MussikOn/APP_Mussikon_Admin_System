import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
  Grid
} from '@mui/material';
import {
  Notifications,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Cancel,
  Message,
  Event,
  Payment,
  Star,
  Warning,
  Info,
  Error
} from '@mui/icons-material';
import type { Notification, NotificationType, NotificationPriority } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  onAction?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onAction
}) => {
  const [expanded, setExpanded] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info />;
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      case 'reminder':
        return <Star />;
      case 'update':
        return <Event />;
      case 'invitation':
        return <Message />;
      case 'payment':
        return <Payment />;
      case 'system':
        return <Notifications />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type: NotificationType, priority: NotificationPriority) => {
    if (priority === 'high') {
      return 'error';
    }
    
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'payment':
        return 'info';
      case 'reminder':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getPriorityLabel = (priority: NotificationPriority) => {
    switch (priority) {
      case 'low':
        return 'Baja';
      case 'normal':
        return 'Normal';
      case 'high':
        return 'Alta';
      case 'urgent':
        return 'Urgente';
      default:
        return 'Normal';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'normal':
        return 'info';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Ahora mismo';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction(notification);
    }
    setActionDialog(false);
  };

  const getActionButtonText = () => {
    switch (notification.type) {
      case 'invitation':
        return 'Responder';
      case 'payment':
        return 'Ver Pago';
      case 'reminder':
        return 'Ver Reseña';
      case 'warning':
        return 'Entendido';
      case 'error':
        return 'Reintentar';
      case 'success':
        return 'Ver Detalles';
      case 'info':
        return 'Ver Más';
      case 'system':
        return 'Ver Detalles';
      default:
        return 'Ver Más';
    }
  };

  const getActionButtonColor = () => {
    switch (notification.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
          borderLeft: `4px solid ${getNotificationColor(notification.type, notification.priority)}.main`,
          borderRadius: 1,
          mb: 1,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <ListItemAvatar>
          <Badge
            color={getNotificationColor(notification.type, notification.priority)}
            variant="dot"
            invisible={notification.isRead}
          >
            <Avatar
              sx={{
                bgcolor: `${getNotificationColor(notification.type, notification.priority)}.main`,
                color: 'white'
              }}
            >
              {getNotificationIcon(notification.type)}
            </Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                  color: notification.isRead ? 'text.secondary' : 'text.primary'
                }}
              >
                {notification.title}
              </Typography>
              
              <Chip
                label={getPriorityLabel(notification.priority)}
                size="small"
                color={getPriorityColor(notification.priority)}
                variant="outlined"
              />
              
              {notification.isRead && (
                <Chip
                  label="Leída"
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {notification.message}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="caption" color="text.secondary">
                  {notification.timestamp ? formatTimestamp(notification.timestamp) : 'Sin fecha'}
                </Typography>
                
                {notification.category && (
                  <Chip
                    label={notification.category}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          }
        />

        <Box display="flex" alignItems="center" gap={1}>
          {!notification.isRead && (
            <IconButton
              size="small"
              color="primary"
              onClick={handleMarkAsRead}
              title="Marcar como leída"
            >
              <CheckCircle />
            </IconButton>
          )}
          
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Mostrar menos' : 'Mostrar más'}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(notification.id)}
            title="Eliminar notificación"
          >
            <Cancel />
          </IconButton>
        </Box>
      </ListItem>

      {/* Expanded Content */}
      <Collapse in={expanded}>
        <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
          <Divider sx={{ mb: 2 }} />
          
          {/* Additional Details */}
          {notification.details && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Detalles adicionales:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.details}
              </Typography>
            </Box>
          )}

          {/* Metadata */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                ID: {notification.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Tipo: {notification.type}
              </Typography>
            </Grid>
            {notification.sender && (
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  De: {notification.sender}
                </Typography>
              </Grid>
            )}
            {notification.recipient && (
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Para: {notification.recipient}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Action Buttons */}
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color={getActionButtonColor()}
              size="small"
              onClick={() => setActionDialog(true)}
            >
              {getActionButtonText()}
            </Button>
            
            {notification.type === 'invitation' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Message />}
              >
                Responder
              </Button>
            )}
            
            {notification.type === 'reminder' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Event />}
              >
                Ver Calendario
              </Button>
            )}
          </Box>
        </Box>
      </Collapse>

      {/* Action Dialog */}
      <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {notification.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {notification.message}
          </Typography>
          
          {notification.details && (
            <Typography variant="body2" color="text.secondary">
              {notification.details}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={getActionButtonColor()}
          >
            {getActionButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationItem;
