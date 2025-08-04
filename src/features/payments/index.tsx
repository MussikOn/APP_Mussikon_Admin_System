// Componente Principal de Gestión de Pagos - MussikOn Admin System
// Sistema completo de verificación de depósitos y gestión de pagos

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Badge,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// Importar servicios
import { depositService } from '../../services/depositService';
import type { 
  UserDeposit, 
  WithdrawalRequest, 
  DepositStats 
} from '../../services/depositService';
import { useApiRequest } from '../../hooks/useApiRequest';

// Importar componentes
import DepositVerification from './components/DepositVerification';
import VoucherImage from '../../components/VoucherImage';

// Importar estilos
import { chipStyles } from '../../theme/buttonStyles';

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
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PaymentsManagement: React.FC = () => {
  // Estado principal
  const [activeTab, setActiveTab] = useState(0);
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState<DepositStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estado para diálogos
  const [selectedDeposit, setSelectedDeposit] = useState<UserDeposit | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Hooks para API requests
  const depositsRequest = useApiRequest(depositService.getPendingDeposits.bind(depositService));
  const withdrawalsRequest = useApiRequest(depositService.getPendingWithdrawals.bind(depositService));
  const statsRequest = useApiRequest(depositService.getDepositStats.bind(depositService));

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

    const loadData = async () => {
      try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [depositsData, withdrawalsData, statsData] = await Promise.all([
        depositsRequest.execute(),
        withdrawalsRequest.execute(),
        statsRequest.execute()
      ]);

      setDeposits(depositsData || []);
      setWithdrawals(withdrawalsData || []);
      setStats(statsData || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos';
      setError(errorMessage);
      console.error('[PaymentsManagement] Error cargando datos:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Filtrar depósitos
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.user?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.amount.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Formatear moneda
  const formatCurrency = (amount: number, currency: string = 'DOP') => {
    // Mapear códigos de moneda a códigos ISO válidos
    const currencyMap: Record<string, string> = {
      'RD$': 'DOP',
      'DOP': 'DOP',
      'USD': 'USD',
      'EUR': 'EUR'
    };
    
    const isoCurrency = currencyMap[currency] || 'DOP';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: isoCurrency
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

  // Obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  // Manejar verificación completada
  const handleVerificationComplete = () => {
    setShowVerificationDialog(false);
    setSelectedDeposit(null);
    loadData(); // Recargar datos
  };

  // Renderizar estado de carga
  if (loading) {
      return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando sistema de pagos...
        </Typography>
        </Box>
      );
    }

  // Renderizar error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error Cargando Datos
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          </Alert>
        <Button
          variant="contained"
          onClick={loadData}
          startIcon={<RefreshIcon />}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Gestión de Pagos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verificación de depósitos y gestión de pagos de usuarios
        </Typography>
      </Box>

      {/* Estadísticas Rápidas */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                    <Typography variant="h4" component="div">
                      {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      Depósitos Pendientes
                  </Typography>
                </Box>
              </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                    <Typography variant="h4" component="div">
                      {stats.verified}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      Verificados Hoy
                  </Typography>
                </Box>
              </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                                         <Typography variant="h4" component="div">
                       {formatCurrency(stats.totalAmount, 'DOP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      Total Procesado
                  </Typography>
                </Box>
              </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                    <Typography variant="h4" component="div">
                      {stats.fraudDetection.duplicatesDetected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      Duplicados Detectados
                  </Typography>
                </Box>
              </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="payment management tabs">
          <Tab 
            label={
              <Badge badgeContent={deposits.filter(d => d.status === 'pending').length} color="warning">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReceiptIcon sx={{ mr: 1 }} />
                  Depósitos
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={withdrawals.filter(w => w.status === 'pending').length} color="info">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  Retiros
              </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Estadísticas
              </Box>
            } 
          />
        </Tabs>
              </Box>

      {/* Tab Panel - Depósitos */}
      <TabPanel value={activeTab} index={0}>
      <Box>
          {/* Filtros y Búsqueda */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por usuario, email, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
                  >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="pending">Pendientes</MenuItem>
                      <MenuItem value="verified">Verificados</MenuItem>
                      <MenuItem value="rejected">Rechazados</MenuItem>
                      <MenuItem value="processing">Procesando</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Fecha</InputLabel>
                    <Select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      label="Fecha"
                    >
                      <MenuItem value="all">Todas las fechas</MenuItem>
                      <MenuItem value="today">Hoy</MenuItem>
                      <MenuItem value="week">Esta semana</MenuItem>
                      <MenuItem value="month">Este mes</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button
                  fullWidth
                    variant="outlined"
                    onClick={loadData}
                  startIcon={<RefreshIcon />}
                >
                    Actualizar
                  </Button>
              </Grid>
            </Grid>
            </CardContent>
          </Card>

          {/* Tabla de Depósitos */}
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Voucher</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedDeposits.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
                      <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {deposit.user?.name} {deposit.user?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                              {deposit.user?.userEmail}
                        </Typography>
                      </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {formatCurrency(deposit.amount, deposit.currency)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <VoucherImage
                            depositId={deposit.id}
                            size="small"
                            showPreview={false}
                            showDuplicateCheck={true}
                          />
                        </TableCell>
                        
                        <TableCell>
                    <Chip
                            label={deposit.status}
                            color={getStatusColor(deposit.status) as any}
                      size="small"
                            sx={chipStyles[getStatusColor(deposit.status) as keyof typeof chipStyles]}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(deposit.createdAt)}
                    </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                        size="small"
                                onClick={() => {
                                  setSelectedDeposit(deposit);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {deposit.status === 'pending' && (
                              <Tooltip title="Verificar depósito">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedDeposit(deposit);
                                    setShowVerificationDialog(true);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {deposit.duplicateCheck?.isDuplicate && (
                              <Tooltip title="Voucher duplicado detectado">
                                <IconButton size="small" color="warning">
                                  <SecurityIcon />
                                </IconButton>
                              </Tooltip>
                    )}
                  </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_event, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
      </Box>
      </TabPanel>

      {/* Tab Panel - Retiros */}
      <TabPanel value={activeTab} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Solicitudes de Retiro Pendientes
          </Typography>
          
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Músico</TableCell>
                      <TableCell>Cuenta Bancaria</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {withdrawal.musician?.name} {withdrawal.musician?.lastName}
          </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {withdrawal.musician?.userEmail}
          </Typography>
        </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {withdrawal.bankAccount?.bankName}
        </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {withdrawal.bankAccount?.accountNumber}
        </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {formatCurrency(withdrawal.amount, withdrawal.currency)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={withdrawal.status}
                            color={getStatusColor(withdrawal.status) as any}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(withdrawal.createdAt)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            
                            {withdrawal.status === 'pending' && (
                              <>
                                <Tooltip title="Aprobar retiro">
                                  <IconButton size="small" color="success">
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Rechazar retiro">
                                  <IconButton size="small" color="error">
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>
      
      {/* Tab Panel - Estadísticas */}
      <TabPanel value={activeTab} index={2}>
            <Box>
          {stats && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Estadísticas de Depósitos
                  </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Resumen General</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                              Total de Depósitos
                      </Typography>
                            <Typography variant="h6">
                              {stats.total}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                              Monto Total
                      </Typography>
                            <Typography variant="h6">
                              {formatCurrency(stats.totalAmount, 'RD$')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                              Tasa de Verificación
                      </Typography>
                            <Typography variant="h6">
                              {stats.verificationRate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                              Tasa de Rechazo
                      </Typography>
                            <Typography variant="h6">
                              {stats.rejectionRate}
                      </Typography>
                    </Grid>
                  </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Detección de Fraude
              </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Actividad Sospechosa</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Duplicados Detectados
                            </Typography>
                            <Typography variant="h6" color="warning.main">
                              {stats.fraudDetection.duplicatesDetected}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Actividad Sospechosa
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {stats.fraudDetection.suspiciousActivity}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Rechazados
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {stats.fraudDetection.totalRejected}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </TabPanel>

      {/* Diálogo de Verificación */}
      <Dialog
        open={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        maxWidth="lg"
                fullWidth
      >
        <DialogTitle>
          Verificación de Depósito
        </DialogTitle>
        <DialogContent>
          {selectedDeposit && (
            <DepositVerification
              deposit={selectedDeposit}
              onVerificationComplete={handleVerificationComplete}
              onCancel={() => setShowVerificationDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Detalles */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Depósito
        </DialogTitle>
        <DialogContent>
          {selectedDeposit && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información del Usuario
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {selectedDeposit.user?.name} {selectedDeposit.user?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedDeposit.user?.userEmail}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {selectedDeposit.user?.phone || 'No especificado'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información del Depósito
                  </Typography>
                  <Typography variant="body2">
                    <strong>ID:</strong> {selectedDeposit.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Monto:</strong> {formatCurrency(selectedDeposit.amount, selectedDeposit.currency)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado:</strong> {selectedDeposit.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {formatDate(selectedDeposit.createdAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Voucher
                  </Typography>
                  <VoucherImage
                    depositId={selectedDeposit.id}
                    size="large"
                    showPreview={true}
                    showDuplicateCheck={true}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsManagement; 