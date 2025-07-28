import { useState, useCallback } from 'react';
import { 
  eventsService,
  type CreateEventData,
  type UpdateEventData,
  type EventFilters
} from '../../../services/eventsService';
import type { Event } from '../types/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const fetchEvents = useCallback(async (filters?: EventFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.getAllEvents(filters);
      setEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getEventById(id);
      setSelectedEvent(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al cargar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEventHandler = useCallback(async (eventData: CreateEventData) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventsService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err: any) {
      setError(err.message || 'Error al crear evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEventHandler = useCallback(async (id: string, eventData: UpdateEventData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventsService.updateEvent(id, eventData);
      setEvents(prev => prev.map(event => 
        event._id === id ? updatedEvent : event
      ));
      if (selectedEvent?._id === id) {
        setSelectedEvent(updatedEvent);
      }
      return updatedEvent;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  const deleteEventHandler = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await eventsService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event._id !== id));
      if (selectedEvent?._id === id) {
        setSelectedEvent(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  const filterEventsByStatus = useCallback(async (status: Event['status']) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.getAllEvents({ status });
      setEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Error al filtrar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterEventsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.getAllEvents({ 
        dateRange: { start: startDate, end: endDate } 
      });
      setEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Error al filtrar eventos por fecha');
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
    loading,
    error,
    selectedEvent,
    fetchEvents,
    fetchEventById,
    createEvent: createEventHandler,
    updateEvent: updateEventHandler,
    deleteEvent: deleteEventHandler,
    filterEventsByStatus,
    filterEventsByDateRange,
    clearError,
    clearSelectedEvent,
    setSelectedEvent,
  };
} 