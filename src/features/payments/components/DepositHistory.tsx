// Componente DepositHistory - MussikOn Admin System
// Lista del historial de depósitos del usuario

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CloudDownload as CloudDownloadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { paymentSystemService } from '../../../services/paymentSystemService';
import VoucherImageEditor from './VoucherImageEditor';

interface DepositHistoryProps {
  onRefresh?: () => void;
  className?: string;
}

interface Deposit {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  voucherUrl?: string;
  description?: string;
  verifiedAt?: string;
  rejectedReason?: string;
}

/**
 * Componente para mostrar el historial de depósitos
 */
export const DepositHistory: React.FC<DepositHistoryProps> = ({
  onRefresh,
  className
}) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [editingDepositId, setEditingDepositId] = useState<string | null>(null);

  // Cargar depósitos al montar el componente
  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      setError(null);
      const depositsData = await paymentSystemService.getMyDeposits();
      
      // Validar que depositsData sea un array
      if (!Array.isArray(depositsData)) {
        console.error('❌ depositsData no es un array:', depositsData);
        setError('Error: Los datos de depósitos no tienen el formato esperado');
        setDeposits([]);
        return;
      }
      
      console.log('✅ Deposits data loaded successfully:', depositsData);
      setDeposits(depositsData);
    } catch (err) {
      console.error('Error cargando depósitos:', err);
      setError('Error al cargar el historial de depósitos');
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar refresh manual
  const handleRefresh = async () => {
    await loadDeposits();
    onRefresh?.();
  };

  // Manejar visualización de comprobante
  const handleViewVoucher = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setDialogOpen(true);
  };

  // Manejar descarga de comprobante
  const handleDownloadVoucher = async (depositId: string) => {
    try {
      const blob = await paymentSystemService.downloadVoucher(depositId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante-${depositId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error descargando comprobante:', err);
    }
  };

  // Manejar edición de imagen del voucher
  const handleEditVoucherImage = (depositId: string) => {
    setEditingDepositId(depositId);
    setImageEditorOpen(true);
  };

  // Manejar cierre del editor de imágenes
  const handleCloseImageEditor = () => {
    setImageEditorOpen(false);
    setEditingDepositId(null);
  };

  // Manejar actualización de imagen
  const handleImageUpdated = (newImageUrl: string) => {
    // Actualizar la lista de depósitos con la nueva imagen
    setDeposits(prevDeposits => 
      prevDeposits.map(deposit => 
        deposit.id === editingDepositId 
          ? { ...deposit, voucherUrl: newImageUrl }
          : deposit
      )
    );
  };

  // Obtener color del chip según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verificado';
      case 'rejected':
        return 'Rechazado';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  // Formatear monto
  const formatAmount = (amount: number, currency: string) => {
    try {
      // Normalizar códigos de moneda no estándar
      const normalizedCurrency = normalizeCurrencyCode(currency);
      
      // Intentar formatear con Intl.NumberFormat
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: normalizedCurrency
      }).format(amount);
    } catch (error) {
      console.warn(`⚠️ Error formateando moneda "${currency}":`, error);
      // Fallback: formatear manualmente
      return `${amount.toLocaleString('es-ES')} ${currency}`;
    }
  };

  // Normalizar códigos de moneda
  const normalizeCurrencyCode = (currency: string): string => {
    const currencyMap: Record<string, string> = {
      'RD$': 'DOP',    // Peso Dominicano
      'RD': 'DOP',     // Peso Dominicano (corto)
      'USD': 'USD',    // Dólar Estadounidense
      'EUR': 'EUR',    // Euro
      'PESO': 'DOP',   // Peso (genérico)
      'DOLLAR': 'USD', // Dólar (genérico)
      'EURO': 'EUR',   // Euro (genérico)
    };

    // Buscar en el mapa de normalización
    const normalized = currencyMap[currency.toUpperCase()];
    if (normalized) {
      return normalized;
    }

    // Si no está en el mapa, intentar usar el código tal como viene
    // pero limpiar caracteres especiales
    const cleanCurrency = currency.replace(/[^A-Z]/gi, '').toUpperCase();
    
    // Verificar si es un código ISO válido (3 letras)
    if (cleanCurrency.length === 3 && /^[A-Z]{3}$/.test(cleanCurrency)) {
      return cleanCurrency;
    }

    // Si no es válido, usar USD como fallback
    console.warn(`⚠️ Código de moneda no reconocido: "${currency}", usando USD como fallback`);
    return 'USD';
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
    <>
      <Card className={className} elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Historial de Depósitos
            </Typography>
            <Tooltip title="Actualizar">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {deposits.length === 0 ? (
            <Alert severity="info">
              No hay depósitos registrados. Sube tu primer depósito para comenzar.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(deposits) && deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(deposit.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatAmount(deposit.amount, deposit.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(deposit.status)}
                          color={getStatusColor(deposit.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {deposit.description || 'Sin descripción'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          {deposit.voucherUrl && (
                            <>
                              <Tooltip title="Ver comprobante">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewVoucher(deposit)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar imagen">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditVoucherImage(deposit.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Descargar comprobante">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadVoucher(deposit.id)}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {Array.isArray(deposits) && deposits.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Total de depósitos: {deposits.length}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver comprobante */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Comprobante de Depósito
          {selectedDeposit && (
            <Typography variant="caption" display="block" color="text.secondary">
              {formatAmount(selectedDeposit.amount, selectedDeposit.currency)} - {formatDate(selectedDeposit.createdAt)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedDeposit?.voucherUrl && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedDeposit.voucherUrl}
                alt="Comprobante de depósito"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
          {selectedDeposit && (
            <Button
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                handleDownloadVoucher(selectedDeposit.id);
                setDialogOpen(false);
              }}
            >
              Descargar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Editor de imágenes del voucher */}
      <VoucherImageEditor
        open={imageEditorOpen}
        onClose={handleCloseImageEditor}
        voucherId={editingDepositId || ''}
        currentImageUrl={deposits.find(d => d.id === editingDepositId)?.voucherUrl}
        onImageUpdated={handleImageUpdated}
      />
    </>
  );
};

export default DepositHistory; 