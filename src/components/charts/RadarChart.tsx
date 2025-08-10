import React from 'react';



export interface RadarChartData {
  label: string;
  value: number;
  maxValue?: number;
}

interface RadarChartProps {
  data: RadarChartData[];
  title: string;
  size?: number;
  levels?: number;
  showLabels?: boolean;
  fillColor?: string;
  strokeColor?: string;
  showGrid?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  size = 300,
  levels = 5,
  showLabels = true,
  fillColor = 'var(--color-primary)',
  strokeColor = 'var(--color-primary)',
  showGrid = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-no-data">Sin datos disponibles</div>
      </div>
    );
  }

  const radius = size / 2 - 40;
  const center = size / 2;
  const angleStep = (2 * Math.PI) / data.length;
  
  // Calcular el valor máximo
  const maxValue = Math.max(...data.map(d => d.maxValue || d.value), ...data.map(d => d.value));

  const getCoordinates = (angle: number, distance: number) => {
    const x = center + distance * Math.cos(angle - Math.PI / 2);
    const y = center + distance * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const createGridLines = () => {
    const lines = [];
    
    // Líneas radiales
    data.forEach((_, index) => {
      const angle = index * angleStep;
      const end = getCoordinates(angle, radius);
      lines.push(
        <line
          key={`radial-${index}`}
          x1={center}
          y1={center}
          x2={end.x}
          y2={end.y}
          stroke="var(--color-border-subtle)"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    });

    // Círculos concéntricos
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      lines.push(
        <circle
          key={`level-${i}`}
          cx={center}
          cy={center}
          r={levelRadius}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }

    return lines;
  };

  const createDataPath = () => {
    let path = '';
    
    data.forEach((point, index) => {
      const angle = index * angleStep;
      const normalizedValue = point.value / maxValue;
      const distance = radius * normalizedValue;
      const coords = getCoordinates(angle, distance);
      
      if (index === 0) {
        path += `M ${coords.x} ${coords.y}`;
      } else {
        path += ` L ${coords.x} ${coords.y}`;
      }
    });
    
    path += ' Z'; // Cerrar el path
    return path;
  };

  const createLabelPositions = () => {
    return data.map((point, index) => {
      const angle = index * angleStep;
      const labelDistance = radius + 20;
      const coords = getCoordinates(angle, labelDistance);
      
      return (
        <g key={`label-${index}`}>
          <text
            x={coords.x}
            y={coords.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-label"
            fill="var(--color-text)"
          >
            {point.label}
          </text>
          <text
            x={coords.x}
            y={coords.y + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-value"
            fill="var(--color-text-muted)"
          >
            {point.value}
          </text>
        </g>
      );
    });
  };

  const createDataPoints = () => {
    return data.map((point, index) => {
      const angle = index * angleStep;
      const normalizedValue = point.value / maxValue;
      const distance = radius * normalizedValue;
      const coords = getCoordinates(angle, distance);
      
      return (
        <circle
          key={`point-${index}`}
          cx={coords.x}
          cy={coords.y}
          r="4"
          fill={strokeColor}
          className="radar-point"
        >
          <title>{`${point.label}: ${point.value}`}</title>
        </circle>
      );
    });
  };

  return (
    <div className="chart-container radar-chart">
      <h3 className="chart-title">{title}</h3>
      <svg width={size} height={size} className="chart-svg">
        <defs>
          <radialGradient id={`radarGradient-${title.replace(/\s/g, '')}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {showGrid && (
          <g className="radar-grid">
            {createGridLines()}
          </g>
        )}

        {/* Área de datos */}
        <path
          d={createDataPath()}
          fill={`url(#radarGradient-${title.replace(/\s/g, '')})`}
          stroke={strokeColor}
          strokeWidth="2"
          className="radar-area"
        />

        {/* Puntos de datos */}
        {createDataPoints()}

        {/* Etiquetas */}
        {showLabels && createLabelPositions()}
      </svg>
      
      <style>{`
        .chart-container {
          background: var(--color-glass);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-glass);
          display: flex;
          flex-direction: column;
          align-items: center;
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
          overflow: visible;
        }
        
        .radar-area {
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 8px rgba(0,0,0,0.1));
        }
        
        .radar-area:hover {
          filter: drop-shadow(0 0 12px rgba(0,0,0,0.2));
        }
        
        .radar-point {
          transition: all 0.3s ease;
          cursor: pointer;
          filter: drop-shadow(0 0 4px currentColor);
        }
        
        .radar-point:hover {
          r: 6;
          filter: drop-shadow(0 0 8px currentColor);
        }
        
        .radar-label {
          font-size: 0.8rem;
          font-weight: 600;
          pointer-events: none;
        }
        
        .radar-value {
          font-size: 0.7rem;
          font-weight: 500;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .radar-label {
            font-size: 0.7rem;
          }
          
          .radar-value {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RadarChart;
