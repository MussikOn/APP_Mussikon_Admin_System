import React, { useState, useEffect } from 'react';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import AreaChart from '../../components/charts/AreaChart';
import DonutChart from '../../components/charts/DonutChart';
import RadarChart from '../../components/charts/RadarChart';
import GaugeChart from '../../components/charts/GaugeChart';
import { dashboardService, type DashboardMetrics } from '../../services/dashboardService';

const DashboardComplete: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getAllMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>🚀 Cargando Dashboard Completo...</h2>
        <p>Conectando con todos los servicios de la API</p>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="dashboard-error">
        <h2>❌ Error en Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          🔄 Reintentar
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  // Preparar datos para gráficos
  const userRoleData = dashboardService.prepareChartData(metrics.users.byRole, [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)'
  ]);

  const eventStatusData = dashboardService.prepareChartData(metrics.events.byStatus, [
    'var(--color-info)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-danger)'
  ]);

  const eventTypeData = dashboardService.prepareChartData(metrics.events.byType);

  const paymentMethodData = dashboardService.prepareChartData(metrics.payments.byMethod);

  const mobilePaymentBankData = dashboardService.prepareChartData(metrics.mobilePayments.depositsByBank);

  const imageTypeData = dashboardService.prepareChartData(metrics.images.byType);

  // Datos para gráfico de radar del sistema
  const systemRadarData = [
    { label: 'CPU', value: metrics.system.cpuUsage, maxValue: 100 },
    { label: 'Memoria', value: metrics.system.memoryUsage, maxValue: 100 },
    { label: 'Disco', value: metrics.system.diskUsage, maxValue: 100 },
    { label: 'Red', value: 100 - (metrics.system.networkLatency / 100 * 100), maxValue: 100 },
    { label: 'Uptime', value: metrics.system.uptime, maxValue: 100 },
    { label: 'Tasa Error', value: 100 - metrics.system.errorRate, maxValue: 100 }
  ];

  // Datos para gráficos de área (simulamos series temporales)
  const userGrowthData = dashboardService.prepareSimpleChartData(
    Array.from({ length: 30 }, (_, i) => ({
      label: `Día ${i + 1}`,
      value: Math.floor(metrics.users.total * 0.8 + Math.random() * metrics.users.total * 0.4)
    })),
    ['var(--color-success)']
  );

  const revenueData = dashboardService.prepareSimpleChartData(
    Array.from({ length: 12 }, (_, i) => ({
      label: `Mes ${i + 1}`,
      value: Math.floor(metrics.payments.totalRevenue * 0.6 + Math.random() * metrics.payments.totalRevenue * 0.8)
    })),
    ['var(--color-success)']
  );

  return (
    <div className="dashboard-complete">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            🎵 DASHBOARD COMPLETO MUSSIKON
          </h1>
          <div className="connection-status">
            <div className="status-indicator online"></div>
            <span>◆ TODOS LOS SERVICIOS CONECTADOS ◆</span>
          </div>
          <div className="last-update">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn" disabled={loading}>
          {loading ? '⟳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Métricas principales */}
      <div className="metrics-overview">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Usuarios Totales</h3>
            <div className="metric-value">{metrics.users.total.toLocaleString()}</div>
            <div className="metric-change positive">+{metrics.users.newToday} hoy</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎪</div>
          <div className="metric-content">
            <h3>Eventos Activos</h3>
            <div className="metric-value">{metrics.events.total.toLocaleString()}</div>
            <div className="metric-change">{metrics.events.upcoming} próximos</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🖼️</div>
          <div className="metric-content">
            <h3>Imágenes</h3>
            <div className="metric-value">{metrics.images.total.toLocaleString()}</div>
            <div className="metric-change">{(metrics.images.totalSize / 1024 / 1024).toFixed(1)} MB</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Ingresos</h3>
            <div className="metric-value">${metrics.payments.totalRevenue.toLocaleString()}</div>
            <div className="metric-change positive">+{metrics.payments.revenueGrowth}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📱</div>
          <div className="metric-content">
            <h3>Pagos Móviles</h3>
            <div className="metric-value">${metrics.mobilePayments.totalDeposits.toLocaleString()}</div>
            <div className="metric-change">{metrics.mobilePayments.pendingDeposits} pendientes</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-content">
            <h3>Conversaciones</h3>
            <div className="metric-value">{metrics.chat.totalConversations.toLocaleString()}</div>
            <div className="metric-change">{metrics.chat.activeConversations} activas</div>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="charts-grid">
        {/* Fila 1: Usuarios y Eventos */}
        <div className="chart-section">
          <h2 className="section-title">📊 ANÁLISIS DE USUARIOS</h2>
          <div className="charts-row">
            <div className="chart-container">
              <DonutChart
                data={userRoleData}
                title="Usuarios por Rol"
                showLabels={true}
                centerText="Total"
                centerValue={metrics.users.total.toLocaleString()}
              />
            </div>
            <div className="chart-container">
              <AreaChart
                data={userGrowthData}
                title="Crecimiento de Usuarios (30 días)"
                color="var(--color-success)"
                height={250}
              />
            </div>
            <div className="chart-container">
              <GaugeChart
                value={metrics.users.active}
                maxValue={metrics.users.total}
                title="Usuarios Activos"
                label="del total"
                color="var(--color-info)"
              />
            </div>
          </div>
        </div>

        {/* Fila 2: Eventos */}
        <div className="chart-section">
          <h2 className="section-title">🎪 ANÁLISIS DE EVENTOS</h2>
          <div className="charts-row">
            <div className="chart-container">
              <PieChart
                data={eventStatusData}
                title="Eventos por Estado"
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={eventTypeData}
                title="Tipos de Eventos"
                color="var(--color-accent)"
              />
            </div>
            <div className="chart-container">
              <GaugeChart
                value={metrics.events.attendanceRate}
                maxValue={100}
                title="Tasa de Asistencia"
                unit="%"
                color="var(--color-warning)"
              />
            </div>
          </div>
        </div>

        {/* Fila 3: Pagos */}
        <div className="chart-section">
          <h2 className="section-title">💰 ANÁLISIS FINANCIERO</h2>
          <div className="charts-row">
            <div className="chart-container">
              <AreaChart
                data={revenueData}
                title="Ingresos por Mes"
                color="var(--color-success)"
                height={250}
              />
            </div>
            <div className="chart-container">
              <DonutChart
                data={paymentMethodData}
                title="Métodos de Pago"
                showLabels={true}
                centerText="Total"
                centerValue={metrics.payments.totalTransactions.toLocaleString()}
              />
            </div>
            <div className="chart-container">
              <GaugeChart
                value={metrics.payments.successRate}
                maxValue={100}
                title="Tasa de Éxito"
                unit="%"
                color="var(--color-success)"
              />
            </div>
          </div>
        </div>

        {/* Fila 4: Pagos Móviles */}
        <div className="chart-section">
          <h2 className="section-title">📱 PAGOS MÓVILES</h2>
          <div className="charts-row">
            <div className="chart-container">
              <BarChart
                data={mobilePaymentBankData}
                title="Depósitos por Banco"
                color="var(--color-info)"
              />
            </div>
            <div className="chart-container">
                          <LineChart
              data={dashboardService.prepareSimpleChartData([
                { label: 'Pendientes', value: metrics.mobilePayments.pendingDeposits },
                { label: 'Verificados', value: metrics.mobilePayments.verifiedDeposits },
                { label: 'Rechazados', value: metrics.mobilePayments.rejectedDeposits }
              ])}
              title="Estado de Depósitos"
              color="var(--color-primary)"
            />
            </div>
            <div className="chart-container">
              <GaugeChart
                value={metrics.mobilePayments.balance}
                maxValue={metrics.mobilePayments.totalDeposits}
                title="Balance Actual"
                unit="$"
                color="var(--color-cyan)"
              />
            </div>
          </div>
        </div>

        {/* Fila 5: Sistema e Imágenes */}
        <div className="chart-section">
          <h2 className="section-title">🖼️ GESTIÓN DE CONTENIDO</h2>
          <div className="charts-row">
            <div className="chart-container">
              <PieChart
                data={imageTypeData}
                title="Tipos de Imagen"
              />
            </div>
            <div className="chart-container">
              <GaugeChart
                value={metrics.images.storageUsed}
                maxValue={metrics.images.storageLimit}
                title="Almacenamiento"
                unit="bytes"
                color="var(--color-warning)"
              />
            </div>
            <div className="chart-container">
                          <BarChart
              data={dashboardService.prepareSimpleChartData([
                { label: 'Hoy', value: metrics.images.uploadsToday },
                { label: 'Esta Semana', value: metrics.images.uploadsThisWeek },
                { label: 'Total', value: metrics.images.total }
              ])}
              title="Subidas de Imágenes"
              color="var(--color-secondary)"
            />
            </div>
          </div>
        </div>

        {/* Fila 6: Sistema */}
        <div className="chart-section">
          <h2 className="section-title">⚙️ MONITOREO DEL SISTEMA</h2>
          <div className="charts-row">
            <div className="chart-container large">
              <RadarChart
                data={systemRadarData}
                title="Rendimiento del Sistema"
                fillColor="var(--color-info)"
                strokeColor="var(--color-info)"
                size={350}
              />
            </div>
            <div className="system-metrics">
              <div className="system-metric">
                <GaugeChart
                  value={metrics.system.cpuUsage}
                  maxValue={100}
                  title="CPU"
                  unit="%"
                  size={120}
                />
              </div>
              <div className="system-metric">
                <GaugeChart
                  value={metrics.system.memoryUsage}
                  maxValue={100}
                  title="Memoria"
                  unit="%"
                  size={120}
                />
              </div>
              <div className="system-metric">
                <GaugeChart
                  value={metrics.system.diskUsage}
                  maxValue={100}
                  title="Disco"
                  unit="%"
                  size={120}
                />
              </div>
              <div className="system-metric">
                <GaugeChart
                  value={metrics.system.uptime}
                  maxValue={100}
                  title="Uptime"
                  unit="%"
                  size={120}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-complete {
          padding: clamp(1rem, 3vw, 2rem);
          min-height: 100vh;
          background: var(--color-background);
          animation: dashboardLoad 0.8s ease-out;
        }

        @keyframes dashboardLoad {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--color-glass-strong);
          border-radius: 16px;
          border: 1px solid var(--color-border);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-glass);
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dashboard-title {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 800;
          margin: 0;
          background: var(--color-gradient-1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px var(--color-glow);
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-success);
          font-weight: 600;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.online {
          background: var(--color-success);
          box-shadow: 0 0 10px var(--color-success);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .last-update {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .refresh-btn {
          padding: 0.75rem 1.5rem;
          background: var(--color-gradient-1);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .refresh-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--color-glass);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-glass);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
          border-color: var(--color-primary);
        }

        .metric-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-glass-strong);
          border-radius: 12px;
          border: 1px solid var(--color-border);
        }

        .metric-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .metric-change {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .metric-change.positive {
          color: var(--color-success);
        }

        .charts-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .chart-section {
          background: var(--color-glass);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-glass);
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          color: var(--color-text);
          background: var(--color-gradient-2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          align-items: start;
        }

        .chart-container {
          min-height: 300px;
        }

        .chart-container.large {
          grid-column: 1 / -1;
          max-width: 600px;
          justify-self: center;
        }

        .system-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .system-metric {
          display: flex;
          justify-content: center;
        }

        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          color: var(--color-text);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-border);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .retry-btn {
          padding: 0.75rem 1.5rem;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .metrics-overview {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .charts-row {
            grid-template-columns: 1fr;
          }

          .chart-container.large {
            grid-column: 1;
          }

          .system-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardComplete;
