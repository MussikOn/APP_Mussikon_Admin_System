// Módulo de Analytics - MussikOn Admin System
// Dashboard completo de analytics con gráficos interactivos y filtros avanzados

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
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

// Importar componentes de analytics
import {
  LineChart,
  BarChart,
  DoughnutChart,
  MetricCard,
  DataTable,
  AnalyticsFilters
} from '../../components/analytics/AnalyticsCharts';

// Importar hook de analytics
import useAnalytics from '../../hooks/useAnalytics';

// Importar estilos
import { buttonStyles, chipStyles } from '../../theme/buttonStyles';
import { ResponsiveLayout, ResponsiveGrid } from '../../components/ResponsiveLayout';
import { responsiveTypography } from '../../theme/breakpoints';

// Tipos para las pestañas
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Componente principal de Analytics
const Analytics: React.FC = () => {
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para menú de exportación
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [exportType, setExportType] = useState<string>('events');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  // Hook de analytics
  const {
    loading,
    error,
    dashboard,
    eventAnalytics,
    requestAnalytics,
    userAnalytics,
    platformAnalytics,
    trends,
    locationPerformance,
    topUsers,
    filters,
    setFilters,
    refreshDashboard,
    refreshEventAnalytics,
    refreshRequestAnalytics,
    refreshUserAnalytics,
    refreshPlatformAnalytics,
    refreshTrends,
    refreshLocationPerformance,
    refreshTopUsers,
    exportReport,
    exportAdminReport
  } = useAnalytics();

  // Manejar cambio de pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar menú de exportación
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async () => {
    try {
      await exportReport(exportType as any, exportFormat);
      handleExportMenuClose();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Cargar datos específicos según la pestaña
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
      case 5: // Tendencias
        refreshTrends();
        break;
      case 6: // Ubicaciones
        refreshLocationPerformance();
        break;
      case 7: // Top Usuarios
        refreshTopUsers();
        break;
    }
  }, [tabValue, filters]);

  // Preparar datos para gráficos
  const prepareEventChartData = () => {
    if (!eventAnalytics) return null;

    return {
      labels: Object.keys(eventAnalytics.eventsByStatus),
      datasets: [
        {
          label: 'Eventos por Estado',
          data: Object.values(eventAnalytics.eventsByStatus),
          backgroundColor: [
            '#4CAF50', // Success
            '#FF9800', // Warning
            '#F44336', // Error
            '#2196F3', // Info
            '#9C27B0'  // Purple
          ]
        }
      ]
    };
  };

  const prepareRequestChartData = () => {
    if (!requestAnalytics) return null;

    return {
      labels: Object.keys(requestAnalytics.requestsByStatus),
      datasets: [
        {
          label: 'Solicitudes por Estado',
          data: Object.values(requestAnalytics.requestsByStatus),
          backgroundColor: [
            '#4CAF50', // Success
            '#FF9800', // Warning
            '#F44336', // Error
            '#2196F3', // Info
            '#9C27B0'  // Purple
          ]
        }
      ]
    };
  };

  const prepareTrendsChartData = () => {
    if (!trends) return null;

    return {
      labels: trends.eventTrends.map(t => t.month),
      datasets: [
        {
          label: 'Eventos',
          data: trends.eventTrends.map(t => t.count),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4
        },
        {
          label: 'Solicitudes',
          data: trends.requestTrends.map(t => t.count),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const prepareUserChartData = () => {
    if (!userAnalytics) return null;

    return {
      labels: Object.keys(userAnalytics.usersByRole),
      datasets: [
        {
          label: 'Usuarios por Rol',
          data: Object.values(userAnalytics.usersByRole),
          backgroundColor: [
            '#2196F3', // Blue
            '#4CAF50', // Green
            '#FF9800', // Orange
            '#9C27B0', // Purple
            '#F44336'  // Red
          ]
        }
      ]
    };
  };

  // Nuevas funciones de preparación de datos
  const prepareEventTypeChartData = () => {
    if (!eventAnalytics) return null;

    return {
      labels: Object.keys(eventAnalytics.eventsByType),
      datasets: [
        {
          label: 'Eventos por Tipo',
          data: Object.values(eventAnalytics.eventsByType),
          backgroundColor: [
            '#2196F3', // Blue
            '#4CAF50', // Green
            '#FF9800', // Orange
            '#9C27B0', // Purple
            '#F44336'  // Red
          ]
        }
      ]
    };
  };

  const prepareEventMonthlyChartData = () => {
    if (!eventAnalytics) return null;

    return {
      labels: Object.keys(eventAnalytics.eventsByMonth),
      datasets: [
        {
          label: 'Eventos por Mes',
          data: Object.values(eventAnalytics.eventsByMonth),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const prepareRequestTypeChartData = () => {
    if (!requestAnalytics) return null;

    return {
      labels: Object.keys(requestAnalytics.requestsByType),
      datasets: [
        {
          label: 'Solicitudes por Tipo',
          data: Object.values(requestAnalytics.requestsByType),
          backgroundColor: [
            '#4CAF50', // Green
            '#2196F3', // Blue
            '#FF9800', // Orange
            '#9C27B0', // Purple
            '#F44336'  // Red
          ]
        }
      ]
    };
  };

  const prepareRequestMonthlyChartData = () => {
    if (!requestAnalytics) return null;

    return {
      labels: Object.keys(requestAnalytics.requestsByMonth),
      datasets: [
        {
          label: 'Solicitudes por Mes',
          data: Object.values(requestAnalytics.requestsByMonth),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const prepareUserMonthlyChartData = () => {
    if (!userAnalytics) return null;

    return {
      labels: Object.keys(userAnalytics.usersByMonth),
      datasets: [
        {
          label: 'Usuarios por Mes',
          data: Object.values(userAnalytics.usersByMonth),
          backgroundColor: [
            '#9C27B0', // Purple
            '#2196F3', // Blue
            '#4CAF50', // Green
            '#FF9800', // Orange
            '#F44336'  // Red
          ]
        }
      ]
    };
  };

  const prepareTopEventTypesChartData = () => {
    if (!platformAnalytics) return null;

    return {
      labels: platformAnalytics.topEventTypes.map(item => item.type),
      datasets: [
        {
          label: 'Cantidad de Eventos',
          data: platformAnalytics.topEventTypes.map(item => item.count),
          backgroundColor: '#2196F3'
        }
      ]
    };
  };

  const prepareTopLocationsChartData = () => {
    if (!platformAnalytics) return null;

    return {
      labels: platformAnalytics.topLocations.map(item => item.location),
      datasets: [
        {
          label: 'Eventos por Ubicación',
          data: platformAnalytics.topLocations.map(item => item.count),
          backgroundColor: '#4CAF50'
        }
      ]
    };
  };

  const prepareEventTrendsChartData = () => {
    if (!trends) return null;

    return {
      labels: trends.eventTrends.map(t => t.month),
      datasets: [
        {
          label: 'Eventos',
          data: trends.eventTrends.map(t => t.count),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4
        },
        {
          label: 'Ingresos',
          data: trends.eventTrends.map(t => t.revenue),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const prepareRequestTrendsChartData = () => {
    if (!trends) return null;

    return {
      labels: trends.requestTrends.map(t => t.month),
      datasets: [
        {
          label: 'Solicitudes',
          data: trends.requestTrends.map(t => t.count),
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4
        },
        {
          label: 'Tasa de Aceptación',
          data: trends.requestTrends.map(t => t.acceptanceRate * 100),
          borderColor: '#9C27B0',
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const prepareUserTrendsChartData = () => {
    if (!trends) return null;

    return {
      labels: trends.userTrends.map(t => t.month),
      datasets: [
        {
          label: 'Nuevos Usuarios',
          data: trends.userTrends.map(t => t.newUsers),
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4
        },
        {
          label: 'Usuarios Activos',
          data: trends.userTrends.map(t => t.activeUsers),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const prepareLocationChartData = () => {
    if (!locationPerformance) return null;

    return {
      labels: locationPerformance.map(item => item.location),
      datasets: [
        {
          label: 'Eventos',
          data: locationPerformance.map(item => item.totalEvents),
          backgroundColor: '#2196F3'
        },
        {
          label: 'Solicitudes',
          data: locationPerformance.map(item => item.totalRequests),
          backgroundColor: '#4CAF50'
        }
      ]
    };
  };

  const prepareTopUsersChartData = () => {
    if (!topUsers) return null;

    return {
      labels: topUsers.map(item => item.user.name),
      datasets: [
        {
          label: 'Eventos Creados',
          data: topUsers.map(item => item.eventsCreated),
          backgroundColor: '#2196F3'
        },
        {
          label: 'Solicitudes Creadas',
          data: topUsers.map(item => item.requestsCreated),
          backgroundColor: '#4CAF50'
        }
      ]
    };
  };

  // Renderizar contenido según la pestaña
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Dashboard
        return (
          <Box>
            {dashboard && dashboard.events && dashboard.requests && dashboard.users && dashboard.platform && (
              <>
                {/* Métricas principales */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Eventos"
                      value={dashboard.events?.totalEvents || 0}
                      subtitle="Eventos en el período"
                      color="primary"
                      icon={<EventIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Solicitudes"
                      value={dashboard.requests?.totalRequests || 0}
                      subtitle="Solicitudes en el período"
                      color="secondary"
                      icon={<AssignmentIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Usuarios"
                      value={dashboard.users?.totalUsers || 0}
                      subtitle="Usuarios registrados"
                      color="success"
                      icon={<PeopleIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Ingresos Totales"
                      value={`$${(dashboard.platform?.totalRevenue || 0).toLocaleString()}`}
                      subtitle="Ingresos de la plataforma"
                      color="info"
                      icon={<TrendingUpIcon />}
                    />
                  </Grid>
                </Grid>

                {/* Gráficos del dashboard */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Eventos por Estado"
                      data={prepareEventChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Solicitudes por Estado"
                      data={prepareRequestChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Tendencias de Eventos y Solicitudes"
                      data={prepareTrendsChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {(!dashboard || !dashboard.events || !dashboard.requests || !dashboard.users || !dashboard.platform) && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos del dashboard...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 1: // Eventos
        return (
          <Box>
            {eventAnalytics && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Eventos"
                      value={eventAnalytics.totalEvents || 0}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Presupuesto Promedio"
                      value={`$${(eventAnalytics.averageBudget || 0).toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Completitud"
                      value={`${((eventAnalytics.completionRate || 0) * 100).toFixed(1)}%`}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Cancelación"
                      value={`${((eventAnalytics.cancellationRate || 0) * 100).toFixed(1)}%`}
                      color="error"
                    />
                  </Grid>
                </Grid>

                {/* Gráficos de eventos */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Eventos por Estado"
                      data={prepareEventChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Eventos por Tipo"
                      data={prepareEventTypeChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Eventos por Mes"
                      data={prepareEventMonthlyChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {!eventAnalytics && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de eventos...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2: // Solicitudes
        return (
          <Box>
            {requestAnalytics && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Solicitudes"
                      value={requestAnalytics.totalRequests || 0}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Presupuesto Promedio"
                      value={`$${(requestAnalytics.averageBudget || 0).toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Aceptación"
                      value={`${((requestAnalytics.acceptanceRate || 0) * 100).toFixed(1)}%`}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tiempo Promedio de Respuesta"
                      value={`${(requestAnalytics.averageResponseTime || 0).toFixed(1)}h`}
                      color="info"
                    />
                  </Grid>
                </Grid>

                {/* Gráficos de solicitudes */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Solicitudes por Estado"
                      data={prepareRequestChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Solicitudes por Tipo"
                      data={prepareRequestTypeChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Solicitudes por Mes"
                      data={prepareRequestMonthlyChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {!requestAnalytics && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de solicitudes...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3: // Usuarios
        return (
          <Box>
            {userAnalytics && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Usuarios"
                      value={userAnalytics.totalUsers || 0}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Usuarios Activos"
                      value={userAnalytics.activeUsers || 0}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Nuevos este Mes"
                      value={userAnalytics.newUsersThisMonth || 0}
                      color="info"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Crecimiento"
                      value={`${((userAnalytics.userGrowthRate || 0) * 100).toFixed(1)}%`}
                      color="secondary"
                    />
                  </Grid>
                </Grid>

                {/* Gráficos de usuarios */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Usuarios por Rol"
                      data={prepareUserChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Usuarios por Mes"
                      data={prepareUserMonthlyChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {!userAnalytics && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de usuarios...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 4: // Plataforma
        return (
          <Box>
            {platformAnalytics && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Ingresos Totales"
                      value={`$${(platformAnalytics.totalRevenue || 0).toLocaleString()}`}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Valor Promedio por Evento"
                      value={`$${(platformAnalytics.averageEventValue || 0).toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Éxito"
                      value={`${((platformAnalytics.performance?.successRate || 0) * 100).toFixed(1)}%`}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tiempo de Respuesta Promedio"
                      value={`${(platformAnalytics.performance?.averageResponseTime || 0).toFixed(1)}ms`}
                      color="info"
                    />
                  </Grid>
                </Grid>

                {/* Gráficos de plataforma */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <BarChart
                      title="Top Tipos de Eventos"
                      data={prepareTopEventTypesChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <BarChart
                      title="Top Ubicaciones"
                      data={prepareTopLocationsChartData() || { labels: [], datasets: [] }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {!platformAnalytics && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de plataforma...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 5: // Tendencias
        return (
          <Box>
            {trends && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LineChart
                      title="Tendencias de Eventos"
                      data={prepareEventTrendsChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Tendencias de Solicitudes"
                      data={prepareRequestTrendsChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Tendencias de Usuarios"
                      data={prepareUserTrendsChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {!trends && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de tendencias...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 6: // Ubicaciones
        return (
          <Box>
            {locationPerformance && locationPerformance.length > 0 && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <BarChart
                      title="Rendimiento por Ubicación"
                      data={prepareLocationChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {(!locationPerformance || locationPerformance.length === 0) && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de ubicaciones...
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 7: // Top Usuarios
        return (
          <Box>
            {topUsers && topUsers.length > 0 && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <BarChart
                      title="Top Usuarios por Rendimiento"
                      data={prepareTopUsersChartData() || { labels: [], datasets: [] }}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {(!topUsers || topUsers.length === 0) && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Cargando datos de top usuarios...
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
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
            Analytics y Reportes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={refreshDashboard}
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

        {/* Filtros */}
        <AnalyticsFilters
          filters={filters}
          onFiltersChange={setFilters}
          eventTypes={['wedding', 'corporate', 'private', 'concert', 'other']}
          statuses={['pending', 'active', 'completed', 'cancelled']}
          userRoles={['admin', 'user', 'musician', 'organizer']}
          locations={['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao']}
        />
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Dashboard" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Eventos" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Solicitudes" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Usuarios" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Plataforma" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Tendencias" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Ubicaciones" icon={<LocationIcon />} iconPosition="start" />
          <Tab label="Top Usuarios" icon={<StarIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Contenido de las pestañas */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderTabContent()
      )}

      {/* Menú de exportación */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportMenuClose}
      >
        <MenuItem>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Reporte</InputLabel>
            <Select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              label="Tipo de Reporte"
            >
              <MenuItem value="events">Eventos</MenuItem>
              <MenuItem value="requests">Solicitudes</MenuItem>
              <MenuItem value="users">Usuarios</MenuItem>
              <MenuItem value="platform">Plataforma</MenuItem>
              <MenuItem value="trends">Tendencias</MenuItem>
              <MenuItem value="location">Ubicaciones</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem>
          <FormControl fullWidth size="small">
            <InputLabel>Formato</InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              label="Formato"
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <DownloadIcon sx={{ mr: 1 }} />
          Descargar Reporte
        </MenuItem>
      </Menu>
    </ResponsiveLayout>
  );
};

export default Analytics; 