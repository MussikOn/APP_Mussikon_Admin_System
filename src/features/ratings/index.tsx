import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Pagination
} from '@mui/material';
import {
  Star,
  StarBorder,
  StarHalf,
  RateReview,
  ThumbUp,
  ThumbDown,
  Flag,
  Edit,
  Delete,
  Reply,
  Visibility,
  FilterList,
  Sort,
  Add,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ratingsService } from '../../services/ratingsService';
import { Rating as RatingType, Review, RatingStats } from './types/ratings';

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
      id={`ratings-tabpanel-${index}`}
      aria-labelledby={`ratings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const RatingsSystem: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para datos
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  
  // Estados para filtros y paginación
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para diálogos
  const [addReviewDialog, setAddReviewDialog] = useState(false);
  const [editReviewDialog, setEditReviewDialog] = useState(false);
  const [deleteReviewDialog, setDeleteReviewDialog] = useState(false);
  const [viewReviewDialog, setViewReviewDialog] = useState(false);
  const [replyDialog, setReplyDialog] = useState(false);
  
  // Estados para formularios
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    category: 'performance',
    anonymous: false
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyForm, setReplyForm] = useState({
    reply: ''
  });

  useEffect(() => {
    loadData();
  }, [ratingFilter, sortBy, sortOrder, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ratingsData, reviewsData, statsData] = await Promise.all([
        ratingsService.getRatings({ filter: ratingFilter, sortBy, sortOrder }),
        ratingsService.getReviews({ filter: ratingFilter, sortBy, sortOrder, page: currentPage, limit: itemsPerPage }),
        ratingsService.getRatingStats()
      ]);
      setRatings(ratingsData);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      setError('Error al cargar los datos de calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddReview = async () => {
    try {
      const newReview = await ratingsService.addReview(reviewForm);
      setReviews([newReview, ...reviews]);
      setAddReviewDialog(false);
      setReviewForm({
        rating: 0,
        title: '',
        comment: '',
        category: 'performance',
        anonymous: false
      });
      setSuccess('Reseña agregada exitosamente');
      loadData(); // Recargar estadísticas
    } catch (err) {
      setError('Error al agregar la reseña');
    }
  };

  const handleEditReview = async () => {
    if (!editingReview) return;
    
    try {
      const updatedReview = await ratingsService.updateReview(
        editingReview.id,
        reviewForm
      );
      setReviews(reviews.map(r => 
        r.id === updatedReview.id ? updatedReview : r
      ));
      setEditReviewDialog(false);
      setEditingReview(null);
      setSuccess('Reseña actualizada exitosamente');
      loadData(); // Recargar estadísticas
    } catch (err) {
      setError('Error al actualizar la reseña');
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    
    try {
      await ratingsService.deleteReview(deletingReview.id);
      setReviews(reviews.filter(r => r.id !== deletingReview.id));
      setDeleteReviewDialog(false);
      setDeletingReview(null);
      setSuccess('Reseña eliminada exitosamente');
      loadData(); // Recargar estadísticas
    } catch (err) {
      setError('Error al eliminar la reseña');
    }
  };

  const handleReplyToReview = async () => {
    if (!selectedReview) return;
    
    try {
      const updatedReview = await ratingsService.replyToReview(
        selectedReview.id,
        replyForm.reply
      );
      setReviews(reviews.map(r => 
        r.id === updatedReview.id ? updatedReview : r
      ));
      setReplyDialog(false);
      setSelectedReview(null);
      setReplyForm({ reply: '' });
      setSuccess('Respuesta enviada exitosamente');
    } catch (err) {
      setError('Error al enviar la respuesta');
    }
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      category: review.category,
      anonymous: review.anonymous
    });
    setEditReviewDialog(true);
  };

  const openDeleteDialog = (review: Review) => {
    setDeletingReview(review);
    setDeleteReviewDialog(true);
  };

  const openReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setReplyDialog(true);
  };

  const openViewDialog = (review: Review) => {
    setSelectedReview(review);
    setViewReviewDialog(true);
  };

  const handleRatingChange = (newValue: number | null) => {
    setReviewForm({ ...reviewForm, rating: newValue || 0 });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 4) return 'Muy Bueno';
    if (rating >= 3.5) return 'Bueno';
    if (rating >= 3) return 'Regular';
    if (rating >= 2) return 'Deficiente';
    return 'Muy Malo';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      performance: 'Rendimiento',
      professionalism: 'Profesionalismo',
      communication: 'Comunicación',
      punctuality: 'Puntualidad',
      quality: 'Calidad',
      overall: 'General'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      performance: 'primary',
      professionalism: 'secondary',
      communication: 'success',
      punctuality: 'warning',
      quality: 'error',
      overall: 'info'
    };
    return colors[category] || 'default';
  };

  const filteredReviews = reviews.filter(review => {
    if (ratingFilter === 'all') return true;
    if (ratingFilter === 'positive') return review.rating >= 4;
    if (ratingFilter === 'neutral') return review.rating >= 3 && review.rating < 4;
    if (ratingFilter === 'negative') return review.rating < 3;
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sistema de Calificaciones y Reseñas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddReviewDialog(true)}
        >
          Agregar Reseña
        </Button>
      </Box>

      {/* Estadísticas Generales */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calificación Promedio
                    </Typography>
                  </Box>
                </Box>
                <Rating value={stats.averageRating} readOnly precision={0.1} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RateReview color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.totalReviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Reseñas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ThumbUp color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.positiveReviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reseñas Positivas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ThumbDown color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.negativeReviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reseñas Negativas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Distribución de Calificaciones */}
      {stats && (
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Distribución de Calificaciones" />
          <CardContent>
            <Grid container spacing={2}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Grid item xs={12} sm={6} md={2.4} key={rating}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {rating}
                      </Typography>
                      <Star color="warning" />
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%`,
                          height: 20,
                          bgcolor: getRatingColor(rating) === 'success' ? 'success.main' : 
                                   getRatingColor(rating) === 'warning' ? 'warning.main' : 'error.main',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {stats.ratingDistribution[rating]} reseñas
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Filtros y Ordenamiento */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por Calificación</InputLabel>
                <Select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  label="Filtrar por Calificación"
                >
                  <MenuItem value="all">Todas las Calificaciones</MenuItem>
                  <MenuItem value="positive">Positivas (4-5 estrellas)</MenuItem>
                  <MenuItem value="neutral">Neutrales (3 estrellas)</MenuItem>
                  <MenuItem value="negative">Negativas (1-2 estrellas)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="date">Fecha</MenuItem>
                  <MenuItem value="rating">Calificación</MenuItem>
                  <MenuItem value="helpful">Más Útiles</MenuItem>
                  <MenuItem value="recent">Más Recientes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Orden</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  label="Orden"
                >
                  <MenuItem value="desc">Descendente</MenuItem>
                  <MenuItem value="asc">Ascendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={loadData}
                startIcon={<Refresh />}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs de Navegación */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="ratings tabs">
            <Tab label="Reseñas" />
            <Tab label="Calificaciones" />
            <Tab label="Análisis" />
          </Tabs>
        </Box>

        {/* Tab 1: Reseñas */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Calificación</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt={review.user.name} />
                          ) : (
                            review.user?.name?.charAt(0) || 'U'
                          )}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {review.anonymous ? 'Anónimo' : review.user?.name || 'Usuario'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.user?.email || 'email@ejemplo.com'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({review.rating})
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {review.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {review.comment.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(review.category)}
                        color={getCategoryColor(review.category) as any}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(review.createdAt).toLocaleDateString('es-ES')}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => openViewDialog(review)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        
                        {user?.id === review.userId && (
                          <>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(review)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openDeleteDialog(review)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        <Tooltip title="Responder">
                          <IconButton
                            size="small"
                            onClick={() => openReplyDialog(review)}
                          >
                            <Reply />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </TabPanel>

        {/* Tab 2: Calificaciones */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {ratings.map((rating) => (
              <Grid item xs={12} sm={6} md={4} key={rating.id}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar>
                        {rating.user?.avatar ? (
                          <img src={rating.user.avatar} alt={rating.user.name} />
                        ) : (
                          rating.user?.name?.charAt(0) || 'U'
                        )}
                      </Avatar>
                    }
                    title={rating.user?.name || 'Usuario'}
                    subheader={new Date(rating.createdAt).toLocaleDateString('es-ES')}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={rating.value} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({rating.value})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {rating.comment || 'Sin comentario'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 3: Análisis */}
        <TabPanel value={tabValue} index={2}>
          {stats && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Calificaciones por Categoría" />
                  <CardContent>
                    {Object.entries(stats.categoryAverages).map(([category, average]) => (
                      <Box key={category} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">
                            {getCategoryLabel(category)}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {average.toFixed(1)}
                          </Typography>
                        </Box>
                        <Rating value={average} readOnly precision={0.1} size="small" />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Tendencias de Calificación" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Análisis de las tendencias de calificación a lo largo del tiempo.
                    </Typography>
                    <Button variant="outlined" fullWidth>
                      Ver Gráficos Detallados
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Card>

      {/* Diálogo para agregar reseña */}
      <Dialog
        open={addReviewDialog}
        onClose={() => setAddReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Agregar Nueva Reseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Calificación General
              </Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(_, newValue) => handleRatingChange(newValue)}
                size="large"
              />
              {reviewForm.rating > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {getRatingLabel(reviewForm.rating)}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Reseña"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comentario"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={reviewForm.category}
                  onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                  label="Categoría"
                >
                  <MenuItem value="performance">Rendimiento</MenuItem>
                  <MenuItem value="professionalism">Profesionalismo</MenuItem>
                  <MenuItem value="communication">Comunicación</MenuItem>
                  <MenuItem value="punctuality">Puntualidad</MenuItem>
                  <MenuItem value="quality">Calidad</MenuItem>
                  <MenuItem value="overall">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Publicar Anónimamente</InputLabel>
                <Select
                  value={reviewForm.anonymous ? 'yes' : 'no'}
                  onChange={(e) => setReviewForm({ ...reviewForm, anonymous: e.target.value === 'yes' })}
                  label="Publicar Anónimamente"
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Sí</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddReviewDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddReview} 
            variant="contained"
            disabled={!reviewForm.rating || !reviewForm.title || !reviewForm.comment}
          >
            Publicar Reseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar reseña */}
      <Dialog
        open={editReviewDialog}
        onClose={() => setEditReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Reseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Calificación General
              </Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(_, newValue) => handleRatingChange(newValue)}
                size="large"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Reseña"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comentario"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={reviewForm.category}
                  onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                  label="Categoría"
                >
                  <MenuItem value="performance">Rendimiento</MenuItem>
                  <MenuItem value="professionalism">Profesionalismo</MenuItem>
                  <MenuItem value="communication">Comunicación</MenuItem>
                  <MenuItem value="punctuality">Puntualidad</MenuItem>
                  <MenuItem value="quality">Calidad</MenuItem>
                  <MenuItem value="overall">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Publicar Anónimamente</InputLabel>
                <Select
                  value={reviewForm.anonymous ? 'yes' : 'no'}
                  onChange={(e) => setReviewForm({ ...reviewForm, anonymous: e.target.value === 'yes' })}
                  label="Publicar Anónimamente"
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Sí</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReviewDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleEditReview} 
            variant="contained"
            disabled={!reviewForm.rating || !reviewForm.title || !reviewForm.comment}
          >
            Actualizar Reseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para eliminar reseña */}
      <Dialog
        open={deleteReviewDialog}
        onClose={() => setDeleteReviewDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteReviewDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteReview} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para ver reseña */}
      <Dialog
        open={viewReviewDialog}
        onClose={() => setViewReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles de la Reseña</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                  {selectedReview.user?.avatar ? (
                    <img src={selectedReview.user.avatar} alt={selectedReview.user.name} />
                  ) : (
                    selectedReview.user?.name?.charAt(0) || 'U'
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedReview.anonymous ? 'Anónimo' : selectedReview.user?.name || 'Usuario'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedReview.createdAt).toLocaleDateString('es-ES')}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Calificación
                </Typography>
                <Rating value={selectedReview.rating} readOnly size="large" />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {getRatingLabel(selectedReview.rating)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Título
                </Typography>
                <Typography variant="body1">{selectedReview.title}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comentario
                </Typography>
                <Typography variant="body1">{selectedReview.comment}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Categoría
                </Typography>
                <Chip
                  label={getCategoryLabel(selectedReview.category)}
                  color={getCategoryColor(selectedReview.category) as any}
                />
              </Box>
              
              {selectedReview.reply && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Respuesta
                  </Typography>
                  <Typography variant="body1" sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.main' }}>
                    {selectedReview.reply}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewReviewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para responder reseña */}
      <Dialog
        open={replyDialog}
        onClose={() => setReplyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Responder a la Reseña</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tu respuesta"
            value={replyForm.reply}
            onChange={(e) => setReplyForm({ reply: e.target.value })}
            multiline
            rows={4}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleReplyToReview} 
            variant="contained"
            disabled={!replyForm.reply.trim()}
          >
            Enviar Respuesta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para notificaciones */}
      <Alert
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
      >
        {error}
      </Alert>

      <Alert
        open={!!success}
        onClose={() => setSuccess(null)}
        severity="success"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
      >
        {success}
      </Alert>
    </Box>
  );
};

