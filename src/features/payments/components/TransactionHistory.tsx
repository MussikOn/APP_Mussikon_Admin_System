// Componente TransactionHistory - MussikOn Admin System
// Lista del historial de transacciones del usuario

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  SwapHoriz as TransferIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';


interface TransactionHistoryProps {
  onRefresh?: () => void;
  className?: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'earning' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  createdAt: string;
  completedAt?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  eventId?: string;
  eventTitle?: string;
}

/**
 * Componente para mostrar el historial de transacciones
 */
export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  onRefresh,
  className
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Cargar transacciones al montar el componente
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Por ahora usamos datos mock, pero aquí se conectaría con el backend
      const mockTransactions: Transaction[] = [
        {
          id: 'tx1',
          type: 'deposit',
          amount: 500.00,
          currency: 'USD',
          status: 'completed',
          description: 'Depósito verificado',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T11:00:00Z'
        },
        {
          id: 'tx2',
          type: 'payment',
          amount: -150.00,
          currency: 'USD',
          status: 'completed',
          description: 'Pago a músico - Boda de María y Carlos',
          createdAt: '2024-01-20T14:45:00Z',
          completedAt: '2024-01-20T15:00:00Z',
          relatedUserId: 'musician123',
          relatedUserName: 'Carlos Músico',
          eventId: 'event1',
          eventTitle: 'Boda de María y Carlos'
        },
        {
          id: 'tx3',
          type: 'earning',
          amount: 300.00,
          currency: 'USD',
          status: 'completed',
          description: 'Ganancia por evento - Fiesta de cumpleaños',
          createdAt: '2024-01-25T18:00:00Z',
          completedAt: '2024-01-25T19:00:00Z',
          eventId: 'event2',
          eventTitle: 'Fiesta de cumpleaños'
        },
        {
          id: 'tx4',
          type: 'withdrawal',
          amount: -200.00,
          currency: 'USD',
          status: 'pending',
          description: 'Solicitud de retiro a cuenta bancaria',
          createdAt: '2024-01-28T09:15:00Z'
        }
      ];
      setTransactions(mockTransactions);
    } catch (err) {
      console.error('Error cargando transacciones:', err);
      setError('Error al cargar el historial de transacciones');
    } finally {
      setLoading(false);
    }
  };

  // Manejar refresh manual
  const handleRefresh = async () => {
    await loadTransactions();
    onRefresh?.();
  };

  // Filtrar transacciones
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    const statusMatch = filterStatus === 'all' || transaction.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Obtener icono según el tipo de transacción
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'earning':
        return <IncomeIcon color="success" />;
      case 'withdrawal':
      case 'payment':
        return <ExpenseIcon color="error" />;
      case 'transfer':
        return <TransferIcon color="primary" />;
      default:
        return <TransferIcon />;
    }
  };

  // Obtener color del chip según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Obtener texto del tipo
  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Retiro';
      case 'payment':
        return 'Pago';
      case 'earning':
        return 'Ganancia';
      case 'transfer':
        return 'Transferencia';
      default:
        return type;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  // Formatear monto
  const formatAmount = (amount: number, currency: string) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount))}`;
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
            Historial de Transacciones
          </Typography>
          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Filtros */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Transacción</InputLabel>
              <Select
                value={filterType}
                label="Tipo de Transacción"
                onChange={(e) => setFilterType(e.target.value)}
                startAdornment={<FilterIcon />}
              >
                <MenuItem value="all">Todos los tipos</MenuItem>
                <MenuItem value="deposit">Depósitos</MenuItem>
                <MenuItem value="withdrawal">Retiros</MenuItem>
                <MenuItem value="payment">Pagos</MenuItem>
                <MenuItem value="earning">Ganancias</MenuItem>
                <MenuItem value="transfer">Transferencias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                label="Estado"
                onChange={(e) => setFilterStatus(e.target.value)}
                startAdornment={<FilterIcon />}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="completed">Completadas</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="failed">Fallidas</MenuItem>
                <MenuItem value="cancelled">Canceladas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {filteredTransactions.length === 0 ? (
          <Alert severity="info">
            No hay transacciones que coincidan con los filtros seleccionados.
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transaction.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getTransactionIcon(transaction.type)}
                        <Typography variant="body2">
                          {getTypeText(transaction.type)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {transaction.description}
                        </Typography>
                        {transaction.eventTitle && (
                          <Typography variant="caption" color="text.secondary">
                            Evento: {transaction.eventTitle}
                          </Typography>
                        )}
                        {transaction.relatedUserName && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Usuario: {transaction.relatedUserName}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={transaction.amount >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatAmount(transaction.amount, transaction.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(transaction.status)}
                        color={getStatusColor(transaction.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredTransactions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Mostrando {filteredTransactions.length} de {transactions.length} transacciones
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            • Las transacciones se actualizan en tiempo real
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Los montos positivos (+) son ingresos, negativos (-) son gastos
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Las transacciones pendientes pueden tardar en procesarse
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory; 