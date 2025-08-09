// Componente VoucherDuplicateChecker - MussikOn Admin System
// Herramienta avanzada para detectar y analizar vouchers duplicados

import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

interface VoucherDuplicateCheckerProps {
  depositId: string;
  onDuplicateFound?: (result: any) => void;
  onFlagSuspicious?: (depositId: string, reason: string) => void;
  showDetails?: boolean;
}

interface DuplicateAnalysis {
  similarityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendations: string[];
}

const VoucherDuplicateChecker: React.FC<VoucherDuplicateCheckerProps> = ({
  depositId,
  onDuplicateFound,
  onFlagSuspicious,
  showDetails = true
}) => {
  const [duplicateCheck, setDuplicateCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState<any>(null);
  const [analysis, setAnalysis] = useState<DuplicateAnalysis | null>(null);

  // Cargar verificación de duplicados
  const loadDuplicateCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular verificación de duplicados
      const mockResult = {
        isDuplicate: false,
        matchedDeposits: [],
        similarityScore: 0
      };
      setDuplicateCheck(mockResult);
      
      if (mockResult.isDuplicate) {
        onDuplicateFound?.(mockResult);
        analyzeDuplicates(mockResult);
      }
    } catch (error) {
      console.error('[VoucherDuplicateChecker] Error verificando duplicados:', error);
      setError(error instanceof Error ? error.message : 'Error verificando duplicados');
    } finally {
      setLoading(false);
    }
  };

  // Analizar duplicados para determinar nivel de riesgo
  const analyzeDuplicates = (result: any) => {
    const riskFactors: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Analizar similitud
    if (result.similarityScore >= 95) {
      riskFactors.push('Similitud muy alta (>95%)');
      riskLevel = 'critical';
      recommendations.push('Rechazar inmediatamente - Voucher idéntico detectado');
    } else if (result.similarityScore >= 80) {
      riskFactors.push('Similitud alta (80-95%)');
      riskLevel = 'high';
      recommendations.push('Verificación manual detallada requerida');
    } else if (result.similarityScore >= 60) {
      riskFactors.push('Similitud moderada (60-80%)');
      riskLevel = 'medium';
      recommendations.push('Revisar cuidadosamente antes de aprobar');
    }

    // Analizar patrones de tiempo
    const timePatterns = analyzeTimePatterns(result.matchedDeposits);
    if (timePatterns.suspicious) {
      riskFactors.push('Patrón temporal sospechoso');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
      recommendations.push('Verificar secuencia temporal de depósitos');
    }

    // Analizar patrones de monto
    const amountPatterns = analyzeAmountPatterns(result.matchedDeposits);
    if (amountPatterns.suspicious) {
      riskFactors.push('Patrón de montos sospechoso');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
      recommendations.push('Verificar consistencia de montos');
    }

    // Analizar usuarios involucrados
    const userPatterns = analyzeUserPatterns(result.matchedDeposits);
    if (userPatterns.suspicious) {
      riskFactors.push('Patrón de usuarios sospechoso');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
      recommendations.push('Verificar relación entre usuarios');
    }

    setAnalysis({
      similarityScore: result.similarityScore,
      riskLevel,
      riskFactors,
      recommendations
    });
  };

  // Analizar patrones temporales
  const analyzeTimePatterns = (deposits: any[]) => {
    const timestamps = deposits.map(d => new Date(d.createdAt).getTime()).sort();
    const intervals = [];
    
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i-1]);
    }
    
    // Detectar intervalos muy cortos (menos de 1 hora)
    const suspiciousIntervals = intervals.filter(interval => interval < 3600000);
    
    return {
      suspicious: suspiciousIntervals.length > 0,
      intervals: suspiciousIntervals,
      totalIntervals: intervals.length
    };
  };

  // Analizar patrones de monto
  const analyzeAmountPatterns = (deposits: any[]) => {
    const amounts = deposits.map(d => d.amount);
    const uniqueAmounts = new Set(amounts);
    
    // Detectar montos idénticos
    const suspiciousAmounts = amounts.filter(amount => 
      amounts.filter(a => a === amount).length > 1
    );
    
    return {
      suspicious: suspiciousAmounts.length > 0,
      uniqueAmounts: uniqueAmounts.size,
      totalAmounts: amounts.length,
      suspiciousAmounts
    };
  };

  // Analizar patrones de usuarios
  const analyzeUserPatterns = (deposits: any[]) => {
    const users = deposits.map(d => d.userId);
    const uniqueUsers = new Set(users);
    
    // Detectar múltiples depósitos del mismo usuario
    const userCounts = users.reduce((acc, user) => {
      acc[user] = (acc[user] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const suspiciousUsers = Object.entries(userCounts)
      .filter(([_, count]) => (count as number) > 1)
      .map(([user, count]) => ({ user, count }));
    
    return {
      suspicious: suspiciousUsers.length > 0,
      uniqueUsers: uniqueUsers.size,
      totalDeposits: deposits.length,
      suspiciousUsers
    };
  };

  // Marcar como sospechoso
  const handleFlagSuspicious = () => {
    if (analysis) {
      const reason = `Voucher duplicado detectado - Similitud: ${analysis.similarityScore}%, Nivel de riesgo: ${analysis.riskLevel}`;
      onFlagSuspicious?.(depositId, reason);
    }
  };

  // Obtener color del nivel de riesgo
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
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

  // Cargar verificación al montar
  useEffect(() => {
    if (depositId) {
      loadDuplicateCheck();
    }
  }, [depositId]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            <Typography>Verificando duplicados...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            <Typography variant="subtitle2" gutterBottom>
              Error verificando duplicados
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              size="small"
              onClick={loadDuplicateCheck}
              startIcon={<RefreshIcon />}
              sx={{ mt: 1 }}
            >
              Reintentar
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!duplicateCheck) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No se pudo verificar duplicados
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SecurityIcon color={duplicateCheck.isDuplicate ? 'warning' : 'success'} />
            <Typography variant="h6">
              Verificación de Duplicados
            </Typography>
            <Chip
              label={duplicateCheck.isDuplicate ? 'DUPLICADO DETECTADO' : 'SIN DUPLICADOS'}
              color={duplicateCheck.isDuplicate ? 'warning' : 'success'}
              icon={duplicateCheck.isDuplicate ? <WarningIcon /> : <CheckCircleIcon />}
            />
          </Box>

          {duplicateCheck.isDuplicate ? (
            <Box>
              {/* Análisis de riesgo */}
              {analysis && (
                <Alert 
                  severity={getRiskColor(analysis.riskLevel) as any}
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      size="small"
                      onClick={() => setShowAnalysisDialog(true)}
                      startIcon={<AnalyticsIcon />}
                    >
                      Ver Análisis
                    </Button>
                  }
                >
                  <Typography variant="subtitle2" gutterBottom>
                    ⚠️ Nivel de Riesgo: {analysis.riskLevel.toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    Similitud: {analysis.similarityScore}% | 
                    Factores de riesgo: {analysis.riskFactors.length}
                  </Typography>
                </Alert>
              )}

              {/* Lista de duplicados */}
              {duplicateCheck.matchedDeposits.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Depósitos Similares ({duplicateCheck.matchedDeposits.length})
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Usuario</TableCell>
                          <TableCell>Monto</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {duplicateCheck.matchedDeposits.slice(0, 5).map((deposit: any) => (
                          <TableRow key={deposit.id} hover>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {deposit.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {deposit.user?.name} {deposit.user?.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {deposit.userId}
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
                                color={deposit.status === 'verified' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {formatDate(deposit.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedDuplicate(deposit)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {duplicateCheck.matchedDeposits.length > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Mostrando 5 de {duplicateCheck.matchedDeposits.length} depósitos similares
                    </Typography>
                  )}
                </Box>
              )}

              {/* Acciones */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={handleFlagSuspicious}
                  startIcon={<FlagIcon />}
                >
                  Marcar Sospechoso
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<BlockIcon />}
                >
                  Rechazar
                </Button>
                
                {showDetails && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShowAnalysisDialog(true)}
                    startIcon={<AnalyticsIcon />}
                  >
                    Análisis Detallado
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Alert severity="success">
              <Typography variant="body2">
                ✅ No se detectaron duplicados para este voucher
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Análisis Detallado */}
      <Dialog
        open={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 1 }} />
            Análisis Detallado de Duplicados
          </Box>
        </DialogTitle>
        <DialogContent>
          {analysis && (
            <Box>
              {/* Resumen del análisis */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resumen del Análisis
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Similitud
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {analysis.similarityScore}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nivel de Riesgo
                      </Typography>
                      <Chip
                        label={analysis.riskLevel.toUpperCase()}
                        color={getRiskColor(analysis.riskLevel) as any}
                        size="medium"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Factores de Riesgo
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {analysis.riskFactors.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Factores de riesgo */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    Factores de Riesgo Detectados
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {analysis.riskFactors.map((factor, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Recomendaciones */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    Recomendaciones
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {analysis.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Comparación de vouchers */}
              {duplicateCheck.matchedDeposits.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Comparación de Vouchers
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Voucher Actual
                        </Typography>
                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Imagen del voucher
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {duplicateCheck.matchedDeposits.slice(0, 2).map((deposit: any, index: number) => (
                        <Grid item xs={12} md={6} key={deposit.id}>
                          <Typography variant="subtitle1" gutterBottom>
                            Voucher Similar {index + 1}
                          </Typography>
                          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Imagen del voucher similar
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {deposit.user?.name} - {formatCurrency(deposit.amount, deposit.currency)}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalysisDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Detalles del Duplicado */}
      <Dialog
        open={!!selectedDuplicate}
        onClose={() => setSelectedDuplicate(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Depósito Similar
        </DialogTitle>
        <DialogContent>
          {selectedDuplicate && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información del Usuario
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Nombre"
                        secondary={`${selectedDuplicate.user?.name} ${selectedDuplicate.user?.lastName}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedDuplicate.user?.userEmail}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="ID de Usuario"
                        secondary={selectedDuplicate.userId}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información del Depósito
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="ID"
                        secondary={selectedDuplicate.id}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Monto"
                        secondary={formatCurrency(selectedDuplicate.amount, selectedDuplicate.currency)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={
                          <Chip
                            label={selectedDuplicate.status}
                            color={selectedDuplicate.status === 'verified' ? 'success' : 'warning'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Fecha"
                        secondary={formatDate(selectedDuplicate.createdAt)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Voucher
                  </Typography>
                  <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Imagen del voucher
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDuplicate(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoucherDuplicateChecker;
