import { api } from './api';
import { getApiUrl } from '../config/apiConfig';
import type {
  CreateMusicianData,
  UpdateMusicianData,
  MusicianFilters,
  MusiciansResponse,
  MusicianResponse,
  MusicianStatsResponse
} from '../features/musicians/types/musician';

class MusiciansService {
  private baseUrl = '/admin/musicians';

  /**
   * Obtener todos los músicos con filtros opcionales
   */
  async getAllMusicians(filters: MusicianFilters = {}): Promise<MusiciansResponse> {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros a los parámetros
      if (filters.instruments?.length) {
        filters.instruments.forEach(instrument => {
          params.append('instruments', instrument);
        });
      }
      
      if (filters.genres?.length) {
        filters.genres.forEach(genre => {
          params.append('genres', genre);
        });
      }
      
      if (filters.location?.city) {
        params.append('city', filters.location.city);
      }
      
      if (filters.location?.state) {
        params.append('state', filters.location.state);
      }
      
      if (filters.location?.country) {
        params.append('country', filters.location.country);
      }
      
      if (filters.location?.radius) {
        params.append('radius', filters.location.radius.toString());
      }
      
      if (filters.experience?.min) {
        params.append('experienceMin', filters.experience.min.toString());
      }
      
      if (filters.experience?.max) {
        params.append('experienceMax', filters.experience.max.toString());
      }
      
      if (filters.hourlyRate?.min) {
        params.append('hourlyRateMin', filters.hourlyRate.min.toString());
      }
      
      if (filters.hourlyRate?.max) {
        params.append('hourlyRateMax', filters.hourlyRate.max.toString());
      }
      
      if (filters.rating?.min) {
        params.append('ratingMin', filters.rating.min.toString());
      }
      
      if (filters.rating?.max) {
        params.append('ratingMax', filters.rating.max.toString());
      }
      
      if (filters.availability?.dayOfWeek !== undefined) {
        params.append('dayOfWeek', filters.availability.dayOfWeek.toString());
      }
      
      if (filters.availability?.startTime) {
        params.append('startTime', filters.availability.startTime);
      }
      
      if (filters.availability?.endTime) {
        params.append('endTime', filters.availability.endTime);
      }
      
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      
      if (filters.isVerified !== undefined) {
        params.append('isVerified', filters.isVerified.toString());
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      
      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo músicos:', error);
      throw error;
    }
  }

  /**
   * Obtener un músico por ID
   */
  async getMusicianById(id: string): Promise<MusicianResponse> {
    try {
      const url = getApiUrl(this.baseUrl, { id });
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo músico:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo músico
   */
  async createMusician(data: CreateMusicianData): Promise<MusicianResponse> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creando músico:', error);
      throw error;
    }
  }

  /**
   * Actualizar un músico existente
   */
  async updateMusician(id: string, data: UpdateMusicianData): Promise<MusicianResponse> {
    try {
      const url = getApiUrl(this.baseUrl, { id });
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando músico:', error);
      throw error;
    }
  }

  /**
   * Eliminar un músico
   */
  async deleteMusician(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = getApiUrl(this.baseUrl, { id });
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error eliminando músico:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de músicos
   */
  async getMusicianStats(): Promise<MusicianStatsResponse> {
    try {
      const url = `${this.baseUrl}/stats`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de músicos:', error);
      throw error;
    }
  }

  /**
   * Buscar músicos por ubicación
   */
  async searchMusiciansByLocation(location: string, radius: number = 50): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/search/location`;
      const response = await api.get(url, {
        params: { location, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando músicos por ubicación:', error);
      throw error;
    }
  }

  /**
   * Buscar músicos por instrumento
   */
  async searchMusiciansByInstrument(instrument: string): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/search/instrument`;
      const response = await api.get(url, {
        params: { instrument }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando músicos por instrumento:', error);
      throw error;
    }
  }

  /**
   * Buscar músicos disponibles en una fecha y hora específica
   */
  async searchAvailableMusicians(date: string, startTime: string, endTime: string): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/search/availability`;
      const response = await api.get(url, {
        params: { date, startTime, endTime }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando músicos disponibles:', error);
      throw error;
    }
  }

  /**
   * Verificar un músico
   */
  async verifyMusician(id: string): Promise<MusicianResponse> {
    try {
      const url = getApiUrl(`${this.baseUrl}/:id/verify`, { id });
      const response = await api.patch(url);
      return response.data;
    } catch (error) {
      console.error('Error verificando músico:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar un músico
   */
  async toggleMusicianStatus(id: string, isActive: boolean): Promise<MusicianResponse> {
    try {
      const url = getApiUrl(`${this.baseUrl}/:id/status`, { id });
      const response = await api.patch(url, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado del músico:', error);
      throw error;
    }
  }

  /**
   * Obtener músicos destacados
   */
  async getFeaturedMusicians(limit: number = 10): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/featured`;
      const response = await api.get(url, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo músicos destacados:', error);
      throw error;
    }
  }

  /**
   * Obtener músicos por género
   */
  async getMusiciansByGenre(genre: string): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/genre/${genre}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo músicos por género:', error);
      throw error;
    }
  }

  /**
   * Obtener músicos cercanos
   */
  async getNearbyMusicians(lat: number, lng: number, radius: number = 50): Promise<MusiciansResponse> {
    try {
      const url = `${this.baseUrl}/nearby`;
      const response = await api.get(url, {
        params: { lat, lng, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo músicos cercanos:', error);
      throw error;
    }
  }

  /**
   * Exportar músicos a CSV
   */
  async exportMusiciansToCSV(filters: MusicianFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros a los parámetros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const url = `${this.baseUrl}/export/csv?${params.toString()}`;
      const response = await api.get(url, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exportando músicos:', error);
      throw error;
    }
  }

  /**
   * Importar músicos desde CSV
   */
  async importMusiciansFromCSV(file: File): Promise<{ success: boolean; message: string; imported: number; errors: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = `${this.baseUrl}/import/csv`;
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importando músicos:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const musiciansService = new MusiciansService(); 