import React from 'react';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  title: string;
  unit?: string;
  color?: string;
  size?: number;
  thickness?: number;
  showValue?: boolean;
  label?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  title,
  unit = '',
  color = 'var(--color-primary)',
  size = 200,
  thickness = 20,
  showValue = true,
  label
}) => {
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = Math.PI * radius; // Solo media circunferencia
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - percentage);

  // Calcular color basado en el porcentaje
  const getColor = () => {
    if (percentage < 0.3) return 'var(--color-success)';
    if (percentage < 0.7) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const dynamicColor = color === 'var(--color-primary)' ? getColor() : color;

  return (
    <div className="chart-container gauge-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="gauge-wrapper">
        <svg width={size} height={size * 0.6 + 40} className="chart-svg">
          {/* Fondo del gauge */}
          <path
            d={`M ${thickness/2} ${center} A ${radius} ${radius} 0 0 1 ${size - thickness/2} ${center}`}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth={thickness}
            strokeLinecap="round"
            className="gauge-background"
          />
          
          {/* Valor actual */}
          <path
            d={`M ${thickness/2} ${center} A ${radius} ${radius} 0 0 1 ${size - thickness/2} ${center}`}
            fill="none"
            stroke={dynamicColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="gauge-value"
            style={{
              filter: `drop-shadow(0 0 8px ${dynamicColor})`
            }}
          />
          
          {/* Marcadores */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const angle = Math.PI * ratio;
            const x1 = center + (radius - 10) * Math.cos(angle + Math.PI);
            const y1 = center + (radius - 10) * Math.sin(angle + Math.PI);
            const x2 = center + (radius + 5) * Math.cos(angle + Math.PI);
            const y2 = center + (radius + 5) * Math.sin(angle + Math.PI);
            
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                className="gauge-marker"
              />
            );
          })}
          
          {/* Valores en los marcadores */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const angle = Math.PI * ratio;
            const x = center + (radius + 20) * Math.cos(angle + Math.PI);
            const y = center + (radius + 20) * Math.sin(angle + Math.PI);
            const displayValue = Math.round(maxValue * ratio);
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="gauge-marker-text"
                fill="var(--color-text-muted)"
              >
                {displayValue}
              </text>
            );
          })}
          
          {/* Indicador central */}
          <circle
            cx={center}
            cy={center}
            r="6"
            fill={dynamicColor}
            className="gauge-center"
          />
        </svg>
        
        {showValue && (
          <div className="gauge-display">
            <div className="gauge-value-text">
              <span className="value">{value.toLocaleString()}</span>
              {unit && <span className="unit">{unit}</span>}
            </div>
            {label && <div className="gauge-label">{label}</div>}
            <div className="gauge-percentage">{(percentage * 100).toFixed(1)}%</div>
          </div>
        )}
      </div>
      
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
        
        .gauge-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .chart-svg {
          overflow: visible;
        }
        
        .gauge-background {
          opacity: 0.3;
        }
        
        .gauge-value {
          transition: all 0.5s ease;
        }
        
        .gauge-marker {
          opacity: 0.7;
        }
        
        .gauge-marker-text {
          font-size: 0.7rem;
          font-weight: 500;
        }
        
        .gauge-center {
          filter: drop-shadow(0 0 4px currentColor);
        }
        
        .gauge-display {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
        
        .gauge-value-text {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 0.25rem;
        }
        
        .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
        }
        
        .unit {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        
        .gauge-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }
        
        .gauge-percentage {
          font-size: 0.9rem;
          font-weight: 600;
          color: ${dynamicColor};
        }
        
        @media (max-width: 768px) {
          .value {
            font-size: 1.2rem;
          }
          
          .gauge-marker-text {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GaugeChart;
