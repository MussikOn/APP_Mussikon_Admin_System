import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface PerformanceMetric {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ReactNode;
  suffix?: string;
  trend?: number;
}

interface PerformanceMetricsProps {
  metrics: {
    systemHealth: number;
    dataGrowth: number;
    userActivity: number;
    eventSuccess: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const performanceData: PerformanceMetric[] = [
    {
      label: 'Salud del Sistema',
      value: metrics.systemHealth,
      maxValue: 100,
      color: '#00e676',
      icon: <CheckCircleIcon />,
      suffix: '%'
    },
    {
      label: 'Crecimiento de Datos',
      value: metrics.dataGrowth,
      maxValue: 100,
      color: '#00e0ff',
      icon: <TrendingUpIcon />,
      suffix: '%'
    },
    {
      label: 'Actividad de Usuarios',
      value: metrics.userActivity,
      maxValue: 100,
      color: '#ff2eec',
      icon: <SpeedIcon />,
      suffix: '%'
    },
    {
      label: 'Éxito de Eventos',
      value: metrics.eventSuccess,
      maxValue: 100,
      color: '#ffd700',
      icon: <MemoryIcon />,
      suffix: '%'
    }
  ];

  const getHealthColor = (value: number) => {
    if (value >= 80) return '#00e676';
    if (value >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 600, 
          textAlign: 'center',
          background: 'var(--color-gradient-1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        ► MÉTRICAS DE RENDIMIENTO ◄
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3 
      }}>
        {performanceData.map((metric, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              background: 'var(--color-glass)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--color-border)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: metric.color,
                boxShadow: `0 8px 32px ${metric.color}33`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${metric.color}, transparent)`,
                opacity: 0.8
              }
            }}
          >
            {/* Header con icono y valor */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2 
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: `${metric.color}22`,
                    color: metric.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'var(--color-text)'
                  }}
                >
                  {metric.label}
                </Typography>
              </Box>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  color: getHealthColor(metric.value),
                  fontFamily: 'Orbitron, monospace',
                  textShadow: `0 0 12px ${getHealthColor(metric.value)}66`
                }}
              >
                {metric.value}{metric.suffix}
              </Typography>
            </Box>

            {/* Barra de progreso personalizada */}
            <Box sx={{ position: 'relative', mb: 1 }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: 'var(--color-glass-strong)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(metric.value / metric.maxValue) * 100}%`,
                    background: `linear-gradient(90deg, ${metric.color}, ${metric.color}aa)`,
                    borderRadius: 4,
                    position: 'relative',
                    transition: 'width 1s ease-out',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Texto de estado */}
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: getHealthColor(metric.value),
                  boxShadow: `0 0 6px ${getHealthColor(metric.value)}66`
                }}
              />
              {metric.value >= 80 ? 'Excelente' : 
               metric.value >= 60 ? 'Bueno' : 
               metric.value >= 40 ? 'Regular' : 'Crítico'}
            </Typography>

            {/* Efecto de fondo animado */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 50% 50%, ${metric.color}08 0%, transparent 70%)`,
                opacity: metric.value > 80 ? 0.6 : 0.3,
                animation: metric.value > 80 ? 'pulse 3s ease-in-out infinite' : 'none',
                pointerEvents: 'none'
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Indicador general de salud del sistema */}
      <Box sx={{ 
        mt: 4, 
        p: 3,
        background: 'var(--color-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--color-text)'
          }}
        >
          Estado General del Sistema
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2,
          mb: 2
        }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: getHealthColor(Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3)),
              boxShadow: `0 0 12px ${getHealthColor(Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3))}66`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              color: getHealthColor(Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3)),
              fontFamily: 'Orbitron, monospace',
              textShadow: `0 0 12px ${getHealthColor(Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3))}66`
            }}
          >
            {Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3)}%
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--color-text-secondary)',
            fontWeight: 500
          }}
        >
          Sistema funcionando {Math.round((metrics.systemHealth + metrics.userActivity + metrics.eventSuccess) / 3) >= 80 ? 'óptimamente' : 'correctamente'}
        </Typography>
      </Box>

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}
      </style>
    </Box>
  );
};

export default PerformanceMetrics;
