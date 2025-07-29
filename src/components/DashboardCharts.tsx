import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon
} from '@mui/icons-material';

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DashboardChartsProps {
  data: ChartData[];
  title: string;
  subtitle?: string;
  type?: 'bar' | 'pie' | 'line';
  isLoading?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  title,
  subtitle,
  type = 'bar',
  isLoading = false
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map(item => item.value));

  const getChartIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChartIcon />;
      case 'pie':
        return <PieChartIcon />;
      case 'line':
        return <LineChartIcon />;
      default:
        return <BarChartIcon />;
    }
  };

  const renderBarChart = () => (
    <Box sx={{ mt: 2 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 8,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: `${(item.value / maxValue) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}80 100%)`,
                borderRadius: 4,
                transition: 'width 0.8s ease',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s infinite',
                },
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );

  const renderPieChart = () => {
    let currentAngle = 0;
    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const x1 = centerX + radius * Math.cos((Math.PI * (currentAngle - 90)) / 180);
            const y1 = centerY + radius * Math.sin((Math.PI * (currentAngle - 90)) / 180);
            const x2 = centerX + radius * Math.cos((Math.PI * (currentAngle + angle - 90)) / 180);
            const y2 = centerY + radius * Math.sin((Math.PI * (currentAngle + angle - 90)) / 180);
            const largeArc = angle > 180 ? 1 : 0;
            const d = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
            
            const element = (
              <path 
                key={index} 
                d={d} 
                fill={item.color} 
                opacity={0.85}
                stroke="#fff"
                strokeWidth="2"
                filter="url(#glow)"
              />
            );
            currentAngle += angle;
            return element;
          })}
          
          <circle cx={centerX} cy={centerY} r="30" fill="rgba(31, 38, 135, 0.95)" />
          <text x={centerX} y={centerY - 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
            {total}
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" fill="#b0b8c1" fontSize="10">
            Total
          </text>
        </svg>
      </Box>
    );
  };

  const renderLineChart = () => (
    <Box sx={{ mt: 2 }}>
      <svg width="100%" height="120" viewBox="0 0 300 120">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f5fff" />
            <stop offset="50%" stopColor="#00e0ff" />
            <stop offset="100%" stopColor="#ff2eec" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, index) => (
          <line
            key={index}
            x1="0"
            y1={y * 1.2}
            x2="300"
            y2={y * 1.2}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 300},${120 - (item.value / maxValue) * 120}`
          ).join(' ')}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 300}
            cy={120 - (item.value / maxValue) * 120}
            r="4"
            fill={item.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
      </svg>
    </Box>
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'line':
        return renderLineChart();
      default:
        return renderBarChart();
    }
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          background: 'rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                {getChartIcon()}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Box className="loading-shimmer" sx={{ width: '100%', height: 120, borderRadius: 2 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(127, 95, 255, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              {getChartIcon()}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        {renderChart()}
        
        {type === 'pie' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            {data.map((item, index) => (
              <Chip
                key={index}
                label={item.label}
                size="small"
                sx={{
                  background: `${item.color}20`,
                  color: item.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCharts; 