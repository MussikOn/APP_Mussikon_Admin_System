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
            '#2196F3', // Admin
            '#4CAF50', // User
            '#FF9800', // Musician
            '#9C27B0'  // Other
          ]
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
            {dashboard && (
              <>
                {/* Métricas principales */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Eventos"
                      value={dashboard.events.totalEvents}
                      subtitle="Eventos en el período"
                      color="primary"
                      icon={<EventIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Solicitudes"
                      value={dashboard.requests.totalRequests}
                      subtitle="Solicitudes en el período"
                      color="secondary"
                      icon={<AssignmentIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Usuarios"
                      value={dashboard.users.totalUsers}
                      subtitle="Usuarios registrados"
                      color="success"
                      icon={<PeopleIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Ingresos Totales"
                      value={`$${dashboard.platform.totalRevenue.toLocaleString()}`}
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
                      data={prepareEventChartData()!}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Solicitudes por Estado"
                      data={prepareRequestChartData()!}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart
                      title="Tendencias de Eventos y Solicitudes"
                      data={prepareTrendsChartData()!}
                      height={400}
                    />
                  </Grid>
                </Grid>
              </>
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
                      value={eventAnalytics.totalEvents}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Presupuesto Promedio"
                      value={`$${eventAnalytics.averageBudget.toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Completitud"
                      value={`${(eventAnalytics.completionRate * 100).toFixed(1)}%`}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Cancelación"
                      value={`${(eventAnalytics.cancellationRate * 100).toFixed(1)}%`}
                      color="error"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Eventos por Estado"
                      data={prepareEventChartData()!}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <BarChart
                      title="Eventos por Tipo"
                      data={{
                        labels: Object.keys(eventAnalytics.eventsByType),
                        datasets: [{
                          label: 'Eventos por Tipo',
                          data: Object.values(eventAnalytics.eventsByType),
                          backgroundColor: '#2196F3'
                        }]
                      }}
                    />
                  </Grid>
                </Grid>
              </>
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
                      value={requestAnalytics.totalRequests}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Presupuesto Promedio"
                      value={`$${requestAnalytics.averageBudget.toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Aceptación"
                      value={`${(requestAnalytics.acceptanceRate * 100).toFixed(1)}%`}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tiempo de Respuesta"
                      value={`${requestAnalytics.averageResponseTime.toFixed(1)} días`}
                      color="info"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Solicitudes por Estado"
                      data={prepareRequestChartData()!}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <BarChart
                      title="Solicitudes por Tipo"
                      data={{
                        labels: Object.keys(requestAnalytics.requestsByType),
                        datasets: [{
                          label: 'Solicitudes por Tipo',
                          data: Object.values(requestAnalytics.requestsByType),
                          backgroundColor: '#4CAF50'
                        }]
                      }}
                    />
                  </Grid>
                </Grid>
              </>
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
                      value={userAnalytics.totalUsers}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Usuarios Activos"
                      value={userAnalytics.activeUsers}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Nuevos este Mes"
                      value={userAnalytics.newUsersThisMonth}
                      color="info"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Crecimiento"
                      value={`${(userAnalytics.userGrowthRate * 100).toFixed(1)}%`}
                      color="warning"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DoughnutChart
                      title="Usuarios por Rol"
                      data={prepareUserChartData()!}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <BarChart
                      title="Usuarios por Mes"
                      data={{
                        labels: Object.keys(userAnalytics.usersByMonth),
                        datasets: [{
                          label: 'Nuevos Usuarios',
                          data: Object.values(userAnalytics.usersByMonth),
                          backgroundColor: '#9C27B0'
                        }]
                      }}
                    />
                  </Grid>
                </Grid>
              </>
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
                      value={`$${platformAnalytics.totalRevenue.toLocaleString()}`}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Valor Promedio"
                      value={`$${platformAnalytics.averageEventValue.toLocaleString()}`}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Eventos por Usuario"
                      value={platformAnalytics.userEngagement.eventsPerUser.toFixed(1)}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Tasa de Éxito"
                      value={`${(platformAnalytics.performance.successRate * 100).toFixed(1)}%`}
                      color="info"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <DataTable
                      title="Tipos de Eventos Populares"
                      data={platformAnalytics.topEventTypes}
                      columns={[
                        { key: 'type', label: 'Tipo' },
                        { key: 'count', label: 'Cantidad' },
                        { 
                          key: 'revenue', 
                          label: 'Ingresos',
                          render: (value) => `$${value.toLocaleString()}`
                        }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <DataTable
                      title="Ubicaciones Top"
                      data={platformAnalytics.topLocations}
                      columns={[
                        { key: 'location', label: 'Ubicación' },
                        { key: 'count', label: 'Eventos' },
                        { 
                          key: 'revenue', 
                          label: 'Ingresos',
                          render: (value) => `$${value.toLocaleString()}`
                        }
                      ]}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );

      case 5: // Tendencias
        return (
          <Box>
            {trends && (
              <LineChart
                title="Tendencias de Eventos y Solicitudes"
                data={prepareTrendsChartData()!}
                height={500}
              />
            )}
          </Box>
        );

      case 6: // Ubicaciones
        return (
          <Box>
            {locationPerformance && (
              <DataTable
                title="Rendimiento por Ubicación"
                data={locationPerformance}
                columns={[
                  { key: 'location', label: 'Ubicación' },
                  { key: 'totalEvents', label: 'Eventos' },
                  { key: 'totalRequests', label: 'Solicitudes' },
                  { 
                    key: 'totalRevenue', 
                    label: 'Ingresos',
                    render: (value) => `$${value.toLocaleString()}`
                  },
                  { 
                    key: 'completionRate', 
                    label: 'Tasa Completitud',
                    render: (value) => `${(value * 100).toFixed(1)}%`
                  },
                  { 
                    key: 'acceptanceRate', 
                    label: 'Tasa Aceptación',
                    render: (value) => `${(value * 100).toFixed(1)}%`
                  }
                ]}
              />
            )}
          </Box>
        );

      case 7: // Top Usuarios
        return (
          <Box>
            {topUsers && (
              <DataTable
                title="Usuarios Más Activos"
                data={topUsers}
                columns={[
                  { 
                    key: 'user', 
                    label: 'Usuario',
                    render: (value) => `${value.name} (${value.email})`
                  },
                  { key: 'eventsCreated', label: 'Eventos Creados' },
                  { key: 'requestsCreated', label: 'Solicitudes Creadas' },
                  { key: 'eventsCompleted', label: 'Eventos Completados' },
                  { key: 'requestsAccepted', label: 'Solicitudes Aceptadas' },
                  { 
                    key: 'totalRevenue', 
                    label: 'Ingresos Totales',
                    render: (value) => `$${value.toLocaleString()}`
                  }
                ]}
              />
            )}
          </Box>
        );

      default:
        return null;
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