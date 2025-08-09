// Componente DepositForm - MussikOn Admin System
// Formulario para subir depósitos con comprobantes

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  AccountCircle as AccountIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { paymentSystemService } from '../../../services/paymentSystemService';

interface DepositFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

interface DepositFormData {
  amount: number;
  currency: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  depositDate: string;
  depositTime: string;
  referenceNumber: string;
  comments: string;
  voucherFile: File | null;
}

/**
 * Componente para subir depósitos con comprobantes
 */
export const DepositForm: React.FC<DepositFormProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const [formData, setFormData] = useState<DepositFormData>({
    amount: 0,
    currency: 'RD$',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    depositDate: new Date().toISOString().split('T')[0],
    depositTime: new Date().toTimeString().slice(0, 5),
    referenceNumber: '',
    comments: '',
    voucherFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field: keyof DepositFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar errores al cambiar campos
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Manejar selección de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos JPG, PNG o PDF');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede ser mayor a 5MB');
        return;
      }

      handleInputChange('voucherFile', file);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }
    
    if (!formData.voucherFile) {
      setError('Debe seleccionar un comprobante');
      return false;
    }

    if (!formData.accountHolderName.trim()) {
      setError('El nombre del titular de la cuenta es obligatorio');
      return false;
    }

    if (!formData.bankName.trim()) {
      setError('El nombre del banco es obligatorio');
      return false;
    }

    if (!formData.depositDate) {
      setError('La fecha de depósito es obligatoria');
      return false;
    }

    if (!formData.depositTime) {
      setError('La hora de depósito es obligatoria');
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount.toString());
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('accountHolderName', formData.accountHolderName);
      formDataToSend.append('bankName', formData.bankName);
      
      // Solo enviar accountNumber si tiene valor, de lo contrario enviar 'N/A'
      if (formData.accountNumber && formData.accountNumber.trim() !== '') {
        formDataToSend.append('accountNumber', formData.accountNumber);
      } else {
        formDataToSend.append('accountNumber', 'N/A');
      }
      
      formDataToSend.append('depositDate', formData.depositDate);
      formDataToSend.append('depositTime', formData.depositTime);
      
      // Manejar campos opcionales
      if (formData.referenceNumber && formData.referenceNumber.trim() !== '') {
        formDataToSend.append('referenceNumber', formData.referenceNumber);
      } else {
        formDataToSend.append('referenceNumber', 'N/A');
      }
      
      if (formData.comments && formData.comments.trim() !== '') {
        formDataToSend.append('comments', formData.comments);
      } else {
        formDataToSend.append('comments', 'Sin comentarios');
      }
      
      formDataToSend.append('voucherFile', formData.voucherFile!);

      // Enviar depósito
      await paymentSystemService.uploadDeposit(formDataToSend);

      // Limpiar formulario
      setFormData({
        amount: 0,
        currency: 'RD$',
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        depositDate: new Date().toISOString().split('T')[0],
        depositTime: new Date().toTimeString().slice(0, 5),
        referenceNumber: '',
        comments: '',
        voucherFile: null
      });

      setSuccess(true);
      onSuccess?.();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir el depósito';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className} elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Subir Depósito
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sube un comprobante de depósito para agregar fondos a tu cuenta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Depósito subido exitosamente. Será verificado por el administrador.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Información del depósito */}
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>
            Información del Depósito
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Monto"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={formData.currency}
                  label="Moneda"
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <MenuItem value="RD$">RD$ - Peso Dominicano</MenuItem>
                  <MenuItem value="USD">USD - Dólar Estadounidense</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Información bancaria */}
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 3 }}>
            Información Bancaria
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del Titular"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del Banco"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BankIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de Cuenta (Opcional)"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                fullWidth
                disabled={loading}
                helperText="Últimos 4 dígitos de la cuenta"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de Referencia"
                value={formData.referenceNumber}
                onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                disabled={loading}
                helperText="Número de referencia del depósito"
              />
            </Grid>
          </Grid>

          {/* Fecha y hora del depósito */}
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 3 }}>
            Fecha y Hora del Depósito
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Depósito"
                type="date"
                value={formData.depositDate}
                onChange={(e) => handleInputChange('depositDate', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Hora de Depósito"
                type="time"
                value={formData.depositTime}
                onChange={(e) => handleInputChange('depositTime', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          {/* Comentarios */}
          <TextField
            label="Comentarios Adicionales"
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            multiline
            rows={3}
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
            helperText="Información adicional sobre el depósito (opcional)"
          />

          {/* Comprobante */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Comprobante de Depósito
            </Typography>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              disabled={loading}
              fullWidth
              sx={{ mb: 1 }}
            >
              Seleccionar Archivo
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </Button>

            {formData.voucherFile && (
              <Chip
                label={formData.voucherFile.name}
                onDelete={() => handleInputChange('voucherFile', null)}
                color="primary"
                variant="outlined"
              />
            )}

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Formatos permitidos: JPG, PNG, PDF. Tamaño máximo: 5MB
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !formData.voucherFile}
            startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {loading ? 'Subiendo...' : 'Subir Depósito'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepositForm; 