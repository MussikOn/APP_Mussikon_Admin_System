// Componente Principal de Gestión de Pagos Móviles - MussikOn Admin System
// Sistema completo de pagos móviles con todas las funcionalidades del backend

import React, { useState, useEffect, useCallback } from 'react';
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
  AccordionDetails,

} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,

  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  Add as AddIcon,

  Warning as WarningIcon,
  VerifiedUser as VerifiedUserIcon,
  AccountBalance as WithdrawIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';

// Importar servicios
import { mobilePaymentsService } from '../../services/mobilePaymentsService';
import type { 
  MobileDeposit, 
  MobileWithdrawal, 
  MobilePaymentStats,
  BankAccount
} from '../../services/mobilePaymentsService';

// Importar componentes
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
      id={`mobile-payment-tabpanel-${index}`}
      aria-labelledby={`mobile-payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MobilePaymentsManagement: React.FC = () => {
  // Estado principal
  const [activeTab, setActiveTab] = useState(0);
  const [deposits, setDeposits] = useState<MobileDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<MobileWithdrawal[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [stats, setStats] = useState<MobilePaymentStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalCommissions: 0,
    pendingDepositsCount: 0,
    pendingWithdrawalsCount: 0,
    totalUsers: 0,
    totalMusicians: 0,
    totalEvents: 0,
    fraudDetection: {
      duplicatesDetected: 0,
      suspiciousActivity: 0,
      totalRejected: 0
    },
    dailyStats: [],
    lastUpdated: new Date().toISOString()
  });
  const [userBalance, setUserBalance] = useState<{ balance: number; currency: string }>({
    balance: 0,
    currency: 'DOP'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAlert, setShowDemoAlert] = useState(true);

  // Estado para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estado para diálogos
  const [selectedDeposit, setSelectedDeposit] = useState<MobileDeposit | null>(null);

  const [showDepositDetailsDialog, setShowDepositDetailsDialog] = useState(false);

  const [showNewDepositDialog, setShowNewDepositDialog] = useState(false);
  const [showNewWithdrawalDialog, setShowNewWithdrawalDialog] = useState(false);
  const [showBankAccountDialog, setShowBankAccountDialog] = useState(false);

  // Estado para formularios
  const [newDeposit, setNewDeposit] = useState({
    amount: '',
    currency: 'DOP',
    description: '',
    voucherFile: null as File | null
  });
  const [newWithdrawal, setNewWithdrawal] = useState({
    bankAccountId: '',
    amount: '',
    currency: 'DOP'
  });
  const [newBankAccount, setNewBankAccount] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    accountType: 'savings' as 'savings' | 'checking',
    routingNumber: ''
  });

  // Función para cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [depositsData, withdrawalsData, bankAccountsData, statsData, balanceData] = await Promise.all([
        mobilePaymentsService.getMyDeposits(),
        mobilePaymentsService.getMyWithdrawals(),
        mobilePaymentsService.getMyBankAccounts(),
        mobilePaymentsService.getPaymentSystemStats(),
        mobilePaymentsService.getMyBalance()
      ]);

      setDeposits(depositsData || []);
      setWithdrawals(withdrawalsData || []);
      setBankAccounts(bankAccountsData || []);
      setStats(statsData);
      setUserBalance(balanceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos';
      setError(errorMessage);
      console.error('[MobilePaymentsManagement] Error cargando datos:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

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
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  // Manejar creación de depósito
  const handleCreateDeposit = async () => {
    try {
      const depositData = {
        amount: parseFloat(newDeposit.amount),
        currency: newDeposit.currency,
        description: newDeposit.description,
        voucherFile: newDeposit.voucherFile || undefined
      };

      await mobilePaymentsService.createDeposit(depositData);
      setShowNewDepositDialog(false);
      setNewDeposit({ amount: '', currency: 'DOP', description: '', voucherFile: null });
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error creando depósito:', error);
    }
  };

  // Manejar creación de retiro
  const handleCreateWithdrawal = async () => {
    try {
      const withdrawalData = {
        bankAccountId: newWithdrawal.bankAccountId,
        amount: parseFloat(newWithdrawal.amount),
        currency: newWithdrawal.currency
      };

      await mobilePaymentsService.createWithdrawal(withdrawalData);
      setShowNewWithdrawalDialog(false);
      setNewWithdrawal({ bankAccountId: '', amount: '', currency: 'DOP' });
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error creando retiro:', error);
    }
  };

  // Manejar registro de cuenta bancaria
  const handleRegisterBankAccount = async () => {
    try {
      await mobilePaymentsService.registerBankAccount(newBankAccount);
      setShowBankAccountDialog(false);
      setNewBankAccount({
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        accountType: 'savings',
        routingNumber: ''
      });
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error registrando cuenta bancaria:', error);
    }
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando sistema de pagos móviles...
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
      {/* Alerta de Demostración */}
      {showDemoAlert && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          onClose={() => setShowDemoAlert(false)}
          icon={<InfoIcon />}
        >
          <Typography variant="h6" gutterBottom>
            🎯 Sistema de Pagos Móviles - Modo Demostración
          </Typography>
          <Typography variant="body2">
            El backend no está disponible en este momento. Estás viendo datos de demostración que te permiten explorar todas las funcionalidades del sistema de pagos móviles.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Funcionalidades disponibles:</strong> Depósitos, retiros, cuentas bancarias, balance, estadísticas y más.
          </Typography>
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sistema de Pagos Móviles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestión completa de pagos móviles para usuarios
        </Typography>
      </Box>

      {/* Balance del Usuario */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatCurrency(userBalance.balance, userBalance.currency)}
                  </Typography>
                  <Typography variant="body1">
                    Balance Disponible
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewDepositDialog(true)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Nuevo Depósito
                </Button>
                <Button
                  variant="contained"
                  startIcon={<WithdrawIcon />}
                  onClick={() => setShowNewWithdrawalDialog(true)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Nuevo Retiro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalDeposits || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Depósitos
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
                <WithdrawIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalWithdrawals || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Retiros
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
                    {formatCurrency(stats?.totalCommissions || 0, 'DOP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comisiones
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
                    {stats?.fraudDetection?.duplicatesDetected || 0}
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

      {/* Tabs de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="mobile payment management tabs">
          <Tab 
            label={
              <Badge badgeContent={deposits.filter(d => d.status === 'pending').length} color="warning">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReceiptIcon sx={{ mr: 1 }} />
                  Mis Depósitos
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={withdrawals.filter(w => w.status === 'pending').length} color="info">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WithdrawIcon sx={{ mr: 1 }} />
                  Mis Retiros
                </Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BankIcon sx={{ mr: 1 }} />
                Cuentas Bancarias
              </Box>
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

      {/* Tab Panel - Mis Depósitos */}
      <TabPanel value={activeTab} index={0}>
        <Box>
          {/* Filtros y Búsqueda */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por ID, descripción..."
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
                      <TableCell>ID</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Descripción</TableCell>
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
                          <Typography variant="body2" fontWeight="bold">
                            {deposit.id}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {formatCurrency(deposit.amount, deposit.currency)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {deposit.description || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          {deposit.hasVoucherFile && (
                            <VoucherImage
                              depositId={deposit.id}
                              size="small"
                              showPreview={false}
                              showDuplicateCheck={false}
                            />
                          )}
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
                                  setShowDepositDetailsDialog(true);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            
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

      {/* Tab Panel - Mis Retiros */}
      <TabPanel value={activeTab} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Mis Solicitudes de Retiro
          </Typography>
          
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
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
                          <Typography variant="body2" fontWeight="bold">
                            {withdrawal.id}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {withdrawal.bankAccount?.bankName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {withdrawal.bankAccount?.accountNumber}
                            </Typography>
                          </Box>
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

      {/* Tab Panel - Cuentas Bancarias */}
      <TabPanel value={activeTab} index={2}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Mis Cuentas Bancarias
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowBankAccountDialog(true)}
            >
              Agregar Cuenta
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {bankAccounts.map((account) => (
              <Grid item xs={12} md={6} key={account.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {account.bankName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {account.accountHolder}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {account.accountNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.accountType === 'savings' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {account.isDefault && (
                          <Chip label="Principal" color="primary" size="small" />
                        )}
                        {account.isVerified ? (
                          <Chip label="Verificada" color="success" size="small" icon={<VerifiedUserIcon />} />
                        ) : (
                          <Chip label="Pendiente" color="warning" size="small" icon={<WarningIcon />} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </TabPanel>
      
      {/* Tab Panel - Estadísticas */}
      <TabPanel value={activeTab} index={3}>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen de Actividad
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Estadísticas Generales</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total de Depósitos
                          </Typography>
                          <Typography variant="h6">
                            {stats?.totalDeposits || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total de Retiros
                          </Typography>
                          <Typography variant="h6">
                            {stats?.totalWithdrawals || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Comisiones
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(stats?.totalCommissions || 0, 'DOP')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Usuarios Activos
                          </Typography>
                          <Typography variant="h6">
                            {stats?.totalUsers || 0}
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
                            {stats?.fraudDetection?.duplicatesDetected || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Actividad Sospechosa
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            {stats?.fraudDetection?.suspiciousActivity || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Rechazados
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            {stats?.fraudDetection?.totalRejected || 0}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      {/* Diálogo de Detalles de Depósito */}
      <Dialog
        open={showDepositDetailsDialog}
        onClose={() => setShowDepositDetailsDialog(false)}
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
                  {selectedDeposit.description && (
                    <Typography variant="body2">
                      <strong>Descripción:</strong> {selectedDeposit.description}
                    </Typography>
                  )}
                </Grid>
                
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
                  <Typography variant="body2">
                    <strong>Balance:</strong> {formatCurrency(selectedDeposit.user?.balance || 0, selectedDeposit.user?.currency || 'DOP')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Voucher
                  </Typography>
                  {showDepositDetailsDialog && (
                    <VoucherImage
                      depositId={selectedDeposit.id}
                      size="large"
                      showPreview={true}
                      showDuplicateCheck={true}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDepositDetailsDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Nuevo Depósito */}
      <Dialog
        open={showNewDepositDialog}
        onClose={() => setShowNewDepositDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nuevo Depósito
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto"
                  type="number"
                  value={newDeposit.amount}
                  onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">RD$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción (opcional)"
                  value={newDeposit.description}
                  onChange={(e) => setNewDeposit({ ...newDeposit, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Subir Voucher (opcional)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewDeposit({ ...newDeposit, voucherFile: file });
                      }
                    }}
                  />
                </Button>
                {newDeposit.voucherFile && (
                  <Typography variant="caption" color="text.secondary">
                    Archivo seleccionado: {newDeposit.voucherFile.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewDepositDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateDeposit}
            variant="contained"
            disabled={!newDeposit.amount || parseFloat(newDeposit.amount) <= 0}
          >
            Crear Depósito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Nuevo Retiro */}
      <Dialog
        open={showNewWithdrawalDialog}
        onClose={() => setShowNewWithdrawalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nuevo Retiro
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Cuenta Bancaria</InputLabel>
                  <Select
                    value={newWithdrawal.bankAccountId}
                    onChange={(e) => setNewWithdrawal({ ...newWithdrawal, bankAccountId: e.target.value })}
                    label="Cuenta Bancaria"
                  >
                    {bankAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.bankName} - {account.accountNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto"
                  type="number"
                  value={newWithdrawal.amount}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">RD$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewWithdrawalDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateWithdrawal}
            variant="contained"
            disabled={!newWithdrawal.bankAccountId || !newWithdrawal.amount || parseFloat(newWithdrawal.amount) <= 0}
          >
            Crear Retiro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Nueva Cuenta Bancaria */}
      <Dialog
        open={showBankAccountDialog}
        onClose={() => setShowBankAccountDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nueva Cuenta Bancaria
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titular de la Cuenta"
                  value={newBankAccount.accountHolder}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, accountHolder: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Banco"
                  value={newBankAccount.bankName}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, bankName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Cuenta"
                  value={newBankAccount.accountNumber}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Cuenta</InputLabel>
                  <Select
                    value={newBankAccount.accountType}
                    onChange={(e) => setNewBankAccount({ ...newBankAccount, accountType: e.target.value as 'savings' | 'checking' })}
                    label="Tipo de Cuenta"
                  >
                    <MenuItem value="savings">Cuenta de Ahorros</MenuItem>
                    <MenuItem value="checking">Cuenta Corriente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Ruta (opcional)"
                  value={newBankAccount.routingNumber}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, routingNumber: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBankAccountDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRegisterBankAccount}
            variant="contained"
            disabled={!newBankAccount.accountHolder || !newBankAccount.bankName || !newBankAccount.accountNumber}
          >
            Registrar Cuenta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobilePaymentsManagement; 