import { apiService } from './api';
import { getApiUrl } from '../config/apiConfig';
import { API_CONFIG } from '../config/apiConfig';
import type { 
  MobileUser, 
  CreateUserData, 
  UpdateUserData, 
  UserFilters,
  UserStats 
} from '../features/mobileUsers/types/mobileUser';

// Tipos para respuestas de la API
export interface MobileUsersResponse {
  users: MobileUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MobileUserResponse {
  user: MobileUser;
}

export interface MobileUserStatsResponse {
  stats: UserStats;
}

// Función para mapear datos del backend al frontend
const mapBackendUserToFrontend = (backendUser: any): MobileUser => {
  return {
    _id: backendUser._id || backendUser.id,
    name: backendUser.name,
    lastName: backendUser.lastName,
    userEmail: backendUser.userEmail,
    roll: backendUser.roll,
    status: backendUser.status === true ? 'active' : 
            backendUser.status === false ? 'inactive' : 
            backendUser.status,
    phone: backendUser.phone,
    location: backendUser.location,
    profileImage: backendUser.profileImage,
    bio: backendUser.bio,
    instruments: backendUser.instruments || [],
    experience: backendUser.experience,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
    lastLogin: backendUser.lastLogin,
    deviceInfo: backendUser.deviceInfo,
    preferences: backendUser.preferences,
    stats: backendUser.stats
  };
};

// Función para mapear datos del frontend al backend
const mapFrontendUserToBackend = (frontendUser: CreateUserData | UpdateUserData): any => {
  const backendUser: any = {
    name: frontendUser.name,
    lastName: frontendUser.lastName,
    userEmail: frontendUser.userEmail,
    roll: frontendUser.roll,
    phone: frontendUser.phone,
    location: frontendUser.location,
    profileImage: frontendUser.profileImage,
    bio: frontendUser.bio,
    instruments: frontendUser.instruments,
    experience: frontendUser.experience,
    preferences: frontendUser.preferences
  };

  // Manejar el status según el tipo de datos
  if ('status' in frontendUser) {
    if (typeof frontendUser.status === 'boolean') {
      backendUser.status = frontendUser.status;
    } else if (typeof frontendUser.status === 'string') {
      backendUser.status = frontendUser.status === 'active';
    }
  }

  // Agregar contraseña solo si está presente
  if ('userPassword' in frontendUser && frontendUser.userPassword) {
    backendUser.userPassword = frontendUser.userPassword;
  }

  return backendUser;
};

// Servicio de usuarios móviles
export const mobileUsersService = {
  // Obtener todos los usuarios móviles
  async getAllUsers(filters?: UserFilters, page: number = 1, limit: number = 20): Promise<MobileUsersResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.roll) params.append('roll', filters.roll);
        if (filters.location) params.append('location', filters.location);
        if (filters.instrument) params.append('instrument', filters.instrument);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `${API_CONFIG.ENDPOINTS.MOBILE_USERS}?${params.toString()}`;
      const response = await apiService.get<{ users: any[]; total: number; page: number; limit: number; totalPages: number }>(url);
      
      return {
        users: response.data?.users?.map(mapBackendUserToFrontend) || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        limit: response.data?.limit || 20,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.warn('Backend no disponible, usando datos de prueba');
      
      // Datos de prueba para desarrollo
      const mockUsers = [
        {
          _id: '1',
          name: 'Juan Pérez',
          lastName: 'García',
          userEmail: 'juan@example.com',
          status: 'active' as const,
          roll: 'musico' as const,
          location: 'Madrid',
          instrument: 'guitarra',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'María López',
          lastName: 'Rodríguez',
          userEmail: 'maria@example.com',
          status: 'active' as const,
          roll: 'eventCreator' as const,
          location: 'Barcelona',
          instrument: 'piano',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          name: 'Carlos Martín',
          lastName: 'Fernández',
          userEmail: 'carlos@example.com',
          status: 'blocked' as const,
          roll: 'musico' as const,
          location: 'Valencia',
          instrument: 'batería',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '4',
          name: 'Ana Silva',
          lastName: 'González',
          userEmail: 'ana@example.com',
          status: 'pending' as const,
          roll: 'eventCreator' as const,
          location: 'Sevilla',
          instrument: 'voz',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '5',
          name: 'Luis Torres',
          lastName: 'Jiménez',
          userEmail: 'luis@example.com',
          status: 'active' as const,
          roll: 'musico' as const,
          location: 'Bilbao',
          instrument: 'bajo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Filtrar usuarios según los filtros aplicados
      let filteredUsers = mockUsers;
      if (filters) {
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.userEmail.toLowerCase().includes(searchTerm)
          );
        }
        if (filters.status) {
          filteredUsers = filteredUsers.filter(user => user.status === filters.status);
        }
        if (filters.roll) {
          filteredUsers = filteredUsers.filter(user => user.roll === filters.roll);
        }
        if (filters.location) {
          filteredUsers = filteredUsers.filter(user => 
            user.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        if (filters.instrument) {
          filteredUsers = filteredUsers.filter(user => 
            user.instrument.toLowerCase().includes(filters.instrument!.toLowerCase())
          );
        }
      }
      
      return {
        users: filteredUsers,
        total: filteredUsers.length,
        page: 1,
        limit: 20,
        totalPages: 1
      };
    }
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<MobileUser> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.MOBILE_USER_BY_ID, { id });
      const response = await apiService.get<{ user: any }>(url);
      
      return mapBackendUserToFrontend(response.data?.user);
    } catch (error) {
      console.error('Error al obtener usuario móvil por ID:', error);
      throw error;
    }
  },

  // Crear nuevo usuario móvil
  async createUser(userData: CreateUserData): Promise<MobileUser> {
    try {
      const backendData = mapFrontendUserToBackend(userData);
      const response = await apiService.post<{ user: any }>(API_CONFIG.ENDPOINTS.CREATE_MOBILE_USER, backendData);
      
      return mapBackendUserToFrontend(response.data?.user);
    } catch (error) {
      console.error('Error al crear usuario móvil:', error);
      throw error;
    }
  },

  // Actualizar usuario móvil
  async updateUser(id: string, userData: UpdateUserData): Promise<MobileUser> {
    try {
      const backendData = mapFrontendUserToBackend(userData);
      const url = getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_MOBILE_USER, { id });
      const response = await apiService.put<{ user: any }>(url, backendData);
      
      return mapBackendUserToFrontend(response.data?.user);
    } catch (error) {
      console.error('Error al actualizar usuario móvil:', error);
      throw error;
    }
  },

  // Eliminar usuario móvil
  async deleteUser(id: string): Promise<void> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.DELETE_MOBILE_USER, { id });
      await apiService.delete(url);
    } catch (error) {
      console.error('Error al eliminar usuario móvil:', error);
      throw error;
    }
  },

  // Bloquear usuario móvil
  async blockUser(id: string, reason?: string): Promise<MobileUser> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.BLOCK_MOBILE_USER, { id });
      const response = await apiService.post<{ user: any }>(url, { reason });
      
      return mapBackendUserToFrontend(response.data?.user);
    } catch (error) {
      console.error('Error al bloquear usuario móvil:', error);
      throw error;
    }
  },

  // Desbloquear usuario móvil
  async unblockUser(id: string): Promise<MobileUser> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.UNBLOCK_MOBILE_USER, { id });
      const response = await apiService.post<{ user: any }>(url);
      
      return mapBackendUserToFrontend(response.data?.user);
    } catch (error) {
      console.error('Error al desbloquear usuario móvil:', error);
      throw error;
    }
  },

  // Obtener estadísticas de usuarios
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiService.get<{ stats: UserStats }>(API_CONFIG.ENDPOINTS.USER_STATS);
      return response.data?.stats || {
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        pendingUsers: 0,
        organizers: 0,
        musicians: 0,
        newUsersThisMonth: 0,
        activeUsersThisWeek: 0,
        topLocations: [],
        topInstruments: [],
        userActivity: []
      };
    } catch (error) {
      console.warn('Backend no disponible, usando estadísticas de prueba');
      
      // Estadísticas de prueba para desarrollo
      return {
        totalUsers: 5,
        activeUsers: 3,
        blockedUsers: 1,
        pendingUsers: 1,
        organizers: 2,
        musicians: 3,
        newUsersThisMonth: 2,
        activeUsersThisWeek: 3,
        topLocations: [
          { location: 'Madrid', count: 2 },
          { location: 'Barcelona', count: 1 },
          { location: 'Valencia', count: 1 }
        ],
        topInstruments: [
          { instrument: 'guitarra', count: 2 },
          { instrument: 'piano', count: 1 },
          { instrument: 'batería', count: 1 }
        ],
        userActivity: []
      };
    }
  },

  // Obtener usuarios por estado
  async getUsersByStatus(status: string): Promise<MobileUser[]> {
    try {
      const params = new URLSearchParams({ status });
      const url = `${API_CONFIG.ENDPOINTS.MOBILE_USERS}?${params.toString()}`;
      const response = await apiService.get<{ users: any[] }>(url);
      
      return response.data?.users?.map(mapBackendUserToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener usuarios por estado:', error);
      throw error;
    }
  },

  // Obtener usuarios por rol
  async getUsersByRole(roll: string): Promise<MobileUser[]> {
    try {
      const params = new URLSearchParams({ roll });
      const url = `${API_CONFIG.ENDPOINTS.MOBILE_USERS}?${params.toString()}`;
      const response = await apiService.get<{ users: any[] }>(url);
      
      return response.data?.users?.map(mapBackendUserToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      throw error;
    }
  },

  // Obtener usuarios por ubicación
  async getUsersByLocation(location: string): Promise<MobileUser[]> {
    try {
      const params = new URLSearchParams({ location });
      const url = `${API_CONFIG.ENDPOINTS.MOBILE_USERS}?${params.toString()}`;
      const response = await apiService.get<{ users: any[] }>(url);
      
      return response.data?.users?.map(mapBackendUserToFrontend) || [];
    } catch (error) {
      console.error('Error al obtener usuarios por ubicación:', error);
      throw error;
    }
  },

  // Obtener conteo de usuarios
  async getUsersCount(filters?: UserFilters): Promise<number> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.roll) params.append('roll', filters.roll);
        if (filters.location) params.append('location', filters.location);
      }
      
      const url = `${API_CONFIG.ENDPOINTS.MOBILE_USERS}/count?${params.toString()}`;
      const response = await apiService.get<{ count: number }>(url);
      
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error al obtener conteo de usuarios:', error);
      throw error;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getUserStats,
  getUsersByStatus,
  getUsersByRole,
  getUsersByLocation,
  getUsersCount
} = mobileUsersService; 