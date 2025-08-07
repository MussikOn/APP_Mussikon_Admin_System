// Script para descubrir endpoints disponibles en el backend
const fetch = require('node-fetch');

const API_CONFIG = {
  BASE_URL: 'http://192.168.54.26:3001'
};

async function discoverEndpoints() {
  console.log('🔍 Descubriendo endpoints disponibles en el backend...');
  console.log(`🌐 URL Base: ${API_CONFIG.BASE_URL}`);
  
  const results = [];
  
  // Lista de endpoints reales del backend basada en la configuración encontrada
  const possibleEndpoints = [
    // Endpoints básicos
    '/',
    '/test',
    '/api-docs',
    '/redoc',
    
    // Autenticación
    '/auth',
    '/auth/login',
    '/auth/register',
    '/auth/Register',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/verify-code',
    '/auth/reset-password',
    '/admin-auth',
    '/admin-auth/login',
    
    // Administración
    '/admin',
    '/admin/users',
    '/admin/users/stats',
    '/admin/events',
    '/admin/musicians',
    '/admin/musician-requests',
    '/admin/musician-requests/stats',
    '/admin/payments',
    '/admin/payments/statistics',
    '/admin/payments/pending-deposits',
    '/admin/payments/deposit-stats',
    '/admin/payments/pending-withdrawals',
    
    // Super Admin
    '/superAdmin',
    
    // Eventos
    '/events',
    '/events/stats',
    
    // Solicitudes de Músicos
    '/musician-requests',
    '/musician-requests/stats',
    
    // Perfil de Músicos
    '/media',
    '/media/profile',
    
    // Chat
    '/chat',
    '/chat/conversations',
    '/chat/messages',
    
    // Búsqueda
    '/search',
    '/search/global',
    '/search/events',
    '/search/users',
    '/search/musician-requests',
    '/search/location',
    '/musician-search',
    
    // Analytics
    '/analytics',
    '/analytics/dashboard',
    '/analytics/users',
    '/analytics/events',
    '/analytics/requests',
    '/analytics/platform',
    '/analytics/trends',
    '/analytics/location-performance',
    '/analytics/top-users',
    '/analytics/export',
    
    // Geolocalización
    '/geolocation',
    '/geolocation/nearby',
    '/geolocation/search',
    
    // Pagos
    '/payments',
    '/payments/statistics',
    '/payments/deposit-stats',
    '/payments/pending-deposits',
    '/payments/pending-withdrawals',
    
    // Sistema de Pagos
    '/payment-system',
    '/payment-system/statistics',
    '/payment-system/deposit-stats',
    '/payment-system/pending-deposits',
    '/payment-system/pending-withdrawals',
    '/payment-system/my-balance',
    '/payment-system/my-deposits',
    '/payment-system/bank-accounts/my-accounts',
    '/payment-system/musicians/earnings',
    
    // Depósitos
    '/deposits',
    '/deposits/my-deposits',
    '/deposits/create',
    
    // Vouchers
    '/vouchers',
    '/vouchers/download',
    '/vouchers/verify',
    
    // Notificaciones
    '/notifications',
    '/notifications/user',
    '/push-notifications',
    '/push-notifications/send',
    
    // Contratación
    '/hiring',
    '/hiring/requests',
    '/hiring/offers',
    
    // Calificaciones
    '/ratings',
    '/ratings/user',
    '/ratings/event',
    
    // Imágenes
    '/imgs',
    '/imgs/getAllImg',
    '/imgs/upload',
    '/imgs/user',
    '/imgs/event',
    
    // Endpoints de compatibilidad (rutas alternativas)
    '/admin/payments/pending-deposits',
    '/admin/payments/statistics',
    '/admin/payments/deposit-stats',
  ];

  console.log(`📋 Probando ${possibleEndpoints.length} endpoints reales del backend...`);
  
  for (const endpoint of possibleEndpoints) {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Probando: ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      const result = {
        endpoint,
        method: 'GET',
        status: response.status,
        available: response.status >= 200 && response.status < 600,
        responseTime
      };

      if (response.status >= 200 && response.status < 400) {
        console.log(`✅ ${endpoint} - Disponible (${response.status}) - ${responseTime}ms`);
      } else if (response.status >= 400 && response.status < 500) {
        console.log(`⚠️ ${endpoint} - Existe pero requiere autenticación/autorización (${response.status}) - ${responseTime}ms`);
      } else if (response.status >= 500) {
        console.log(`❌ ${endpoint} - Error del servidor (${response.status}) - ${responseTime}ms`);
        result.error = `Server Error: ${response.status}`;
      }

      results.push(result);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const result = {
        endpoint,
        method: 'GET',
        status: 0,
        available: false,
        responseTime,
        error: error.message || 'Network Error'
      };

      console.log(`❌ ${endpoint} - No disponible (${result.error}) - ${responseTime}ms`);
      results.push(result);
    }

    // Pequeña pausa entre requests para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Analizar resultados
  const availableEndpoints = results.filter(r => r.available);
  const workingEndpoints = results.filter(r => r.status >= 200 && r.status < 400);
  const authRequiredEndpoints = results.filter(r => r.status >= 400 && r.status < 500);
  const serverErrorEndpoints = results.filter(r => r.status >= 500);
  const unavailableEndpoints = results.filter(r => !r.available);

  console.log('\n📊 RESUMEN DE DESCUBRIMIENTO:');
  console.log(`✅ Endpoints disponibles: ${availableEndpoints.length}/${results.length}`);
  console.log(`🟢 Endpoints funcionando: ${workingEndpoints.length}`);
  console.log(`🟡 Endpoints que requieren auth: ${authRequiredEndpoints.length}`);
  console.log(`🔴 Errores del servidor: ${serverErrorEndpoints.length}`);
  console.log(`❌ Endpoints no disponibles: ${unavailableEndpoints.length}`);

  if (workingEndpoints.length > 0) {
    console.log('\n🟢 ENDPOINTS FUNCIONANDO:');
    workingEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint} (${endpoint.status})`);
    });
  }

  if (authRequiredEndpoints.length > 0) {
    console.log('\n🟡 ENDPOINTS QUE REQUIEREN AUTENTICACIÓN:');
    authRequiredEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint} (${endpoint.status})`);
    });
  }

  if (serverErrorEndpoints.length > 0) {
    console.log('\n🔴 ENDPOINTS CON ERRORES DEL SERVIDOR:');
    serverErrorEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint} (${endpoint.status})`);
    });
  }

  return results;
}

// Ejecutar el descubrimiento
discoverEndpoints().catch(console.error); 