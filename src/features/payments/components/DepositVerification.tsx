// Componente de Verificación de Depósitos - MussikOn Admin System
// Funcionalidad específica para que el admin verifique depósitos de usuarios

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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  Compare as CompareIcon
} from '@mui/icons-material';

// Importar servicios y hooks
import { depositService } from '../../../services/depositService';
import type { 
  UserDeposit, 
  VerifyDepositRequest, 
  DuplicateCheckResult 
} from '../../../services/depositService';
import { useApiRequest } from '../../../hooks/useApiRequest';

// Importar componentes
import VoucherImage from '../../../components/VoucherImage';

// Importar estilos
import { buttonStyles, chipStyles } from '../../../theme/buttonStyles';

interface DepositVerificationProps {
  deposit: UserDeposit;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

interface VerificationStep {
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  icon: React.ReactNode;
}

interface BankVerificationData {
  bankName: string;
  accountNumber: string;
  depositDate: string;
  depositTime: string;
  referenceNumber: string;
  amount: number;
  transactionType: string;
  verifiedInBank: boolean;
  bankStatementMatch: boolean;
}

const DepositVerification: React.FC<DepositVerificationProps> = ({
  deposit,
  onVerificationComplete,
  onCancel
}) => {
  // Estado para el proceso de verificación
  const [activeStep, setActiveStep] = useState(0);
  const [verificationData, setVerificationData] = useState({
    verificationMethod: '',
    referenceNumber: '',
    bankName: '',
    accountNumber: '',
    depositAmount: deposit.amount,
    depositDate: new Date().toISOString().split('T')[0],
    depositTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
    notes: '',
    adminNotes: '',
    verificationStatus: 'pending',
    rejectionReason: ''
  });

  // Estado para verificación bancaria
  const [bankVerification, setBankVerification] = useState<BankVerificationData>({
    bankName: '',
    accountNumber: '',
    depositDate: '',
    depositTime: '',
    referenceNumber: '',
    amount: deposit.amount,
    transactionType: 'deposit',
    verifiedInBank: false,
    bankStatementMatch: false
  });

  // Estado para diálogos
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  // Estado para duplicados
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  // Hooks para API requests
  const verifyDepositRequest = useApiRequest(depositService.verifyDeposit.bind(depositService));
  const flagSuspiciousRequest = useApiRequest(depositService.flagSuspiciousDeposit.bind(depositService));

  // Pasos de verificación
  const verificationSteps: VerificationStep[] = [
    {
      label: 'Revisar Documentación',
      description: 'Verificar comprobante de depósito y documentación del usuario',
      completed: false,
      required: true,
      icon: <ReceiptIcon />
    },
    {
      label: 'Verificar Duplicados',
      description: 'Comprobar si el voucher ha sido usado anteriormente',
      completed: false,
      required: true,
      icon: <SecurityIcon />
    },
    {
      label: 'Confirmar Monto',
      description: 'Verificar que el monto depositado coincida con la solicitud',
      completed: false,
      required: true,
      icon: <CompareIcon />
    },
    {
      label: 'Verificación Bancaria',
      description: 'Confirmar el depósito en el estado de cuenta bancario',
      completed: false,
      required: true,
      icon: <AccountBalanceIcon />
    },
    {
      label: 'Registrar Verificación',
      description: 'Completar el proceso de verificación en el sistema',
      completed: false,
      required: true,
      icon: <VerifiedUserIcon />
    }
  ];

  // Verificar duplicados al cargar
  useEffect(() => {
    if (deposit.hasVoucherFile) {
      checkForDuplicates();
    }
  }, [deposit.id]);

  // Verificar duplicados
  const checkForDuplicates = async () => {
    try {
      setCheckingDuplicates(true);
      const result = await depositService.checkDuplicateVoucher(deposit.id);
      setDuplicateCheck(result);
      
      if (result.isDuplicate) {
        console.warn('[DepositVerification] Duplicado detectado:', result);
      }
    } catch (error) {
      console.error('[DepositVerification] Error verificando duplicados:', error);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  // Manejar cambio de paso
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepComplete = (stepIndex: number) => {
    const updatedSteps = [...verificationSteps];
    updatedSteps[stepIndex].completed = true;
    console.log(`Step ${stepIndex} completed`);
  };

  // Confirmar verificación
  const confirmVerification = async () => {
    try {
      const verificationRequest: VerifyDepositRequest = {
        approved: true,
        notes: verificationData.notes,
        verificationData: {
          bankDepositDate: verificationData.depositDate,
          bankDepositTime: verificationData.depositTime,
          referenceNumber: verificationData.referenceNumber,
          accountLastFourDigits: verificationData.accountNumber.slice(-4),
          verifiedBy: 'admin', // En producción, obtener del contexto de autenticación
          verificationMethod: verificationData.verificationMethod,
          bankName: verificationData.bankName,
          depositAmount: verificationData.depositAmount
        }
      };

      await verifyDepositRequest.execute(deposit.id, verificationRequest);
      onVerificationComplete();
    } catch (error) {
      console.error('Error verificando depósito:', error);
    }
  };

  // Rechazar depósito
  const rejectDeposit = async () => {
    try {
      const verificationRequest: VerifyDepositRequest = {
        approved: false,
        notes: verificationData.adminNotes,
        rejectionReason: verificationData.rejectionReason
      };

      await verifyDepositRequest.execute(deposit.id, verificationRequest);
      onVerificationComplete();
    } catch (error) {
      console.error('Error rechazando depósito:', error);
    }
  };

  // Marcar como sospechoso
  const flagAsSuspicious = async () => {
    try {
      await flagSuspiciousRequest.execute(deposit.id, 'Voucher duplicado detectado');
      console.log('Depósito marcado como sospechoso');
    } catch (error) {
      console.error('Error marcando depósito como sospechoso:', error);
    }
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener estado del depósito
  const getDepositStatus = () => {
    switch (deposit.status) {
      case 'pending':
        return { status: 'pending', label: 'Pendiente', color: 'warning' as const };
      case 'verified':
        return { status: 'verified', label: 'Verificado', color: 'success' as const };
      case 'rejected':
        return { status: 'rejected', label: 'Rechazado', color: 'error' as const };
      case 'processing':
        return { status: 'processing', label: 'Procesando', color: 'info' as const };
      default:
        return { status: 'pending', label: 'Pendiente', color: 'warning' as const };
    }
  };

  const depositStatus = getDepositStatus();

  return (
    <Box>
      {/* Header de Verificación */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Verificación de Depósito
            </Typography>
            <Chip
              label={depositStatus.label}
              color={depositStatus.color}
              icon={<ReceiptIcon />}
              sx={chipStyles[depositStatus.color as keyof typeof chipStyles]}
            />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID de Depósito
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {deposit.id}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Usuario
              </Typography>
              <Typography variant="body1">
                {deposit.user?.name} {deposit.user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {deposit.user?.userEmail}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monto del Depósito
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatCurrency(deposit.amount, deposit.currency)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fecha de Solicitud
              </Typography>
              <Typography variant="body1">
                {formatDate(deposit.createdAt)}
              </Typography>
            </Grid>
          </Grid>

          {/* Alerta de duplicado */}
          {duplicateCheck?.isDuplicate && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                ⚠️ Voucher Duplicado Detectado
              </Typography>
              <Typography variant="body2">
                Este voucher tiene una similitud del {duplicateCheck.similarityScore}% con otros depósitos.
                Se recomienda verificación adicional.
              </Typography>
              <Button
                size="small"
                onClick={() => setShowDuplicateDialog(true)}
                sx={{ mt: 1 }}
              >
                Ver Detalles de Duplicados
              </Button>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Proceso de Verificación */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Proceso de Verificación
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {verificationSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={step.required ? undefined : <Chip label="Opcional" size="small" />}
                  icon={step.completed ? <CheckCircleIcon color="success" /> : step.icon}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  
                  {/* Contenido específico de cada paso */}
                  {index === 0 && (
                    <Box>
                      {/* Voucher del depósito */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                          Comprobante de Depósito
                        </Typography>
                        <VoucherImage 
                          depositId={deposit.id}
                          size="large"
                          showPreview={true}
                          showDuplicateCheck={true}
                          onError={(error) => {
                            console.error('Error cargando voucher:', error);
                          }}
                          onLoad={() => {
                            console.log('Voucher cargado exitosamente');
                          }}
                        />
                      </Box>
                      
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Método de Verificación</InputLabel>
                        <Select
                          value={verificationData.verificationMethod}
                          onChange={(e) => setVerificationData({
                            ...verificationData,
                            verificationMethod: e.target.value
                          })}
                          label="Método de Verificación"
                        >
                          <MenuItem value="bank_statement">Estado de Cuenta Bancario</MenuItem>
                          <MenuItem value="deposit_slip">Comprobante de Depósito</MenuItem>
                          <MenuItem value="transfer_receipt">Comprobante de Transferencia</MenuItem>
                          <MenuItem value="mobile_banking">Banca Móvil</MenuItem>
                          <MenuItem value="atm_receipt">Recibo de ATM</MenuItem>
                          <MenuItem value="other">Otro</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                  
                  {index === 1 && (
                    <Box>
                      {checkingDuplicates ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} />
                          <Typography>Verificando duplicados...</Typography>
                        </Box>
                      ) : duplicateCheck ? (
                        <Box>
                          <Alert 
                            severity={duplicateCheck.isDuplicate ? 'warning' : 'success'}
                            sx={{ mb: 2 }}
                          >
                            {duplicateCheck.isDuplicate ? (
                              <>
                                <Typography variant="subtitle2" gutterBottom>
                                  ⚠️ Duplicado Detectado
                                </Typography>
                                <Typography variant="body2">
                                  Similitud: {duplicateCheck.similarityScore}%
                                </Typography>
                                {duplicateCheck.duplicateIds.length > 0 && (
                                  <Typography variant="body2">
                                    IDs similares: {duplicateCheck.duplicateIds.join(', ')}
                                  </Typography>
                                )}
                              </>
                            ) : (
                              <Typography variant="body2">
                                ✅ No se detectaron duplicados
                              </Typography>
                            )}
                          </Alert>
                          
                          {duplicateCheck.isDuplicate && (
                            <Button
                              variant="outlined"
                              color="warning"
                              onClick={flagAsSuspicious}
                              startIcon={<SecurityIcon />}
                              sx={{ mb: 2 }}
                            >
                              Marcar como Sospechoso
                            </Button>
                          )}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">
                          No se pudo verificar duplicados
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {index === 2 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Monto Depositado"
                        type="number"
                        value={verificationData.depositAmount}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          depositAmount: parseFloat(e.target.value) || 0
                        })}
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>RD$</Typography>
                        }}
                      />
                      
                      {verificationData.depositAmount !== deposit.amount && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          El monto depositado ({formatCurrency(verificationData.depositAmount, deposit.currency)}) 
                          no coincide con el monto solicitado ({formatCurrency(deposit.amount, deposit.currency)})
                        </Alert>
                      )}
                    </Box>
                  )}
                  
                  {index === 3 && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Verificación Bancaria
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Banco"
                            value={bankVerification.bankName}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              bankName: e.target.value
                            })}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Número de Cuenta"
                            value={bankVerification.accountNumber}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              accountNumber: e.target.value
                            })}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Fecha del Depósito"
                        type="date"
                            value={bankVerification.depositDate}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                          depositDate: e.target.value
                        })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Hora del Depósito"
                            type="time"
                            value={bankVerification.depositTime}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              depositTime: e.target.value
                            })}
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Número de Referencia"
                            value={bankVerification.referenceNumber}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              referenceNumber: e.target.value
                            })}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Monto Verificado"
                            type="number"
                            value={bankVerification.amount}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              amount: parseFloat(e.target.value) || 0
                            })}
                            sx={{ mb: 2 }}
                            InputProps={{
                              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>RD$</Typography>
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={bankVerification.verifiedInBank}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              verifiedInBank: e.target.checked
                            })}
                          />
                        }
                        label="Verificado en estado de cuenta bancario"
                        sx={{ mb: 2 }}
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={bankVerification.bankStatementMatch}
                            onChange={(e) => setBankVerification({
                              ...bankVerification,
                              bankStatementMatch: e.target.checked
                            })}
                          />
                        }
                        label="Coincide con el estado de cuenta"
                        sx={{ mb: 2 }}
                      />
                      
                      {(!bankVerification.verifiedInBank || !bankVerification.bankStatementMatch) && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          ⚠️ IMPORTANTE: Si el depósito no aparece en el estado de cuenta bancario, 
                          NO debe ser aprobado. Esto es fundamental para prevenir fraudes.
                        </Alert>
                      )}
                    </Box>
                  )}
                  
                  {index === 4 && (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notas de Verificación"
                        value={verificationData.notes}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          notes: e.target.value
                        })}
                        placeholder="Detalles sobre la verificación del depósito..."
                        sx={{ mb: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notas Internas (Admin)"
                        value={verificationData.adminNotes}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          adminNotes: e.target.value
                        })}
                        placeholder="Notas internas para administradores..."
                        sx={{ mb: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Razón de Rechazo (si aplica)"
                        value={verificationData.rejectionReason}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          rejectionReason: e.target.value
                        })}
                        placeholder="Especificar razón si se rechaza el depósito..."
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleStepComplete(index);
                        handleNext();
                      }}
                      disabled={index === verificationSteps.length - 1}
                      sx={buttonStyles.primary}
                    >
                      {index === verificationSteps.length - 1 ? 'Finalizar' : 'Continuar'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ ml: 1, ...buttonStyles.text }}
                    >
                      Atrás
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<CloseIcon />}
          sx={buttonStyles.text}
        >
          Cancelar
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          onClick={rejectDeposit}
          disabled={verifyDepositRequest.loading || activeStep < verificationSteps.length - 1}
          startIcon={<CloseIcon />}
          sx={buttonStyles.text}
        >
          Rechazar
        </Button>
        
        <Button
          variant="contained"
          onClick={() => setShowDetailsDialog(true)}
          startIcon={<VisibilityIcon />}
          sx={buttonStyles.secondary}
        >
          Ver Detalles
        </Button>
        
        <Button
          variant="contained"
          onClick={confirmVerification}
          disabled={
            verifyDepositRequest.loading || 
            activeStep < verificationSteps.length - 1 ||
            !bankVerification.verifiedInBank ||
            !bankVerification.bankStatementMatch
          }
          startIcon={verifyDepositRequest.loading ? <CircularProgress size={16} /> : <VerifiedUserIcon />}
          sx={buttonStyles.primary}
        >
          {verifyDepositRequest.loading ? 'Verificando...' : 'Aprobar Depósito'}
        </Button>
      </Box>

      {/* Diálogo de Detalles */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            Detalles del Depósito
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información del Usuario
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Nombre"
                    secondary={`${deposit.user?.name} ${deposit.user?.lastName}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={deposit.user?.userEmail}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Teléfono"
                    secondary={deposit.user?.phone || 'No especificado'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ID de Usuario"
                    secondary={deposit.userId}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información del Depósito
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="ID de Depósito"
                    secondary={deposit.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Monto"
                    secondary={formatCurrency(deposit.amount, deposit.currency)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Estado"
                  />
                  <Chip
                    label={depositStatus.label}
                    color={depositStatus.color}
                    size="small"
                    sx={chipStyles[depositStatus.color as keyof typeof chipStyles]}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Descripción"
                    secondary={deposit.description || 'No especificada'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fecha de Creación"
                    secondary={formatDate(deposit.createdAt)}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          {deposit.adminNotes && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notas del Administrador
              </Typography>
              <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                {deposit.adminNotes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)} sx={buttonStyles.text}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Duplicados */}
      <Dialog
        open={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1 }} />
            Detalles de Duplicados Detectados
          </Box>
        </DialogTitle>
        <DialogContent>
          {duplicateCheck && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ⚠️ Voucher Duplicado Detectado
                </Typography>
                <Typography variant="body2">
                  Similitud: {duplicateCheck.similarityScore}%
                </Typography>
              </Alert>
              
              {duplicateCheck.matchedDeposits.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Depósitos Similares
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Usuario</TableCell>
                          <TableCell>Monto</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Fecha</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {duplicateCheck.matchedDeposits.map((matchedDeposit) => (
                          <TableRow key={matchedDeposit.id}>
                            <TableCell>{matchedDeposit.id}</TableCell>
                            <TableCell>
                              {matchedDeposit.user?.name} {matchedDeposit.user?.lastName}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(matchedDeposit.amount, matchedDeposit.currency)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={matchedDeposit.status}
                                color={matchedDeposit.status === 'verified' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(matchedDeposit.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDuplicateDialog(false)} sx={buttonStyles.text}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepositVerification; 