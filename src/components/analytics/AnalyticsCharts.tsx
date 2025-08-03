// Componentes de Gráficos para Analytics - MussikOn Admin System
// Gráficos interactivos usando Chart.js y react-chartjs-2

import React from 'react';
import {
  Line as LineChartComponent,
  Bar as BarChartComponent,
  Doughnut as DoughnutChartComponent,
  Radar as RadarChartComponent
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useTheme } from '../../hooks/useTheme';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configuración de colores para gráficos
const chartColors = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#00BCD4',
  purple: '#9C27B0',
  pink: '#E91E63',
  indigo: '#3F51B5',
  teal: '#009688',
  orange: '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  blueGrey: '#607D8B'
};

// Opciones base para gráficos
const getChartOptions = (title: string, isDark: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDark ? '#ffffff' : '#000000',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: title,
      color: isDark ? '#ffffff' : '#000000',
      font: {
        size: 16,
        weight: 'bold' as const
      }
    },
    tooltip: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDark ? '#ffffff' : '#000000',
      bodyColor: isDark ? '#ffffff' : '#000000',
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      ticks: {
        color: isDark ? '#ffffff' : '#000000'
      },
      grid: {
        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      ticks: {
        color: isDark ? '#ffffff' : '#000000'
      },
      grid: {
        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
});

// Componente de gráfico de líneas
interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    data: number[];
  };
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ title, data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.data,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  return (
    <Card sx={{ height, p: 2 }}>
      <CardContent>
        <LineChartComponent data={chartData} options={getChartOptions(title, isDark)} />
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de barras
interface BarChartProps {
  title: string;
  data: {
    labels: string[];
    data: number[];
  };
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ title, data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.data,
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.success,
          chartColors.warning,
          chartColors.error,
          chartColors.info,
          chartColors.purple,
          chartColors.pink,
          chartColors.indigo,
          chartColors.teal
        ],
        borderColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.success,
          chartColors.warning,
          chartColors.error,
          chartColors.info,
          chartColors.purple,
          chartColors.pink,
          chartColors.indigo,
          chartColors.teal
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  return (
    <Card sx={{ height, p: 2 }}>
      <CardContent>
        <BarChartComponent data={chartData} options={getChartOptions(title, isDark)} />
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de dona
interface DoughnutChartProps {
  title: string;
  data: {
    labels: string[];
    data: number[];
  };
  height?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ title, data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.data,
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.success,
          chartColors.warning,
          chartColors.error,
          chartColors.info,
          chartColors.purple,
          chartColors.pink,
          chartColors.indigo,
          chartColors.teal
        ],
        borderColor: isDark ? '#333333' : '#ffffff',
        borderWidth: 2,
        cutout: '60%'
      }
    ]
  };

  const options = {
    ...getChartOptions(title, isDark),
    plugins: {
      ...getChartOptions(title, isDark).plugins,
      legend: {
        ...getChartOptions(title, isDark).plugins.legend,
        position: 'bottom' as const
      }
    }
  };

  return (
    <Card sx={{ height, p: 2 }}>
      <CardContent>
        <DoughnutChartComponent data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de radar
interface RadarChartProps {
  title: string;
  data: {
    labels: string[];
    data: number[];
  };
  height?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ title, data, height = 300 }) => {
  const { isDark } = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.data,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    ...getChartOptions(title, isDark),
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          color: isDark ? '#ffffff' : '#000000',
          backdropColor: 'transparent'
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          color: isDark ? '#ffffff' : '#000000'
        }
      }
    }
  };

  return (
    <Card sx={{ height, p: 2 }}>
      <CardContent>
        <RadarChartComponent data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

// Componente de tarjeta de métrica
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle 
}) => {
  const { isDark } = useTheme();

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary': return chartColors.primary;
      case 'secondary': return chartColors.secondary;
      case 'success': return chartColors.success;
      case 'warning': return chartColors.warning;
      case 'error': return chartColors.error;
      case 'info': return chartColors.info;
      default: return chartColors.primary;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark 
            ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
            : '0 8px 25px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Box 
              sx={{ 
                mr: 1, 
                color: getColorValue(color),
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {icon}
            </Box>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: isDark ? '#ffffff' : '#000000',
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: getColorValue(color),
            mb: subtitle ? 1 : 0
          }}
        >
          {value}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Componente de tabla de datos
interface DataTableProps {
  title: string;
  data: Array<{
    [key: string]: string | number;
  }>;
  columns: Array<{
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
  }>;
}

export const DataTable: React.FC<DataTableProps> = ({ title, data, columns }) => {
  const { isDark } = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: isDark ? '#ffffff' : '#000000',
            fontWeight: 600,
            mb: 2
          }}
        >
          {title}
        </Typography>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 400,
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align || 'left'}
                    sx={{
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      color: isDark ? '#ffffff' : '#000000',
                      fontWeight: 600,
                      borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                    },
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align || 'left'}
                      sx={{
                        color: isDark ? '#ffffff' : '#000000',
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                      }}
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// Componente de filtros de analytics
interface AnalyticsFiltersProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    eventType: string;
    status: string;
    location: string;
  };
  onFiltersChange: (filters: any) => void;
  eventTypes: string[];
  statuses: string[];
  locations: string[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  eventTypes,
  statuses,
  locations
}) => {
  const { isDark } = useTheme();

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: isDark ? '#ffffff' : '#000000',
            fontWeight: 600,
            mb: 2
          }}
        >
          Filtros de Analytics
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '4px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000'
            }}
          />
          
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '4px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000'
            }}
          />
          
          <select
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '4px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000'
            }}
          >
            <option value="">Todos los tipos</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '4px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000'
            }}
          >
            <option value="">Todos los estados</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '4px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000'
            }}
          >
            <option value="">Todas las ubicaciones</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </Box>
      </CardContent>
    </Card>
  );
}; 