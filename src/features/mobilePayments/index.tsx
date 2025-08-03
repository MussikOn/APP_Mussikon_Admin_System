// Pantalla de Verificación de Pagos Móviles - MussikOn Admin System
// Permite a los administradores verificar pagos realizados desde la app móvil

import React, { useState } from 'react';
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
  Badge,
} from '@mui/material';
import {
  Smartphone as SmartphoneIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';

// Importar servicios y hooks
import { useMobilePayments } from '../../hooks/useMobilePayments';
import type { MobilePayment } from '../../services/mobilePaymentsService';

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
      id={`mobile-payments-tabpanel-${index}`}
      aria-labelledby={`mobile-payments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Componente principal de Verificación de Pagos Móviles
const MobilePayments: React.FC = () => {
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
  });

  // Estado para diálogos
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MobilePayment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('manual');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Hook para pagos móviles
  const {
    payments,
    stats,
    loading,
    statsLoading,
    verifyLoading,
    rejectLoading,
    error,
    statsError,
    verifyError,
    rejectError,
    loadPayments,
    verifyPayment,
    rejectPayment,
    refreshData,
  } = useMobilePayments();

  // Manejar cambio de pestañas
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manejar verificación de pago
  const handleVerifyPayment = (payment: MobilePayment) => {
    setSelectedPayment(payment);
    setVerificationNotes('');
    setVerificationMethod('manual');
    setVerifyDialogOpen(true);
  };

  // Manejar rechazo de pago
  const handleRejectPayment = (payment: MobilePayment) => {
    setSelectedPayment(payment);
    setRejectionReason('');
    setRejectionNotes('');
    setRejectDialogOpen(true);
  };

  // Confirmar verificación
  const confirmVerification = async () => {
    if (!selectedPayment) return;

    const success = await verifyPayment(selectedPayment.id, {
      notes: verificationNotes,
      verificationMethod,
    });

    if (success) {
      setVerifyDialogOpen(false);
      setSelectedPayment(null);
      setVerificationNotes('');
      setVerificationMethod('manual');
      
      // Recargar datos
      refreshData();
    }
  };

  // Confirmar rechazo
  const confirmRejection = async () => {
    if (!selectedPayment) return;

    const success = await rejectPayment(selectedPayment.id, {
      reason: rejectionReason,
      notes: rejectionNotes,
    });

    if (success) {
      setRejectDialogOpen(false);
      setSelectedPayment(null);
      setRejectionReason('');
      setRejectionNotes('');
      
      // Recargar datos
      refreshData();
    }
  };

  // Ver imagen en pantalla completa
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
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
      case 'verified':
        return 'Verificado';
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
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Tarjeta de Crédito';
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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    if (filters.status !== 'all' && payment.status !== filters.status) return false;
    if (filters.paymentMethod !== 'all' && payment.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });

  // Renderizar dashboard
  const renderDashboard = () => {
    if (statsLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (statsError) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error cargando estadísticas: {statsError}
        </Alert>
      );
    }

    if (!stats) return null;

    return (
      <Box>
        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SmartphoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="div">
                    Total Pagos
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solicitudes de pago móvil
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" component="div">
                    Pendientes
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Requieren verificación
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" component="div">
                    Verificados
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {stats.verified}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos confirmados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6" component="div">
                    Monto Total
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stats.totalAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor total de pagos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Estadísticas adicionales */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tasa de Verificación
                </Typography>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {stats.verificationRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos verificados exitosamente
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={cardStyles.default}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tasa de Rechazo
                </Typography>
                <Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>
                  {stats.rejectionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos rechazados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas importantes */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>📱 Sistema de Verificación de Pagos Móviles:</strong> Los usuarios de la app móvil pueden realizar pagos y subir comprobantes para verificación manual por parte de los administradores.
        </Alert>
      </Box>
    );
  };

  // Renderizar lista de pagos
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
          Error cargando pagos: {error}
        </Alert>
      );
    }

    return (
      <Box>
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
                    <MenuItem value="pending">Pendientes</MenuItem>
                    <MenuItem value="verified">Verificados</MenuItem>
                    <MenuItem value="rejected">Rechazados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={filters.paymentMethod}
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                    label="Método de Pago"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="stripe">Tarjeta de Crédito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={() => loadPayments()}
                  disabled={loading}
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
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{
                    ...buttonStyles.primary,
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
                  Exportar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de pagos */}
        <Grid container spacing={3}>
          {filteredPayments.map((payment) => (
            <Grid item xs={12} md={6} lg={4} key={payment.id}>
              <Card sx={cardStyles.default}>
                <CardContent>
                  {/* Header con estado */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {payment.user?.name} {payment.user?.lastName}
                    </Typography>
                    <Chip
                      label={getStatusText(payment.status)}
                      color={getStatusColor(payment.status) as any}
                      size="small"
                      sx={chipStyles[getStatusColor(payment.status) as keyof typeof chipStyles]}
                    />
                  </Box>

                  {/* Información del pago */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {payment.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Método:</strong> {getPaymentMethodText(payment.paymentMethod)}
                    </Typography>
                    {payment.eventName && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Evento:</strong> {payment.eventName}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha:</strong> {formatDate(payment.createdAt)}
                    </Typography>
                  </Box>

                  {/* Comprobante */}
                  {payment.proofImage && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Comprobante:</strong>
                      </Typography>
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={payment.proofImage}
                          alt="Comprobante de pago"
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleViewImage(payment.proofImage!)}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                          }}
                          onClick={() => handleViewImage(payment.proofImage!)}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {/* Notas */}
                  {payment.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notas:</strong> {payment.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* Acciones */}
                  {payment.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVerifyPayment(payment)}
                        sx={{
                          flex: 1,
                          py: 0.5,
                          fontSize: '0.875rem',
                          backgroundColor: 'success.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'success.dark'
                          }
                        }}
                      >
                        Verificar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleRejectPayment(payment)}
                        sx={{
                          flex: 1,
                          py: 0.5,
                          fontSize: '0.875rem',
                          borderColor: 'error.main',
                          color: 'error.main',
                          '&:hover': {
                            borderColor: 'error.dark',
                            backgroundColor: 'error.light',
                            color: 'error.dark'
                          }
                        }}
                      >
                        Rechazar
                      </Button>
                    </Box>
                  )}

                  {/* Información de verificación/rechazo */}
                  {payment.status === 'verified' && payment.verificationNotes && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.dark">
                        <strong>Verificado:</strong> {payment.verificationNotes}
                      </Typography>
                    </Box>
                  )}

                  {payment.status === 'rejected' && payment.rejectionReason && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'error.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="error.dark">
                        <strong>Rechazado:</strong> {payment.rejectionReason}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredPayments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron pagos móviles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros o recargar los datos
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <ResponsiveLayout spacing="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: responsiveTypography.h3 }}>
            Verificación de Pagos Móviles
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={refreshData}
              disabled={loading || statsLoading}
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
          Gestión y verificación de pagos realizados desde la aplicación móvil
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
                Pagos
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

      {/* Diálogo de verificación */}
      <Dialog 
        open={verifyDialogOpen} 
        onClose={() => setVerifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            Verificar Pago Móvil
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Usuario:</strong> {selectedPayment.user?.name} {selectedPayment.user?.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Monto:</strong> {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Descripción:</strong> {selectedPayment.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Método:</strong> {getPaymentMethodText(selectedPayment.paymentMethod)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Método de Verificación</InputLabel>
                <Select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  label="Método de Verificación"
                >
                  <MenuItem value="manual">Verificación Manual</MenuItem>
                  <MenuItem value="bank_verification">Verificación Bancaria</MenuItem>
                  <MenuItem value="payment_gateway">Gateway de Pago</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notas de Verificación"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Ej: Comprobante verificado, pago confirmado en cuenta bancaria, etc."
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
            disabled={verifyLoading}
            startIcon={verifyLoading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: 'success.main',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'success.dark',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {verifyLoading ? 'Verificando...' : 'Confirmar Verificación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de rechazo */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon sx={{ mr: 1, color: 'error.main' }} />
            Rechazar Pago Móvil
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Usuario:</strong> {selectedPayment.user?.name} {selectedPayment.user?.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Monto:</strong> {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Descripción:</strong> {selectedPayment.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <TextField
                fullWidth
                label="Razón del Rechazo"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ej: Comprobante no legible, monto incorrecto, etc."
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notas Adicionales"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Detalles adicionales sobre el rechazo..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 3 }}>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
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
            onClick={confirmRejection}
            disabled={rejectLoading || !rejectionReason.trim()}
            startIcon={rejectLoading ? <CircularProgress size={16} /> : <CancelIcon />}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: 'error.main',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'error.dark',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                backgroundColor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            {rejectLoading ? 'Rechazando...' : 'Confirmar Rechazo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de imagen */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ mr: 1 }} />
            Comprobante de Pago
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={selectedImage}
              alt="Comprobante de pago"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas de error */}
      {verifyError && (
        <Alert severity="error" sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          Error verificando pago: {verifyError}
        </Alert>
      )}

      {rejectError && (
        <Alert severity="error" sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          Error rechazando pago: {rejectError}
        </Alert>
      )}
    </ResponsiveLayout>
  );
};

export default MobilePayments; 