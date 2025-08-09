// Componente VoucherBulkManager - MussikOn Admin System
// Gestión masiva de vouchers para administradores

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Clear as ClearIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Importar servicios
import { depositService } from '../../../services/depositService';
import type { UserDeposit, VerifyDepositRequest } from '../../../services/depositService';

// Importar componentes
import VoucherImage from '../../../components/VoucherImage';

interface VoucherBulkManagerProps {
  deposits: UserDeposit[];
  onBulkAction?: (action: 'approve' | 'reject' | 'flag', depositIds: string[], notes?: string) => void;
  onRefresh?: () => void;
  className?: string;
}

interface BulkActionState {
  selectedDeposits: Set<string>;
  action: 'approve' | 'reject' | 'flag' | null;
  notes: string;
  loading: boolean;
  progress: number;
}

interface FilterState {
  status: string;
  amountRange: { min: number; max: number };
  dateRange: { from: string; to: string };
  search: string;
}

const VoucherBulkManager: React.FC<VoucherBulkManagerProps> = ({
  deposits,
  onBulkAction,
  onRefresh,
  className = ''
}) => {
  const [bulkState, setBulkState] = useState<BulkActionState>({
    selectedDeposits: new Set(),
    action: null,
    notes: '',
    loading: false,
    progress: 0
  });

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    amountRange: { min: 0, max: 1000000 },
    dateRange: { from: '', to: '' },
    search: ''
  });

  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'user' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrar y ordenar depósitos
  const filteredAndSortedDeposits = deposits
    .filter(deposit => {
      // Filtro por estado
      if (filters.status !== 'all' && deposit.status !== filters.status) {
        return false;
      }

      // Filtro por monto
      if (deposit.amount < filters.amountRange.min || deposit.amount > filters.amountRange.max) {
        return false;
      }

      // Filtro por fecha
      if (filters.dateRange.from && new Date(deposit.createdAt) < new Date(filters.dateRange.from)) {
        return false;
      }
      if (filters.dateRange.to && new Date(deposit.createdAt) > new Date(filters.dateRange.to)) {
        return false;
      }

      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesId = deposit.id.toLowerCase().includes(searchLower);
        const matchesUser = deposit.user?.name?.toLowerCase().includes(searchLower) ||
                           deposit.user?.lastName?.toLowerCase().includes(searchLower) ||
                           deposit.user?.userEmail?.toLowerCase().includes(searchLower);
        const matchesAmount = deposit.amount.toString().includes(searchLower);
        
        if (!matchesId && !matchesUser && !matchesAmount) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'user':
          comparison = (a.user?.name || '').localeCompare(b.user?.name || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Seleccionar/deseleccionar todos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredAndSortedDeposits.map(d => d.id));
      setBulkState(prev => ({ ...prev, selectedDeposits: allIds }));
    } else {
      setBulkState(prev => ({ ...prev, selectedDeposits: new Set() }));
    }
  };

  // Seleccionar/deseleccionar individual
  const handleSelectDeposit = (depositId: string, checked: boolean) => {
    setBulkState(prev => {
      const newSelected = new Set(prev.selectedDeposits);
      if (checked) {
        newSelected.add(depositId);
      } else {
        newSelected.delete(depositId);
      }
      return { ...prev, selectedDeposits: newSelected };
    });
  };

  // Ejecutar acción masiva
  const executeBulkAction = async () => {
    if (!bulkState.action || bulkState.selectedDeposits.size === 0) return;

    setBulkState(prev => ({ ...prev, loading: true, progress: 0 }));
    
    const selectedIds = Array.from(bulkState.selectedDeposits);
    const total = selectedIds.length;
    
    try {
      for (let i = 0; i < selectedIds.length; i++) {
        const depositId = selectedIds[i];
        
        const verificationRequest: VerifyDepositRequest = {
          approved: bulkState.action === 'approve',
          notes: bulkState.notes,
          rejectionReason: bulkState.action === 'reject' ? bulkState.notes : undefined
        };

        await depositService.verifyDeposit(depositId, verificationRequest);
        
        // Actualizar progreso
        setBulkState(prev => ({ 
          ...prev, 
          progress: ((i + 1) / total) * 100 
        }));
      }

      // Limpiar selección
      setBulkState(prev => ({ 
        ...prev, 
        selectedDeposits: new Set(),
        action: null,
        notes: '',
        loading: false,
        progress: 0
      }));

      setShowBulkDialog(false);
      onBulkAction?.(bulkState.action, selectedIds, bulkState.notes);
      onRefresh?.();
      
    } catch (error) {
      console.error('Error ejecutando acción masiva:', error);
      setBulkState(prev => ({ ...prev, loading: false }));
    }
  };

  // Obtener estadísticas de selección
  const getSelectionStats = () => {
    const selected = Array.from(bulkState.selectedDeposits);
    const selectedDeposits = filteredAndSortedDeposits.filter(d => selected.includes(d.id));
    
    return {
      count: selected.length,
      totalAmount: selectedDeposits.reduce((sum, d) => sum + d.amount, 0),
      statuses: selectedDeposits.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      hasDuplicates: selectedDeposits.some(d => d.duplicateCheck?.isDuplicate)
    };
  };

  // Formatear moneda
  const formatCurrency = (amount: number, currency: string = 'DOP') => {
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'verified': return 'success';
      case 'rejected': return 'error';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  const selectionStats = getSelectionStats();
  const allSelected = filteredAndSortedDeposits.length > 0 && 
                     bulkState.selectedDeposits.size === filteredAndSortedDeposits.length;
  const someSelected = bulkState.selectedDeposits.size > 0 && !allSelected;

  return (
    <Box className={className}>
      {/* Header con controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Gestión Masiva de Vouchers
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterIcon />}
              >
                Filtros
              </Button>
              
              <Button
                size="small"
                variant="outlined"
                onClick={onRefresh}
                startIcon={<RefreshIcon />}
              >
                Actualizar
              </Button>
            </Box>
          </Box>

          {/* Estadísticas */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total de Depósitos
              </Typography>
              <Typography variant="h6">
                {filteredAndSortedDeposits.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Seleccionados
              </Typography>
              <Typography variant="h6" color="primary">
                {selectionStats.count}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Monto Total Seleccionado
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(selectionStats.totalAmount)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Con Duplicados
              </Typography>
              <Typography variant="h6" color={selectionStats.hasDuplicates ? 'warning' : 'success'}>
                {selectionStats.hasDuplicates ? 'Sí' : 'No'}
              </Typography>
            </Grid>
          </Grid>

          {/* Controles de selección */}
          {selectionStats.count > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {selectionStats.count} depósito(s) seleccionado(s)
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setBulkState(prev => ({ ...prev, action: 'approve' }));
                    setShowBulkDialog(true);
                  }}
                  startIcon={<ApproveIcon />}
                >
                  Aprobar Seleccionados
                </Button>
                
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setBulkState(prev => ({ ...prev, action: 'reject' }));
                    setShowBulkDialog(true);
                  }}
                  startIcon={<RejectIcon />}
                >
                  Rechazar Seleccionados
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setBulkState(prev => ({ ...prev, action: 'flag' }));
                    setShowBulkDialog(true);
                  }}
                  startIcon={<FlagIcon />}
                >
                  Marcar Sospechosos
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setBulkState(prev => ({ ...prev, selectedDeposits: new Set() }))}
                  startIcon={<ClearIcon />}
                >
                  Limpiar Selección
                </Button>
              </Box>
            </Alert>
          )}

          {/* Filtros */}
          {showFilters && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Filtros y Ordenamiento</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        label="Estado"
                      >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="pending">Pendientes</MenuItem>
                        <MenuItem value="verified">Verificados</MenuItem>
                        <MenuItem value="rejected">Rechazados</MenuItem>
                        <MenuItem value="processing">Procesando</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monto Mínimo"
                      type="number"
                      value={filters.amountRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        amountRange: { ...prev.amountRange, min: Number(e.target.value) }
                      }))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monto Máximo"
                      type="number"
                      value={filters.amountRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        amountRange: { ...prev.amountRange, max: Number(e.target.value) }
                      }))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Buscar"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="ID, usuario, monto..."
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ordenar por</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        label="Ordenar por"
                      >
                        <MenuItem value="date">Fecha</MenuItem>
                        <MenuItem value="amount">Monto</MenuItem>
                        <MenuItem value="user">Usuario</MenuItem>
                        <MenuItem value="status">Estado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Orden</InputLabel>
                      <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        label="Orden"
                      >
                        <MenuItem value="desc">Descendente</MenuItem>
                        <MenuItem value="asc">Ascendente</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Tabla de depósitos */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={someSelected}
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  </TableCell>
                  <TableCell>Voucher</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Duplicados</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedDeposits.map((deposit) => (
                  <TableRow key={deposit.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={bulkState.selectedDeposits.has(deposit.id)}
                        onChange={(e) => handleSelectDeposit(deposit.id, e.target.checked)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <VoucherImage
                        depositId={deposit.id}
                        size="small"
                        showPreview={true}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {deposit.user?.name} {deposit.user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {deposit.user?.userEmail}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(deposit.amount, deposit.currency)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={deposit.status}
                        color={getStatusColor(deposit.status) as any}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="caption">
                        {formatDate(deposit.createdAt)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      {deposit.duplicateCheck?.isDuplicate ? (
                        <Chip
                          label="DUPLICADO"
                          color="warning"
                          size="small"
                          icon={<WarningIcon />}
                        />
                      ) : (
                        <Chip
                          label="OK"
                          color="success"
                          size="small"
                          icon={<CheckBoxIcon />}
                        />
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Verificar duplicados">
                          <IconButton size="small">
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Ver detalles">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredAndSortedDeposits.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron depósitos que coincidan con los filtros
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de acción masiva */}
      <Dialog
        open={showBulkDialog}
        onClose={() => !bulkState.loading && setShowBulkDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {bulkState.action === 'approve' && <ApproveIcon sx={{ mr: 1, color: 'success.main' }} />}
            {bulkState.action === 'reject' && <RejectIcon sx={{ mr: 1, color: 'error.main' }} />}
            {bulkState.action === 'flag' && <FlagIcon sx={{ mr: 1, color: 'warning.main' }} />}
            
            {bulkState.action === 'approve' && 'Aprobar Depósitos Seleccionados'}
            {bulkState.action === 'reject' && 'Rechazar Depósitos Seleccionados'}
            {bulkState.action === 'flag' && 'Marcar como Sospechosos'}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {bulkState.loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={bulkState.progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Procesando... {Math.round(bulkState.progress)}%
              </Typography>
            </Box>
          )}

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ⚠️ Acción Masiva
            </Typography>
            <Typography variant="body2">
              Está a punto de {bulkState.action === 'approve' ? 'aprobar' : 
                              bulkState.action === 'reject' ? 'rechazar' : 'marcar como sospechosos'} 
              {selectionStats.count} depósito(s) seleccionado(s).
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            label={bulkState.action === 'reject' ? 'Razón de Rechazo' : 'Notas'}
            value={bulkState.notes}
            onChange={(e) => setBulkState(prev => ({ ...prev, notes: e.target.value }))}
            placeholder={bulkState.action === 'reject' ? 
              'Especificar razón del rechazo...' : 
              'Notas adicionales sobre la acción...'
            }
            disabled={bulkState.loading}
          />

          {/* Resumen de selección */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Resumen de Selección
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Cantidad de depósitos"
                  secondary={selectionStats.count}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Monto total"
                  secondary={formatCurrency(selectionStats.totalAmount)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Estados"
                  secondary={Object.entries(selectionStats.statuses)
                    .map(([status, count]) => `${status}: ${count}`)
                    .join(', ')
                  }
                />
              </ListItem>
              {selectionStats.hasDuplicates && (
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="⚠️ Algunos depósitos tienen duplicados"
                    secondary="Se recomienda revisión manual"
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button
            onClick={() => setShowBulkDialog(false)}
            disabled={bulkState.loading}
          >
            Cancelar
          </Button>
          
          <Button
            variant="contained"
            onClick={executeBulkAction}
            disabled={bulkState.loading || !bulkState.action}
            startIcon={bulkState.loading ? <CircularProgress size={16} /> : undefined}
            color={bulkState.action === 'approve' ? 'success' : 
                   bulkState.action === 'reject' ? 'error' : 'warning'}
          >
            {bulkState.loading ? 'Procesando...' : 
             bulkState.action === 'approve' ? 'Aprobar' :
             bulkState.action === 'reject' ? 'Rechazar' : 'Marcar Sospechoso'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherBulkManager;
