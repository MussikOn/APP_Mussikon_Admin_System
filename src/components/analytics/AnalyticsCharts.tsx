// Componentes de gráficos para Analytics - MussikOn Admin System
// Este archivo contiene componentes de gráficos para visualizar datos de analytics

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';
import { colors } from '../../theme/colors';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Configuración común de gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: colors.text.primary,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: colors.background.paper,
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1
    }
  },
  scales: {
    x: {
      ticks: {
        color: colors.text.secondary
      },
      grid: {
        color: colors.border.secondary
      }
    },
    y: {
      ticks: {
        color: colors.text.secondary
      },
      grid: {
        color: colors.border.secondary
      }
    }
  }
};

// Colores para gráficos
const chartColors = {
  primary: colors.primary.main,
  secondary: colors.secondary.main,
  success: colors.success.main,
  warning: colors.warning.main,
  error: colors.error.main,
  info: colors.info.main,
  gradient: [
    colors.primary.main,
    colors.secondary.main,
    colors.success.main,
    colors.warning.main,
    colors.error.main,
    colors.info.main
  ]
};

// Componente de gráfico de líneas para tendencias
interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }>;
  };
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ title, data, height = 300 }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: height + 80 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, position: 'relative' }}>
        <Line
          data={data}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: false
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// Componente de gráfico de barras
interface BarChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>;
  };
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ title, data, height = 300 }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: height + 80 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, position: 'relative' }}>
        <Bar
          data={data}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: false
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// Componente de gráfico de dona
interface DoughnutChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
    }>;
  };
  height?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ title, data, height = 300 }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: height + 80 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, position: 'relative' }}>
        <Doughnut
          data={data}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: false
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// Componente de gráfico de radar
interface RadarChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  };
  height?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ title, data, height = 300 }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: height + 80 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, position: 'relative' }}>
        <Radar
          data={data}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: false
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// Componente de métricas con tarjetas
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  icon 
}) => {
  const colorMap = {
    primary: colors.primary.main,
    secondary: colors.secondary.main,
    success: colors.success.main,
    warning: colors.warning.main,
    error: colors.error.main,
    info: colors.info.main
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        textAlign: 'center',
        borderLeft: `4px solid ${colorMap[color]}`,
        height: '100%'
      }}
    >
      {icon && (
        <Box sx={{ mb: 1, color: colorMap[color] }}>
          {icon}
        </Box>
      )}
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

// Componente de tabla de datos
interface DataTableProps {
  title: string;
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
}

export const DataTable: React.FC<DataTableProps> = ({ title, data, columns }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border.primary}` }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: colors.text.primary
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: `1px solid ${colors.border.secondary}`,
                  '&:hover': {
                    backgroundColor: colors.action.hover
                  }
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '12px',
                      color: colors.text.secondary
                    }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
};

// Componente de filtros de analytics
interface AnalyticsFiltersProps {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    eventType?: string;
    status?: string;
    userRole?: string;
    location?: string;
    period?: string;
    groupBy?: string;
  };
  onFiltersChange: (filters: any) => void;
  eventTypes?: string[];
  statuses?: string[];
  userRoles?: string[];
  locations?: string[];
  periods?: string[];
  groupByOptions?: string[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  eventTypes = [],
  statuses = [],
  userRoles = [],
  locations = [],
  periods = ['day', 'week', 'month', 'quarter'],
  groupByOptions = []
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filtros de Analytics
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Box>
          <Typography variant="body2" gutterBottom>
            Fecha Desde
          </Typography>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${colors.border.primary}`,
              borderRadius: '4px'
            }}
          />
        </Box>
        
        <Box>
          <Typography variant="body2" gutterBottom>
            Fecha Hasta
          </Typography>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${colors.border.primary}`,
              borderRadius: '4px'
            }}
          />
        </Box>

        {eventTypes.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Tipo de Evento
            </Typography>
            <select
              value={filters.eventType || ''}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Todos</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Box>
        )}

        {statuses.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Estado
            </Typography>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Todos</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Box>
        )}

        {userRoles.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Rol de Usuario
            </Typography>
            <select
              value={filters.userRole || ''}
              onChange={(e) => handleFilterChange('userRole', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Todos</option>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </Box>
        )}

        {locations.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Ubicación
            </Typography>
            <select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Todas</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </Box>
        )}

        {periods.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Período
            </Typography>
            <select
              value={filters.period || ''}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Seleccionar</option>
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </Box>
        )}

        {groupByOptions.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Agrupar Por
            </Typography>
            <select
              value={filters.groupBy || ''}
              onChange={(e) => handleFilterChange('groupBy', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '4px'
              }}
            >
              <option value="">Seleccionar</option>
              {groupByOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default {
  LineChart,
  BarChart,
  DoughnutChart,
  RadarChart,
  MetricCard,
  DataTable,
  AnalyticsFilters
}; 