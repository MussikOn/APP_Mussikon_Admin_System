// Tipos unificados para todos los gráficos

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  percentage?: number;
  timestamp?: string;
}

// Para compatibilidad con los componentes existentes
export type ChartData = ChartDataPoint;
export type DonutChartData = ChartDataPoint;
export type AreaChartData = ChartDataPoint;
export type RadarChartDataPoint = {
  label: string;
  value: number;
  maxValue?: number;
};
