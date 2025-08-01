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
  Button,
  AlertTitle
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
import ResponsiveLayout from '../../components/ResponsiveLayout';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { responsiveTypography } from '../../theme/breakpoints';
import { buttonStyles } from '../../theme/buttonStyles';
import { useApiRequest } from '../../hooks/useApiRequest';
import { analyticsService, type AnalyticsFilters } from '../../services/searchService';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

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

  const { user } = useAuth();

  // Verificar permisos del usuario
  const userPermissionLevel = authService.getPermissionLevel();
  const canAccessUserAnalytics = userPermissionLevel >= 2; // Solo adminJunior y superior

  // Inicializar métricas seleccionadas basadas en permisos
  useEffect(() => {
    const initialMetrics = ['dashboard', 'events'];
    
    // Solo agregar 'users' si el usuario tiene permisos suficientes
    if (canAccessUserAnalytics) {
      initialMetrics.push('users');
    }
    
    setSelectedMetrics(initialMetrics);
    console.log('📊 Métricas iniciales configuradas:', initialMetrics);
  }, [canAccessUserAnalytics]);

  // Función para cargar datos de analytics
  const loadAnalyticsData = async () => {
    console.log('📊 Iniciando carga de datos de analytics con filtros:', filters);
    console.log('📊 Nivel de permisos del usuario:', userPermissionLevel);
    console.log('📊 ¿Puede acceder a analytics de usuarios?', canAccessUserAnalytics);
    
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
      if (selectedMetrics.includes('users') && canAccessUserAnalytics) {
        promises.push(usersRequest.execute(filters).catch(error => {
          console.warn('📊 Error en users analytics, usando datos de respaldo:', error);
          return null;
        }));
      } else if (selectedMetrics.includes('users') && !canAccessUserAnalytics) {
        console.log('📊 Omitiendo analytics de usuarios - permisos insuficientes');
        // No agregar la promesa para users analytics
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
  const hasBlockedByClientError = (error: any): boolean => {
    return error?.code === 'ERR_BLOCKED_BY_CLIENT' || 
           error?.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
           error?.message?.includes('blocked by client');
  };

  const hasServerError = (error: any): boolean => {
    return error?.response?.status >= 500 || 
           error?.code === 'ERR_NETWORK' ||
           error?.message?.includes('Network Error');
  };

  const hasPermissionError = (error: any): boolean => {
    return error?.response?.status === 403 || 
           error?.response?.status === 401;
  };

  // Función para obtener mensaje de error específico
  const getErrorMessage = (error: any): string => {
    if (hasBlockedByClientError(error)) {
      return '🚨 Error: La petición fue bloqueada por el navegador o extensiones';
    }
    if (hasPermissionError(error)) {
      return '🚫 Error: No tienes permisos para acceder a estos datos';
    }
    if (hasServerError(error)) {
      return '🔧 Error: Problema de conectividad con el servidor';
    }
    return error?.message || 'Error desconocido';
  };

  // Función para obtener sugerencias de solución
  const getErrorSuggestions = (error: any): string[] => {
    const suggestions: string[] = [];
    
    if (hasBlockedByClientError(error)) {
      suggestions.push('🔒 Desactiva temporalmente las extensiones del navegador (ad blockers, privacy extensions)');
      suggestions.push('🌐 Verifica que el backend esté corriendo en http://localhost:3001');
      suggestions.push('🔄 Intenta recargar la página con Ctrl+F5 (hard refresh)');
      suggestions.push('🔧 Verifica la configuración de firewall/antivirus');
      suggestions.push('🌐 Intenta con otro navegador o modo incógnito');
    }
    
    if (hasPermissionError(error)) {
      suggestions.push('🔑 Verifica que tu sesión esté activa');
      suggestions.push('👤 Contacta al administrador para solicitar permisos');
      suggestions.push('🔄 Cierra sesión y vuelve a iniciar sesión');
    }
    
    if (hasServerError(error)) {
      suggestions.push('🌐 Verifica tu conexión a internet');
      suggestions.push('🔌 Asegúrate de que el backend esté corriendo');
      suggestions.push('🔧 Contacta al equipo técnico si el problema persiste');
    }
    
    return suggestions;
  };

  // Función para manejar errores de bloqueo por cliente
  const handleBlockedByClientError = () => {
    console.warn('🚨 ERR_BLOCKED_BY_CLIENT detectado!');
    console.warn('🔧 Soluciones recomendadas:');
    console.warn('   1. Desactiva temporalmente las extensiones del navegador');
    console.warn('   2. Verifica que el backend esté corriendo en http://localhost:3001');
    console.warn('   3. Intenta con modo incógnito');
    console.warn('   4. Verifica la configuración de firewall/antivirus');
  };

  // Función para verificar disponibilidad del backend
  const checkBackendAvailability = async () => {
    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        console.log('✅ Backend está disponible');
        return true;
      } else {
        console.warn('⚠️ Backend responde pero con error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend no está disponible:', error);
      return false;
    }
  };

  // Función para ejecutar diagnósticos
  const runDiagnostics = async () => {
    console.log('🔍 Iniciando diagnósticos...');
    
    // Verificar backend
    const backendAvailable = await checkBackendAvailability();
    
    // Verificar configuración
    console.log('🔧 Configuración actual:');
    console.log('   - URL del backend:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
    console.log('   - Rol del usuario:', user?.role);
    console.log('   - Token presente:', !!localStorage.getItem('token'));
    
    // Verificar extensiones del navegador
    console.log('🔍 Verificando extensiones del navegador...');
    console.log('   - Si tienes ad blockers, desactívalos temporalmente');
    console.log('   - Si tienes extensiones de privacidad, desactívalas temporalmente');
    
    // Mostrar resultados
    if (backendAvailable) {
      console.log('✅ Diagnóstico: Backend está disponible');
    } else {
      console.log('❌ Diagnóstico: Backend no está disponible');
      console.log('💡 Solución: Inicia el backend con "npm run dev" en la carpeta ../app_mussikon_express');
    }
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
    // Verificar permisos para analytics de usuarios
    if (metric === 'users' && !canAccessUserAnalytics) {
      console.warn('📊 Intento de agregar analytics de usuarios sin permisos suficientes');
      return;
    }
    
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

  // Renderizar alertas de error mejoradas
  const renderErrorAlerts = () => {
    const alerts: React.ReactElement[] = [];

    // Alerta para errores de bloqueo por cliente
    if (dashboardRequest.error && hasBlockedByClientError(dashboardRequest.error)) {
      alerts.push(
        <Alert key="blocked-client" severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>🚨 Petición bloqueada por el navegador</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {getErrorMessage(dashboardRequest.error)}
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 1 }}>
            {getErrorSuggestions(dashboardRequest.error).map((suggestion, index) => (
              <li key={index}>
                <Typography variant="body2">{suggestion}</Typography>
              </li>
            ))}
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={runDiagnostics}
            startIcon={<BugReportIcon />}
            sx={{ mt: 1 }}
          >
            Diagnosticar problemas de conectividad
          </Button>
        </Alert>
      );
    }

    // Alerta para errores de permisos
    if (dashboardRequest.error && hasPermissionError(dashboardRequest.error)) {
      alerts.push(
        <Alert key="permission" severity="error" sx={{ mb: 2 }}>
          <AlertTitle>🚫 Error de permisos</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {getErrorMessage(dashboardRequest.error)}
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 1 }}>
            {getErrorSuggestions(dashboardRequest.error).map((suggestion, index) => (
              <li key={index}>
                <Typography variant="body2">{suggestion}</Typography>
              </li>
            ))}
          </Box>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
            Rol actual: <strong>{user?.role}</strong>
          </Typography>
        </Alert>
      );
    }

    // Alerta para errores de servidor
    if (dashboardRequest.error && hasServerError(dashboardRequest.error)) {
      alerts.push(
        <Alert key="server" severity="error" sx={{ mb: 2 }}>
          <AlertTitle>🔧 Error de conectividad</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {getErrorMessage(dashboardRequest.error)}
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 1 }}>
            {getErrorSuggestions(dashboardRequest.error).map((suggestion, index) => (
              <li key={index}>
                <Typography variant="body2">{suggestion}</Typography>
              </li>
            ))}
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={runDiagnostics}
            startIcon={<BugReportIcon />}
            sx={{ mt: 1 }}
          >
            Verificar conectividad del backend
          </Button>
        </Alert>
      );
    }

    return alerts;
  };

  return (
    <ResponsiveLayout
      spacing="lg"
      sx={{ maxWidth: '100%', mx: 'auto' }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        gap: { xs: 2, md: 0 },
        mb: 4
      }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              fontSize: responsiveTypography.h3,
              mb: 1
            }}
          >
            Analytics & Reportes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis detallado del rendimiento de la plataforma
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={dashboardRequest.loading || eventsRequest.loading || usersRequest.loading}
            sx={{ 
              ...buttonStyles.secondary,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Actualizar
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('all')}
            sx={{ 
              ...buttonStyles.secondary,
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.04)'
              }
            }}
          >
            Exportar
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<BugReportIcon />}
            onClick={runDiagnostics}
            sx={{ 
              ...buttonStyles.secondary,
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.04)'
              }
            }}
          >
            Diagnóstico
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            <TextField
              select
              label="Período"
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
              <MenuItem value="quarter">Trimestre</MenuItem>
              <MenuItem value="year">Año</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Agrupar por"
              value={filters.groupBy}
              onChange={(e) => handleFilterChange('groupBy', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="hour">Hora</MenuItem>
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
            </TextField>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['dashboard', 'events', 'requests', 'users', 'platform', 'trends'].map((metric) => (
                <Chip
                  key={metric}
                  label={metric.charAt(0).toUpperCase() + metric.slice(1)}
                  onClick={() => toggleMetric(metric)}
                  color={selectedMetrics.includes(metric) ? 'primary' : 'default'}
                  variant={selectedMetrics.includes(metric) ? 'filled' : 'outlined'}
                  sx={{ 
                    ...buttonStyles.chip,
                    '&:hover': {
                      backgroundColor: selectedMetrics.includes(metric) 
                        ? 'rgba(25, 118, 210, 0.12)' 
                        : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alertas de errores */}
      {renderErrorAlerts()}

      {/* Métricas */}
      <ResponsiveGrid
        type="metrics"
        gap={3}
      >
        {selectedMetrics.includes('dashboard') && renderMetric(
          'Dashboard Analytics',
          dashboardRequest.data,
          dashboardRequest.loading,
          dashboardRequest.error,
          <TrendingUpIcon />
        )}
        
        {selectedMetrics.includes('events') && renderMetric(
          'Eventos Analytics',
          eventsRequest.data,
          eventsRequest.loading,
          eventsRequest.error,
          <EventIcon />
        )}
        
        {selectedMetrics.includes('requests') && renderMetric(
          'Solicitudes Analytics',
          requestsRequest.data,
          requestsRequest.loading,
          requestsRequest.error,
          <LibraryMusicIcon />
        )}
        
        {selectedMetrics.includes('users') && canAccessUserAnalytics && renderMetric(
          'Usuarios Analytics',
          usersRequest.data,
          usersRequest.loading,
          usersRequest.error,
          <PeopleIcon />
        )}
        
        {selectedMetrics.includes('platform') && renderMetric(
          'Plataforma Analytics',
          platformRequest.data,
          platformRequest.loading,
          platformRequest.error,
          <BarChartIcon />
        )}
        
        {selectedMetrics.includes('trends') && renderMetric(
          'Tendencias Analytics',
          trendsRequest.data,
          trendsRequest.loading,
          trendsRequest.error,
          <TimelineIcon />
        )}
      </ResponsiveGrid>
    </ResponsiveLayout>
  );
};

export default Analytics; 