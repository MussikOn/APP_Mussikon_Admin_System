import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { 
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface ActivityItem {
  id: string;
  type: 'user' | 'event' | 'request';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ 
  activities, 
  maxItems = 10 
}) => {
  const displayActivities = activities.slice(0, maxItems);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays}d`;
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'active':
      case 'aprobada':
      case 'approved':
        return '#00e676';
      case 'pendiente':
      case 'pending':
        return '#ff9800';
      case 'cancelado':
      case 'cancelled':
      case 'rechazada':
      case 'rejected':
        return '#f44336';
      default:
        return '#7f5fff';
    }
  };

  if (displayActivities.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'var(--color-glass)',
        borderRadius: 3,
        border: '1px solid var(--color-border)'
      }}>
        <ScheduleIcon sx={{ fontSize: 48, color: 'var(--color-text-disabled)', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No hay actividad reciente para mostrar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'var(--color-glass)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--color-border)',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-glass-strong)'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            background: 'var(--color-gradient-1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ◆ ACTIVIDAD RECIENTE ◆
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Últimas {displayActivities.length} actividades del sistema
        </Typography>
      </Box>

      {/* Lista de actividades */}
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {displayActivities.map((activity, index) => (
          <Box
            key={activity.id}
            sx={{
              p: 3,
              borderBottom: index < displayActivities.length - 1 ? '1px solid var(--color-border)' : 'none',
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'var(--color-glass-strong)',
                transform: 'translateX(4px)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: activity.color,
                opacity: 0.8
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Avatar con icono */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: `${activity.color}22`,
                  color: activity.color,
                  border: `2px solid ${activity.color}44`,
                  fontSize: '1.2rem'
                }}
              >
                {activity.icon}
              </Avatar>

              {/* Contenido */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  mb: 0.5
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      lineHeight: 1.3
                    }}
                  >
                    {activity.title}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      background: 'var(--color-glass)',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      minWidth: 'fit-content',
                      ml: 1
                    }}
                  >
                    {getRelativeTime(activity.timestamp)}
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--color-text-secondary)',
                    mb: 1,
                    lineHeight: 1.4
                  }}
                >
                  {activity.description}
                </Typography>

                {/* Estado si existe */}
                {activity.status && (
                  <Chip
                    label={activity.status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: `${getStatusColor(activity.status)}22`,
                      color: getStatusColor(activity.status),
                      border: `1px solid ${getStatusColor(activity.status)}44`,
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Línea de conexión vertical (excepto el último) */}
            {index < displayActivities.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 22,
                  bottom: -1,
                  width: '2px',
                  height: '20px',
                  background: `linear-gradient(to bottom, ${activity.color}44, transparent)`,
                  zIndex: 1
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer con indicador de más elementos */}
      {activities.length > maxItems && (
        <Box sx={{ 
          p: 2, 
          background: 'var(--color-glass-strong)',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)'
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic'
            }}
          >
            ▼ {activities.length - maxItems} actividades más ▼
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecentActivityFeed;
