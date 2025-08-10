import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ChartData } from '../../types/chartTypes';

interface BarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  showValues?: boolean;
  animated?: boolean;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  showValues = true,
  animated = true,
  color = 'var(--color-primary)'
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartPadding = 40;

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
        {/* Líneas de fondo */}
        <svg 
          width="100%" 
          height={height - 40}
          style={{ position: 'absolute', top: 20, left: 0 }}
        >
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={chartPadding}
              y1={(height - 60) * (i / 4) + 20}
              x2="95%"
              y2={(height - 60) * (i / 4) + 20}
              stroke="var(--color-border)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}
        </svg>

        {/* Barras */}
        <Box sx={{ 
          display: 'flex', 
          height: '100%', 
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          position: 'relative',
          pt: 2,
          pb: 4
        }}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 100);
            
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  flex: 1,
                  maxWidth: 80
                }}
              >
                {/* Valor encima de la barra */}
                {showValues && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: -25,
                      fontWeight: 600,
                      color: item.color || color,
                      textShadow: `0 0 8px ${item.color || color}66`
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
                
                {/* Barra */}
                <Box
                  sx={{
                    width: '60%',
                    height: barHeight,
                    background: `linear-gradient(to top, ${item.color || color}, ${item.color || color}aa)`,
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    boxShadow: `0 0 20px ${item.color || color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    transition: animated ? 'all 0.3s ease' : 'none',
                    transform: animated ? 'scaleY(0)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    animation: animated ? `growBar 0.8s ease-out ${index * 0.1}s forwards` : 'none',
                    '&:hover': {
                      transform: 'scaleY(1) scaleX(1.1)',
                      boxShadow: `0 0 30px ${item.color}66, inset 0 1px 0 rgba(255,255,255,0.3)`
                    },
                    '@keyframes growBar': {
                      to: {
                        transform: 'scaleY(1)'
                      }
                    }
                  }}
                >
                  {/* Efecto de brillo en la barra */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '20%',
                      width: '60%',
                      height: '100%',
                      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                </Box>
                
                {/* Etiqueta */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    lineHeight: 1.2,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Etiquetas del eje Y */}
        <Box sx={{ 
          position: 'absolute',
          left: 5,
          top: 20,
          height: height - 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {[...Array(5)].map((_, i) => (
            <Typography
              key={i}
              variant="caption"
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.6rem',
                transform: 'translateY(-50%)'
              }}
            >
              {Math.round(maxValue * (4 - i) / 4)}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BarChart;
