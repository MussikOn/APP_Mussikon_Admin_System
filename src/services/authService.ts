import { post, get } from './httpClient';

export interface AuthResponse {
  token: string;
  user: any;
}

export async function login(userEmail: string, userPassword: string): Promise<AuthResponse> {
  return await post<AuthResponse>('/auth/login', { userEmail, userPassword });
}

export async function verifyToken(token: string): Promise<any> {
  return await get<any>('/auth/verToken', {
    headers: { Authorization: `Bearer ${token}` },
  });
} 