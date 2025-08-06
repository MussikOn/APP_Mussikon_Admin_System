import { useState, useCallback } from 'react';
import { eventsService } from '../../../services/eventsService';
import type { Event, CreateEventData, UpdateEventData } from '../../../services/eventsService';

// CORREGIDO: Usar los tipos del servicio en lugar de los tipos del feature
export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getAllEvents();
      setEvents(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getEventById(id);
      setSelectedEvent(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar evento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: CreateEventData) => {
    try {
      setLoading(true);
      setError(null);
      const newEvent = await eventsService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, eventData: UpdateEventData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventsService.updateEvent(id, eventData);
      setEvents(prev => prev.map(event =>
        event.id === id ? updatedEvent : event
      ));
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await eventsService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  const searchEvents = useCallback(async (filters: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getAllEvents(filters);
      setEvents(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventsByStatus = useCallback(async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getAllEvents({ status });
      setEvents(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos por estado');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return {
    events,
    selectedEvent,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    getEventsByStatus,
    clearError,
    clearSelectedEvent,
    setSelectedEvent,
  };
}; 