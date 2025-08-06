import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Card, 
  CardContent, 
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Snackbar
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  PhotoLibrary as GalleryIcon,
  Person as PersonIcon,
  Event as EventIcon,
  PostAdd as PostIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import ResponsiveLayout from '../../components/ResponsiveLayout';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { responsiveTypography } from '../../theme/breakpoints';
import { buttonStyles } from '../../theme/buttonStyles';
import { useImages } from './hooks/useImages';
import ImageUpload from './components/ImageUpload';
import ImageFilters from './components/ImageFilters';
import type { Image, ImageUpdateRequest } from './types/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`image-tabpanel-${index}`}
      aria-labelledby={`image-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Images: React.FC = () => {
  const {
    images,
    loading,
    error,
    uploading,
    stats,
    loadImages,
    uploadImage,
    updateImage,
    deleteImage,
    searchImages,
    getImagesByCategory,
    getPublicImages,
    cleanupExpiredImages,
    getImagePresignedUrl
  } = useImages();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [editDialog, setEditDialog] = useState<{ open: boolean; image: Image | null }>({ open: false, image: null });
  const [editForm, setEditForm] = useState<ImageUpdateRequest>({});
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  // Filtrar y ordenar imágenes
  const filteredImages = (Array.isArray(images) ? images : [])
    .filter(image => 
      image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const handleImageUpload = async (
    file: File, 
    category: Image['category'], 
    metadata?: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ) => {
    try {
      await uploadImage(file, category, metadata);
      showSnackbar('Imagen subida exitosamente', 'success');
    } catch {
      showSnackbar('Error al subir la imagen', 'error');
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      try {
        await deleteImage(imageId);
        setSelectedImages(prev => prev.filter(id => id !== imageId));
        showSnackbar('Imagen eliminada exitosamente', 'success');
      } catch {
        showSnackbar('Error al eliminar la imagen', 'error');
      }
    }
  };

  const handleImageUpdate = async (imageId: string, updateData: ImageUpdateRequest) => {
    try {
      await updateImage(imageId, updateData);
      setEditDialog({ open: false, image: null });
      setEditForm({});
      showSnackbar('Imagen actualizada exitosamente', 'success');
    } catch {
      showSnackbar('Error al actualizar la imagen', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedImages.length} imagen(es)?`)) {
      try {
        await Promise.all(selectedImages.map(imageId => deleteImage(imageId)));
        setSelectedImages([]);
        showSnackbar(`${selectedImages.length} imágenes eliminadas exitosamente`, 'success');
      } catch {
        showSnackbar('Error al eliminar las imágenes', 'error');
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await searchImages(term);
    } else {
      await loadImages();
    }
  };

  const handleCategoryFilter = async (category: Image['category'] | 'all') => {
    if (category === 'all') {
      await loadImages();
    } else {
      await getImagesByCategory(category);
    }
  };

  const handlePublicFilter = async () => {
    await getPublicImages();
  };

  const handleCleanup = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar las imágenes expiradas?')) {
      try {
        const result = await cleanupExpiredImages();
        showSnackbar(`${result.deletedCount} imágenes expiradas fueron eliminadas`, 'success');
      } catch {
        showSnackbar('Error al limpiar imágenes', 'error');
      }
    }
  };

  const openEditDialog = (image: Image) => {
    setEditForm({
      description: image.description || '',
      tags: image.tags || [],
      isPublic: image.isPublic,
      isActive: image.isActive
    });
    setEditDialog({ open: true, image });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: Image['category']) => {
    switch (category) {
      case 'profile': return <PersonIcon />;
      case 'post': return <PostIcon />;
      case 'event': return <EventIcon />;
      case 'gallery': return <GalleryIcon />;
      default: return <CategoryIcon />;
    }
  };

  const getCategoryColor = (category: Image['category']) => {
    switch (category) {
      case 'profile': return 'primary';
      case 'post': return 'secondary';
      case 'event': return 'success';
      case 'gallery': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando galería de imágenes...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
          Conectando con el backend para obtener las imágenes disponibles
        </Typography>
      </Box>
    );
  }

  // ✅ NUEVO: Mostrar error si existe
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        gap: 2,
        p: 3
      }}>
        <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar imágenes
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => loadImages()}
            sx={{ mt: 2 }}
          >
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <ResponsiveLayout
      spacing="lg"
      sx={{ maxWidth: '100%', mx: 'auto' }}
    >
      {/* Header con estadísticas */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          gap: 2 
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: responsiveTypography.h4
              }}
            >
              Galería de Imágenes
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {images.length} imagen(es) • {stats?.totalSize ? formatFileSize(stats.totalSize) : '0 Bytes'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => loadImages()}
              sx={{ 
                ...buttonStyles.secondary,
                color: 'white', 
                borderColor: 'white', 
                '&:hover': { 
                  borderColor: 'white', 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                } 
              }}
            >
              Actualizar
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={handleCleanup}
              sx={{ 
                ...buttonStyles.secondary,
                color: 'white', 
                borderColor: 'white', 
                '&:hover': { 
                  borderColor: 'white', 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                } 
              }}
            >
              Limpiar
            </Button>
            
            {selectedImages.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{ 
                  backgroundColor: '#ff4757', 
                  '&:hover': { backgroundColor: '#ff3742' } 
                }}
              >
                Eliminar ({selectedImages.length})
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Estadísticas */}
      {stats && (
        <ResponsiveGrid
          type="metrics"
          gap={3}
          sx={{ mb: 3 }}
        >
          <Card sx={{ minWidth: 250, flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.totalImages || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Imágenes
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <GalleryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 250, flex: 1, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatFileSize(stats?.totalSize || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tamaño Total
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <DownloadIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 250, flex: 1, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats?.publicImages || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Públicas
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <VisibilityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 250, flex: 1, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Object.keys(stats?.imagesByCategory || {}).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Categorías
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </ResponsiveGrid>
      )}

      {/* Tabs para diferentes vistas */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Todas las Imágenes" />
          <Tab label="Subir Nueva" />
          <Tab label="Filtros Avanzados" />
        </Tabs>
      </Paper>

      {/* Tab Panel - Todas las Imágenes */}
      <TabPanel value={tabValue} index={0}>
        {/* Filtros rápidos */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 300, flexGrow: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Todas" 
                onClick={() => loadImages()}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="Públicas" 
                onClick={() => handlePublicFilter()}
                icon={<VisibilityIcon />}
              />
              <Chip 
                label="Perfil" 
                onClick={() => handleCategoryFilter('profile')}
                icon={<PersonIcon />}
              />
              <Chip 
                label="Posts" 
                onClick={() => handleCategoryFilter('post')}
                icon={<PostIcon />}
              />
              <Chip 
                label="Eventos" 
                onClick={() => handleCategoryFilter('event')}
                icon={<EventIcon />}
              />
            </Box>
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button onClick={() => loadImages()} sx={{ ml: 2 }}>
              Reintentar
            </Button>
          </Alert>
        )}

        {/* Images Grid */}
        {filteredImages.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>🖼️</Typography>
              <Typography variant="h6" gutterBottom>
                No hay imágenes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm 
                  ? 'No se encontraron imágenes que coincidan con tu búsqueda.'
                  : 'Sube tu primera imagen para comenzar.'
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <ResponsiveGrid
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            gap={2}
          >
            {filteredImages.map((image) => (
              <Card 
                key={image.id}
                sx={{ 
                  width: 300,
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={image.url}
                      alt={image.originalName}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error(`Error cargando imagen ${image.id}:`, e);
                        // ✅ CORREGIDO: Usar placeholder local en lugar de hacer consultas al backend
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    
                    {/* Overlay con acciones */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      display: 'flex',
                      gap: 1
                    }}>
                      <Tooltip title={image.isPublic ? 'Pública' : 'Privada'}>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
                          {image.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Más opciones">
                        <IconButton 
                          size="small" 
                          sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                          onClick={(e) => handleMenuOpen(e)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {/* Badge de categoría */}
                    <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                      <Chip
                        icon={getCategoryIcon(image.category)}
                        label={image.category}
                        size="small"
                        color={getCategoryColor(image.category) as any}
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                      />
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap gutterBottom>
                      {image.originalName}
                    </Typography>
                    
                    {image.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {image.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {image.tags?.slice(0, 3).map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {image.tags && image.tags.length > 3 && (
                        <Chip label={`+${image.tags.length - 3}`} size="small" />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(image.size)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(image.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEditDialog(image)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleImageDelete(image.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box>
                      <Tooltip title="Copiar URL">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            showSnackbar('URL copiada al portapapeles', 'success');
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Descargar">
                        <IconButton 
                          size="small"
                          onClick={async () => {
                            try {
                              // ✅ CORREGIDO: Usar URL existente si está disponible
                              if (image.url && image.url.startsWith('http')) {
                                const link = document.createElement('a');
                                link.href = image.url;
                                link.download = image.originalName;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                showSnackbar('Descarga iniciada', 'success');
                              } else {
                                // Solo intentar URL firmada si no hay URL válida
                                const presignedUrl = await getImagePresignedUrl(image.id);
                                if (presignedUrl) {
                                  const link = document.createElement('a');
                                  link.href = presignedUrl;
                                  link.download = image.originalName;
                                  link.target = '_blank';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  showSnackbar('Descarga iniciada', 'success');
                                } else {
                                  showSnackbar('No se pudo obtener la URL de descarga', 'error');
                                }
                              }
                            } catch (error) {
                              console.error('Error descargando imagen:', error);
                              showSnackbar('Error al descargar la imagen', 'error');
                            }
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              ))}
            </ResponsiveGrid>
        )}
      </TabPanel>

      {/* Tab Panel - Subir Nueva */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Subir Nueva Imagen
            </Typography>
            <ImageUpload 
              onUpload={handleImageUpload}
              uploading={uploading}
            />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab Panel - Filtros Avanzados */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros Avanzados
            </Typography>
            <ImageFilters
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onSelectAll={handleSelectAll}
              allSelected={selectedImages.length === filteredImages.length && filteredImages.length > 0}
              someSelected={selectedImages.length > 0 && selectedImages.length < filteredImages.length}
              onCategoryFilter={handleCategoryFilter}
              onPublicFilter={handlePublicFilter}
            />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, image: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Imagen</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Descripción"
            value={editForm.description || ''}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2, mt: 1 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={editForm.isPublic ?? true}
                onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
              />
            }
            label="Imagen pública"
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={editForm.isActive ?? true}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              />
            }
            label="Imagen activa"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, image: null })}>
            Cancelar
          </Button>
          <Button 
            variant="contained"
            onClick={() => editDialog.image && handleImageUpdate(editDialog.image.id, editForm)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Compartir</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* FAB para subir imagen rápida */}
      <Fab
        color="primary"
        aria-label="subir imagen"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setTabValue(1)}
      >
        <UploadIcon />
      </Fab>
    </ResponsiveLayout>
  );
};

export default Images; 