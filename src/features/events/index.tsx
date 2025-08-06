import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Importar componentes
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import EventDetails from './components/EventDetails';
import EventFilters from './components/EventFilters';

// Importar hook
import { useEvents } from './hooks/useEvents';

// Importar tipos del servicio
import type { Event } from '../../services/eventsService';

// Importar componentes UI
import ModernButton from '../../components/ui/ModernButton';
import ModernCard from '../../components/ui/ModernCard';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { responsiveTypography } from '../../theme/breakpoints';



const Events: React.FC = () => {
  const {
    events,
    selectedEvent,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,

    setSelectedEvent
  } = useEvents();

  // Estados locales
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (eventData: any) => {
    try {
      // CORREGIDO: Mapear los datos del formulario a la estructura del backend
      const backendEventData = {
        eventName: eventData.title,
        eventType: eventData.category,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        duration: '2 horas', // Valor por defecto
        instrument: 'Guitarra', // Valor por defecto
        bringInstrument: false,
        comment: eventData.description,
        budget: eventData.budget?.toString() || '0',
        songs: [],
        recommendations: [],
        mapsLink: '',
        status: 'pending_musician' as const
      };
      
      await createEvent({
        ...backendEventData,
        user: 'admin@mussikon.com' // Usuario por defecto para eventos creados desde admin
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    
    try {
      // CORREGIDO: Mapear los datos del formulario a la estructura del backend
      const backendEventData = {
        eventName: eventData.title,
        eventType: eventData.category,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        duration: '2 horas', // Valor por defecto
        instrument: 'Guitarra', // Valor por defecto
        bringInstrument: false,
        comment: eventData.description,
        budget: eventData.budget?.toString() || '0',
        songs: [],
        recommendations: [],
        mapsLink: '',
        status: 'pending_musician' as const
      };
      
      await updateEvent(editingEvent.id, backendEventData);
      setSnackbar({
        open: true,
        message: 'Evento actualizado exitosamente',
        severity: 'success'
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setSnackbar({
        open: true,
        message: 'Evento eliminado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar evento',
        severity: 'error'
      });
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleViewEvent = async (eventId: string) => {
    try {
      const event = await fetchEventById(eventId);
      if (event) {
        setSelectedEvent(event);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleFilterEvents = (filters: any) => {
    searchEvents(filters);
    setShowFilters(false);
  };



  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ResponsiveLayout spacing="md">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(135deg, #7f5fff 0%, #00e0ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: responsiveTypography.h3
              }}
            >
              Eventos
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontWeight: 400, opacity: 0.8 }}
            >
              Gestiona todos los eventos de la plataforma
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ModernButton
              variant="outline"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(true)}
            >
              Filtros
            </ModernButton>
            
            <ModernButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingEvent(null);

                setShowForm(true);
              }}
            >
              Nuevo Evento
            </ModernButton>
          </Box>
        </Box>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ModernCard variant="flat">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {events.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Eventos
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <ModernCard variant="flat">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {events.filter(e => e.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completados
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <ModernCard variant="flat">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {events.filter(e => e.status === 'pending_musician').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <ModernCard variant="flat">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {events.filter(e => e.status === 'cancelled').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cancelados
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Lista de eventos */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 3,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }
            }}>
              <EventCard
                event={event}
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
                onView={() => handleViewEvent(event.id)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Formulario de evento */}
      <Dialog 
        open={showForm} 
        onClose={() => setShowForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        </DialogTitle>
        <DialogContent>
          <EventForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            event={editingEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Detalles del evento */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles del Evento</DialogTitle>
        <DialogContent>
          <EventDetails
            event={selectedEvent}
            open={showDetails}
            onClose={() => setShowDetails(false)}
            onEdit={() => handleEditEvent(selectedEvent!)}
            onDelete={() => handleDeleteEvent(selectedEvent!.id)}
          />
        </DialogContent>
      </Dialog>

      {/* Filtros */}
      <Dialog 
        open={showFilters} 
        onClose={() => setShowFilters(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtros de Eventos</DialogTitle>
        <DialogContent>
          <EventFilters
            onApply={handleFilterEvents}
            onCancel={() => setShowFilters(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ResponsiveLayout>
  );
};

export default Events; 