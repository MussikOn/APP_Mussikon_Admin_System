import { useState, useCallback } from 'react';

export function useApiRequest<T, Args extends any[]>(
  apiFn: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err: any) {
      // Verificar si el error es porque se están usando datos de respaldo
      if (err?.response?.status === 404 || err?.response?.status === 500) {
        console.warn('📊 Endpoint no disponible, usando datos de respaldo');
        setError('Datos de respaldo - Endpoint no disponible');
      } else {
        const errorMessage = err?.response?.data?.message || err.message || 'Error desconocido';
        setError(errorMessage);
        console.error('❌ Error en API request:', errorMessage);
      }
      setData(null);
      // No lanzar el error si es un problema de endpoint no disponible
      if (err?.response?.status !== 404 && err?.response?.status !== 500) {
        throw err;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute };
} 