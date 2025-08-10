import { api } from './api';
import type { MusicianProfile, SearchFilters, SearchResponse } from '../features/musicianSearch/types';

export class MusicianSearchService {
  // Búsqueda básica de músicos
  static async searchMusicians(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching musicians:', error);
      throw error;
    }
  }

  // Búsqueda avanzada con filtros específicos
  static async advancedSearch(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/advanced-search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  // Búsqueda por ubicación
  static async searchByLocation(location: string, radius: number = 50): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/location-search', {
        params: { location, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by location:', error);
      throw error;
    }
  }

  // Búsqueda por instrumento
  static async searchByInstrument(instrument: string): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/instrument-search', {
        params: { instrument }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by instrument:', error);
      throw error;
    }
  }

  // Búsqueda por género musical
  static async searchByGenre(genre: string): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/genre-search', {
        params: { genre }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by genre:', error);
      throw error;
    }
  }

  // Obtener perfil completo de un músico
  static async getMusicianProfile(musicianId: string): Promise<MusicianProfile> {
    try {
      const response = await api.get(`/musician-search/profile/${musicianId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting musician profile:', error);
      throw error;
    }
  }

  // Obtener músicos recomendados
  static async getRecommendedMusicians(userId: string): Promise<SearchResponse> {
    try {
      const response = await api.get(`/musician-search/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  // Obtener músicos populares
  static async getPopularMusicians(limit: number = 10): Promise<SearchResponse> {
    try {
      const response = await api.get('/musician-search/popular', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting popular musicians:', error);
      throw error;
    }
  }
}

export default MusicianSearchService;
