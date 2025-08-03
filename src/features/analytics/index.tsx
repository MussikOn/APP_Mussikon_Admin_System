// Módulo de Analytics - MussikOn Admin System
// Sistema completo de análisis y reportes con datos mock

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Computer as ComputerIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Importar componentes de analytics
import {
  MetricCard,
  LineChart,
  BarChart,
  DoughnutChart
} from '../../components/analytics/AnalyticsCharts';

// Importar hook de analytics
import { useAnalytics } from '../../hooks/useAnalytics';

// Importar estilos
import { buttonStyles } from '../../theme/buttonStyles';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { responsiveTypography } from '../../theme/breakpoints';

// Componente principal de Analytics
const Analytics: React.FC = () => {
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para menú de exportación
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  // Hook de analytics
  const {
    dashboard,
    eventAnalytics,
    requestAnalytics,
    userAnalytics,
    platformAnalytics,
    loading,
    error,
    usingMockData,
    refreshDashboard,
    refreshEventAnalytics,
    refreshRequestAnalytics,
    refreshUserAnalytics,
    refreshPlatformAnalytics,
    exportReport
  } = useAnalytics();

  // Cargar datos según la pestaña
  useEffect(() => {
    switch (tabValue) {
      case 0: // Dashboard
        refreshDashboard();
        break;
      case 1: // Eventos
        refreshEventAnalytics();
        break;
      case 2: // Solicitudes
        refreshRequestAnalytics();
        break;
      case 3: // Usuarios
        refreshUserAnalytics();
        break;
      case 4: // Plataforma
        refreshPlatformAnalytics();
        break;
    }
  }, [tabValue]);

  // Manejar cambio de pestañas
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar menú de exportación
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  // Manejar exportación
  const handleExport = (format: 'csv' | 'json') => {
    const reportType = tabValue === 0 ? 'events' : 
                      tabValue === 1 ? 'events' : 
                      tabValue === 2 ? 'requests' : 
                      tabValue === 3 ? 'users' : 'platform';
    exportReport(reportType, format);
    handleExportMenuClose();
  };

  // Preparar datos para gráficos
  const prepareEventTypeChartData = () => {
    if (!eventAnalytics?.eventsByType) return { labels: [], data: [] };
    
    const labels = Object.keys(eventAnalytics.eventsByType);
    const data = Object.values(eventAnalytics.eventsByType);
    
    return { labels, data };
  };

  const prepareEventMonthlyChartData = () => {
    if (!eventAnalytics?.eventsByMonth) return { labels: [], data: [] };
    
    const labels = Object.keys(eventAnalytics.eventsByMonth);
    const data = Object.values(eventAnalytics.eventsByMonth);
    
    return { labels, data };
  };

  const prepareRequestStatusChartData = () => {
    if (!requestAnalytics?.requestsByStatus) return { labels: [], data: [] };
    
    const labels = Object.keys(requestAnalytics.requestsByStatus);
    const data = Object.values(requestAnalytics.requestsByStatus);
    
    return { labels, data };
  };

  const prepareUserGrowthChartData = () => {
    if (!userAnalytics?.usersByMonth) return { labels: [], data: [] };
    
    const labels = Object.keys(userAnalytics.usersByMonth);
    const data = Object.values(userAnalytics.usersByMonth);
    
    return { labels, data };
  };

  const preparePlatformUsageChartData = () => {
    if (!platformAnalytics?.topEventTypes) return { labels: [], data: [] };
    
    const labels = platformAnalytics.topEventTypes.map(item => item.type);
    const data = platformAnalytics.topEventTypes.map(item => item.count);
    
    return { labels, data };
  };

  // Renderizar contenido de pestañas
  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando datos: {error}
        </Alert>
      );
    }

    switch (tabValue) {
      case 0: // Dashboard
        return (
          <Box>
            {/* Métricas principales */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total de Eventos"
                  value={dashboard?.events?.totalEvents || 0}
                  icon={<EventIcon />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Solicitudes Activas"
                  value={dashboard?.requests?.totalRequests || 0}
                  icon={<AssignmentIcon />}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Usuarios Registrados"
                  value={dashboard?.users?.totalUsers || 0}
                  icon={<PeopleIcon />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Ingresos Totales"
                  value={`$${(dashboard?.platform?.totalRevenue || 0).toLocaleString()}`}
                  icon={<TrendingUpIcon />}
                  color="info"
                />
              </Grid>
            </Grid>

            {/* Gráficos del dashboard */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LineChart
                  title="Eventos por Mes"
                  data={prepareEventMonthlyChartData()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  title="Tipos de Eventos"
                  data={prepareEventTypeChartData()}
                />
              </Grid>
            </Grid>

            {/* Alertas de datos mock */}
            {usingMockData.dashboard && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📊 Datos de Prueba:</strong> Se están mostrando datos simulados para el dashboard.
              </Alert>
            )}
          </Box>
        );

      case 1: // Eventos
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DoughnutChart
                  title="Distribución por Tipo"
                  data={prepareEventTypeChartData()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  title="Eventos por Mes"
                  data={prepareEventMonthlyChartData()}
                />
              </Grid>
            </Grid>

            {usingMockData.events && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📊 Datos de Prueba:</strong> Se están mostrando datos simulados para eventos.
              </Alert>
            )}
          </Box>
        );

      case 2: // Solicitudes
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DoughnutChart
                  title="Estado de Solicitudes"
                  data={prepareRequestStatusChartData()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LineChart
                  title="Solicitudes por Mes"
                  data={prepareRequestStatusChartData()}
                />
              </Grid>
            </Grid>

            {usingMockData.requests && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📊 Datos de Prueba:</strong> Se están mostrando datos simulados para solicitudes.
              </Alert>
            )}
          </Box>
        );

      case 3: // Usuarios
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LineChart
                  title="Crecimiento de Usuarios"
                  data={prepareUserGrowthChartData()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  title="Usuarios por Mes"
                  data={prepareUserGrowthChartData()}
                />
              </Grid>
            </Grid>

            {usingMockData.users && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📊 Datos de Prueba:</strong> Se están mostrando datos simulados para usuarios.
              </Alert>
            )}
          </Box>
        );

      case 4: // Plataforma
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DoughnutChart
                  title="Uso por Dispositivo"
                  data={preparePlatformUsageChartData()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BarChart
                  title="Uso de Plataforma"
                  data={preparePlatformUsageChartData()}
                />
              </Grid>
            </Grid>

            {usingMockData.platform && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📊 Datos de Prueba:</strong> Se están mostrando datos simulados para plataforma.
              </Alert>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Selecciona una pestaña para ver los datos
            </Typography>
          </Box>
        );
    }
  };

  return (
    <ResponsiveLayout spacing="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: responsiveTypography.h3 }}>
            Analytics
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refreshDashboard();
                refreshEventAnalytics();
                refreshRequestAnalytics();
                refreshUserAnalytics();
                refreshPlatformAnalytics();
              }}
              disabled={loading}
              sx={buttonStyles.secondary}
            >
              Actualizar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportMenuOpen}
              sx={buttonStyles.primary}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Análisis completo de datos y métricas de la plataforma
        </Typography>
      </Box>

      {/* Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Dashboard" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Eventos" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Solicitudes" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Usuarios" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Plataforma" icon={<ComputerIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Contenido de las pestañas */}
      {renderTabContent()}

      {/* Menú de exportación */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
      >
        <MenuItem onClick={() => handleExport('csv')}>Exportar como CSV</MenuItem>
        <MenuItem onClick={() => handleExport('json')}>Exportar como JSON</MenuItem>
      </Menu>
    </ResponsiveLayout>
  );
};

export default Analytics; 