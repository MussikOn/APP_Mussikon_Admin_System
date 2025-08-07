// Componente BankAccountsList - MussikOn Admin System
// Lista de cuentas bancarias del usuario

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import {
  AccountBalance as BankIcon,

  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
  Star as DefaultIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { paymentSystemService } from '../../../services/paymentSystemService';
import type { BankAccount } from '../../../services/paymentSystemService';

interface BankAccountsListProps {
  onRefresh?: () => void;
  className?: string;
}

/**
 * Componente para mostrar la lista de cuentas bancarias
 */
export const BankAccountsList: React.FC<BankAccountsListProps> = ({
  onRefresh,
  className
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar cuentas bancarias al montar el componente
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const accountsData = await paymentSystemService.getMyBankAccounts();
      setBankAccounts(accountsData);
    } catch (err) {
      console.error('Error cargando cuentas bancarias:', err);
      setError('Error al cargar las cuentas bancarias');
    } finally {
      setLoading(false);
    }
  };

  // Manejar refresh manual
  const handleRefresh = async () => {
    await loadBankAccounts();
    onRefresh?.();
  };

  // Obtener texto del tipo de cuenta
  const getAccountTypeText = (accountType: string) => {
    switch (accountType) {
      case 'savings':
        return 'Ahorros';
      case 'checking':
        return 'Corriente';
      default:
        return accountType;
    }
  };

  // Formatear número de cuenta (mostrar solo últimos 4 dígitos)
  const formatAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">
            Mis Cuentas Bancarias
          </Typography>
          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {bankAccounts.length === 0 ? (
          <Alert severity="info">
            No tienes cuentas bancarias registradas. Registra una cuenta para recibir pagos y retiros.
          </Alert>
        ) : (
          <List>
            {bankAccounts.map((account, index) => (
              <React.Fragment key={account.id}>
                <ListItem
                  sx={{
                    border: account.isDefault ? '2px solid' : '1px solid',
                    borderColor: account.isDefault ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: account.isDefault ? 'primary.50' : 'transparent'
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BankIcon />
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" fontWeight="bold">
                          {account.bankName}
                        </Typography>
                        {account.isDefault && (
                          <Chip
                            icon={<DefaultIcon />}
                            label="Predeterminada"
                            color="primary"
                            size="small"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Titular:</strong> {account.accountHolder}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cuenta:</strong> {formatAccountNumber(account.accountNumber)} ({getAccountTypeText(account.accountType)})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ruta:</strong> {account.routingNumber}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                          <Chip
                            icon={account.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                            label={account.isVerified ? 'Verificada' : 'Pendiente de verificación'}
                            color={account.isVerified ? 'success' : 'warning'}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Registrada el {formatDate(account.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  
                  <Box display="flex" gap={1}>
                    <Tooltip title="Editar cuenta">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar cuenta">
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
                
                {index < bankAccounts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {bankAccounts.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Total de cuentas: {bankAccounts.length}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Cuentas verificadas: {bankAccounts.filter(acc => acc.isVerified).length}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            • Solo las cuentas verificadas pueden recibir pagos
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • La cuenta predeterminada se usa para retiros automáticos
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Puedes cambiar la cuenta predeterminada en cualquier momento
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BankAccountsList; 