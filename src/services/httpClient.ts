import { api } from './api';

export async function get<T>(url: string, config?: any): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function post<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: any): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
} 