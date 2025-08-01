import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Fab,
  Snackbar
} from '@mui/material';
import { Add, Refresh, Event as EventIcon } from '@mui/icons-material';
import { useEvents } from './hooks/useEvents';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import EventDetails from './components/EventDetails';
import EventFilters from './components/EventFilters';
import type { Event as EventType, CreateEventData } from './types/event';
import ResponsiveLayout from '../../components/ResponsiveLayout';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { responsiveTypography } from '../../theme/breakpoints';
import { buttonStyles } from '../../theme/buttonStyles';

const Events = () => {
  const {
    events,
    loading,
    error,
    selectedEvent,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
    setSelectedEvent,
    clearSelectedEvent
  } = useEvents();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    try {
      await createEvent(eventData);
      setSnackbar({
        open: true,
        message: 'Evento creado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al crear evento',
        severity: 'error'
      });
    }
  };

  const handleUpdateEvent = async (eventData: CreateEventData) => {
    if (!editingEvent?._id) return;
    
    try {
      await updateEvent(editingEvent._id, eventData);
      setSnackbar({
        open: true,
        message: 'Evento actualizado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al actualizar evento',
        severity: 'error'
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      await deleteEvent(id);
      setSnackbar({
        open: true,
        message: 'Evento eliminado exitosamente',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Error al eliminar evento',
        severity: 'error'
      });
    }
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleViewEvent = (event: EventType) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    clearSelectedEvent();
  };

  const handleFilterChange = (filters: Record<string, unknown>) => {
    // Implementar lógica de filtrado
    console.log('Filtros aplicados:', filters);
  };

  const handleClearFilters = () => {
    // Limpiar filtros
    console.log('Filtros limpiados');
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredEvents = events.filter(() => {
    // Aquí se pueden aplicar filtros adicionales si es necesario
    return true;
  });

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
            <EventIcon sx={{ color: '#000', fontSize: 28 }} />
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
              GESTIÓN DE EVENTOS
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
              Sistema de Control y Administración
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
            NUEVO EVENTO
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <EventFilters
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

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
              <EventIcon sx={{ color: '#000', fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ color: '#00fff7', fontWeight: 600, letterSpacing: '1px' }}>
            CARGANDO EVENTOS...
          </Typography>
        </Box>
      )}

      {/* Lista de eventos */}
      {!loading && !error && (
        <>
          {filteredEvents.length === 0 ? (
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
                <EventIcon sx={{ fontSize: 48, color: '#00fff7' }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, color: '#00fff7', fontWeight: 600 }}>
                No hay eventos para mostrar
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b8c1', maxWidth: 400, mx: 'auto' }}>
                {events.length === 0 
                  ? 'No se han creado eventos aún. ¡Crea el primero para comenzar!'
                  : 'No se encontraron eventos con los filtros aplicados.'
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
              {filteredEvents.map((event, index) => (
                <Box key={event._id} sx={{
                  animation: 'slideIn 0.4s ease-out',
                  animationDelay: `${index * 0.1}s`
                }}>
                  <EventCard
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    onView={handleViewEvent}
                    loading={loading}
                  />
                </Box>
              ))}
            </ResponsiveGrid>
          )}
        </>
      )}

      {/* Formulario de evento */}
      <EventForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
        loading={loading}
      />

      {/* Detalles del evento */}
      <EventDetails
        event={selectedEvent}
        open={showDetails}
        onClose={handleCloseDetails}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
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

export default Events; 