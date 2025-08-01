import { useState, useCallback, useEffect } from 'react';
import { useApiRequest } from '../../../hooks/useApiRequest';
import { musiciansService } from '../../../services/musiciansService';
import type {
  Musician,
  CreateMusicianData,
  UpdateMusicianData,
  MusicianFilters,
  MusicianStats
} from '../types/musician';

export const useMusicians = () => {
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(null);
  const [stats, setStats] = useState<MusicianStats | null>(null);
  const [filters, setFilters] = useState<MusicianFilters>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Hook para obtener músicos
  const musiciansRequest = useApiRequest(musiciansService.getAllMusicians.bind(musiciansService));
  
  // Hook para obtener estadísticas
  const statsRequest = useApiRequest(musiciansService.getMusicianStats.bind(musiciansService));
  
  // Hook para crear músico
  const createRequest = useApiRequest(musiciansService.createMusician.bind(musiciansService));
  
  // Hook para actualizar músico
  const updateRequest = useApiRequest(musiciansService.updateMusician.bind(musiciansService));
  
  // Hook para eliminar músico
  const deleteRequest = useApiRequest(musiciansService.deleteMusician.bind(musiciansService));
  
  // Hook para verificar músico
  const verifyRequest = useApiRequest(musiciansService.verifyMusician.bind(musiciansService));
  
  // Hook para cambiar estado
  const toggleStatusRequest = useApiRequest(musiciansService.toggleMusicianStatus.bind(musiciansService));

  // Cargar músicos
  const fetchMusicians = useCallback(async (newFilters?: MusicianFilters) => {
    try {
      const updatedFilters = { ...filters, ...newFilters };
      const response = await musiciansRequest.execute(updatedFilters);
      
      if (response && response.success) {
        setMusicians(response.data.musicians);
        setFilters(updatedFilters);
      }
    } catch (error) {
      console.error('Error cargando músicos:', error);
    }
  }, [filters, musiciansRequest]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      const response = await statsRequest.execute();
      
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, [statsRequest]);

  // Crear músico
  const createMusician = useCallback(async (data: CreateMusicianData) => {
    try {
      const response = await createRequest.execute(data);
      
      if (response && response.success) {
        // Recargar la lista de músicos
        await fetchMusicians();
        return response.data;
      }
      
      throw new Error(response?.message || 'Error creando músico');
    } catch (error) {
      console.error('Error creando músico:', error);
      throw error;
    }
  }, [createRequest, fetchMusicians]);

  // Actualizar músico
  const updateMusician = useCallback(async (id: string, data: UpdateMusicianData) => {
    try {
      const response = await updateRequest.execute(id, data);
      
      if (response && response.success) {
        // Actualizar la lista de músicos
        setMusicians(prev => 
          prev.map(musician => 
            musician._id === id ? response.data : musician
          )
        );
        return response.data;
      }
      
      throw new Error(response?.message || 'Error actualizando músico');
    } catch (error) {
      console.error('Error actualizando músico:', error);
      throw error;
    }
  }, [updateRequest]);

  // Eliminar músico
  const deleteMusician = useCallback(async (id: string) => {
    try {
      const response = await deleteRequest.execute(id);
      
      if (response && response.success) {
        // Remover de la lista
        setMusicians(prev => prev.filter(musician => musician._id !== id));
        return response;
      }
      
      throw new Error(response?.message || 'Error eliminando músico');
    } catch (error) {
      console.error('Error eliminando músico:', error);
      throw error;
    }
  }, [deleteRequest]);

  // Verificar músico
  const verifyMusician = useCallback(async (id: string) => {
    try {
      const response = await verifyRequest.execute(id);
      
      if (response && response.success) {
        // Actualizar en la lista
        setMusicians(prev => 
          prev.map(musician => 
            musician._id === id ? response.data : musician
          )
        );
        return response.data;
      }
      
      throw new Error(response?.message || 'Error verificando músico');
    } catch (error) {
      console.error('Error verificando músico:', error);
      throw error;
    }
  }, [verifyRequest]);

  // Cambiar estado del músico
  const toggleMusicianStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const response = await toggleStatusRequest.execute(id, isActive);
      
      if (response && response.success) {
        // Actualizar en la lista
        setMusicians(prev => 
          prev.map(musician => 
            musician._id === id ? response.data : musician
          )
        );
        return response.data;
      }
      
      throw new Error(response?.message || 'Error cambiando estado del músico');
    } catch (error) {
      console.error('Error cambiando estado del músico:', error);
      throw error;
    }
  }, [toggleStatusRequest]);

  // Buscar músicos por instrumento
  const searchByInstrument = useCallback(async (instrument: string) => {
    try {
      const response = await musiciansRequest.execute({ instruments: [instrument] });
      
      if (response && response.success) {
        setMusicians(response.data.musicians);
        return response.data;
      }
      
      throw new Error(response?.message || 'Error buscando por instrumento');
    } catch (error) {
      console.error('Error buscando por instrumento:', error);
      throw error;
    }
  }, [musiciansRequest]);

  // Buscar músicos por ubicación
  const searchByLocation = useCallback(async (location: string, radius: number = 50) => {
    try {
      const response = await musiciansService.searchMusiciansByLocation(location, radius);
      
      if (response.success) {
        setMusicians(response.data.musicians);
        return response.data;
      }
      
      throw new Error(response.message || 'Error buscando por ubicación');
    } catch (error) {
      console.error('Error buscando por ubicación:', error);
      throw error;
    }
  }, []);

  // Buscar músicos disponibles
  const searchAvailable = useCallback(async (date: string, startTime: string, endTime: string) => {
    try {
      const response = await musiciansService.searchAvailableMusicians(date, startTime, endTime);
      
      if (response.success) {
        setMusicians(response.data.musicians);
        return response.data;
      }
      
      throw new Error(response.message || 'Error buscando músicos disponibles');
    } catch (error) {
      console.error('Error buscando músicos disponibles:', error);
      throw error;
    }
  }, []);

  // Obtener músicos destacados
  const getFeaturedMusicians = useCallback(async (limit: number = 10) => {
    try {
      const response = await musiciansService.getFeaturedMusicians(limit);
      
      if (response.success) {
        setMusicians(response.data.musicians);
        return response.data;
      }
      
      throw new Error(response.message || 'Error obteniendo músicos destacados');
    } catch (error) {
      console.error('Error obteniendo músicos destacados:', error);
      throw error;
    }
  }, []);

  // Exportar a CSV
  const exportToCSV = useCallback(async (exportFilters?: MusicianFilters) => {
    try {
      const filtersToUse = exportFilters || filters;
      const blob = await musiciansService.exportMusiciansToCSV(filtersToUse);
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `musicians_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Exportación completada' };
    } catch (error) {
      console.error('Error exportando músicos:', error);
      throw error;
    }
  }, [filters]);

  // Importar desde CSV
  const importFromCSV = useCallback(async (file: File) => {
    try {
      const response = await musiciansService.importMusiciansFromCSV(file);
      
      if (response.success) {
        // Recargar la lista
        await fetchMusicians();
        return response;
      }
      
      throw new Error(response.message || 'Error importando músicos');
    } catch (error) {
      console.error('Error importando músicos:', error);
      throw error;
    }
  }, [fetchMusicians]);

  // Limpiar selección
  const clearSelectedMusician = useCallback(() => {
    setSelectedMusician(null);
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    musiciansRequest.clearError();
    statsRequest.clearError();
    createRequest.clearError();
    updateRequest.clearError();
    deleteRequest.clearError();
    verifyRequest.clearError();
    toggleStatusRequest.clearError();
  }, [
    musiciansRequest,
    statsRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    verifyRequest,
    toggleStatusRequest
  ]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchMusicians();
    fetchStats();
  }, []);

  return {
    // Estado
    musicians,
    selectedMusician,
    stats,
    filters,
    
    // Estados de carga
    loading: musiciansRequest.loading,
    loadingStats: statsRequest.loading,
    loadingCreate: createRequest.loading,
    loadingUpdate: updateRequest.loading,
    loadingDelete: deleteRequest.loading,
    loadingVerify: verifyRequest.loading,
    loadingToggleStatus: toggleStatusRequest.loading,
    
    // Estados de error
    error: musiciansRequest.error,
    errorStats: statsRequest.error,
    errorCreate: createRequest.error,
    errorUpdate: updateRequest.error,
    errorDelete: deleteRequest.error,
    errorVerify: verifyRequest.error,
    errorToggleStatus: toggleStatusRequest.error,
    
    // Acciones
    fetchMusicians,
    fetchStats,
    createMusician,
    updateMusician,
    deleteMusician,
    verifyMusician,
    toggleMusicianStatus,
    searchByInstrument,
    searchByLocation,
    searchAvailable,
    getFeaturedMusicians,
    exportToCSV,
    importFromCSV,
    setSelectedMusician,
    clearSelectedMusician,
    setFilters,
    clearError
  };
}; 