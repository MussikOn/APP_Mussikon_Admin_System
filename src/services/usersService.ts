import { get, post, put, del } from './httpClient';

export const ROLES = [
  'admin',
  'superadmin',
  'organizador', // sinónimo de eventCreator
  'eventCreator',
  'musico',
];

// CORREGIDO: Estructura compatible con el backend
export interface User {
  // ❌ ELIMINADO: _id - Backend usa userEmail como ID
  name: string;
  lastName: string;
  userEmail: string; // ✅ Este es el ID en el backend
  roll: string;
  status: boolean;
  userPassword?: string;
  create_at?: string;
  update_at?: string;
  delete_at?: string;
  // ✅ AGREGADOS: Campos adicionales del backend
  phone?: string;
  location?: string;
  profileImage?: string;
  bio?: string;
  instruments?: string[];
  experience?: string;
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: string;
  };
  lastLogin?: string;
}

// CORREGIDO: Estructura de respuesta compatible con el backend
export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener todos los usuarios con paginación
export async function getAllUsers(page: number = 1, limit: number = 20): Promise<UsersResponse> {
  try {
    const response = await get<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
    console.log('📊 Usuarios obtenidos:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
}

// Obtener conteo de usuarios
export async function getUsersCount(): Promise<number> {
  try {
    const response = await getAllUsers(1, 1000); // Obtener todos para contar
    return response.total || response.users.length;
  } catch (error) {
    console.error('❌ Error al obtener conteo de usuarios:', error);
    return 0;
  }
}

// Crear usuario
export async function createUser(form: User): Promise<any> {
  try {
    console.log('📝 Creando usuario:', form);
    const response = await post<any>('/admin/users', form);
    console.log('✅ Usuario creado:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    throw error;
  }
}

// CORREGIDO: Usar userEmail como ID
export async function updateUser(userEmail: string, form: Partial<User>): Promise<any> {
  try {
    console.log('📝 Actualizando usuario:', { userEmail, form });
    const response = await put<any>(`/admin/users/${userEmail}`, form);
    console.log('✅ Usuario actualizado:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    throw error;
  }
}

// CORREGIDO: Usar userEmail como ID
export async function deleteUserByEmail(userEmail: string): Promise<any> {
  try {
    console.log('🗑️ Eliminando usuario:', userEmail);
    const response = await del<any>(`/admin/users/${userEmail}`);
    console.log('✅ Usuario eliminado:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    throw error;
  }
}

// CORREGIDO: Usar userEmail como ID
export async function getUserById(userEmail: string): Promise<User> {
  try {
    const response = await get<User>(`/admin/users/${userEmail}`);
    console.log('👤 Usuario obtenido:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    throw error;
  }
}

// Obtener estadísticas de usuarios
export async function getUsersStats(): Promise<any> {
  try {
    const response = await get<any>('/admin/users/stats');
    console.log('📊 Estadísticas de usuarios:', response);
    return response;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de usuarios:', error);
    throw error;
  }
} 