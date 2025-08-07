// Componente WithdrawalForm - MussikOn Admin System
// Formulario para solicitar retiros de fondos

import React, { useState, useEffect } from 'react';
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
  Grid,
  Chip
} from '@mui/material';
import {

  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { paymentSystemService } from '../../../services/paymentSystemService';
import { usePaymentBalance } from '../hooks/usePaymentBalance';
import type { BankAccount, WithdrawalRequestData } from '../../../services/paymentSystemService';

interface WithdrawalFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Componente para solicitar retiros de fondos
 */
export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const { balance } = usePaymentBalance();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<WithdrawalRequestData>({
    bankAccountId: '',
    amount: 0,
    currency: 'USD',
    reason: ''
  });

  // Cargar cuentas bancarias al montar el componente
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const accounts = await paymentSystemService.getMyBankAccounts();
      setBankAccounts(accounts);
    } catch (err) {
      console.error('Error cargando cuentas bancarias:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field: keyof WithdrawalRequestData, value: any) => {
    setFormData((prev: WithdrawalRequestData) => ({
      ...prev,
      [field]: value
    }));
    // Limpiar errores al cambiar campos
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.bankAccountId) {
      setError('Debe seleccionar una cuenta bancaria');
      return false;
    }
    
    if (formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }

    if (!balance) {
      setError('No se pudo obtener el balance actual');
      return false;
    }

    if (formData.amount > balance.currentBalance) {
      setError(`No tienes fondos suficientes. Balance disponible: $${balance.currentBalance.toFixed(2)}`);
      return false;
    }
    
    if (formData.reason && formData.reason.trim().length < 10) {
      setError('La razón del retiro debe tener al menos 10 caracteres');
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

      // Enviar solicitud de retiro
      await paymentSystemService.requestWithdrawal(formData);

      // Limpiar formulario
      setFormData({
        bankAccountId: '',
        amount: 0,
        currency: 'USD',
        reason: ''
      });

      setSuccess(true);
      onSuccess?.();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al solicitar el retiro';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener la cuenta bancaria seleccionada
  const selectedAccount = bankAccounts.find(account => account.id === formData.bankAccountId);

  return (
    <Card className={className} elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Solicitar Retiro
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Solicita un retiro de fondos a tu cuenta bancaria
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Solicitud de retiro enviada exitosamente. Será procesada por el administrador.
          </Alert>
        )}

        {balance && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Balance disponible: <strong>${balance.currentBalance.toFixed(2)}</strong>
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={loading || loadingAccounts}>
                <InputLabel>Cuenta Bancaria</InputLabel>
                <Select
                  value={formData.bankAccountId}
                  label="Cuenta Bancaria"
                  onChange={(e) => handleInputChange('bankAccountId', e.target.value)}
                >
                  {bankAccounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      <Box>
                        <Typography variant="body2">
                          {account.bankName} - {account.accountNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.accountHolder} ({account.accountType === 'savings' ? 'Ahorros' : 'Corriente'})
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {loadingAccounts && (
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">Cargando cuentas bancarias...</Typography>
                </Box>
              )}

              {!loadingAccounts && bankAccounts.length === 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  No tienes cuentas bancarias registradas. Registra una cuenta primero.
                </Alert>
              )}
            </Grid>

            {selectedAccount && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cuenta seleccionada:
                  </Typography>
                  <Chip
                    label={`${selectedAccount.bankName} - ${selectedAccount.accountNumber}`}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                label="Monto a Retirar"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                fullWidth
                required
                disabled={loading || !formData.bankAccountId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                helperText={balance ? `Máximo: $${balance.currentBalance.toFixed(2)}` : ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Razón del Retiro (Opcional)"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                multiline
                rows={3}
                fullWidth
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
                helperText="Describe el motivo del retiro (opcional, mínimo 10 caracteres si se especifica)"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !formData.bankAccountId || bankAccounts.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {loading ? 'Enviando...' : 'Solicitar Retiro'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            • Los retiros se procesan en 1-3 días hábiles
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Se aplica una comisión del 2% por retiro
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • El monto mínimo para retiros es $10.00
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WithdrawalForm; 