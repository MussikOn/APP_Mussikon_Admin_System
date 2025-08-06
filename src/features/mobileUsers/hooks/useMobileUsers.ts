import { useState, useEffect, useCallback } from 'react';
import { mobileUsersService } from '../../../services/mobileUsersService';
import type { 
  MobileUser, 
  CreateUserData, 
  UpdateUserData, 
  UserFilters,
  UserStats 
} from '../types/mobileUser';

interface UseMobileUsersReturn {
  users: MobileUser[];
  loading: boolean;
  error: string | null;
  stats: UserStats | null;
  total: number;
  page: number;
  totalPages: number;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  setPage: (page: number) => void;
  fetchUsers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<MobileUser>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<MobileUser>;
  deleteUser: (id: string) => Promise<void>;
  blockUser: (id: string, reason?: string) => Promise<MobileUser>;
  unblockUser: (id: string) => Promise<MobileUser>;
  getUserById: (id: string) => Promise<MobileUser>;
  getUsersByStatus: (status: string) => Promise<MobileUser[]>;
  getUsersByRole: (roll: string) => Promise<MobileUser[]>;
  getUsersByLocation: (location: string) => Promise<MobileUser[]>;
  getUsersCount: (filters?: UserFilters) => Promise<number>;
}

export const useMobileUsers = (): UseMobileUsersReturn => {
  const [users, setUsers] = useState<MobileUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});

  // Función para obtener usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mobileUsersService.getAllUsers(filters, page, 20);
      setUsers(response.users);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    try {
      const userStats = await mobileUsersService.getUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Función para crear usuario
  const createUser = useCallback(async (userData: CreateUserData): Promise<MobileUser> => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await mobileUsersService.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar usuario
  const updateUser = useCallback(async (id: string, userData: UpdateUserData): Promise<MobileUser> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await mobileUsersService.updateUser(id, userData);
      setUsers(prev => prev.map(user => user._id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar usuario
  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await mobileUsersService.deleteUser(id);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para bloquear usuario
  const blockUser = useCallback(async (id: string, reason?: string): Promise<MobileUser> => {
    setLoading(true);
    setError(null);
    
    try {
      const blockedUser = await mobileUsersService.blockUser(id, reason);
      setUsers(prev => prev.map(user => user._id === id ? blockedUser : user));
      return blockedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al bloquear usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para desbloquear usuario
  const unblockUser = useCallback(async (id: string): Promise<MobileUser> => {
    setLoading(true);
    setError(null);
    
    try {
      const unblockedUser = await mobileUsersService.unblockUser(id);
      setUsers(prev => prev.map(user => user._id === id ? unblockedUser : user));
      return unblockedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desbloquear usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener usuario por ID
  const getUserById = useCallback(async (id: string): Promise<MobileUser> => {
    try {
      return await mobileUsersService.getUserById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Función para obtener usuarios por estado
  const getUsersByStatus = useCallback(async (status: string): Promise<MobileUser[]> => {
    try {
      return await mobileUsersService.getUsersByStatus(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuarios por estado';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Función para obtener usuarios por rol
  const getUsersByRole = useCallback(async (roll: string): Promise<MobileUser[]> => {
    try {
      return await mobileUsersService.getUsersByRole(roll);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuarios por rol';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Función para obtener usuarios por ubicación
  const getUsersByLocation = useCallback(async (location: string): Promise<MobileUser[]> => {
    try {
      return await mobileUsersService.getUsersByLocation(location);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuarios por ubicación';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Función para obtener conteo de usuarios
  const getUsersCount = useCallback(async (): Promise<number> => {
    try {
      return await mobileUsersService.getUsersCount();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener conteo de usuarios';
      console.error('Error al obtener conteo de usuarios:', errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Efecto para cargar usuarios cuando cambian los filtros o la página
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Efecto para cargar estadísticas al montar el componente
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    users,
    loading,
    error,
    stats,
    total,
    page,
    totalPages,
    filters,
    setFilters,
    setPage,
    fetchUsers,
    fetchStats,
    createUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    getUserById,
    getUsersByStatus,
    getUsersByRole,
    getUsersByLocation,
    getUsersCount
  };
}; 