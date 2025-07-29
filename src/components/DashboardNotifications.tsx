import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DashboardNotificationsProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#00e676' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#00e676';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <Card
      sx={{
        background: 'rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <NotificationsIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notificaciones
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {unreadCount} sin leer
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'text.secondary' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Notifications List */}
        <Collapse in={expanded}>
          <List sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <ListItem sx={{ py: 3 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No hay notificaciones
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    py: 2,
                    px: 2.5,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: notification.read ? 'transparent' : 'rgba(255, 46, 236, 0.05)',
                    '&:hover': {
                      background: 'rgba(255, 46, 236, 0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box component="span" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {notification.title}
                        </Box>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: getNotificationColor(notification.type),
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', display: 'block', mb: 1 }}>
                          {notification.message}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            {formatTimestamp(notification.timestamp)}
                          </Box>
                          <Chip
                            label={notification.type}
                            size="small"
                            sx={{
                              background: `${getNotificationColor(notification.type)}20`,
                              color: getNotificationColor(notification.type),
                              fontWeight: 600,
                              fontSize: '0.6rem',
                              height: 18,
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!notification.read && onMarkAsRead && (
                      <IconButton
                        size="small"
                        onClick={() => onMarkAsRead(notification.id)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {onDismiss && (
                      <IconButton
                        size="small"
                        onClick={() => onDismiss(notification.id)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              ))
            )}
          </List>
          
          {notifications.length > 5 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                size="small"
                sx={{
                  color: '#ff2eec',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 46, 236, 0.1)',
                  },
                }}
              >
                Ver todas las notificaciones
              </Button>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DashboardNotifications; 