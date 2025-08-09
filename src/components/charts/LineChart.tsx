import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ChartData } from '../../services/analyticsService';

interface LineChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  color?: string;
  gradient?: boolean;
  animated?: boolean;
  showDots?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  color = '#7f5fff',
  gradient = true,
  animated = true,
  showDots = true
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const valueRange = maxValue - minValue;
  const chartWidth = 350;
  const chartHeight = height - 80;
  const padding = 40;

  const points = data.map((item, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - ((item.value - minValue) / valueRange) * (chartHeight - padding * 2) + padding;
    return { x, y, value: item.value, label: item.label };
  });

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x},${point.y}`;
  }, '');

  const gradientPath = `${pathData} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        {title}
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        height: height,
        position: 'relative',
        background: 'var(--color-glass)',
        borderRadius: 3,
        padding: 2,
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Definir gradientes */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Líneas de la cuadrícula */}
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <line
                x1={padding}
                y1={padding + (i * (chartHeight - padding * 2)) / 4}
                x2={chartWidth - padding}
                y2={padding + (i * (chartHeight - padding * 2)) / 4}
                stroke="var(--color-border)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Líneas verticales */}
          {points.map((point, i) => (
            <line
              key={i}
              x1={point.x}
              y1={padding}
              x2={point.x}
              y2={chartHeight - padding}
              stroke="var(--color-border)"
              strokeWidth="0.5"
              strokeDasharray="1,3"
              opacity="0.2"
            />
          ))}

          {/* Área de relleno con gradiente */}
          {gradient && (
            <path
              d={gradientPath}
              fill={`url(#gradient-${color.replace('#', '')})`}
              style={{
                animation: animated ? 'fadeIn 1s ease-out' : 'none'
              }}
            />
          )}

          {/* Línea principal */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            filter="url(#glow)"
            style={{
              strokeDasharray: animated ? `${pathData.length}px` : 'none',
              strokeDashoffset: animated ? `${pathData.length}px` : 'none',
              animation: animated ? 'drawLine 2s ease-out forwards' : 'none'
            }}
          />

          {/* Puntos de datos */}
          {showDots && points.map((point, index) => (
            <g key={index}>
              {/* Círculo exterior (glow) */}
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill={color}
                opacity="0.2"
                style={{
                  animation: animated ? `popIn 0.5s ease-out ${index * 0.1 + 1}s forwards` : 'none',
                  transform: animated ? 'scale(0)' : 'scale(1)',
                  transformOrigin: `${point.x}px ${point.y}px`
                }}
              />
              {/* Círculo principal */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
                filter="url(#glow)"
                style={{
                  animation: animated ? `popIn 0.5s ease-out ${index * 0.1 + 1.2}s forwards` : 'none',
                  transform: animated ? 'scale(0)' : 'scale(1)',
                  transformOrigin: `${point.x}px ${point.y}px`,
                  cursor: 'pointer'
                }}
              />
              {/* Valor del punto */}
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fill={color}
                fontSize="10"
                fontWeight="600"
                style={{
                  textShadow: `0 0 6px ${color}66`,
                  animation: animated ? `fadeIn 0.5s ease-out ${index * 0.1 + 1.5}s forwards` : 'none',
                  opacity: animated ? '0' : '1'
                }}
              >
                {point.value}
              </text>
            </g>
          ))}
        </svg>

        {/* Etiquetas del eje X */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
          px: `${padding}px`
        }}>
          {data.map((item, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.7rem',
                textAlign: 'center',
                flex: 1
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>

        {/* Estilos CSS para animaciones */}
        <style>
          {`
            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes fadeIn {
              to {
                opacity: 1;
              }
            }
            @keyframes popIn {
              to {
                transform: scale(1);
              }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default LineChart;
