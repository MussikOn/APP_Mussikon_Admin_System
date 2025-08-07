// Componente BankAccountForm - MussikOn Admin System
// Formulario para registrar cuentas bancarias

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
  Grid
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Person as PersonIcon,
  CreditCard as CardIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { paymentSystemService } from '../../../services/paymentSystemService';
import type { BankAccountData } from '../../../services/paymentSystemService';

interface BankAccountFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Componente para registrar cuentas bancarias
 */
export const BankAccountForm: React.FC<BankAccountFormProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const [formData, setFormData] = useState<BankAccountData>({
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    accountType: 'savings',
    routingNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field: keyof BankAccountData, value: any) => {
    setFormData((prev: BankAccountData) => ({
      ...prev,
      [field]: value
    }));
    // Limpiar errores al cambiar campos
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.accountHolder.trim()) {
      setError('El nombre del titular es requerido');
      return false;
    }
    
    if (!formData.accountNumber.trim()) {
      setError('El número de cuenta es requerido');
      return false;
    }
    
    if (!formData.bankName.trim()) {
      setError('El nombre del banco es requerido');
      return false;
    }
    
    if (!formData.routingNumber.trim()) {
      setError('El número de ruta es requerido');
      return false;
    }

    // Validar formato del número de cuenta (solo números)
    if (!/^\d+$/.test(formData.accountNumber.replace(/\s/g, ''))) {
      setError('El número de cuenta debe contener solo números');
      return false;
    }

    // Validar formato del número de ruta (solo números)
    if (!/^\d+$/.test(formData.routingNumber.replace(/\s/g, ''))) {
      setError('El número de ruta debe contener solo números');
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

      // Enviar datos de la cuenta bancaria
      await paymentSystemService.registerBankAccount(formData);

      // Limpiar formulario
      setFormData({
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        accountType: 'savings',
        routingNumber: ''
      });

      setSuccess(true);
      onSuccess?.();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar la cuenta bancaria';
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
          Registrar Cuenta Bancaria
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Agrega una cuenta bancaria para recibir pagos y retiros
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Cuenta bancaria registrada exitosamente.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del Titular"
                value={formData.accountHolder}
                onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Número de Cuenta"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CardIcon />
                    </InputAdornment>
                  ),
                }}
                helperText="Solo números, sin espacios ni guiones"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Número de Ruta"
                value={formData.routingNumber}
                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BankIcon />
                    </InputAdornment>
                  ),
                }}
                helperText="Código de ruta del banco"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre del Banco"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BankIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Tipo de Cuenta</InputLabel>
                <Select
                  value={formData.accountType}
                  label="Tipo de Cuenta"
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                >
                  <MenuItem value="savings">Cuenta de Ahorros</MenuItem>
                  <MenuItem value="checking">Cuenta Corriente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? 'Registrando...' : 'Registrar Cuenta Bancaria'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            • La cuenta será verificada por el administrador antes de ser activada
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Puedes registrar múltiples cuentas bancarias
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Los datos están protegidos y encriptados
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BankAccountForm; 