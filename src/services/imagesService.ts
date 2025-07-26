import { get } from './httpClient';

export interface Image {
  // Define aquí los campos de la imagen según tu backend
  url: string;
  // ...otros campos
}

export async function getAllImages(): Promise<Image[]> {
  return await get<Image[]>('/getAllImages');
}

export async function getImagesCount(): Promise<number> {
  const images = await getAllImages();
  return Array.isArray(images) ? images.length : 0;
} 