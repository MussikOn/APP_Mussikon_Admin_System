import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Fab,
  Snackbar,
  Card,
  CardContent,
  Avatar
} from '@mui/material';

import {
  Add,
  Refresh,
  FilterList,
  Download,
  MusicNote,
  Verified,
  Star,
  AccessTime
} from '@mui/icons-material';
import { useMusicians } from './hooks/useMusicians';
import MusicianCard from './components/MusicianCard';
import MusicianForm from './components/MusicianForm';
import MusicianDetails from './components/MusicianDetails';
import MusicianFiltersComponent from './components/MusicianFilters';
import type { Musician, CreateMusicianData } from './types/musician';
import ResponsiveLayout from '../../components/ResponsiveLayout';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { responsiveTypography } from '../../theme/breakpoints';
import { buttonStyles } from '../../theme/buttonStyles';

const Musicians = () => {
  const {
    musicians,
    stats,
    loading,
    error,
    selectedMusician,
    fetchMusicians,
    createMusician,
    updateMusician,
    deleteMusician,
    verifyMusician,
    toggleMusicianStatus,
    exportToCSV,
    setSelectedMusician,
    clearSelectedMusician,
    clearError
  } = useMusicians();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingMusician, setEditingMusician] = useState<Musician | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchMusicians();
  }, [fetchMusicians]);

  const handleCreateMusician = async (musicianData: CreateMusicianData) => {
    try {
      await createMusician(musicianData);
      setSnackbar({
        open: true,
        message: 'Músico creado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al crear músico',
        severity: 'error'
      });
    }
  };

  const handleUpdateMusician = async (musicianData: CreateMusicianData) => {
    if (!editingMusician?._id) return;
    
    try {
      await updateMusician(editingMusician._id, musicianData);
      setSnackbar({
        open: true,
        message: 'Músico actualizado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
      setEditingMusician(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar músico',
        severity: 'error'
      });
    }
  };

  const handleDeleteMusician = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este músico?')) {
      return;
    }

    try {
      await deleteMusician(id);
      setSnackbar({
        open: true,
        message: 'Músico eliminado exitosamente',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar músico',
        severity: 'error'
      });
    }
  };

  const handleVerifyMusician = async (id: string) => {
    try {
      await verifyMusician(id);
      setSnackbar({
        open: true,
        message: 'Músico verificado exitosamente',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al verificar músico',
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleMusicianStatus(id, isActive);
      setSnackbar({
        open: true,
        message: `Músico ${isActive ? 'activado' : 'desactivado'} exitosamente`,
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al cambiar estado del músico',
        severity: 'error'
      });
    }
  };

  const handleEditMusician = (musician: Musician) => {
    setEditingMusician(musician);
    setShowForm(true);
  };

  const handleViewMusician = (musician: Musician) => {
    setSelectedMusician(musician);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMusician(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    clearSelectedMusician();
  };

  const handleExport = async () => {
    try {
      await exportToCSV();
      setSnackbar({
        open: true,
        message: 'Datos exportados exitosamente',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al exportar datos',
        severity: 'error'
      });
    }
  };

  const handleRefresh = () => {
    fetchMusicians();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <ResponsiveLayout
      spacing="lg"
      sx={{
        background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.05) 0%, rgba(0, 0, 0, 0.9) 100%)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(0, 255, 247, 0.2)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header futurista */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        gap: { xs: 2, md: 0 },
        mb: 4,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00fff7, #00ff88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
            animation: 'pulse 2s infinite'
          }}>
            <MusicNote sx={{ color: '#000', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#00fff7', 
                fontWeight: 800,
                textShadow: '0 0 20px rgba(0, 255, 247, 0.5)',
                fontSize: responsiveTypography.h3,
                letterSpacing: '2px'
              }}
            >
              GESTIÓN DE MÚSICOS
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#b0b8c1',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                mt: 0.5
              }}
            >
              Sistema de Control y Administración de Perfiles
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              ...buttonStyles.secondary,
              borderColor: '#00fff7',
              color: '#00fff7',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 247, 0.1)',
                boxShadow: '0 0 15px rgba(0, 255, 247, 0.3)'
              }
            }}
          >
            FILTROS
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{ 
              ...buttonStyles.secondary,
              borderColor: '#00fff7',
              color: '#00fff7',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 247, 0.1)',
                boxShadow: '0 0 15px rgba(0, 255, 247, 0.3)'
              }
            }}
          >
            EXPORTAR
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ 
              ...buttonStyles.secondary,
              borderColor: '#00fff7',
              color: '#00fff7',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 247, 0.1)',
                boxShadow: '0 0 15px rgba(0, 255, 247, 0.3)'
              }
            }}
          >
            ACTUALIZAR
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowForm(true)}
            sx={{ 
              ...buttonStyles.primary,
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              color: '#000',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.9rem',
              boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00ff88, #00fff7)',
                boxShadow: '0 0 25px rgba(0, 255, 247, 0.6)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            NUEVO MÚSICO
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      {stats && (
        <ResponsiveGrid
          type="metrics"
          gap={3}
          sx={{ mb: 4 }}
        >
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalMusicians}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Músicos
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <MusicNote />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.activeMusicians}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Activos
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Verified />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Rating Promedio
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(stats.averageHourlyRate)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tarifa Promedio
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AccessTime />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </ResponsiveGrid>
      )}

      {/* Filtros */}
      {showFilters && (
        <MusicianFiltersComponent
          onFilterChange={(filters) => {
            fetchMusicians(filters);
            setShowFilters(false);
          }}
          onClearFilters={() => {
            fetchMusicians();
            setShowFilters(false);
          }}
        />
      )}

      {/* Mensajes de error */}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            '& .MuiAlert-icon': {
              color: '#ff4444'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Loading futurista */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          py: 8,
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{
            position: 'relative',
            width: 80,
            height: 80
          }}>
            <CircularProgress 
              size={80}
              thickness={4}
              sx={{ 
                color: '#00fff7',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00fff7, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 255, 247, 0.5)'
            }}>
              <MusicNote sx={{ color: '#000', fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ color: '#00fff7', fontWeight: 600, letterSpacing: '1px' }}>
            CARGANDO MÚSICOS...
          </Typography>
        </Box>
      )}

      {/* Lista de músicos */}
      {!loading && !error && (
        <>
          {musicians.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 12,
              color: '#b0b8c1'
            }}>
              <Box sx={{
                width: 120,
                height: 120,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 255, 247, 0.1), rgba(0, 255, 136, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(0, 255, 247, 0.3)'
              }}>
                <MusicNote sx={{ fontSize: 48, color: '#00fff7' }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, color: '#00fff7', fontWeight: 600 }}>
                No hay músicos para mostrar
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b8c1', maxWidth: 400, mx: 'auto' }}>
                {musicians.length === 0 
                  ? 'No se han registrado músicos aún. ¡Registra el primero para comenzar!'
                  : 'No se encontraron músicos con los filtros aplicados.'
                }
              </Typography>
            </Box>
          ) : (
            <ResponsiveGrid
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gap={3}
              sx={{
                animation: 'fadeIn 0.6s ease-out'
              }}
            >
              {musicians.map((musician, index) => (
                <Box key={musician._id} sx={{
                  animation: 'slideIn 0.4s ease-out',
                  animationDelay: `${index * 0.1}s`
                }}>
                  <MusicianCard
                    musician={musician}
                    onEdit={handleEditMusician}
                    onDelete={handleDeleteMusician}
                    onView={handleViewMusician}
                    onVerify={handleVerifyMusician}
                    onToggleStatus={handleToggleStatus}
                    loading={loading}
                  />
                </Box>
              ))}
            </ResponsiveGrid>
          )}
        </>
      )}

      {/* Formulario de músico */}
      <MusicianForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={editingMusician ? handleUpdateMusician : handleCreateMusician}
        musician={editingMusician}
        loading={loading}
      />

      {/* Detalles del músico */}
      <MusicianDetails
        musician={selectedMusician}
        open={showDetails}
        onClose={handleCloseDetails}
        onEdit={handleEditMusician}
        onDelete={handleDeleteMusician}
        onVerify={handleVerifyMusician}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* FAB futurista */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowForm(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #00fff7, #00ff88)',
          color: '#000',
          width: 64,
          height: 64,
          boxShadow: '0 0 25px rgba(0, 255, 247, 0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00ff88, #00fff7)',
            boxShadow: '0 0 35px rgba(0, 255, 247, 0.7)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Add sx={{ fontSize: 28 }} />
      </Fab>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ResponsiveLayout>
  );
};

export default Musicians; 