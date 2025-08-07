// Componente BalanceCard - MussikOn Admin System
// Muestra el balance actual del usuario de manera atractiva

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { usePaymentBalance, useFormattedBalance } from '../hooks/usePaymentBalance';

interface BalanceCardProps {
  showRefreshButton?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * Componente que muestra el balance actual del usuario
 */
export const BalanceCard: React.FC<BalanceCardProps> = ({
  showRefreshButton = true,
  variant = 'default',
  className
}) => {
  const { balance, loading, error, refreshBalance } = usePaymentBalance();
  const formattedBalance = useFormattedBalance();

  // Función para manejar el refresh
  const handleRefresh = async () => {
    await refreshBalance();
  };

  // Función para obtener el color del chip según el tipo de usuario
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'musician':
        return 'primary';
      case 'event_organizer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del tipo de usuario
  const getUserTypeText = (userType: string) => {
    switch (userType) {
      case 'musician':
        return 'Músico';
      case 'event_organizer':
        return 'Organizador';
      default:
        return userType;
    }
  };

  // Función para formatear números con separadores de miles
  const formatNumber = (num: number | undefined | null) => {
    // Validar que el número sea válido
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Función para obtener el color del balance según el monto
  const getBalanceColor = (amount: number | undefined | null) => {
    // Validar que el número sea válido
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'error.main';
    }
    if (amount > 1000) return 'success.main';
    if (amount > 500) return 'warning.main';
    return 'error.main';
  };

  // Renderizado de carga
  if (loading) {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Skeleton variant="text" width={200} height={48} />
          <Skeleton variant="text" width={150} height={20} />
        </CardContent>
      </Card>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Alert severity="error" action={
            showRefreshButton && (
              <IconButton
                color="inherit"
                size="small"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            )
          }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Renderizado sin datos
  if (!balance) {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No hay información de balance disponible
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Renderizado compacto
  if (variant === 'compact') {
    return (
      <Card className={className} elevation={2}>
        <CardContent sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <AccountBalanceIcon color="primary" />
              <Typography variant="h6" component="div">
                Balance
              </Typography>
            </Box>
            {showRefreshButton && (
              <Tooltip title="Actualizar balance">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Typography
            variant="h4"
            component="div"
            sx={{ color: getBalanceColor(balance.currentBalance), fontWeight: 'bold' }}
          >
            {formattedBalance}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Renderizado detallado
  if (variant === 'detailed') {
    return (
      <Card className={className} elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccountBalanceIcon color="primary" />
              <Typography variant="h6" component="div">
                Balance Detallado
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={getUserTypeText(balance.userType)}
                color={getUserTypeColor(balance.userType) as any}
                size="small"
              />
              {showRefreshButton && (
                <Tooltip title="Actualizar balance">
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="div"
            sx={{ color: getBalanceColor(balance.currentBalance), fontWeight: 'bold', mb: 2 }}
          >
            {formattedBalance}
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                <TrendingUpIcon fontSize="small" color="success" />
                Total Depositado
              </Typography>
              <Typography variant="h6" color="success.main">
                ${formatNumber(balance.totalDeposited)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                <TrendingDownIcon fontSize="small" color="error" />
                Total Retirado
              </Typography>
              <Typography variant="h6" color="error.main">
                ${formatNumber(balance.totalWithdrawn)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                <MoneyIcon fontSize="small" color="primary" />
                Total Ganado
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${formatNumber(balance.totalEarned)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Ganancias Pendientes
              </Typography>
              <Typography variant="h6" color="warning.main">
                ${formatNumber(balance.pendingEarnings)}
              </Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              Última actualización: {new Date(balance.updatedAt).toLocaleString('es-ES')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Renderizado por defecto
  return (
    <Card className={className} elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalanceIcon color="primary" />
            <Typography variant="h6" component="div">
              Balance Actual
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={getUserTypeText(balance.userType)}
              color={getUserTypeColor(balance.userType) as any}
              size="small"
            />
            {showRefreshButton && (
              <Tooltip title="Actualizar balance">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="div"
          sx={{ color: getBalanceColor(balance.currentBalance), fontWeight: 'bold', mb: 1 }}
        >
          {formattedBalance}
        </Typography>

        <Box display="flex" gap={2} mb={1}>
          <Typography variant="body2" color="text.secondary">
            Depositado: <strong>${formatNumber(balance.totalDeposited)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ganado: <strong>${formatNumber(balance.totalEarned)}</strong>
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Última transacción: {new Date(balance.lastTransactionAt).toLocaleDateString('es-ES')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BalanceCard; 