import { get, post, put, del } from './httpClient';

export const ROLES = [
  'admin',
  'organizador', // sinónimo de eventCreator
  'eventCreator',
  'musico',
  'superadmin',
];

export interface User {
  name: string;
  lastName: string;
  userEmail: string;
  roll: string;
  status: boolean;
  userPassword?: string;
}

export async function getAllUsers(): Promise<User[]> {
  return await get<User[]>('/getAllUsers');
}

export async function getUsersCount(): Promise<number> {
  const users = await getAllUsers();
  return Array.isArray(users) ? users.length : 0;
}

export async function createUser(form: User): Promise<any> {
  console.log(`form: ${form}`);
  console.log(form);
  return await post<any>('/auth/Register', form);
}

export async function updateUser(email: string, form: Partial<User>): Promise<any> {
  return await put<any>(`/auth/update/${encodeURIComponent(email)}`, { ...form, password: undefined });
}

export async function deleteUserByEmail(email: string): Promise<any> {
  return await del<any>('/auth/delete', { data: { userEmail: email } });
} 