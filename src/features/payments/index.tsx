// Módulo de Pagos - MussikOn Admin System
// Sistema completo de gestión de pagos con verificación de depósitos por admin

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  VerifiedUser as VerifiedUserIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Importar servicios y hooks
import { paymentService } from '../../services/paymentService';
import type { Invoice } from '../../services/paymentService';
import { useApiRequest } from '../../hooks/useApiRequest';

// Importar componentes modernos
import ModernCard from '../../components/ui/ModernCard';
import ModernButton from '../../components/ui/ModernButton';
import ModernInput from '../../components/ui/ModernInput';
import VoucherImage from '../../components/VoucherImage';
import VoucherList from '../../components/VoucherList';

// Importar estilos
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { designSystem } from '../../theme/designSystem';

// Tipos para las pestañas
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payments-tabpanel-${index}`}
      aria-labelledby={`payments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Datos mock para cuando el backend no esté disponible
const mockStats = {
  totalRevenue: 125000,
  totalTransactions: 342,
  averageTransaction: 365.5,
  successRate: 0.94
};

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    userId: 'user_123',
    amount: 150.00,
    currency: 'USD',
    status: 'sent',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{
      id: 'item_001',
      description: 'Servicios de música',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00
    }],
    total: 150.00,
    tax: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv_002',
    userId: 'user_456',
    amount: 250.00,
    currency: 'USD',
    status: 'paid',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{
      id: 'item_002',
      description: 'Evento corporativo',
      quantity: 1,
      unitPrice: 250.00,
      total: 250.00
    }],
    total: 250.00,
    tax: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv_003',
    userId: 'user_789',
    amount: 75.00,
    currency: 'USD',
    status: 'overdue',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{
      id: 'item_003',
      description: 'Sesión de práctica',
      quantity: 1,
      unitPrice: 75.00,
      total: 75.00
    }],
    total: 75.00,
    tax: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const Payments: React.FC = () => {
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    amount: '',
    userId: ''
  });

  // Estado para diálogos
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Estado para modo demo
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Hooks para API requests
  const invoicesRequest = useApiRequest(paymentService.getInvoices.bind(paymentService));
  const paymentMethodsRequest = useApiRequest(paymentService.getPaymentMethods.bind(paymentService));
  const paymentIntentsRequest = useApiRequest(paymentService.getPaymentIntents.bind(paymentService));
  const statsRequest = useApiRequest(paymentService.getPaymentStats.bind(paymentService));
  const markAsPaidRequest = useApiRequest(paymentService.markInvoiceAsPaid.bind(paymentService));

  // Cargar datos según la pestaña
  useEffect(() => {
    const loadData = async () => {
      try {
        switch (tabValue) {
          case 0: // Dashboard
            await statsRequest.execute();
            break;
          case 1: // Facturas
            await invoicesRequest.execute();
            break;
          case 2: // Métodos de Pago
            await paymentMethodsRequest.execute();
            break;
          case 3: // Transacciones
            await paymentIntentsRequest.execute();
            break;
          case 4: // Vouchers
            // Los vouchers se cargan automáticamente en el componente VoucherList
            break;
        }
      } catch (error: any) {
        // Si hay error de permisos o conexión, activar modo demo
        if (error?.response?.status === 403 || error?.response?.status === 500) {
          console.log('🔧 Activando modo demo debido a error de permisos/conexión');
          setIsDemoMode(true);
        }
      }
    };

    loadData();
  }, [tabValue]);

  // Manejar cambio de pestañas
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar verificación de depósito
  const handleVerifyDeposit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setVerificationNotes('');
    setVerifyDialogOpen(true);
  };

  // Confirmar verificación
  const confirmVerification = async () => {
    if (!selectedInvoice) return;

    if (isDemoMode) {
      // En modo demo, simular verificación exitosa
      setVerifyDialogOpen(false);
      setSelectedInvoice(null);
      setVerificationNotes('');
      return;
    }

    try {
      await markAsPaidRequest.execute(selectedInvoice.id);
      setVerifyDialogOpen(false);
      setSelectedInvoice(null);
      setVerificationNotes('');
      
      // Recargar datos
      invoicesRequest.execute();
      statsRequest.execute();
    } catch (error) {
      console.error('Error verificando depósito:', error);
    }
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'sent':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'info';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'sent':
        return 'Pendiente';
      case 'overdue':
        return 'Vencido';
      case 'cancelled':
        return 'Cancelado';
      case 'draft':
        return 'Borrador';
      default:
        return status;
    }
  };

  // Formatear moneda
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar dashboard
  const renderDashboard = () => {
    if (statsRequest.loading && !isDemoMode) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    const stats = isDemoMode ? mockStats : (statsRequest.data || mockStats);

    return (
      <Box>
        {/* Alerta de modo demo */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>🔧 Modo Demo Activado:</strong> Mostrando estadísticas de ejemplo.
          </Alert>
        )}

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    {formatCurrency(stats.totalRevenue, 'USD')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos Totales
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.primary
                }}>
                  <MoneyIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                    {stats.totalTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transacciones
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'success.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.success
                }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                    {formatCurrency(stats.averageTransaction, 'USD')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Promedio por Transacción
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'warning.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.warning
                }}>
                  <AccountBalanceIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', mb: 1 }}>
                    {(stats.successRate * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de Éxito
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'info.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.secondary
                }}>
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>
        </Grid>

        {/* Gráficos y análisis */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ModernCard variant="elevated" sx={{ height: 400 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Análisis de Pagos
                </Typography>
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 2
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Gráfico de análisis de pagos (implementar con librería de gráficos)
                  </Typography>
                </Box>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ModernCard variant="elevated" sx={{ height: 400 }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Actividad Reciente
                </Typography>
                <List sx={{ p: 0 }}>
                                     {mockInvoices.slice(0, 5).map((invoice) => (
                    <ListItem key={invoice.id} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: getStatusColor(invoice.status) + '.main',
                          width: 40,
                          height: 40
                        }}>
                          <ReceiptIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {getStatusText(invoice.status)} • {formatDate(invoice.dueDate)}
                          </Typography>
                        }
                      />
                      <Chip
                        label={getStatusText(invoice.status)}
                        color={getStatusColor(invoice.status) as any}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </ModernCard>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Renderizar facturas
  const renderInvoices = () => {
    if (invoicesRequest.loading && !isDemoMode) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (invoicesRequest.error && !isDemoMode) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando facturas: {invoicesRequest.error}
        </Alert>
      );
    }

    const invoices = isDemoMode ? mockInvoices : (invoicesRequest.data || []);

    return (
      <Box>
        {/* Alerta de modo demo */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>🔧 Modo Demo Activado:</strong> Mostrando facturas de ejemplo.
          </Alert>
        )}

        {/* Filtros mejorados */}
        <ModernCard variant="flat" sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1 }} />
              Filtros de Búsqueda
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="all">Todos los Estados</MenuItem>
                    <MenuItem value="sent">Pendientes</MenuItem>
                    <MenuItem value="paid">Pagados</MenuItem>
                    <MenuItem value="overdue">Vencidos</MenuItem>
                    <MenuItem value="cancelled">Cancelados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernInput
                  fullWidth
                  size="sm"
                  label="Fecha Desde"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  startIcon={<CalendarIcon />}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernInput
                  fullWidth
                  size="sm"
                  label="Fecha Hasta"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  startIcon={<CalendarIcon />}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ModernButton
                  variant="outline"
                  size="sm"
                  startIcon={<RefreshIcon />}
                  onClick={() => invoicesRequest.execute()}
                  disabled={invoicesRequest.loading}
                  sx={{ width: '100%' }}
                >
                  {invoicesRequest.loading ? 'Actualizando...' : 'Actualizar'}
                </ModernButton>
              </Grid>
            </Grid>
          </Box>
        </ModernCard>

        {/* Contador de resultados */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Facturas ({invoices.length})
          </Typography>
          <ModernButton
            variant="primary"
            size="sm"
            startIcon={<DownloadIcon />}
            sx={{ px: 3 }}
          >
            Exportar
          </ModernButton>
        </Box>

        {/* Lista de facturas mejorada */}
        <Grid container spacing={2}>
          {invoices.map((invoice) => (
            <Grid item xs={12} md={6} lg={4} key={invoice.id}>
              <ModernCard 
                variant="elevated" 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: designSystem.shadows.xl
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: getStatusColor(invoice.status) + '.main',
                        width: 40,
                        height: 40,
                        mr: 2
                      }}>
                        <ReceiptIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {invoice.id.slice(0, 8)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={getStatusText(invoice.status)}
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Información principal */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      color: 'primary.main',
                      mb: 1
                    }}>
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Usuario: {invoice.userId.slice(0, 8)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Vence: {formatDate(invoice.dueDate)}
                      </Typography>
                    </Box>
                    
                    {/* Voucher del depósito */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Comprobante:
                      </Typography>
                      <VoucherImage 
                        depositId={invoice.id}
                        size="small"
                        showPreview={true}
                        onError={(error) => {
                          console.error('Error cargando voucher:', error);
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Acciones */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      startIcon={<VisibilityIcon />}
                      sx={{ flex: 1 }}
                    >
                      Ver Detalles
                    </ModernButton>
                    {invoice.status === 'sent' && (
                      <ModernButton
                        variant="primary"
                        size="sm"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVerifyDeposit(invoice)}
                        sx={{ flex: 1 }}
                      >
                        Verificar
                      </ModernButton>
                    )}
                  </Box>
                </Box>
              </ModernCard>
            </Grid>
          ))}
        </Grid>

        {/* Estado vacío */}
        {invoices.length === 0 && (
          <ModernCard variant="flat" sx={{ textAlign: 'center', py: 6 }}>
            <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No se encontraron facturas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No hay facturas que coincidan con los filtros aplicados
            </Typography>
            <ModernButton
              variant="outline"
              onClick={() => setFilters({ status: 'all', dateFrom: '', dateTo: '', amount: '', userId: '' })}
            >
              Limpiar Filtros
            </ModernButton>
          </ModernCard>
        )}
      </Box>
    );
  };

  // Renderizar métodos de pago
  const renderPaymentMethods = () => {
    return (
      <ModernCard variant="elevated">
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Métodos de Pago Configurados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configuración de métodos de pago (implementar según necesidades)
          </Typography>
        </Box>
      </ModernCard>
    );
  };

  // Renderizar transacciones
  const renderTransactions = () => {
    return (
      <ModernCard variant="elevated">
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Historial de Transacciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Historial detallado de transacciones (implementar según necesidades)
          </Typography>
        </Box>
      </ModernCard>
    );
  };

  return (
    <ResponsiveLayout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          mb: 1,
          background: designSystem.gradients.primary,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Sistema de Pagos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona facturas, verifica depósitos y monitorea transacciones
        </Typography>
      </Box>

      {/* Pestañas mejoradas */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              mx: 0.5,
              '&.Mui-selected': {
                background: 'rgba(127, 95, 255, 0.1)',
                color: 'primary.main'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 1.5
            }
          }}
        >
          <Tab 
            label="Dashboard" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
            sx={{ 
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                fontSize: '1.2rem'
              }
            }}
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Facturas
                {invoicesRequest.data && invoicesRequest.data.filter(i => i.status === 'sent').length > 0 && (
                  <Badge 
                    badgeContent={invoicesRequest.data.filter(i => i.status === 'sent').length} 
                    color="warning" 
                    sx={{ 
                      ml: 1,
                      '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        height: 20,
                        minWidth: 20
                      }
                    }}
                  />
                )}
              </Box>
            } 
            icon={<ReceiptIcon />} 
            iconPosition="start"
            sx={{ 
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                fontSize: '1.2rem'
              }
            }}
          />
          <Tab 
            label="Métodos de Pago" 
            icon={<CreditCardIcon />} 
            iconPosition="start"
            sx={{ 
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                fontSize: '1.2rem'
              }
            }}
          />
          <Tab 
            label="Transacciones" 
            icon={<PaymentIcon />} 
            iconPosition="start"
            sx={{ 
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                fontSize: '1.2rem'
              }
            }}
          />
          <Tab 
            label="Vouchers" 
            icon={<ReceiptIcon />} 
            iconPosition="start"
            sx={{ 
              '& .MuiTab-iconWrapper': {
                marginRight: 1,
                fontSize: '1.2rem'
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Contenido de las pestañas */}
      <TabPanel value={tabValue} index={0}>
        {renderDashboard()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderInvoices()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderPaymentMethods()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {renderTransactions()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <VoucherList 
          title="Vouchers de Depósitos"
          showFilters={true}
          maxItems={20}
          onVoucherClick={(voucher) => {
            console.log('Voucher seleccionado:', voucher);
          }}
        />
      </TabPanel>

      {/* Diálogo de verificación de depósito mejorado */}
      <Dialog 
        open={verifyDialogOpen} 
        onClose={() => setVerifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: designSystem.shadows.xl
          }
        }}
      >
        <DialogTitle sx={{ 
          background: designSystem.gradients.success,
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUserIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Verificar Depósito
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedInvoice && (
            <Box>
              <ModernCard variant="flat" sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Información de la Factura
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID de Factura
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedInvoice.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Usuario ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedInvoice.userId}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Monto
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Vencimiento
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedInvoice.dueDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ModernCard>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Notas de Verificación
              </Typography>
              <ModernInput
                fullWidth
                multiline
                rows={4}
                label="Notas sobre la verificación del depósito"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Ej: Depósito verificado en cuenta bancaria, comprobante recibido, etc."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <ModernButton
            variant="ghost"
            onClick={() => setVerifyDialogOpen(false)}
            sx={{ px: 3 }}
          >
            Cancelar
          </ModernButton>
          <ModernButton
            variant="primary"
            onClick={confirmVerification}
            disabled={markAsPaidRequest.loading}
            loading={markAsPaidRequest.loading}
            startIcon={<CheckCircleIcon />}
            sx={{ px: 3 }}
          >
            {markAsPaidRequest.loading ? 'Verificando...' : 'Confirmar Verificación'}
          </ModernButton>
        </DialogActions>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default Payments; 