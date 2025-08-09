// Componente VoucherDashboard - MussikOn Admin System
// Dashboard especializado para gestión de vouchers con estadísticas y métricas

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

interface VoucherDashboardProps {
  onViewDetails?: (section: string) => void;
  onRefresh?: () => void;
  className?: string;
}

interface DashboardMetrics {
  totalDeposits: number;
  pendingDeposits: number;
  verifiedDeposits: number;
  rejectedDeposits: number;
  totalAmount: number;
  verifiedAmount: number;
  averageAmount: number;
  verificationRate: number;
  rejectionRate: number;
  duplicatesDetected: number;
  suspiciousActivity: number;
  todayDeposits: number;
  todayAmount: number;
  weeklyTrend: 'up' | 'down' | 'stable';
  fraudRate: number;
}

const VoucherDashboard: React.FC<VoucherDashboardProps> = ({
  onViewDetails,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Cargar estadísticas
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular datos para el dashboard
      const mockData = {
        total: 150,
        pending: 25,
        verified: 100,
        rejected: 15,
        totalAmount: 2500000,
        verifiedAmount: 1800000,
        averageAmount: 16667,
        dailyStats: [],
        fraudDetection: {
          totalRejected: 15,
          duplicatesDetected: 8,
          suspiciousActivity: 12
        }
      };
      
      const calculatedMetrics: DashboardMetrics = {
        totalDeposits: mockData.total,
        pendingDeposits: mockData.pending,
        verifiedDeposits: mockData.verified,
        rejectedDeposits: mockData.rejected,
        totalAmount: mockData.totalAmount,
        verifiedAmount: mockData.verifiedAmount,
        averageAmount: mockData.averageAmount,
        verificationRate: (mockData.verified / mockData.total) * 100,
        rejectionRate: (mockData.rejected / mockData.total) * 100,
        duplicatesDetected: mockData.fraudDetection.duplicatesDetected,
        suspiciousActivity: mockData.fraudDetection.suspiciousActivity,
        todayDeposits: 12,
        todayAmount: 180000,
        weeklyTrend: 'stable',
        fraudRate: (mockData.fraudDetection.totalRejected / mockData.total) * 100
      };
      
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('[VoucherDashboard] Error cargando estadísticas:', error);
      setError(error instanceof Error ? error.message : 'Error cargando estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  // Obtener color de tendencia
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      case 'stable': return 'info';
      default: return 'default';
    }
  };

  // Obtener icono de tendencia
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUpIcon />;
      case 'down': return <TrendingDownIcon />;
      case 'stable': return <TimelineIcon />;
      default: return <TimelineIcon />;
    }
  };

  // Cargar estadísticas al montar
  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Error cargando dashboard
        </Typography>
        <Typography variant="body2">{error}</Typography>
        <Button
          size="small"
          onClick={loadStats}
          startIcon={<RefreshIcon />}
          sx={{ mt: 1 }}
        >
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert severity="info">
        No hay datos disponibles para mostrar en el dashboard
      </Alert>
    );
  }

  return (
    <Box className={className}>
      {/* Header del Dashboard */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Dashboard de Vouchers
            </Typography>
            
            <Button
              size="small"
              variant="outlined"
              onClick={loadStats}
              startIcon={<RefreshIcon />}
            >
              Actualizar
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Estadísticas en tiempo real del sistema de depósitos
          </Typography>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {metrics.totalDeposits}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total de Depósitos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {formatCurrency(metrics.totalAmount)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Monto Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ApproveIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {metrics.verificationRate.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tasa de Verificación
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {metrics.fraudRate.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tasa de Fraude
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas de seguridad */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Seguridad y Detección de Fraude
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="warning.main">
                  {metrics.duplicatesDetected}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duplicados Detectados
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <FlagIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="error.main">
                  {metrics.suspiciousActivity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actividad Sospechosa
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <BlockIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="error.main">
                  {metrics.rejectedDeposits}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Depósitos Rechazados
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Hoy:
                </Typography>
                <Chip
                  label={`${metrics.todayDeposits} depósitos`}
                  color="primary"
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({formatCurrency(metrics.todayAmount)})
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Tendencia Semanal:
                </Typography>
                <Chip
                  icon={getTrendIcon(metrics.weeklyTrend)}
                  label={metrics.weeklyTrend === 'up' ? 'En aumento' : 
                         metrics.weeklyTrend === 'down' ? 'En descenso' : 'Estable'}
                  color={getTrendColor(metrics.weeklyTrend) as any}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Acciones rápidas */}
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => onViewDetails?.('pending')}
            >
              Ver Pendientes
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => onViewDetails?.('security')}
            >
              Revisar Seguridad
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => onViewDetails?.('analytics')}
            >
              Ver Análisis
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VoucherDashboard;
