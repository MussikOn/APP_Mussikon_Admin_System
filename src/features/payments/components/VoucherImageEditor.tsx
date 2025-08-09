// Componente VoucherImageEditor - MussikOn Admin System
// Editor de imágenes para vouchers de depósitos

import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,

  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,

} from '@mui/icons-material';
import { voucherService } from '../../../services/voucherService';

interface VoucherImageEditorProps {
  open: boolean;
  onClose: () => void;
  voucherId: string;
  currentImageUrl?: string;
  onImageUpdated?: (newImageUrl: string) => void;
}

interface ImageEditState {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  zoom: number;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

const initialEditState: ImageEditState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  zoom: 1,
  crop: null
};

export const VoucherImageEditor: React.FC<VoucherImageEditorProps> = ({
  open,
  onClose,
  voucherId,

  onImageUpdated
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editState, setEditState] = useState<ImageEditState>(initialEditState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Manejar selección de archivo
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 10MB permitido');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Crear URL de preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  // Aplicar filtros de edición
  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Configurar canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Aplicar transformaciones
      ctx.save();
      
      // Rotación
      if (editState.rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((editState.rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      // Zoom
      if (editState.zoom !== 1) {
        ctx.scale(editState.zoom, editState.zoom);
      }

      // Dibujar imagen
      ctx.drawImage(img, 0, 0);

      // Aplicar filtros CSS
      const filters = [
        `brightness(${editState.brightness}%)`,
        `contrast(${editState.contrast}%)`,
        `saturate(${editState.saturation}%)`
      ].join(' ');

      canvas.style.filter = filters;
      
      ctx.restore();
    };
    img.src = previewUrl;
  }, [previewUrl, editState]);

  // Aplicar filtros cuando cambie el estado
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Manejar cambios en controles de edición
  const handleEditChange = (property: keyof ImageEditState, value: number) => {
    setEditState(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Resetear edición
  const handleReset = () => {
    setEditState(initialEditState);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Guardar imagen
  const handleSave = async () => {
    if (!selectedFile) {
      setError('No hay imagen seleccionada para guardar');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Aquí podrías procesar la imagen editada antes de enviarla
      // Por ahora enviamos el archivo original
      const updatedVoucher = await voucherService.updateVoucherImage(voucherId, selectedFile);
      
      setSuccess('Imagen del voucher actualizada exitosamente');
      
      // Notificar al componente padre
      if (onImageUpdated && updatedVoucher.voucherUrl) {
        onImageUpdated(updatedVoucher.voucherUrl);
      }

      // Cerrar después de un breve delay
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      console.error('Error actualizando imagen:', err);
      setError(err.message || 'Error al actualizar la imagen del voucher');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cierre
  const handleClose = () => {
    if (loading) return; // No permitir cerrar mientras se guarda
    
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Editar Imagen del Voucher
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Panel de edición */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              {previewUrl ? (
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      border: '2px dashed #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Vista previa de la imagen editada
                  </Typography>
                </Box>
              ) : (
                <Box textAlign="center">
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Selecciona una imagen para comenzar a editar
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<EditIcon />}
                  >
                    Seleccionar Imagen
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Panel de controles */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Controles de Edición
              </Typography>

              {/* Selección de archivo */}
              <Box sx={{ mb: 3 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<EditIcon />}
                  sx={{ mb: 1 }}
                >
                  {selectedFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </Button>
                {selectedFile && (
                  <Chip
                    label={selectedFile.name}
                    size="small"
                    onDelete={() => setSelectedFile(null)}
                    sx={{ width: '100%' }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Controles de zoom */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Zoom
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditChange('zoom', Math.max(0.5, editState.zoom - 0.1))}
                  >
                    <ZoomOutIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: '40px', textAlign: 'center' }}>
                    {Math.round(editState.zoom * 100)}%
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleEditChange('zoom', Math.min(3, editState.zoom + 0.1))}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Controles de rotación */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Rotación
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditChange('rotation', editState.rotation - 90)}
                  >
                    <RotateLeftIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: '40px', textAlign: 'center' }}>
                    {editState.rotation}°
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleEditChange('rotation', editState.rotation + 90)}
                  >
                    <RotateRightIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Controles de brillo */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Brillo
                </Typography>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={editState.brightness}
                  onChange={(e) => handleEditChange('brightness', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {editState.brightness}%
                </Typography>
              </Box>

              {/* Controles de contraste */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Contraste
                </Typography>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={editState.contrast}
                  onChange={(e) => handleEditChange('contrast', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {editState.contrast}%
                </Typography>
              </Box>

              {/* Controles de saturación */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Saturación
                </Typography>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={editState.saturation}
                  onChange={(e) => handleEditChange('saturation', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {editState.saturation}%
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Botones de acción */}
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleReset}
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                >
                  Resetear
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Mensajes de estado */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedFile || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherImageEditor; 