// Pantalla de Verificación de Depósitos - MussikOn Admin System
// Permite a los administradores verificar depósitos realizados desde la app móvil

import React, { useState } from 'react';
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
  ListItemText
} from '@mui/material';
import {
  Smartphone as SmartphoneIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

// Importar servicios y hooks
import { useMobilePayments } from '../../hooks/useMobilePayments';
import type { MobilePayment } from '../../services/mobilePaymentsService';

// Importar componentes modernos
import ModernCard from '../../components/ui/ModernCard';
import ModernButton from '../../components/ui/ModernButton';
import ModernInput from '../../components/ui/ModernInput';

// Importar estilos
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { designSystem } from '../../theme/designSystem';
import PaymentCard from './components/PaymentCard';

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
      id={`mobile-payments-tabpanel-${index}`}
      aria-labelledby={`mobile-payments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Componente principal de Verificación de Depósitos
const MobilePayments: React.FC = () => {
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
  });

  // Estados para diálogos
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MobilePayment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Hook para depósitos
  const {
    payments,
    stats,
    loading,
    error,
    verifyPayment,
    rejectPayment,
    refreshData
  } = useMobilePayments();

  // Manejar cambio de pestañas
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar verificación de depósito
  const handleVerifyPayment = (payment: MobilePayment) => {
    setSelectedPayment(payment);
    setVerificationNotes('');
    setVerifyDialogOpen(true);
  };

  // Manejar rechazo de depósito
  const handleRejectPayment = (payment: MobilePayment) => {
    setSelectedPayment(payment);
    setRejectionReason('');
    setRejectionNotes('');
    setRejectDialogOpen(true);
  };

  // Confirmar verificación
  const confirmVerification = async () => {
    if (!selectedPayment) return;

    try {
      await verifyPayment(selectedPayment.id, {
        approved: true,
        notes: verificationNotes,
        verificationData: {
          bankDepositDate: new Date().toISOString().split('T')[0],
          bankDepositTime: new Date().toLocaleTimeString('es-ES', { hour12: false }),
          referenceNumber: `REF-${Date.now()}`,
          accountLastFourDigits: '****'
        }
      });
      setVerifyDialogOpen(false);
            setSelectedPayment(null);
      setVerificationNotes('');
    } catch (error) {
      console.error('Error verificando depósito:', error);
    }
  };

  // Confirmar rechazo
  const confirmRejection = async () => {
    if (!selectedPayment) return;

    try {
      await rejectPayment(selectedPayment.id, {
        approved: false,
        notes: rejectionNotes || rejectionReason
      });
      setRejectDialogOpen(false);
      setSelectedPayment(null);
      setRejectionReason('');
      setRejectionNotes('');
    } catch (error) {
      console.error('Error rechazando depósito:', error);
    }
  };

  // Manejar vista de imagen
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const handleViewDetails = (payment: MobilePayment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  // Obtener texto del método de pago
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Transferencia Bancaria';
      case 'cash':
        return 'Efectivo';
      case 'mobile_payment':
        return 'Pago Móvil';
      case 'card':
        return 'Tarjeta';
      default:
        return method;
    }
  };

  // Formatear moneda
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    // Mapear códigos de moneda no válidos a códigos ISO válidos
    const currencyMap: { [key: string]: string } = {
      'RD$': 'DOP', // Peso Dominicano
      'USD': 'USD',
      'EUR': 'EUR',
      'DOP': 'DOP'
    };

    // Obtener el código de moneda válido
    const validCurrency = currencyMap[currency] || 'EUR';

    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: validCurrency
      }).format(amount);
    } catch (error) {
      // Fallback si hay algún error con el formateo
      return `${amount.toFixed(2)} ${validCurrency}`;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filtrar depósitos
  const filteredPayments = payments.filter(payment => {
    if (filters.status !== 'all' && payment.status !== filters.status) return false;
    if (filters.paymentMethod !== 'all' && payment.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });

  // Renderizar dashboard
  const renderDashboard = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        {/* Tarjetas de estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    {formatCurrency(stats?.totalAmount || 0, 'DOP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monto Total
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
                                         {stats?.approved || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verificados
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'success.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.success
                }}>
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                                         {stats?.pending || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'warning.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.warning
                }}>
                  <WarningIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ModernCard variant="elevated" sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}>
                                         {stats?.rejected || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rechazados
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'error.main', 
                  width: 56, 
                  height: 56,
                  background: designSystem.gradients.error
                }}>
                  <CancelIcon sx={{ fontSize: 28 }} />
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
                  Análisis de Depósitos
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
                    Gráfico de análisis de depósitos (implementar con librería de gráficos)
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
                                     {payments.slice(0, 5).map((payment) => (
                    <ListItem key={payment.id} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: getStatusColor(payment.status) + '.main',
                          width: 40,
                          height: 40
                        }}>
                          <SmartphoneIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(payment.amount, payment.currency)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {getStatusText(payment.status)} • {formatDate(payment.createdAt)}
                          </Typography>
                        }
                      />
                      <Chip
                        label={getStatusText(payment.status)}
                        color={getStatusColor(payment.status) as any}
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

  // Renderizar lista de depósitos
  const renderPaymentsList = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando depósitos: {error}
        </Alert>
      );
    }

    return (
      <Box>
        {/* Filtros mejorados */}
        <ModernCard variant="flat" sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1 }} />
              Filtros de Búsqueda
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="all">Todos los Estados</MenuItem>
                    <MenuItem value="pending">Pendientes</MenuItem>
                    <MenuItem value="verified">Verificados</MenuItem>
                    <MenuItem value="rejected">Rechazados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={filters.paymentMethod}
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                    label="Método de Pago"
                  >
                    <MenuItem value="all">Todos los Métodos</MenuItem>
                    <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
                    <MenuItem value="cash">Efectivo</MenuItem>
                    <MenuItem value="mobile_payment">Pago Móvil</MenuItem>
                    <MenuItem value="card">Tarjeta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ModernButton
                  variant="outline"
                  size="sm"
                  startIcon={<RefreshIcon />}
                                     onClick={refreshData}
                  disabled={loading}
                  sx={{ width: '100%' }}
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </ModernButton>
              </Grid>
            </Grid>
          </Box>
        </ModernCard>

        {/* Contador de resultados */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Depósitos ({filteredPayments.length})
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

        {/* Lista de depósitos */}
        <Grid container spacing={2}>
          {filteredPayments.map((payment) => (
            <Grid item xs={12} md={6} lg={4} key={payment.id}>
              <PaymentCard
                payment={payment}
                onVerify={handleVerifyPayment}
                onReject={handleRejectPayment}
                onViewImage={handleViewImage}
                onViewDetails={handleViewDetails}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                getPaymentMethodText={getPaymentMethodText}
                formatDate={(dateString: string) => formatDate(dateString)}
                formatCurrency={formatCurrency}
              />
            </Grid>
          ))}
        </Grid>

        {/* Estado vacío */}
        {filteredPayments.length === 0 && (
          <ModernCard variant="flat" sx={{ textAlign: 'center', py: 6 }}>
            <SmartphoneIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No se encontraron depósitos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No hay depósitos que coincidan con los filtros aplicados
            </Typography>
            <ModernButton
              variant="outline"
              onClick={() => setFilters({ status: 'all', paymentMethod: 'all' })}
            >
              Limpiar Filtros
            </ModernButton>
          </ModernCard>
        )}
      </Box>
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
          Depósitos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verifica y gestiona depósitos realizados desde la aplicación móvil
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
                Depósitos
                {payments.filter(p => p.status === 'pending').length > 0 && (
                  <Badge 
                    badgeContent={payments.filter(p => p.status === 'pending').length} 
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
            icon={<SmartphoneIcon />} 
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
        {renderPaymentsList()}
      </TabPanel>

      {/* Diálogo de verificación mejorado */}
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
            <CheckCircleIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Verificar Depósito
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedPayment && (
            <Box>
              <ModernCard variant="flat" sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Información del Pago
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID de Pago
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedPayment.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Usuario
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedPayment.user?.name} {selectedPayment.user?.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Monto
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Método
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {getPaymentMethodText(selectedPayment.paymentMethod)}
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
            startIcon={<CheckCircleIcon />}
            sx={{ px: 3 }}
          >
            Confirmar Verificación
          </ModernButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo de rechazo mejorado */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
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
          background: designSystem.gradients.error,
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Rechazar Depósito
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedPayment && (
            <Box>
              <ModernCard variant="flat" sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Información del Pago
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID de Pago
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedPayment.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Usuario
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedPayment.user?.name} {selectedPayment.user?.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Monto
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Método
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {getPaymentMethodText(selectedPayment.paymentMethod)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ModernCard>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Motivo del Rechazo
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Razón</InputLabel>
                <Select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  label="Razón"
                >
                  <MenuItem value="invalid_proof">Comprobante Inválido</MenuItem>
                  <MenuItem value="wrong_amount">Monto Incorrecto</MenuItem>
                  <MenuItem value="duplicate_payment">Depósito Duplicado</MenuItem>
                  <MenuItem value="other">Otro</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Notas Adicionales
              </Typography>
              <ModernInput
                fullWidth
                multiline
                rows={4}
                label="Notas sobre el rechazo del depósito"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Explica el motivo del rechazo..."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <ModernButton
            variant="ghost"
            onClick={() => setRejectDialogOpen(false)}
            sx={{ px: 3 }}
          >
            Cancelar
          </ModernButton>
          <ModernButton
            variant="danger"
            onClick={confirmRejection}
            startIcon={<CancelIcon />}
            sx={{ px: 3 }}
          >
            Confirmar Rechazo
          </ModernButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo de imagen */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: designSystem.shadows.xl
          }
        }}
      >
        <DialogTitle sx={{ 
          background: designSystem.gradients.primary,
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Comprobante de Depósito
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <img
            src={selectedImage}
            alt="Comprobante de depósito"
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: 8
            }}
            onError={(e) => {
              console.error('Error cargando imagen en diálogo:', selectedImage);
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+comprobante';
              target.style.filter = 'grayscale(100%) opacity(0.5)';
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <ModernButton
            variant="ghost"
            onClick={() => setImageDialogOpen(false)}
            sx={{ px: 3 }}
          >
            Cerrar
          </ModernButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Detalles del Depósito */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: designSystem.shadows.xl
          }
        }}
      >
        <DialogTitle sx={{ 
          background: designSystem.gradients.primary,
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Detalles del Depósito
              </Typography>
            </Box>
            {selectedPayment && (
              <Chip
                label={getStatusText(selectedPayment.status)}
                color={getStatusColor(selectedPayment.status) as any}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedPayment && (
            <Box>
              {/* Información General */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Información General
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      ID del Depósito
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedPayment.id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Monto
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(selectedPayment.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Última Actualización
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(selectedPayment.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Información del Usuario */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Información del Usuario
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      ID del Usuario
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedPayment.userId}
                    </Typography>
                  </Box>
                </Grid>
                {selectedPayment.user && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Nombre Completo
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedPayment.user.name} {selectedPayment.user.lastName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedPayment.user.userEmail}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Información Bancaria */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Información Bancaria
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Banco
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedPayment.bankName || 'No especificado'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Titular de la Cuenta
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedPayment.accountHolderName || 'No especificado'}
                    </Typography>
                  </Box>
                </Grid>
                {selectedPayment.accountNumber && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Número de Cuenta
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedPayment.accountNumber}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedPayment.referenceNumber && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Número de Referencia
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedPayment.referenceNumber}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedPayment.depositDate && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Fecha del Depósito
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedPayment.depositDate}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedPayment.depositTime && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Hora del Depósito
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedPayment.depositTime}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Comprobante */}
              {selectedPayment.proofImage && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Comprobante de Depósito
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={selectedPayment.proofImage}
                      alt="Comprobante de depósito"
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedImage(selectedPayment.proofImage!);
                        setImageDialogOpen(true);
                        setDetailsDialogOpen(false);
                      }}
                      onError={(e) => {
                        console.error('Error cargando imagen en detalles:', selectedPayment.proofImage);
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+comprobante';
                        target.style.filter = 'grayscale(100%) opacity(0.5)';
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                      Haz clic en la imagen para verla en tamaño completo
                    </Typography>
                  </Box>
                </>
              )}

              {/* Notas y Comentarios */}
              {(selectedPayment.notes || selectedPayment.comments) && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Notas y Comentarios
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    {selectedPayment.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Notas del Sistema
                        </Typography>
                        <Typography variant="body1">
                          {selectedPayment.notes}
                        </Typography>
                      </Box>
                    )}
                    {selectedPayment.comments && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Comentarios del Usuario
                        </Typography>
                        <Typography variant="body1">
                          {selectedPayment.comments}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {/* Información de Verificación */}
              {selectedPayment.verifiedBy && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Información de Verificación
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Verificado por
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedPayment.verifiedBy}
                        </Typography>
                      </Box>
                    </Grid>
                    {selectedPayment.verifiedAt && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Fecha de Verificación
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(selectedPayment.verifiedAt)}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {selectedPayment.verificationNotes && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Notas de Verificación
                          </Typography>
                          <Typography variant="body1">
                            {selectedPayment.verificationNotes}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {selectedPayment?.status === 'pending' && (
            <>
              <ModernButton
                variant="primary"
                onClick={() => {
                  setDetailsDialogOpen(false);
                  handleVerifyPayment(selectedPayment);
                }}
                startIcon={<CheckCircleIcon />}
                sx={{ px: 3 }}
              >
                Aprobar Depósito
              </ModernButton>
              <ModernButton
                variant="danger"
                onClick={() => {
                  setDetailsDialogOpen(false);
                  handleRejectPayment(selectedPayment);
                }}
                startIcon={<CancelIcon />}
                sx={{ px: 3 }}
              >
                Rechazar Depósito
              </ModernButton>
            </>
          )}
          <ModernButton
            variant="ghost"
            onClick={() => setDetailsDialogOpen(false)}
            sx={{ px: 3 }}
          >
            Cerrar
          </ModernButton>
        </DialogActions>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default MobilePayments; 