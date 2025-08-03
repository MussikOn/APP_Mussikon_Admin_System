// Componente de Verificación de Depósitos - MussikOn Admin System
// Funcionalidad específica para que el admin verifique depósitos de usuarios

import React, { useState } from 'react';
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
  StepContent
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Importar servicios y hooks
import { paymentService } from '../../../services/paymentService';
import type { Invoice } from '../../../services/paymentService';
import { useApiRequest } from '../../../hooks/useApiRequest';

// Importar estilos
import { buttonStyles, chipStyles } from '../../../theme/buttonStyles';

interface DepositVerificationProps {
  invoice: Invoice;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

interface VerificationStep {
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const DepositVerification: React.FC<DepositVerificationProps> = ({
  invoice,
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
    depositAmount: invoice.amount,
    depositDate: new Date().toISOString().split('T')[0],
    notes: '',
    adminNotes: '',
    verificationStatus: 'pending'
  });

  // Estado para diálogos
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Hooks para API requests
  const markAsPaidRequest = useApiRequest(paymentService.markInvoiceAsPaid.bind(paymentService));

  // Pasos de verificación
  const verificationSteps: VerificationStep[] = [
    {
      label: 'Revisar Documentación',
      description: 'Verificar comprobante de depósito y documentación del usuario',
      completed: false,
      required: true
    },
    {
      label: 'Confirmar Monto',
      description: 'Verificar que el monto depositado coincida con la factura',
      completed: false,
      required: true
    },
    {
      label: 'Validar Fecha',
      description: 'Confirmar que el depósito se realizó dentro del plazo',
      completed: false,
      required: true
    },
    {
      label: 'Registrar Verificación',
      description: 'Completar el proceso de verificación en el sistema',
      completed: false,
      required: true
    }
  ];

  // Manejar cambio de paso
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepComplete = (stepIndex: number) => {
    // En una implementación real, actualizarías el estado de los pasos
    console.log(`Step ${stepIndex} completed`);
  };

  // Confirmar verificación
  const confirmVerification = async () => {
    try {
      await markAsPaidRequest.execute(invoice.id);
      onVerificationComplete();
    } catch (error) {
      console.error('Error verificando depósito:', error);
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
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener estado de la factura
  const getInvoiceStatus = () => {
    const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      return { status: 'overdue', label: 'Vencida', color: 'error' as const };
    } else if (daysUntilDue <= 3) {
      return { status: 'urgent', label: 'Urgente', color: 'warning' as const };
    } else {
      return { status: 'pending', label: 'Pendiente', color: 'info' as const };
    }
  };

  const invoiceStatus = getInvoiceStatus();

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
              label={invoiceStatus.label}
              color={invoiceStatus.color}
              icon={<ReceiptIcon />}
              sx={chipStyles[invoiceStatus.color as keyof typeof chipStyles]}
            />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Factura ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {invoice.id}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Usuario ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {invoice.userId}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monto de la Factura
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatCurrency(invoice.amount, invoice.currency)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fecha de Vencimiento
              </Typography>
              <Typography variant="body1">
                {formatDate(invoice.dueDate)}
              </Typography>
            </Grid>
          </Grid>
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
                  icon={step.completed ? <CheckCircleIcon color="success" /> : undefined}
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
                          <MenuItem value="other">Otro</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        label="Número de Referencia"
                        value={verificationData.referenceNumber}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          referenceNumber: e.target.value
                        })}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}
                  
                  {index === 1 && (
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
                          startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                        }}
                      />
                      
                      {verificationData.depositAmount !== invoice.amount && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          El monto depositado no coincide con el monto de la factura
                        </Alert>
                      )}
                    </Box>
                  )}
                  
                  {index === 2 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Fecha del Depósito"
                        type="date"
                        value={verificationData.depositDate}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          depositDate: e.target.value
                        })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Banco"
                        value={verificationData.bankName}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          bankName: e.target.value
                        })}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}
                  
                  {index === 3 && (
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
          disabled={markAsPaidRequest.loading || activeStep < verificationSteps.length - 1}
          startIcon={markAsPaidRequest.loading ? <CircularProgress size={16} /> : <VerifiedUserIcon />}
          sx={buttonStyles.primary}
        >
          {markAsPaidRequest.loading ? 'Verificando...' : 'Confirmar Verificación'}
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
            Detalles de la Factura
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información de la Factura
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="ID de Factura"
                    secondary={invoice.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Usuario"
                    secondary={invoice.userId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Monto"
                    secondary={formatCurrency(invoice.amount, invoice.currency)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Estado"
                    secondary={
                      <Chip
                        label={invoiceStatus.label}
                        color={invoiceStatus.color}
                        size="small"
                        sx={chipStyles[invoiceStatus.color as keyof typeof chipStyles]}
                      />
                    }
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información de Verificación
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Método de Verificación"
                    secondary={verificationData.verificationMethod || 'No especificado'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Número de Referencia"
                    secondary={verificationData.referenceNumber || 'No especificado'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Monto Depositado"
                    secondary={formatCurrency(verificationData.depositAmount, invoice.currency)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fecha de Depósito"
                    secondary={verificationData.depositDate ? formatDate(verificationData.depositDate) : 'No especificada'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          {verificationData.notes && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notas de Verificación
              </Typography>
              <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                {verificationData.notes}
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
    </Box>
  );
};

export default DepositVerification; 