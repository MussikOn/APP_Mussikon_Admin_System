import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ChartData } from '../../types/chartTypes';

interface PieChartProps {
  data: ChartData[];
  title: string;
  size?: number;
  showLegend?: boolean;
  centerText?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLegend = true,
  centerText
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createPath = (item: ChartData) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArc},1 ${x2},${y2} Z`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
        {/* Gráfico SVG */}
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <svg width={size} height={size} viewBox="0 0 100 100">
            {data.map((item, index) => (
              <path
                key={index}
                d={createPath(item)}
                fill={item.color}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
                style={{
                  transition: 'all 0.3s ease',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            ))}
          </svg>
          
          {centerText && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                {centerText}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                Total
              </Typography>
            </Box>
          )}
        </Box>

        {/* Leyenda */}
        {showLegend && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  px: 2,
                  mb: 1,
                  borderRadius: 2,
                  background: 'var(--color-glass)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'var(--color-glass-strong)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}66`
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    {((item.value / total) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PieChart;
