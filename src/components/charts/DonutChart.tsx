import React from 'react';

import type { DonutChartData } from '../../types/chartTypes';

interface DonutChartProps {
  data: DonutChartData[];
  title: string;
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  centerText?: string;
  centerValue?: string | number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  innerRadius = 60,
  showLabels = true,
  showPercentages = true,
  centerText,
  centerValue
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-no-data">Sin datos disponibles</div>
      </div>
    );
  }

  const radius = size / 2 - 10;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;

  const createPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = cumulativePercentage * 2 * Math.PI;
    const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI;
    
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);

    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  const getLabelPosition = (percentage: number, cumulativePercentage: number) => {
    const angle = (cumulativePercentage + percentage / 2) * 2 * Math.PI;
    const labelRadius = radius + 20;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="chart-container donut-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <svg width={size + 60} height={size + 60} className="chart-svg">
          <g transform="translate(30, 30)">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const currentCumulative = cumulativePercentage;
              cumulativePercentage += percentage;
              
              const path = createPath(percentage, currentCumulative);
              const labelPos = getLabelPosition(percentage, currentCumulative);
              
              return (
                <g key={index} className="donut-segment">
                  <path
                    d={path}
                    fill={item.color}
                    className="donut-path"
                    data-label={item.label}
                    data-value={item.value}
                  >
                    <title>{`${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)`}</title>
                  </path>
                  
                  {showLabels && percentage > 0.05 && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="donut-label"
                      fill="var(--color-text)"
                    >
                      {showPercentages ? `${(percentage * 100).toFixed(1)}%` : item.label}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Centro del donut */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius - 5}
              fill="var(--color-glass-strong)"
              stroke="var(--color-border)"
              strokeWidth="1"
              className="donut-center"
            />
            
            {centerText && (
              <text
                x={center}
                y={center - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="donut-center-text"
                fill="var(--color-text)"
              >
                {centerText}
              </text>
            )}
            
            {centerValue && (
              <text
                x={center}
                y={center + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="donut-center-value"
                fill="var(--color-primary)"
              >
                {centerValue}
              </text>
            )}
          </g>
        </svg>
        
        {showLabels && (
          <div className="donut-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
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
        
        .chart-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
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
        
        .donut-path {
          transition: all 0.3s ease;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .donut-path:hover {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1);
          transform: scale(1.02);
          transform-origin: center;
        }
        
        .donut-label {
          font-size: 0.8rem;
          font-weight: 500;
          pointer-events: none;
        }
        
        .donut-center {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .donut-center-text {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .donut-center-value {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 200px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .legend-item:hover {
          background: var(--color-glass-subtle);
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .legend-label {
          flex: 1;
          font-size: 0.8rem;
          color: var(--color-text);
        }
        
        .legend-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        
        @media (max-width: 768px) {
          .chart-wrapper {
            flex-direction: column;
          }
          
          .donut-legend {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DonutChart;
