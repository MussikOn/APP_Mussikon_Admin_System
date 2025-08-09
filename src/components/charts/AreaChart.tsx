import React from 'react';

import type { AreaChartData } from '../../types/chartTypes';

interface AreaChartProps {
  data: AreaChartData[];
  title: string;
  color?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  gradient?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  color = 'var(--color-primary)',
  height = 200,
  width = 400,
  showGrid = true,
  gradient = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-no-data">Sin datos disponibles</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const createPath = () => {
    let path = '';
    let areaPath = '';
    
    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + (1 - point.value / maxValue) * chartHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
        areaPath += `M ${x} ${height - padding}`;
        areaPath += ` L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
    });
    
    // Cerrar el área
    areaPath += ` L ${padding + chartWidth} ${height - padding}`;
    areaPath += ` Z`;
    
    return { linePath: path, areaPath };
  };

  const { linePath, areaPath } = createPath();

  return (
    <div className="chart-container area-chart">
      <h3 className="chart-title">{title}</h3>
      <svg width={width} height={height} className="chart-svg">
        <defs>
          {gradient && (
            <linearGradient id={`areaGradient-${title.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          )}
        </defs>
        
        {showGrid && (
          <g className="chart-grid">
            {/* Líneas horizontales */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`h-${ratio}`}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={width - padding}
                y2={padding + ratio * chartHeight}
                stroke="var(--color-border-subtle)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {/* Líneas verticales */}
            {data.map((_, index) => (
              <line
                key={`v-${index}`}
                x1={padding + (index / (data.length - 1)) * chartWidth}
                y1={padding}
                x2={padding + (index / (data.length - 1)) * chartWidth}
                y2={height - padding}
                stroke="var(--color-border-subtle)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </g>
        )}

        {/* Área */}
        <path
          d={areaPath}
          fill={gradient ? `url(#areaGradient-${title.replace(/\s/g, '')})` : color}
          opacity="0.3"
          className="chart-area"
        />

        {/* Línea */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="chart-line"
        />

        {/* Puntos */}
        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + (1 - point.value / maxValue) * chartHeight;
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="chart-point"
              />
              {/* Tooltip en hover */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="transparent"
                className="chart-point-hover"
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      
      <style>{`
        .chart-container {
          background: var(--color-glass);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-glass);
        }
        
        .chart-title {
          color: var(--color-text);
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 600;
          margin: 0 0 1rem 0;
          text-align: center;
          background: var(--color-gradient-1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .chart-no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .chart-svg {
          width: 100%;
          height: auto;
        }
        
        .chart-line {
          filter: drop-shadow(0 0 4px currentColor);
        }
        
        .chart-area {
          transition: opacity 0.3s ease;
        }
        
        .chart-point {
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 4px currentColor);
        }
        
        .chart-point-hover:hover + .chart-point,
        .chart-point:hover {
          r: 6;
          filter: drop-shadow(0 0 8px currentColor);
        }
        
        .area-chart:hover .chart-area {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default AreaChart;
