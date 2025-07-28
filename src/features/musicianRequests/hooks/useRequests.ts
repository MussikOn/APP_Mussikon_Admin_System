import { useState, useCallback } from 'react';
import {
  musicianRequestsService,
  type RequestFilters
} from '../../../services/musicianRequestsService';
import type { 
  MusicianRequest, 
  CreateRequestData, 
  UpdateRequestData, 
  AcceptRequestData, 
  CancelRequestData 
} from '../types/request';

export const useRequests = () => {
  const [requests, setRequests] = useState<MusicianRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MusicianRequest | null>(null);

  // Obtener todas las solicitudes
  const fetchRequests = useCallback(async (filters?: RequestFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await musicianRequestsService.getAllRequests(filters);
      setRequests(response.requests);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener solicitud por ID
  const fetchRequestById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await musicianRequestsService.getRequestById(id);
      setSelectedRequest(data);
      return data;
    } catch (err) {
      setError('Error al cargar la solicitud');
      console.error('Error fetching request by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva solicitud
  const createRequestHandler = useCallback(async (requestData: CreateRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const newRequest = await musicianRequestsService.createRequest(requestData);
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError('Error al crear la solicitud');
      console.error('Error creating request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar solicitud
  const updateRequestHandler = useCallback(async (id: string, requestData: UpdateRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRequest = await musicianRequestsService.updateRequest(id, requestData);
      setRequests(prev => prev.map(req => req._id === id ? updatedRequest : req));
      if (selectedRequest?._id === id) {
        setSelectedRequest(updatedRequest);
      }
      return updatedRequest;
    } catch (err) {
      setError('Error al actualizar la solicitud');
      console.error('Error updating request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRequest]);

  // Eliminar solicitud
  const deleteRequestHandler = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await musicianRequestsService.deleteRequest(id);
      setRequests(prev => prev.filter(req => req._id !== id));
      if (selectedRequest?._id === id) {
        setSelectedRequest(null);
      }
    } catch (err) {
      setError('Error al eliminar la solicitud');
      console.error('Error deleting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRequest]);

  // Aceptar solicitud (funcionalidad no disponible en el nuevo servicio)
  const acceptRequestHandler = useCallback(async (_acceptData: AcceptRequestData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implementar cuando el backend soporte esta funcionalidad
      console.warn('Funcionalidad de aceptar solicitud no implementada en el nuevo servicio');
      return false;
    } catch (err) {
      setError('Error al aceptar la solicitud');
      console.error('Error accepting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRequest]);

  // Cancelar solicitud (funcionalidad no disponible en el nuevo servicio)
  const cancelRequestHandler = useCallback(async (_cancelData: CancelRequestData) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implementar cuando el backend soporte esta funcionalidad
      console.warn('Funcionalidad de cancelar solicitud no implementada en el nuevo servicio');
      return false;
    } catch (err) {
      setError('Error al cancelar la solicitud');
      console.error('Error cancelling request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRequest]);

  // Filtrar solicitudes por estado
  const filterRequestsByStatus = useCallback(async (status: MusicianRequest['status']) => {
    setLoading(true);
    setError(null);
    try {
      const response = await musicianRequestsService.getAllRequests({ status });
      setRequests(response.requests);
    } catch (err) {
      setError('Error al filtrar las solicitudes');
      console.error('Error filtering requests by status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar solicitudes por rango de fechas
  const filterRequestsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await musicianRequestsService.getAllRequests({ 
        dateRange: { start: startDate, end: endDate } 
      });
      setRequests(response.requests);
    } catch (err) {
      setError('Error al filtrar las solicitudes por fecha');
      console.error('Error filtering requests by date range:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar solicitudes por tipo de evento (usando eventId como aproximación)
  const filterRequestsByEventType = useCallback(async (eventType: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implementar filtro por tipo de evento cuando el backend lo soporte
      console.warn('Filtro por tipo de evento no implementado, usando búsqueda general');
      const response = await musicianRequestsService.getAllRequests({ search: eventType });
      setRequests(response.requests);
    } catch (err) {
      setError('Error al filtrar las solicitudes por tipo de evento');
      console.error('Error filtering requests by event type:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar solicitudes por instrumento
  const filterRequestsByInstrument = useCallback(async (instrument: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await musicianRequestsService.getAllRequests({ instrument });
      setRequests(response.requests);
    } catch (err) {
      setError('Error al filtrar las solicitudes por instrumento');
      console.error('Error filtering requests by instrument:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener conteo de solicitudes
  const getRequestsCountHandler = useCallback(async () => {
    try {
      return await musicianRequestsService.getRequestsCount();
    } catch (err) {
      console.error('Error getting requests count:', err);
      return 0;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Limpiar solicitud seleccionada
  const clearSelectedRequest = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  // Establecer solicitud seleccionada
  const setSelectedRequestHandler = useCallback((request: MusicianRequest | null) => {
    setSelectedRequest(request);
  }, []);

  return {
    requests,
    loading,
    error,
    selectedRequest,
    fetchRequests,
    fetchRequestById,
    createRequest: createRequestHandler,
    updateRequest: updateRequestHandler,
    deleteRequest: deleteRequestHandler,
    acceptRequest: acceptRequestHandler,
    cancelRequest: cancelRequestHandler,
    filterRequestsByStatus,
    filterRequestsByDateRange,
    filterRequestsByEventType,
    filterRequestsByInstrument,
    getRequestsCount: getRequestsCountHandler,
    clearError,
    clearSelectedRequest,
    setSelectedRequest: setSelectedRequestHandler
  };
}; 