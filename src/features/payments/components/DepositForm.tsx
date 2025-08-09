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
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon
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
  description: string;
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
    currency: 'USD',
    description: '',
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
    
    if (formData.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
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
      formDataToSend.append('description', formData.description);
      formDataToSend.append('voucherFile', formData.voucherFile!);

      // Enviar depósito
      await paymentSystemService.uploadDeposit(formDataToSend);

      // Limpiar formulario
      setFormData({
        amount: 0,
        currency: 'USD',
        description: '',
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
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} sx={{ mb: 2 }}>
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

            <FormControl fullWidth disabled={loading}>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={formData.currency}
                label="Moneda"
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <MenuItem value="USD">USD - Dólar Estadounidense</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="COP">COP - Peso Colombiano</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
            helperText="Describe el propósito del depósito (mínimo 10 caracteres)"
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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