import { apiService } from './api';
import { API_CONFIG } from '../config/apiConfig';

// Interfaces para geolocalización
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface SearchByProximityFilters {
  latitude: number;
  longitude: number;
  radius: number;
  type: 'events' | 'musicians' | 'both';
  category?: string;
  instrument?: string;
  date?: string;
}

export interface NearbyEvent {
  id: string;
  title: string;
  description: string;
  location: Location;
  date: string;
  distance: number;
  category: string;
  status: string;
}

export interface NearbyMusician {
  id: string;
  name: string;
  instruments: string[];
  location: Location;
  distance: number;
  rating: number;
  availability: boolean;
}

export interface RouteOptimizationRequest {
  startLocation: Location;
  endLocation: Location;
  waypoints?: Location[];
  mode: 'driving' | 'walking' | 'transit';
  avoid?: string[];
}

export interface OptimizedRoute {
  distance: number;
  duration: number;
  polyline: string;
  waypoints: Location[];
  instructions: string[];
}

export interface GeocodingResult {
  location: Location;
  formattedAddress: string;
  confidence: number;
}

export interface DistanceCalculationRequest {
  origin: Location;
  destination: Location;
  mode?: 'driving' | 'walking' | 'transit';
}

export interface DistanceResult {
  distance: number;
  duration: number;
  mode: string;
}

export interface LocationStats {
  totalEvents: number;
  totalMusicians: number;
  averageDistance: number;
  popularAreas: Array<{
    location: Location;
    count: number;
  }>;
  period: string;
}

// Servicio de geolocalización
export const geolocationService = {
  /**
   * Búsqueda por proximidad
   */
  async searchByProximity(filters: SearchByProximityFilters): Promise<{
    events?: NearbyEvent[];
    musicians?: NearbyMusician[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      params.append('latitude', filters.latitude.toString());
      params.append('longitude', filters.longitude.toString());
      params.append('radius', filters.radius.toString());
      params.append('type', filters.type);
      
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.instrument) {
        params.append('instrument', filters.instrument);
      }
      
      if (filters.date) {
        params.append('date', filters.date);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GEOLOCATION_SEARCH}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error en búsqueda por proximidad:', error);
      throw error;
    }
  },

  /**
   * Encontrar eventos cercanos
   */
  async findNearbyEvents(location: Location, radius: number = 10): Promise<NearbyEvent[]> {
    try {
      const params = new URLSearchParams();
      params.append('latitude', location.latitude.toString());
      params.append('longitude', location.longitude.toString());
      params.append('radius', radius.toString());

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.NEARBY_EVENTS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error encontrando eventos cercanos:', error);
      throw error;
    }
  },

  /**
   * Encontrar músicos cercanos
   */
  async findNearbyMusicians(location: Location, radius: number = 10): Promise<NearbyMusician[]> {
    try {
      const params = new URLSearchParams();
      params.append('latitude', location.latitude.toString());
      params.append('longitude', location.longitude.toString());
      params.append('radius', radius.toString());

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.NEARBY_MUSICIANS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error encontrando músicos cercanos:', error);
      throw error;
    }
  },

  /**
   * Optimizar ruta
   */
  async optimizeRoute(request: RouteOptimizationRequest): Promise<OptimizedRoute> {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.OPTIMIZE_ROUTE,
        request
      );

      return response.data.data;
    } catch (error) {
      console.error('Error optimizando ruta:', error);
      throw error;
    }
  },

  /**
   * Geocodificar dirección
   */
  async geocodeAddress(address: string): Promise<GeocodingResult> {
    try {
      const params = new URLSearchParams();
      params.append('address', address);

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GEOCODE_ADDRESS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error geocodificando dirección:', error);
      throw error;
    }
  },

  /**
   * Geocodificación inversa
   */
  async reverseGeocode(location: Location): Promise<GeocodingResult> {
    try {
      const params = new URLSearchParams();
      params.append('latitude', location.latitude.toString());
      params.append('longitude', location.longitude.toString());

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.REVERSE_GEOCODE}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      throw error;
    }
  },

  /**
   * Calcular distancia entre dos puntos
   */
  async calculateDistance(request: DistanceCalculationRequest): Promise<DistanceResult> {
    try {
      const params = new URLSearchParams();
      params.append('originLat', request.origin.latitude.toString());
      params.append('originLng', request.origin.longitude.toString());
      params.append('destLat', request.destination.latitude.toString());
      params.append('destLng', request.destination.longitude.toString());
      
      if (request.mode) {
        params.append('mode', request.mode);
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CALCULATE_DISTANCE}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error calculando distancia:', error);
      throw error;
    }
  },

  /**
   * Verificar si un punto está dentro del radio
   */
  async isWithinRadius(
    center: Location,
    point: Location,
    radius: number
  ): Promise<{ isWithin: boolean; distance: number }> {
    try {
      const params = new URLSearchParams();
      params.append('centerLat', center.latitude.toString());
      params.append('centerLng', center.longitude.toString());
      params.append('pointLat', point.latitude.toString());
      params.append('pointLng', point.longitude.toString());
      params.append('radius', radius.toString());

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.IS_WITHIN_RADIUS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error verificando si está dentro del radio:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de ubicación
   */
  async getLocationStats(filters: {
    period?: 'day' | 'week' | 'month';
    area?: Location;
    radius?: number;
  } = {}): Promise<LocationStats> {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      
      if (filters.area) {
        params.append('areaLat', filters.area.latitude.toString());
        params.append('areaLng', filters.area.longitude.toString());
      }
      
      if (filters.radius) {
        params.append('radius', filters.radius.toString());
      }

      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GEOLOCATION_STATS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de ubicación:', error);
      throw error;
    }
  },

  /**
   * Calcular tiempo de viaje estimado
   */
  async estimateTravelTime(
    origin: Location,
    destination: Location,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): Promise<{ duration: number; distance: number }> {
    try {
      const distanceResult = await this.calculateDistance({
        origin,
        destination,
        mode
      });

      return {
        duration: distanceResult.duration,
        distance: distanceResult.distance
      };
    } catch (error) {
      console.error('Error estimando tiempo de viaje:', error);
      throw error;
    }
  },

  /**
   * Calcular costo de combustible
   */
  async calculateFuelCost(
    distance: number,
    fuelPrice: number,
    fuelEfficiency: number
  ): Promise<{ cost: number; liters: number }> {
    try {
      const liters = distance / fuelEfficiency;
      const cost = liters * fuelPrice;

      return { cost, liters };
    } catch (error) {
      console.error('Error calculando costo de combustible:', error);
      throw error;
    }
  }
}; 