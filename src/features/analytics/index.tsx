import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Event as EventIcon,
  LibraryMusic as LibraryMusicIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { useApiRequest } from '../../hooks/useApiRequest';
import { analyticsService, type AnalyticsFilters } from '../../services/searchService';

const Analytics: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'month',
    groupBy: 'day'
  });

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['dashboard', 'events', 'users']);

  // Hooks para diferentes tipos de analytics - Bind del contexto this
  const dashboardRequest = useApiRequest(analyticsService.getDashboardAnalytics.bind(analyticsService));
  const eventsRequest = useApiRequest(analyticsService.getEventsAnalytics.bind(analyticsService));
  const requestsRequest = useApiRequest(analyticsService.getRequestsAnalytics.bind(analyticsService));
  const usersRequest = useApiRequest(analyticsService.getUsersAnalytics.bind(analyticsService));
  const platformRequest = useApiRequest(analyticsService.getPlatformAnalytics.bind(analyticsService));
  const trendsRequest = useApiRequest(analyticsService.getTrendsAnalytics.bind(analyticsService));

  // Función para cargar datos de analytics
  const loadAnalyticsData = async () => {
    console.log('📊 Iniciando carga de datos de analytics con filtros:', filters);
    
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const promises = [];
      
      if (selectedMetrics.includes('dashboard')) {
        promises.push(dashboardRequest.execute(filters).catch(error => {
          console.warn('📊 Error en dashboard analytics, usando datos de respaldo:', error);
          return null;
        }));
      }
      if (selectedMetrics.includes('events')) {
        promises.push(eventsRequest.execute(filters).catch(error => {
          console.warn('📊 Error en events analytics, usando datos de respaldo:', error);
          return null;
        }));
      }
      if (selectedMetrics.includes('requests')) {
        promises.push(requestsRequest.execute(filters).catch(error => {
          console.warn('📊 Error en requests analytics, usando datos de respaldo:', error);
          return null;
        }));
      }
      if (selectedMetrics.includes('users')) {
        promises.push(usersRequest.execute(filters).catch(error => {
          console.warn('📊 Error en users analytics, usando datos de respaldo:', error);
          return null;
        }));
      }
      if (selectedMetrics.includes('platform')) {
        promises.push(platformRequest.execute(filters).catch(error => {
          console.warn('📊 Error en platform analytics, usando datos de respaldo:', error);
          return null;
        }));
      }
      if (selectedMetrics.includes('trends')) {
        promises.push(trendsRequest.execute(filters).catch(error => {
          console.warn('📊 Error en trends analytics, usando datos de respaldo:', error);
          return null;
        }));
      }

      await Promise.allSettled(promises);
      console.log('📊 Carga de datos de analytics completada (con manejo de errores)');
    } catch (error) {
      console.error('📊 Error general cargando datos de analytics:', error);
    }
  };

  // Función para detectar errores específicos
  const hasBlockedByClientError = () => {
    return [eventsRequest.error, dashboardRequest.error, requestsRequest.error, 
            usersRequest.error, platformRequest.error, trendsRequest.error]
      .some(error => error?.includes('ERR_BLOCKED_BY_CLIENT') || error?.includes('Network Error'));
  };

  const hasServerError = () => {
    return [eventsRequest.error, dashboardRequest.error, requestsRequest.error, 
            usersRequest.error, platformRequest.error, trendsRequest.error]
      .some(error => error?.includes('500') || error?.includes('Internal Server Error'));
  };

  // Función para diagnosticar problemas de conectividad
  const runDiagnostics = async () => {
    console.log('🔍 Iniciando diagnóstico de conectividad...');
    
    const endpoints = [
      '/analytics/dashboard',
      '/analytics/events',
      '/analytics/users',
      '/analytics/requests',
      '/analytics/platform',
      '/analytics/trends'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3001${endpoint}?period=month&groupBy=day`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          error: null
        });
        
        console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error: any) {
        results.push({
          endpoint,
          status: null,
          statusText: null,
          error: error.message
        });
        
        console.error(`❌ ${endpoint}: ${error.message}`);
      }
    }

    // Mostrar resumen en consola
    console.log('📊 Resumen de diagnóstico:', results);
    
    // Crear reporte
    const report = results.map(r => 
      `${r.endpoint}: ${r.status ? `${r.status} ${r.statusText}` : `Error: ${r.error}`}`
    ).join('\n');
    
    alert(`🔍 Diagnóstico completado:\n\n${report}\n\nRevisa la consola para más detalles.`);
  };

  // Cargar datos al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadAnalyticsData();
  }, [filters, selectedMetrics]);

  // Función para exportar reportes
  const handleExport = async (type: string) => {
    try {
      console.log('📊 Exportando reporte:', type);
      const blob = await analyticsService.exportAnalytics(filters, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('📊 Reporte exportado exitosamente');
    } catch (error) {
      console.error('📊 Error exportando reporte:', error);
    }
  };

  // Función para refrescar datos
  const handleRefresh = () => {
    console.log('📊 Refrescando datos de analytics');
    loadAnalyticsData();
  };

  // Función para cambiar filtros
  const handleFilterChange = (key: keyof AnalyticsFilters, value: any) => {
    console.log('📊 Cambiando filtro:', key, 'a:', value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función para alternar métricas
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Renderizar métrica individual
  const renderMetric = (title: string, data: any, loading: boolean, error: string | null, icon: React.ReactNode) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
          </Box>
          <Chip 
            label={loading ? 'Cargando...' : error ? 'Error' : 'Activo'} 
            color={loading ? 'warning' : error ? 'error' : 'success'}
            size="small"
          />
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && data && (
          <Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {data.summary?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.summary?.change > 0 ? '+' : ''}{data.summary?.change || 0} ({data.summary?.percentage || 0}%)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Título y controles */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Analytics y Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis detallado del rendimiento de la plataforma
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Refrescar datos">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar reporte">
            <IconButton onClick={() => handleExport('dashboard')} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Diagnosticar problemas de conectividad">
            <IconButton onClick={runDiagnostics} color="warning">
              <BugReportIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerta de datos de respaldo */}
      <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => window.open('mailto:soporte@mussikon.com?subject=Analytics Backend Issue', '_blank')}>
            Reportar
          </Button>
        }
      >
        <Typography variant="body2">
          <strong>Nota:</strong> Algunos datos de analytics están siendo mostrados desde nuestro sistema de respaldo. 
          Esto puede ocurrir cuando el backend no está disponible o los endpoints de analytics no están implementados.
          Los datos mostrados son representativos para demostración.
        </Typography>
      </Alert>

      {/* Alerta de troubleshooting para ERR_BLOCKED_BY_CLIENT */}
      {hasBlockedByClientError() && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.open('https://support.google.com/chrome/answer/2765944', '_blank')}>
              Ayuda
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Problema detectado:</strong> Algunas solicitudes están siendo bloqueadas por el navegador o extensiones.
            <br />
            <strong>Soluciones:</strong>
            <br />
            • Desactiva temporalmente las extensiones del navegador (especialmente ad-blockers)
            <br />
            • Verifica la configuración de firewall corporativo
            <br />
            • Intenta usar modo incógnito o un navegador diferente
            <br />
            • Los datos se muestran desde respaldo mientras se resuelve el problema
          </Typography>
        </Alert>
      )}

      {/* Alerta de error del servidor */}
      {hasServerError() && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.open('mailto:soporte@mussikon.com?subject=Analytics Server Error 500', '_blank')}>
              Reportar Error
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Error del servidor detectado:</strong> El backend está devolviendo errores 500 para algunos endpoints de analytics.
            <br />
            <strong>Posibles causas:</strong>
            <br />
            • Los endpoints de analytics no están implementados en el backend
            <br />
            • Error interno en el servidor
            <br />
            • Problema de configuración del backend
            <br />
            • Los datos se muestran desde respaldo mientras se resuelve el problema
          </Typography>
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterIcon />
            <Typography variant="h6">Filtros</Typography>
          </Box>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
            <TextField
              select
              fullWidth
              label="Período"
              value={filters.period || ''}
              onChange={(e) => handleFilterChange('period', e.target.value)}
            >
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
              <MenuItem value="year">Año</MenuItem>
            </TextField>
            
            <TextField
              select
              fullWidth
              label="Agrupar por"
              value={filters.groupBy || ''}
              onChange={(e) => handleFilterChange('groupBy', e.target.value)}
            >
              <MenuItem value="hour">Hora</MenuItem>
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
            </TextField>
            
            <TextField
              fullWidth
              label="Fecha desde"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Fecha hasta"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Métricas seleccionables */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Métricas disponibles
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <BarChartIcon /> },
            { key: 'events', label: 'Eventos', icon: <EventIcon /> },
            { key: 'requests', label: 'Solicitudes', icon: <LibraryMusicIcon /> },
            { key: 'users', label: 'Usuarios', icon: <PeopleIcon /> },
            { key: 'platform', label: 'Plataforma', icon: <TrendingUpIcon /> },
            { key: 'trends', label: 'Tendencias', icon: <TimelineIcon /> }
          ].map((metric) => (
            <Chip
              key={metric.key}
              label={metric.label}
              icon={metric.icon}
              onClick={() => toggleMetric(metric.key)}
              color={selectedMetrics.includes(metric.key) ? 'primary' : 'default'}
              variant={selectedMetrics.includes(metric.key) ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Métricas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
        {selectedMetrics.includes('dashboard') && (
          <Box>
            {renderMetric(
              'Dashboard General',
              dashboardRequest.data,
              dashboardRequest.loading,
              dashboardRequest.error,
              <BarChartIcon />
            )}
          </Box>
        )}
        
        {selectedMetrics.includes('events') && (
          <Box>
            {renderMetric(
              'Eventos',
              eventsRequest.data,
              eventsRequest.loading,
              eventsRequest.error,
              <EventIcon />
            )}
          </Box>
        )}
        
        {selectedMetrics.includes('requests') && (
          <Box>
            {renderMetric(
              'Solicitudes',
              requestsRequest.data,
              requestsRequest.loading,
              requestsRequest.error,
              <LibraryMusicIcon />
            )}
          </Box>
        )}
        
        {selectedMetrics.includes('users') && (
          <Box>
            {renderMetric(
              'Usuarios',
              usersRequest.data,
              usersRequest.loading,
              usersRequest.error,
              <PeopleIcon />
            )}
          </Box>
        )}
        
        {selectedMetrics.includes('platform') && (
          <Box>
            {renderMetric(
              'Plataforma',
              platformRequest.data,
              platformRequest.loading,
              platformRequest.error,
              <TrendingUpIcon />
            )}
          </Box>
        )}
        
        {selectedMetrics.includes('trends') && (
          <Box>
            {renderMetric(
              'Tendencias',
              trendsRequest.data,
              trendsRequest.loading,
              trendsRequest.error,
              <TimelineIcon />
            )}
          </Box>
        )}
      </Box>

      {/* Estado general */}
      {(dashboardRequest.loading || eventsRequest.loading || requestsRequest.loading || 
        usersRequest.loading || platformRequest.loading || trendsRequest.loading) && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Alert severity="info">
            Cargando datos de analytics...
          </Alert>
        </Box>
      )}

      {/* Errores generales */}
      {(dashboardRequest.error || eventsRequest.error || requestsRequest.error || 
        usersRequest.error || platformRequest.error || trendsRequest.error) && (
        <Box mt={3}>
          <Alert severity="warning">
            Algunos datos no se pudieron cargar. Verifica tu conexión y permisos.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default Analytics; 