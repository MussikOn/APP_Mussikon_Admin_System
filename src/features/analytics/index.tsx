import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { analyticsService } from '../../services/searchService';
import type { AnalyticsFilters, AnalyticsResponse } from '../../services/searchService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Event as EventIcon,
  MusicNote as MusicIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Componente de gráfico simple (placeholder para Chart.js o similar)
const SimpleChart: React.FC<{ data: any; type: 'bar' | 'line' | 'pie' }> = ({ data, type }) => {
  const { isDark } = useTheme();
  
  return (
    <Box sx={{ 
      height: 300, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      borderRadius: 2,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
    }}>
      <Box sx={{ textAlign: 'center' }}>
        {type === 'bar' && <BarChartIcon sx={{ fontSize: 48, color: '#00fff7', mb: 2 }} />}
        {type === 'line' && <LineChartIcon sx={{ fontSize: 48, color: '#00ff88', mb: 2 }} />}
        {type === 'pie' && <PieChartIcon sx={{ fontSize: 48, color: '#ff2eec', mb: 2 }} />}
        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
          Gráfico {type === 'bar' ? 'de Barras' : type === 'line' ? 'de Líneas' : 'Circular'}
        </Typography>
        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {data?.datasets?.[0]?.data?.length || 0} puntos de datos
        </Typography>
      </Box>
    </Box>
  );
};

// Componente de métrica individual
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, icon, color }) => {
  const { isDark } = useTheme();
  
  return (
    <Card sx={{ 
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            background: `${color}20`,
            border: `1px solid ${color}40`
          }}>
            {icon}
          </Box>
          <Chip 
            label={`${change >= 0 ? '+' : ''}${change}%`}
            size="small"
            color={change >= 0 ? 'success' : 'error'}
            icon={change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 1,
          background: `linear-gradient(45deg, ${color}, ${color}80)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {value}
        </Typography>
        
        <Typography variant="body2" sx={{ 
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          fontWeight: 500
        }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Analytics: React.FC = () => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'month',
    groupBy: 'day'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<AnalyticsResponse | null>(null);
  const [usersData, setUsersData] = useState<AnalyticsResponse | null>(null);
  const [eventsData, setEventsData] = useState<AnalyticsResponse | null>(null);
  const [requestsData, setRequestsData] = useState<AnalyticsResponse | null>(null);

  // Cargar todos los datos de analytics
  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboard, users, events, requests] = await Promise.all([
        analyticsService.getDashboardAnalytics(filters),
        analyticsService.getUsersAnalytics(filters),
        analyticsService.getEventsAnalytics(filters),
        analyticsService.getRequestsAnalytics(filters)
      ]);

      if (dashboard) setDashboardData(dashboard as AnalyticsResponse);
      if (users) setUsersData(users as AnalyticsResponse);
      if (events) setEventsData(events as AnalyticsResponse);
      if (requests) setRequestsData(requests as AnalyticsResponse);
    } catch (err) {
      setError('Error al cargar los datos de analytics');
      console.error('Error en analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar datos al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Exportar reporte
  const handleExport = async () => {
    try {
      const blob = await analyticsService.exportAnalytics(filters, 'csv');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al exportar reporte');
    }
  };

  // Datos de ejemplo para las métricas (en producción vendrían del backend)
  const metrics = [
    {
      title: 'Usuarios Totales',
      value: dashboardData?.summary?.total || '1,234',
      change: dashboardData?.summary?.percentage || 12.5,
      icon: <PeopleIcon sx={{ color: '#00fff7' }} />,
      color: '#00fff7'
    },
    {
      title: 'Eventos Activos',
      value: eventsData?.summary?.total || '89',
      change: eventsData?.summary?.percentage || 8.3,
      icon: <EventIcon sx={{ color: '#00ff88' }} />,
      color: '#00ff88'
    },
    {
      title: 'Solicitudes Pendientes',
      value: requestsData?.summary?.total || '156',
      change: requestsData?.summary?.percentage || -2.1,
      icon: <MusicIcon sx={{ color: '#ff2eec' }} />,
      color: '#ff2eec'
    },
    {
      title: 'Imágenes Subidas',
      value: '2,847',
      change: 15.7,
      icon: <ImageIcon sx={{ color: '#b993d6' }} />,
      color: '#b993d6'
    }
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: isDark ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #00fff7, #00ff88)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          📊 Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
              label="Período"
              sx={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                borderRadius: 2
              }}
            >
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
              <MenuItem value="year">Año</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            onClick={loadAnalyticsData}
            startIcon={<RefreshIcon />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              borderColor: '#00fff7',
              color: '#00fff7',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0,255,247,0.1)',
              }
            }}
          >
            Actualizar
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleExport}
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 2,
              borderColor: '#00ff88',
              color: '#00ff88',
              '&:hover': {
                borderColor: '#00fff7',
                backgroundColor: 'rgba(0,255,136,0.1)',
              }
            }}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Estado de carga */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#00fff7' }} />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Métricas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
        {/* Gráfico de usuarios */}
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#00fff7', fontWeight: 600 }}>
                <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Crecimiento de Usuarios
              </Typography>
              <Tooltip title="Configurar gráfico">
                <IconButton size="small" sx={{ color: '#00fff7' }}>
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <SimpleChart data={usersData?.data} type="line" />
          </CardContent>
        </Card>

        {/* Gráfico de eventos */}
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600 }}>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Eventos por Categoría
              </Typography>
              <Tooltip title="Configurar gráfico">
                <IconButton size="small" sx={{ color: '#00ff88' }}>
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <SimpleChart data={eventsData?.data} type="pie" />
          </CardContent>
        </Card>

        {/* Gráfico de solicitudes */}
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#ff2eec', fontWeight: 600 }}>
                <MusicIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Solicitudes por Estado
              </Typography>
              <Tooltip title="Configurar gráfico">
                <IconButton size="small" sx={{ color: '#ff2eec' }}>
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <SimpleChart data={requestsData?.data} type="bar" />
          </CardContent>
        </Card>

        {/* Gráfico de tendencias */}
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#b993d6', fontWeight: 600 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tendencias Generales
              </Typography>
              <Tooltip title="Configurar gráfico">
                <IconButton size="small" sx={{ color: '#b993d6' }}>
                  <TimelineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <SimpleChart data={dashboardData?.data} type="line" />
          </CardContent>
        </Card>
      </Box>

      {/* Información adicional */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ 
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#00fff7', mb: 2, fontWeight: 600 }}>
              📈 Resumen de Rendimiento
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700, mb: 1 }}>
                  98.5%
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                  Tasa de Uptime
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#ff2eec', fontWeight: 700, mb: 1 }}>
                  2.3s
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                  Tiempo de Respuesta Promedio
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#b993d6', fontWeight: 700, mb: 1 }}>
                  1,847
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                  Usuarios Activos Hoy
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Analytics; 