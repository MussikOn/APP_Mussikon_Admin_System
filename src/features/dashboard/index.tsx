import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mobileUsersService } from '../../services/mobileUsersService';
import { eventsService } from '../../services/eventsService';
import { musicianRequestsService } from '../../services/musicianRequestsService';
import { imagesService } from '../../services/imagesService';
import { useApiRequest } from '../../hooks/useApiRequest';
import { useTheme } from '../../contexts/ThemeContext';
import DashboardNotifications from '../../components/DashboardNotifications';
import DashboardCharts from '../../components/DashboardCharts';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  LibraryMusic as LibraryMusicIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  MusicNote as MusicIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Configuración de métricas con mejor diseño
const metricCards = [
  { 
    label: 'Usuarios Registrados', 
    subtitle: 'Total de usuarios en la plataforma',
    icon: <PeopleIcon />,
    color: '#7f5fff',
    gradient: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
    path: '/users',
    trend: '+12%',
    trendPositive: true
  },
  { 
    label: 'Eventos Activos', 
    subtitle: 'Eventos programados y en curso',
    icon: <EventIcon />,
    color: '#00e0ff',
    gradient: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
    path: '/events',
    trend: '+8%',
    trendPositive: true
  },
  { 
    label: 'Solicitudes Pendientes', 
    subtitle: 'Solicitudes de músicos por revisar',
    icon: <LibraryMusicIcon />,
    color: '#ff2eec',
    gradient: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
    path: '/musician-requests',
    trend: '+5%',
    trendPositive: false
  },
  { 
    label: 'Imágenes Subidas', 
    subtitle: 'Contenido multimedia disponible',
    icon: <ImageIcon />,
    color: '#00fff7',
    gradient: 'linear-gradient(135deg, #00fff7 0%, #7f5fff 100%)',
    path: '/images',
    trend: '+15%',
    trendPositive: true
  },
];

// Datos de ejemplo para gráficos
const chartData = [
  { label: 'Admin', value: 5, color: '#00fff7' },
  { label: 'Organizador', value: 12, color: '#b993d6' },
  { label: 'Músico', value: 28, color: '#ff2eec' },
  { label: 'Usuario', value: 15, color: '#7f5fff' },
];

// Datos de actividad semanal
const activityData = [
  { label: 'Lun', value: 12, color: '#7f5fff' },
  { label: 'Mar', value: 19, color: '#00e0ff' },
  { label: 'Mié', value: 15, color: '#ff2eec' },
  { label: 'Jue', value: 25, color: '#00fff7' },
  { label: 'Vie', value: 22, color: '#b993d6' },
  { label: 'Sáb', value: 18, color: '#7f5fff' },
  { label: 'Dom', value: 14, color: '#00e0ff' },
];

// Notificaciones de ejemplo
const notifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Nuevo usuario registrado',
    message: 'Se ha registrado un nuevo usuario en la plataforma',
    timestamp: new Date(Date.now() - 300000),
    read: false
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'Evento próximo a vencer',
    message: 'El evento "Concierto de Jazz" vence en 2 días',
    timestamp: new Date(Date.now() - 600000),
    read: false
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Actualización del sistema',
    message: 'Se han aplicado mejoras en el sistema de notificaciones',
    timestamp: new Date(Date.now() - 900000),
    read: true
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Métricas principales
  const {
    data: usersData,
    loading: loadingUsersCount,
    error: errorUsersCount,
    execute: fetchUsersCount
  } = useApiRequest(async () => {
    const response = await mobileUsersService.getAllUsers(undefined, 1, 1);
    return response.total;
  });
  
  const {
    data: eventsData,
    loading: loadingEventsCount,
    error: errorEventsCount,
    execute: fetchEventsCount
  } = useApiRequest(async () => {
    const response = await eventsService.getAllEvents(undefined, 1, 1);
    return response.total;
  });
  
  const {
    data: requestsData,
    loading: loadingRequestsCount,
    error: errorRequestsCount,
    execute: fetchRequestsCount
  } = useApiRequest(async () => {
    const response = await musicianRequestsService.getAllRequests(undefined, 1, 1);
    return response.total;
  });
  
  const {
    data: imagesData,
    loading: loadingImagesCount,
    error: errorImagesCount,
    execute: fetchImagesCount
  } = useApiRequest(async () => {
    const images = await imagesService.getAllImages();
    return images.length;
  });

  // Recientes y roles
  const {
    data: usersDataRecent,
    loading: loadingRecentUsers,
    execute: fetchRecentUsers
  } = useApiRequest(mobileUsersService.getAllUsers);
  const {
    data: eventsDataRecent,
    loading: loadingRecentEvents,
    execute: fetchRecentEvents
  } = useApiRequest(eventsService.getAllEvents);
  const {
    data: requestsDataRecent,
    loading: loadingRecentRequests,
    execute: fetchRecentRequests
  } = useApiRequest(musicianRequestsService.getAllRequests);

  useEffect(() => {
    fetchAllData();
    intervalRef.current = setInterval(fetchAllData, 600000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchAllData = () => {
    fetchUsersCount();
    fetchEventsCount();
    fetchRequestsCount();
    fetchImagesCount();
    fetchRecentUsers();
    fetchRecentEvents();
    fetchRecentRequests();
  };

  // Procesar datos recientes y roles
  const recentUsers = usersDataRecent?.users ? usersDataRecent.users.slice(-3).reverse() : [];
  const recentEvents = eventsDataRecent?.events ? eventsDataRecent.events.slice(-3).reverse() : [];
  const recentRequests = requestsDataRecent?.requests ? requestsDataRecent.requests.slice(-3).reverse() : [];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleMarkAsRead = (id: string) => {
    // Implementar lógica para marcar como leído
    console.log('Mark as read:', id);
  };

  const handleDismissNotification = (id: string) => {
    // Implementar lógica para descartar notificación
    console.log('Dismiss notification:', id);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'approved':
        return <CheckCircleIcon sx={{ color: '#00e676' }} />;
      case 'pendiente':
      case 'pending':
        return <PendingIcon sx={{ color: '#ff9800' }} />;
      case 'error':
      case 'rejected':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      default:
        return <StarIcon sx={{ color: '#ffd700' }} />;
    }
  };

  const isLoading = loadingUsersCount || loadingEventsCount || loadingRequestsCount || loadingImagesCount;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%' }}>
      {/* Header Mejorado */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
            Dashboard
          </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontWeight: 400, opacity: 0.8 }}
            >
              Bienvenido de vuelta, {user?.name || user?.email || 'Usuario'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1, opacity: 0.6 }}
            >
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
          </Typography>
        </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Actualizar datos">
              <IconButton
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                sx={{
                  background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
        
        <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/users')}
              sx={{
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(127, 95, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(127, 95, 255, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Nuevo Usuario
        </Button>
          </Box>
        </Box>
      </Box>

      {/* Métricas Principales */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {metricCards.map((card, index) => {
          const counts = [usersData, eventsData, requestsData, imagesData];
          const loadings = [loadingUsersCount, loadingEventsCount, loadingRequestsCount, loadingImagesCount];
          const errors = [errorUsersCount, errorEventsCount, errorRequestsCount, errorImagesCount];
          
          return (
            <Card
              key={index}
              onClick={() => handleCardClick(card.path)}
              sx={{
                cursor: 'pointer',
                background: isDark 
                  ? 'rgba(31, 38, 135, 0.15)'
                  : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 60px ${card.color}40`,
                  '& .metric-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: card.gradient,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    className="metric-icon"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: card.gradient,
          display: 'flex',
          alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 8px 24px ${card.color}40`,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip
                    label={card.trend}
                    size="small"
                    icon={card.trendPositive ? <TrendingUpIcon /> : <TrendingUpIcon />}
                    sx={{
                      background: card.trendPositive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                      color: card.trendPositive ? '#00e676' : '#ff9800',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: card.color }}>
                  {errors[index] ? (
                    <Alert severity="error" sx={{ fontSize: '0.75rem' }}>
                      {String(errors[index])}
                    </Alert>
                  ) : loadings[index] ? (
                    <CircularProgress size={32} sx={{ color: card.color }} />
                  ) : (
                    counts[index] || 0
                  )}
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  {card.label}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Contenido Principal */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Actividad Reciente */}
        <Box sx={{ flex: { lg: 2 } }}>
        <Card
          sx={{
            background: isDark 
              ? 'rgba(31, 38, 135, 0.15)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 4,
              height: '100%',
          }}
        >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Actividad Reciente
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/users')}
                  sx={{ 
                    color: '#7f5fff',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(127, 95, 255, 0.1)',
                    }
                  }}
              >
                  Ver todo
              </Button>
            </Box>
            
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip 
                  label="Usuarios" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(127, 95, 255, 0.1)', 
                    color: '#7f5fff',
                    fontWeight: 600 
                  }} 
                />
                <Chip 
                  label="Eventos" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(0, 224, 255, 0.1)', 
                    color: '#00e0ff',
                    fontWeight: 600 
                  }} 
                />
                <Chip 
                  label="Solicitudes" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(255, 46, 236, 0.1)', 
                    color: '#ff2eec',
                    fontWeight: 600 
                  }} 
                />
              </Box>
              
              {loadingRecentUsers && loadingRecentEvents && loadingRecentRequests ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
            ) : (
                <List sx={{ p: 0 }}>
                {recentUsers.map((user: any, index: number) => (
                    <ListItem 
                      key={user.userEmail || index}
                      sx={{ 
                        px: 0, 
                        py: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        background: 'rgba(127, 95, 255, 0.05)',
                        '&:hover': {
                          background: 'rgba(127, 95, 255, 0.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {user.name?.charAt(0) || user.userEmail?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {user.name || 'Usuario'} {user.lastName || ''}
                          </Typography>
                        }
                        secondary={
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {user.userEmail || user.email}
                            </Typography>
                            <Chip
                              label={user.roll || 'Usuario'}
                              size="small"
                              sx={{
                                background: 'rgba(127, 95, 255, 0.1)',
                                color: '#7f5fff',
                                fontWeight: 600,
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Typography>
                        }
                      />
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItem>
                ))}

                  {recentEvents.map((event: any, index: number) => (
                    <ListItem 
                      key={event._id || index}
          sx={{
                        px: 0, 
                        py: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        background: 'rgba(0, 224, 255, 0.05)',
                        '&:hover': {
                          background: 'rgba(0, 224, 255, 0.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                            fontSize: '0.875rem',
                            width: 48,
                            height: 48,
                          }}
                        >
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {event.name || event.title || 'Evento'}
                          </Typography>
                        }
                        secondary={
                          <Typography component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {event.date || event.fecha || event.createdAt || 'Sin fecha'}
                            </Typography>
                            <Chip
                              label="Activo"
                              size="small"
                              icon={getStatusIcon('activo')}
                              sx={{
                                background: 'rgba(0, 224, 255, 0.1)',
                                color: '#00e0ff',
                                fontWeight: 600,
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Typography>
                        }
                      />
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
        </Box>

        {/* Notificaciones */}
        <Box sx={{ flex: { lg: 1 } }}>
          <DashboardNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismissNotification}
          />
        </Box>
      </Box>

      {/* Gráficos y Estadísticas */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
        gap: 3, 
        mt: 3 
      }}>
        <DashboardCharts
          data={chartData}
          title="Distribución de Roles"
          subtitle="Usuarios por tipo de rol"
          type="pie"
          isLoading={loadingRecentUsers}
        />
        
        <DashboardCharts
          data={activityData}
          title="Actividad Semanal"
          subtitle="Actividad de los últimos 7 días"
          type="line"
          isLoading={false}
        />
      </Box>

      {/* Solicitudes Recientes */}
      <Box sx={{ mt: 3 }}>
        <Card
          sx={{
            background: isDark 
              ? 'rgba(31, 38, 135, 0.15)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Solicitudes Recientes
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/musician-requests')}
                sx={{ color: '#ff2eec' }}
              >
                Ver todas
              </Button>
            </Box>
            
            {loadingRecentRequests ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2 
              }}>
                {recentRequests.map((request: any, index: number) => (
                  <Card
                    key={request._id || index}
                    sx={{
                      background: 'rgba(255, 46, 236, 0.05)',
                      border: '1px solid rgba(255, 46, 236, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255, 46, 236, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
                            fontSize: '0.875rem',
                            width: 32,
                            height: 32,
                          }}
                        >
                          <MusicIcon />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {request.userId || 'Solicitante'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {request.status || 'Pendiente'}
            </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(request.status)}
                        <Typography variant="caption" color="text.secondary">
                          Hace 2 horas
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 