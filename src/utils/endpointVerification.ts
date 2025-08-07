// Script para verificar qué endpoints están realmente disponibles en el backend
import { API_CONFIG } from '../config/apiConfig';

export interface EndpointTestResult {
  endpoint: string;
  method: string;
  available: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
}

export const testEndpointAvailability = async (
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<EndpointTestResult> => {
  const startTime = Date.now();
  const result: EndpointTestResult = {
    endpoint,
    method,
    available: false
  };

  try {
    console.log(`🧪 Probando ${method} ${endpoint}`);
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, options);
    const responseTime = Date.now() - startTime;

    result.status = response.status;
    result.responseTime = responseTime;

    // Consideramos disponible si obtenemos cualquier respuesta del servidor
    // (incluso errores 401, 403, 404 indican que el servidor está funcionando)
    if (response.status >= 200 && response.status < 600) {
      result.available = true;
      console.log(`✅ ${method} ${endpoint} - Disponible (${response.status}) - ${responseTime}ms`);
    } else {
      result.available = false;
      result.error = `Status: ${response.status}`;
      console.log(`❌ ${method} ${endpoint} - No disponible (${response.status}) - ${responseTime}ms`);
    }

  } catch (error: any) {
    result.available = false;
    result.error = error.message || 'Error de red';
    result.responseTime = Date.now() - startTime;
    console.log(`❌ ${method} ${endpoint} - Error: ${result.error} - ${result.responseTime}ms`);
  }

  return result;
};

export const testAllEndpoints = async (): Promise<EndpointTestResult[]> => {
  console.log('🚀 Iniciando verificación de endpoints disponibles...');
  console.log(`🌐 URL Base: ${API_CONFIG.BASE_URL}`);
  
  const results: EndpointTestResult[] = [];
  
  // Lista de endpoints a probar (solo GET para verificar disponibilidad)
  const endpointsToTest = [
    // Autenticación
    '/auth/login',
    '/admin-auth/login',
    '/auth/Register',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/verify-code',
    '/auth/reset-password',
    
    // Usuarios Móviles (Admin)
    '/admin/users',
    '/admin/users/stats',
    
    // Eventos (Admin)
    '/admin/events',
    
    // Músicos (Admin)
    '/admin/musicians',
    
    // Solicitudes de Músicos (Admin)
    '/admin/musician-requests',
    '/admin/musician-requests/stats',
    
    // Búsqueda Avanzada (Admin)
    '/search/global',
    '/search/events',
    '/search/users',
    '/search/musician-requests',
    '/search/location',
    
    // Analytics (Admin)
    '/analytics/dashboard',
    '/analytics/users',
    '/analytics/events',
    '/analytics/requests',
    '/analytics/platform',
    '/analytics/trends',
    '/analytics/location-performance',
    '/analytics/top-users',
    '/analytics/export',
    
    // Sistema de Pagos
    '/payment-system/statistics',
    '/payment-system/deposit-stats',
    '/payment-system/pending-deposits',
    '/payment-system/pending-withdrawals',
    
    // Sistema de Pagos Móviles
    '/payment-system/my-balance',
    '/payment-system/my-deposits',
    '/payment-system/bank-accounts/my-accounts',
    '/payment-system/musicians/earnings',
    
    // Imágenes (Admin)
    '/imgs/getAllImg',
    
    // Endpoints de compatibilidad
    '/admin/payments/pending-deposits',
    '/admin/payments/statistics',
    '/admin/payments/deposit-stats',
  ];

  console.log(`📋 Probando ${endpointsToTest.length} endpoints...`);
  
  for (const endpoint of endpointsToTest) {
    const result = await testEndpointAvailability(endpoint);
    results.push(result);
    
    // Pequeña pausa entre requests para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Calcular estadísticas
  const availableEndpoints = results.filter(r => r.available);
  const unavailableEndpoints = results.filter(r => !r.available);
  const averageResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;

  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log(`✅ Endpoints disponibles: ${availableEndpoints.length}/${results.length}`);
  console.log(`❌ Endpoints no disponibles: ${unavailableEndpoints.length}/${results.length}`);
  console.log(`📈 Tasa de disponibilidad: ${((availableEndpoints.length / results.length) * 100).toFixed(1)}%`);
  console.log(`⏱️ Tiempo promedio de respuesta: ${averageResponseTime.toFixed(0)}ms`);

  if (unavailableEndpoints.length > 0) {
    console.log('\n❌ ENDPOINTS NO DISPONIBLES:');
    unavailableEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.method} ${endpoint.endpoint}: ${endpoint.error}`);
    });
  }

  if (availableEndpoints.length > 0) {
    console.log('\n✅ ENDPOINTS DISPONIBLES:');
    availableEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.method} ${endpoint.endpoint} (${endpoint.status})`);
    });
  }

  return results;
};

export const testPaymentSystemEndpoints = async (): Promise<EndpointTestResult[]> => {
  console.log('\n🔍 Verificando endpoints del Sistema de Pagos...');
  
  const paymentEndpoints = [
    '/payment-system/statistics',
    '/payment-system/deposit-stats',
    '/payment-system/pending-deposits',
    '/payment-system/pending-withdrawals',
    '/payment-system/my-balance',
    '/payment-system/my-deposits',
    '/payment-system/bank-accounts/my-accounts',
    '/payment-system/musicians/earnings',
    '/admin/payments/pending-deposits',
    '/admin/payments/statistics',
    '/admin/payments/deposit-stats',
  ];

  const results: EndpointTestResult[] = [];
  
  for (const endpoint of paymentEndpoints) {
    const result = await testEndpointAvailability(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const available = results.filter(r => r.available);
  console.log(`✅ Sistema de Pagos: ${available.length}/${results.length} endpoints disponibles`);

  return results;
};

// Función para ejecutar desde la consola del navegador
export const runEndpointVerification = async (): Promise<EndpointTestResult[]> => {
  return await testAllEndpoints();
};

export const runPaymentSystemVerification = async (): Promise<EndpointTestResult[]> => {
  return await testPaymentSystemEndpoints();
}; 