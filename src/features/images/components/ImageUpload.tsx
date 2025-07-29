import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Add as AddIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface ImageUploadProps {
  onUpload: (
    file: File, 
    category: 'profile' | 'post' | 'event' | 'gallery' | 'other', 
    metadata?: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ) => Promise<void>;
  uploading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, uploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'profile' | 'post' | 'event' | 'gallery' | 'other'>('gallery');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
      return false;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Limpiar el input para permitir subir el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      setError('Por favor, arrastra un archivo de imagen válido');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo');
      return;
    }

    try {
      await onUpload(selectedFile, category, {
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        isPublic
      });
      
      // Limpiar formulario después de subir
      setSelectedFile(null);
      setDescription('');
      setTags([]);
      setNewTag('');
      setCategory('gallery');
      setIsPublic(true);
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setError('Error al subir la imagen. Inténtalo de nuevo.');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      {/* Área de subida */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Seleccionar Imagen
          </Typography>
          
          <Paper
            elevation={isDragOver ? 8 : 1}
            sx={{
              border: '3px dashed',
              borderColor: isDragOver ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
            {uploading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={40} />
                <Typography>Subiendo imagen...</Typography>
              </Box>
            ) : selectedFile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain'
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  startIcon={<ClearIcon />}
                >
                  Cambiar archivo
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6">
                  Arrastra una imagen aquí
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  o haz clic para seleccionar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Formatos: JPEG, PNG, GIF, WebP • Máximo: 10MB
                </Typography>
              </Box>
            )}
          </Paper>
        </CardContent>
      </Card>

      {/* Formulario de metadatos */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información de la Imagen
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                label="Categoría"
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <MenuItem value="profile">Perfil</MenuItem>
                <MenuItem value="post">Post</MenuItem>
                <MenuItem value="event">Evento</MenuItem>
                <MenuItem value="gallery">Galería</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              placeholder="Describe la imagen..."
            />

            <Box>
              <Typography variant="body2" gutterBottom>
                Etiquetas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Agregar etiqueta..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  size="small"
                  onClick={handleAddTag}
                  startIcon={<AddIcon />}
                  disabled={!newTag.trim()}
                >
                  Agregar
                </Button>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label="Imagen pública"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload; 