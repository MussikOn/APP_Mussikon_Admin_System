import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useAnalyticsSimple } from '../../hooks/useAnalyticsSimple';
import { analyticsService } from '../../services/analyticsService';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Event as EventIcon,
  LibraryMusic as MusicIcon
} from '@mui/icons-material';
import ModernCard from '../../components/ui/ModernCard';
import ModernButton from '../../components/ui/ModernButton';
import ResponsiveLayout from '../../components/ResponsiveLayout';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import PerformanceMetrics from '../../components/analytics/PerformanceMetrics';
import RecentActivityFeed from '../../components/analytics/RecentActivityFeed';
import { responsiveTypography } from '../../theme/breakpoints';

const DashboardEnhanced: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Hook de analytics
  const { systemStats, loading, error, refreshData } = useAnalyticsSimple();

  const handleRefresh = async () => {
    await refreshData();
  };

  // Procesar datos para gráficos
  const userRoleData = systemStats ? 
    analyticsService.generateUserRoleDistribution(systemStats.users.byRole) : [];
  
  const eventStatusData = systemStats ? 
    analyticsService.generateEventStatusData(systemStats.events.byStatus) : [];

  const requestStatusData = systemStats ? 
    Object.entries(systemStats.requests.byStatus).map(([status, count], index) => ({
      label: status === 'pending' ? 'Pendientes' : 
             status === 'approved' ? 'Aprobadas' : 
             status === 'rejected' ? 'Rechazadas' : status,
      value: count,
      color: ['#ff9800', '#00e676', '#f44336', '#7f5fff'][index] || '#7f5fff'
    })) : [];

  // Generar actividades recientes simuladas
  const recentActivities = systemStats ? [
    {
      id: '1',
      type: 'user' as const,
      title: 'Nuevo usuario registrado',
      description: `Se registró un nuevo usuario en la plataforma`,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      icon: <PersonAddIcon />,
      color: '#7f5fff'
    },
    {
      id: '2',
      type: 'event' as const,
      title: 'Evento creado',
      description: 'Se creó un nuevo evento musical',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'Activo',
      icon: <EventIcon />,
      color: '#00e0ff'
    },
    {
      id: '3',
      type: 'request' as const,
      title: 'Solicitud de músico',
      description: 'Nueva solicitud de músico pendiente de revisión',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'Pendiente',
      icon: <MusicIcon />,
      color: '#ff2eec'
    }
  ] : [];

  // Métricas de rendimiento
  const performanceMetrics = systemStats ? 
    analyticsService.calculatePerformanceMetrics(systemStats, {
      timestamp: systemStats.system.timestamp,
      memory: systemStats.system.memory,
      cpu: { user: 0, system: 0 },
      uptime: systemStats.system.uptime,
      platform: 'web',
      nodeVersion: '18.0.0',
      pid: 1234
    }) : { systemHealth: 0, dataGrowth: 0, userActivity: 0, eventSuccess: 0 };

  // Datos de tendencia semanal
  const weeklyTrendData = [
    { label: 'Lun', value: 45, color: '#7f5fff' },
    { label: 'Mar', value: 52, color: '#7f5fff' },
    { label: 'Mié', value: 38, color: '#7f5fff' },
    { label: 'Jue', value: 61, color: '#7f5fff' },
    { label: 'Vie', value: 55, color: '#7f5fff' },
    { label: 'Sáb', value: 67, color: '#7f5fff' },
    { label: 'Dom', value: 43, color: '#7f5fff' }
  ];

  if (loading) {
    return (
      <ResponsiveLayout spacing="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} sx={{ color: 'var(--color-primary)' }} />
          <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)' }}>
            ► Cargando Dashboard ◄
          </Typography>
        </Box>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout spacing="md">
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <IconButton color="inherit" size="small" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DashboardIcon sx={{ color: 'var(--color-primary)', fontSize: 32 }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: responsiveTypography.h3,
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                ◆ DASHBOARD ◆
              </Typography>
            </Box>
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
                disabled={loading}
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
          
            <ModernButton
              variant="primary"
              size="lg"
              startIcon={<AddIcon />}
              onClick={() => navigate('/users')}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Nuevo Usuario
            </ModernButton>
          </Box>
        </Box>
      </Box>

      {/* Métricas principales */}
      {systemStats && (
        <ResponsiveGrid type="metrics" gap={3} sx={{ mb: 4 }}>
          <ModernCard
            variant="elevated"
            onClick={() => navigate('/users')}
            sx={{
              cursor: 'pointer',
              background: isDark ? 'rgba(31, 38, 135, 0.15)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(127, 95, 255, 0.3)',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                >
                  <PersonAddIcon />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {systemStats.users.total}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Usuarios Registrados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de usuarios en la plataforma
              </Typography>
            </Box>
          </ModernCard>

          {/* Eventos */}
          <ModernCard
            variant="elevated"
            onClick={() => navigate('/events')}
            sx={{
              cursor: 'pointer',
              background: isDark ? 'rgba(31, 38, 135, 0.15)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 224, 255, 0.3)',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #00e0ff 0%, #7f5fff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                >
                  <EventIcon />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#00e0ff' }}>
                  {systemStats.events.total}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Eventos Totales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eventos programados y en curso
              </Typography>
            </Box>
          </ModernCard>

          {/* Solicitudes */}
          <ModernCard
            variant="elevated"
            onClick={() => navigate('/musician-requests')}
            sx={{
              cursor: 'pointer',
              background: isDark ? 'rgba(31, 38, 135, 0.15)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(255, 46, 236, 0.3)',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #ff2eec 0%, #b993d6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                >
                  <MusicIcon />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#ff2eec' }}>
                  {systemStats.requests.total}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Solicitudes de Músicos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solicitudes pendientes y procesadas
              </Typography>
            </Box>
          </ModernCard>
        </ResponsiveGrid>
      )}

      {/* Gráficos principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {userRoleData.length > 0 && (
          <Grid item xs={12} lg={6}>
            <ModernCard variant="elevated">
              <PieChart
                data={userRoleData}
                title="► Distribución de Usuarios por Rol ◄"
                size={220}
                centerText={systemStats?.users.total.toString()}
              />
            </ModernCard>
          </Grid>
        )}

        {eventStatusData.length > 0 && (
          <Grid item xs={12} lg={6}>
            <ModernCard variant="elevated">
              <BarChart
                data={eventStatusData}
                title="► Estado de Eventos ◄"
                height={300}
                animated={true}
              />
            </ModernCard>
          </Grid>
        )}
      </Grid>

      {/* Segunda fila de gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {requestStatusData.length > 0 && (
          <Grid item xs={12} lg={6}>
            <ModernCard variant="elevated">
              <PieChart
                data={requestStatusData}
                title="► Estado de Solicitudes ◄"
                size={200}
                showLegend={true}
              />
            </ModernCard>
          </Grid>
        )}

        <Grid item xs={12} lg={6}>
          <ModernCard variant="elevated">
            <LineChart
              data={weeklyTrendData}
              title="► Actividad Semanal ◄"
              height={300}
              color="#7f5fff"
              gradient={true}
              animated={true}
            />
          </ModernCard>
        </Grid>
      </Grid>

      {/* Métricas de rendimiento y actividad reciente */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ModernCard variant="elevated">
            <PerformanceMetrics metrics={performanceMetrics} />
          </ModernCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <RecentActivityFeed activities={recentActivities} maxItems={8} />
        </Grid>
      </Grid>
    </ResponsiveLayout>
  );
};

export default DashboardEnhanced;
