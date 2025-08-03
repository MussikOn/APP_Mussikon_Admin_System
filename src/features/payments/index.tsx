// Módulo de Pagos - MussikOn Admin System
// Sistema completo de gestión de pagos con verificación de depósitos por admin

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Badge
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
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';

// Importar servicios y hooks
import { paymentService } from '../../services/paymentService';
import type { Invoice } from '../../services/paymentService';
import { useApiRequest } from '../../hooks/useApiRequest';

// Importar estilos
import { buttonStyles, chipStyles, cardStyles } from '../../theme/buttonStyles';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { responsiveTypography } from '../../theme/breakpoints';

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
    amount: 75.50,
    currency: 'USD',
    status: 'paid',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{
      id: 'item_002',
      description: 'Evento musical',
      quantity: 1,
      unitPrice: 75.50,
      total: 75.50
    }],
    total: 75.50,
    tax: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv_003',
    userId: 'user_789',
    amount: 200.00,
    currency: 'USD',
    status: 'overdue',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{
      id: 'item_003',
      description: 'Concierto privado',
      quantity: 1,
      unitPrice: 200.00,
      total: 200.00
    }],
    total: 200.00,
    tax: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockPaymentMethods = [
  {
    id: 'pm_001',
    userId: 'user_123',
    type: 'card' as const,
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pm_002',
    userId: 'user_456',
    type: 'paypal' as const,
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockTransactions = [
  {
    id: 'pi_001',
    amount: 150.00,
    currency: 'USD',
    status: 'succeeded' as const,
    paymentMethodId: 'pm_001',
    description: 'Pago por servicios de música',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pi_002',
    amount: 75.50,
    currency: 'USD',
    status: 'succeeded' as const,
    paymentMethodId: 'pm_002',
    description: 'Pago por evento',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Componente principal de Pagos
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

    if (statsRequest.error && !isDemoMode) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando estadísticas: {statsRequest.error}
        </Alert>
      );
    }

    const stats = isDemoMode ? mockStats : statsRequest.data;

    return (
      <Box>
        {/* Alerta de modo demo */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>🔧 Modo Demo Activado:</strong> Mostrando datos de ejemplo porque el backend no está disponible o hay problemas de permisos.
          </Alert>
        )}

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="div">
                    Ingresos Totales
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats ? formatCurrency(stats.totalRevenue) : '$0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de ingresos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" component="div">
                    Transacciones
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats ? stats.totalTransactions : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de transacciones
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" component="div">
                    Tasa de Éxito
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats ? `${(stats.successRate * 100).toFixed(1)}%` : '0%'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transacciones exitosas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6" component="div">
                    Promedio
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats ? formatCurrency(stats.averageTransaction) : '$0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por transacción
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas importantes */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>💳 Sistema de Verificación de Depósitos:</strong> Los administradores pueden verificar manualmente los depósitos de los usuarios marcando las facturas como pagadas.
        </Alert>
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

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="sent">Pendientes</MenuItem>
                    <MenuItem value="paid">Pagados</MenuItem>
                    <MenuItem value="overdue">Vencidos</MenuItem>
                    <MenuItem value="cancelled">Cancelados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Desde"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Hasta"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={() => invoicesRequest.execute()}
                  disabled={invoicesRequest.loading}
                  sx={{
                    ...buttonStyles.secondary,
                    px: 2.5,
                    py: 1,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de facturas */}
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Usuario</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Monto</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha Vencimiento</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {invoice.id.slice(0, 8)}...
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {invoice.userId.slice(0, 8)}...
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Chip
                      label={getStatusText(invoice.status)}
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                      sx={chipStyles[getStatusColor(invoice.status) as keyof typeof chipStyles]}
                    />
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          sx={{
                            ...buttonStyles.icon,
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.2)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {invoice.status === 'sent' && (
                        <Tooltip title="Verificar depósito">
                          <IconButton
                            size="small"
                            onClick={() => handleVerifyDeposit(invoice)}
                            sx={{
                              ...buttonStyles.icon,
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: 'success.main',
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <VerifiedUserIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Estadísticas de facturas */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resumen de Facturas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {invoices.filter(i => i.status === 'sent').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes de Verificación
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {invoices.filter(i => i.status === 'paid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verificadas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error.main">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vencidas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {formatCurrency(
                      invoices
                        .filter(i => i.status === 'sent')
                        .reduce((sum, i) => sum + i.amount, 0)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monto Pendiente
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  // Renderizar métodos de pago
  const renderPaymentMethods = () => {
    if (paymentMethodsRequest.loading && !isDemoMode) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (paymentMethodsRequest.error && !isDemoMode) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando métodos de pago: {paymentMethodsRequest.error}
        </Alert>
      );
    }

    const paymentMethods = isDemoMode ? mockPaymentMethods : (paymentMethodsRequest.data || []);

    return (
      <Box>
        {/* Alerta de modo demo */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>🔧 Modo Demo Activado:</strong> Mostrando métodos de pago de ejemplo.
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>💳 Métodos de Pago:</strong> Gestión de tarjetas, cuentas bancarias y PayPal de los usuarios.
        </Alert>

        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Tipo</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Detalles</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Por Defecto</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method) => (
                <tr key={method.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Chip
                      label={method.type === 'card' ? 'Tarjeta' : method.type === 'bank_account' ? 'Cuenta Bancaria' : 'PayPal'}
                      color="primary"
                      size="small"
                      sx={chipStyles.primary}
                    />
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {method.type === 'card' && method.last4 ? `**** ${method.last4}` : method.type === 'bank_account' ? 'Cuenta Bancaria' : 'PayPal'}
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Chip
                      label={method.isActive ? 'Activo' : 'Inactivo'}
                      color={method.isActive ? 'success' : 'default'}
                      size="small"
                      sx={method.isActive ? chipStyles.success : chipStyles.secondary}
                    />
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    {method.isDefault ? (
                      <Chip
                        label="Por Defecto"
                        color="primary"
                        size="small"
                        sx={chipStyles.primary}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {formatDate(method.createdAt)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };

  // Renderizar transacciones
  const renderTransactions = () => {
    if (paymentIntentsRequest.loading && !isDemoMode) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (paymentIntentsRequest.error && !isDemoMode) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando transacciones: {paymentIntentsRequest.error}
        </Alert>
      );
    }

    const transactions = isDemoMode ? mockTransactions : (paymentIntentsRequest.data || []);

    return (
      <Box>
        {/* Alerta de modo demo */}
        {isDemoMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>🔧 Modo Demo Activado:</strong> Mostrando transacciones de ejemplo.
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>💳 Transacciones:</strong> Historial completo de todas las transacciones procesadas.
        </Alert>

        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Monto</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.id.slice(0, 8)}...
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Chip
                      label={getStatusText(transaction.status)}
                      color={getStatusColor(transaction.status) as any}
                      size="small"
                      sx={chipStyles[getStatusColor(transaction.status) as keyof typeof chipStyles]}
                    />
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {transaction.description}
                    </Typography>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                      {formatDate(transaction.createdAt)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };

  return (
    <ResponsiveLayout spacing="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: responsiveTypography.h3 }}>
            Sistema de Pagos
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => {
                statsRequest.execute();
                invoicesRequest.execute();
                paymentMethodsRequest.execute();
                paymentIntentsRequest.execute();
              }}
              disabled={statsRequest.loading || invoicesRequest.loading || paymentMethodsRequest.loading || paymentIntentsRequest.loading}
              sx={{
                ...buttonStyles.secondary,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Actualizar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                ...buttonStyles.primary,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Gestión completa de pagos, facturas y verificación de depósitos por administradores
        </Typography>
      </Box>

      {/* Pestañas */}
      <Box sx={{ 
        borderBottom: 2, 
        borderColor: 'primary.main', 
        mb: 4,
        backgroundColor: 'background.paper',
        borderRadius: 1
      }}>
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
              color: 'text.secondary',
              padding: '12px 24px',
              margin: '0 8px',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s ease-in-out',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                boxShadow: 'none'
              },
              '&.Mui-selected': {
                color: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                fontWeight: 700,
                boxShadow: 'none'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: 'primary.main',
              borderRadius: '2px 2px 0 0'
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

      {/* Diálogo de verificación de depósito */}
      <Dialog 
        open={verifyDialogOpen} 
        onClose={() => setVerifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUserIcon sx={{ mr: 1, color: 'success.main' }} />
            Verificar Depósito
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Factura ID:</strong> {selectedInvoice.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Usuario ID:</strong> {selectedInvoice.userId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Monto:</strong> {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Fecha de Vencimiento:</strong> {formatDate(selectedInvoice.dueDate)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Notas de Verificación
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notas sobre la verificación del depósito"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Ej: Depósito verificado en cuenta bancaria, comprobante recibido, etc."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 3 }}>
          <Button 
            onClick={() => setVerifyDialogOpen(false)}
            sx={{
              ...buttonStyles.text,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              border: '1px solid #e0e0e0',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderColor: '#bdbdbd'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmVerification}
            disabled={markAsPaidRequest.loading}
            startIcon={markAsPaidRequest.loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
            sx={{
              ...buttonStyles.primary,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {markAsPaidRequest.loading ? 'Verificando...' : 'Confirmar Verificación'}
          </Button>
        </DialogActions>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default Payments; 