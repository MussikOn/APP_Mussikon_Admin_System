// Componente VoucherImage - MussikOn Admin System
// Muestra imágenes de vouchers de depósitos con manejo de errores y opciones de visualización

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  ZoomIn as ZoomInIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Importar servicios
import { depositService } from '../services/depositService';
import type { VoucherImageData, DuplicateCheckResult } from '../services/depositService';

// Cache para evitar peticiones duplicadas
const voucherDataCache = new Map<string, VoucherImageData>();
const loadingCache = new Set<string>();

// Función para limpiar cache (opcional)
export const clearVoucherCache = () => {
  voucherDataCache.clear();
  loadingCache.clear();
};

// Importar estilos
import { buttonStyles } from '../theme/buttonStyles';

interface VoucherImageProps {
  depositId: string;
  size?: 'small' | 'medium' | 'large';
  showPreview?: boolean;
  className?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
  showDuplicateCheck?: boolean;
}

const VoucherImage: React.FC<VoucherImageProps> = ({
  depositId,
  size = 'medium',
  showPreview = true,
  className = '',
  onError,
  onLoad,
  showDuplicateCheck = true
}) => {
  const [voucherData, setVoucherData] = useState<VoucherImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [useDirectRoute, setUseDirectRoute] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);

  // Tamaños de imagen
  const imageSizes = {
    small: { width: 120, height: 80 },
    medium: { width: 200, height: 150 },
    large: { width: 300, height: 200 }
  };

  // Máximo número de reintentos
  const MAX_RETRIES = 3;

  // Cargar datos del voucher
  const loadVoucherData = useCallback(async () => {
    if (!depositId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('[VoucherImage] Cargando datos para depositId:', depositId);
      
      const data = await depositService.getDepositInfo(depositId);
      console.log('[VoucherImage] Datos recibidos:', data);
      
      setVoucherData(data);
      
      // Verificar duplicados si está habilitado
      if (showDuplicateCheck) {
        await checkForDuplicates();
      }
      
      console.log('[VoucherImage] Voucher cargado exitosamente');
    } catch (error) {
      console.error('[VoucherImage] Error cargando voucher:', error);
      setError(error instanceof Error ? error.message : 'Error cargando voucher');
    } finally {
      setLoading(false);
    }
  }, [depositId, showDuplicateCheck]);

  // Verificar duplicados
  const checkForDuplicates = async () => {
    try {
      const result = await depositService.checkDuplicateVoucher(depositId);
      setDuplicateCheck(result);
      
      if (result.isDuplicate) {
        console.warn('[VoucherImage] Duplicado detectado:', result);
      }
    } catch (error) {
      console.error('[VoucherImage] Error verificando duplicados:', error);
    }
  };

  // Determinar si tiene voucher basándose en voucherFile
  const hasVoucherFile = Boolean(voucherData?.voucherFile && voucherData.voucherFile.url);
  
  // Debug: mostrar el estado actual
  console.log('[VoucherImage] Estado actual - voucherData:', voucherData);
  console.log('[VoucherImage] Estado actual - hasVoucherFile:', hasVoucherFile);
  console.log('[VoucherImage] Estado actual - imageUrl:', imageUrl);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (depositId) {
      loadVoucherData();
    }
  }, [loadVoucherData]); // Se ejecuta cuando cambia loadVoucherData

  // Efecto para manejar cambios en voucherData
  useEffect(() => {
    if (voucherData && voucherData.voucherFile && voucherData.voucherFile.url && !imageUrl) {
      console.log('[VoucherImage] voucherData actualizado, cargando URL de imagen...');
      // Solo cargar URL si no existe ya
      if (!imageUrlLoading) {
        setImageUrlLoading(true);
        getImageUrl(voucherData).then(url => {
          setImageUrl(url);
          setImageUrlLoading(false);
        }).catch(error => {
          console.error('[VoucherImage] Error cargando URL después de actualización:', error);
          setImageUrlLoading(false);
        });
      }
    }
  }, [voucherData, imageUrl, imageUrlLoading]);

  // Manejar error de imagen con reintentos
  const handleImageError = () => {
    if (retryCount < MAX_RETRIES) {
      if (useDirectRoute) {
        // Intentar con ruta de redirección
        setUseDirectRoute(false);
        setRetryCount(prev => prev + 1);
        setImageError(false);
      } else {
        // Volver a intentar con ruta directa
        setUseDirectRoute(true);
        setRetryCount(prev => prev + 1);
        setImageError(false);
      }
    } else {
      setImageError(true);
      const errorMsg = 'No se pudo cargar la imagen del voucher después de varios intentos';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  // Descargar imagen
  const handleDownload = async () => {
    if (!hasVoucherFile) return;
    
    try {
      // Intentar usar URL firmada si está disponible
      if (imageUrl && imageUrl.startsWith('http')) {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = voucherData?.voucherFile?.filename || `voucher-${depositId}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return;
        }
      }
      
      // Fallback: usar el servicio de descarga
      const blob = await depositService.downloadVoucher(depositId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = voucherData?.voucherFile?.filename || `voucher-${depositId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando voucher:', error);
      // Fallback: usar endpoint de fallback
      const fallbackUrl = `/imgs/voucher/${depositId}`;
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.download = voucherData?.voucherFile?.filename || `voucher-${depositId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Abrir en nueva pestaña
  const handleOpenInNewTab = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    } else {
      // Fallback: usar el endpoint de fallback
      const fallbackUrl = `/imgs/voucher/${depositId}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  // Generar URL de imagen
  const getImageUrl = async (data: VoucherImageData) => {
    console.log('[VoucherImage] getImageUrl - voucherData:', data);
    console.log('[VoucherImage] getImageUrl - hasVoucherFile:', Boolean(data.voucherFile && data.voucherFile.url));
    console.log('[VoucherImage] getImageUrl - depositId:', data.id);
    
    if (!Boolean(data.voucherFile && data.voucherFile.url)) {
      console.log('[VoucherImage] getImageUrl - No tiene voucher file');
      return null;
    }
    
    try {
      console.log('[VoucherImage] getImageUrl - Intentando obtener URL firmada...');
      console.log('[VoucherImage] getImageUrl - Llamando a depositService.getVoucherPresignedUrl...');
      
      // Intentar obtener URL firmada
      const presignedUrl = await depositService.getVoucherPresignedUrl(data.id);
      
      console.log('[VoucherImage] getImageUrl - Respuesta de getVoucherPresignedUrl:', presignedUrl);
      
      if (presignedUrl) {
        console.log('[VoucherImage] getImageUrl - URL firmada obtenida exitosamente:', presignedUrl);
        return presignedUrl;
      }
      
      console.log('[VoucherImage] getImageUrl - URL firmada no disponible, usando fallback');
      
      // Fallback: usar el endpoint de fallback que funciona con S3
      const fallbackUrl = `/imgs/voucher/${data.id}`;
      console.log('[VoucherImage] getImageUrl - Usando endpoint de fallback:', fallbackUrl);
      return fallbackUrl;
    } catch (error) {
      console.error('[VoucherImage] getImageUrl - Error obteniendo URL firmada:', error);
      // Fallback: usar el endpoint de fallback
      const fallbackUrl = `/imgs/voucher/${data.id}`;
      console.log('[VoucherImage] getImageUrl - Usando endpoint de fallback por error:', fallbackUrl);
      return fallbackUrl;
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Renderizar estado de carga o si no hay datos
  if (loading || imageUrlLoading || !voucherData) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          ...imageSizes[size],
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          bgcolor: 'grey.50'
        }}
        className={className}
      >
        <CircularProgress size={24} />
        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
          {loading ? 'Cargando voucher...' : 'Generando URL...'}
        </Typography>
      </Box>
    );
  }

  // Renderizar error
  console.log('[VoucherImage] Renderizando error - error:', error, 'hasVoucherFile:', hasVoucherFile, 'imageError:', imageError);
  if (error || !hasVoucherFile || imageError) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          ...imageSizes[size],
          border: '2px dashed',
          borderColor: 'error.main',
          borderRadius: 2,
          bgcolor: 'error.50'
        }}
        className={className}
      >
        <ErrorIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
        <Typography variant="caption" sx={{ color: 'error.main', textAlign: 'center' }}>
          {error || 'Voucher no disponible'}
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={loadVoucherData}
          sx={{ mt: 1, fontSize: '0.75rem' }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <>
      {/* Imagen del voucher */}
      <Card 
        sx={{ 
          width: imageSizes[size].width,
          height: imageSizes[size].height,
          cursor: showPreview ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': showPreview ? {
            transform: 'scale(1.02)',
            boxShadow: 4
          } : {},
          position: 'relative'
        }}
        className={className}
        onClick={showPreview ? () => setShowDialog(true) : undefined}
      >
        <CardMedia
          component="img"
          image={imageUrl || ''}
          alt={`Voucher de depósito ${depositId}`}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={handleImageError}
          onLoad={() => {
            setImageError(false);
            onLoad?.();
          }}
        />
        
        {/* Overlay con información */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white',
            p: 1
          }}
        >
          <Typography variant="caption" sx={{ display: 'block' }}>
            {voucherData?.currency} {voucherData?.amount}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {new Date(voucherData?.voucherFile?.uploadedAt || '').toLocaleDateString()}
          </Typography>
        </Box>

        {/* Icono de zoom */}
        {showPreview && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              p: 0.5
            }}
          >
            <ZoomInIcon sx={{ fontSize: 16, color: 'white' }} />
          </Box>
        )}

        {/* Badge de duplicado */}
        {duplicateCheck?.isDuplicate && (
          <Tooltip title="Voucher duplicado detectado">
            <Badge
              badgeContent={<SecurityIcon sx={{ fontSize: 12, color: 'warning.main' }} />}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                '& .MuiBadge-badge': {
                  bgcolor: 'warning.main',
                  color: 'white'
                }
              }}
            />
          </Tooltip>
        )}
      </Card>

      {/* Diálogo de vista previa */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1 }} />
              Voucher de Depósito
              {duplicateCheck?.isDuplicate && (
                <Chip
                  label="DUPLICADO"
                  color="warning"
                  size="small"
                  icon={<WarningIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            <IconButton onClick={() => setShowDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Alerta de duplicado */}
          {duplicateCheck?.isDuplicate && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                ⚠️ Voucher Duplicado Detectado
              </Typography>
              <Typography variant="body2">
                Este voucher tiene una similitud del {duplicateCheck.similarityScore}% con otros depósitos.
                Verifique cuidadosamente antes de aprobar.
              </Typography>
              {duplicateCheck.duplicateIds.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  IDs de depósitos similares: {duplicateCheck.duplicateIds.join(', ')}
                </Typography>
              )}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Información del Depósito
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="ID de Depósito"
                      secondary={voucherData?.id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Usuario"
                      secondary={voucherData?.userId}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Monto"
                      secondary={`${voucherData?.currency} ${voucherData?.amount}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Estado"
                      secondary={
                        <Chip
                          label={voucherData?.status}
                          color={voucherData?.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Archivo del Voucher
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Nombre del archivo"
                      secondary={voucherData?.voucherFile?.filename || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tamaño"
                      secondary={voucherData?.voucherFile?.fileSize ? 
                        formatFileSize(voucherData.voucherFile?.fileSize) : 'N/A'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tipo de archivo"
                      secondary={voucherData?.voucherFile?.mimeType || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Fecha de subida"
                      secondary={voucherData?.voucherFile?.uploadedAt ? 
                        new Date(voucherData.voucherFile?.uploadedAt).toLocaleString() : 'N/A'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Hash del archivo"
                      secondary={
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {voucherData?.voucherFile?.hash || 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>

          {/* Imagen en tamaño completo */}
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={imageUrl || ''}
              alt={`Voucher de depósito ${depositId}`}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: 8
              }}
              onError={handleImageError}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={buttonStyles.secondary}
          >
            Descargar
          </Button>
          <Button
            startIcon={<OpenInNewIcon />}
            onClick={handleOpenInNewTab}
            sx={buttonStyles.primary}
          >
            Abrir en Nueva Pestaña
          </Button>
          <Button
            onClick={() => setShowDialog(false)}
            sx={buttonStyles.text}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoucherImage; 