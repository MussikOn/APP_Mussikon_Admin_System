const http = require('http');

// Configuración
const BACKEND_URL = 'http://localhost:10000';
const TIMEOUT = 5000;

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Endpoints críticos para verificar
const criticalEndpoints = [
  // Autenticación
  { path: '/auth/login', method: 'POST', description: 'Login de usuarios móviles' },
  { path: '/admin-auth/login', method: 'POST', description: 'Login de administradores' },
  
  // Admin - Usuarios
  { path: '/admin/users', method: 'GET', description: 'Listar usuarios (admin)' },
  { path: '/admin/users/stats', method: 'GET', description: 'Estadísticas de usuarios' },
  
  // Admin - Eventos
  { path: '/admin/events', method: 'GET', description: 'Listar eventos (admin)' },
  
  // Admin - Músicos
  { path: '/admin/musicians', method: 'GET', description: 'Listar músicos (admin)' },
  
  // Admin - Solicitudes
  { path: '/admin/musician-requests', method: 'GET', description: 'Listar solicitudes (admin)' },
  
  // Admin - Imágenes
  { path: '/admin/images', method: 'GET', description: 'Listar imágenes (admin)' },
  
  // Analytics
  { path: '/analytics/stats', method: 'GET', description: 'Estadísticas generales' },
  { path: '/analytics/dashboard', method: 'GET', description: 'Dashboard de analytics' },
  
  // Búsqueda
  { path: '/search/global', method: 'GET', description: 'Búsqueda global' },
  
  // Imágenes
  { path: '/images', method: 'GET', description: 'Listar imágenes' },
  { path: '/images/stats', method: 'GET', description: 'Estadísticas de imágenes' },
  
  // Pagos
  { path: '/payment-system/statistics', method: 'GET', description: 'Estadísticas de pagos' },
  { path: '/payment-system/pending-deposits', method: 'GET', description: 'Depósitos pendientes' },
  
  // Chat (no implementado en frontend)
  { path: '/chat/conversations', method: 'GET', description: 'Conversaciones de chat' },
  
  // Geolocalización (no implementado en frontend)
  { path: '/geolocation/nearby-events', method: 'GET', description: 'Eventos cercanos' },
  
  // Ratings (no implementado en frontend)
  { path: '/rating/trends', method: 'GET', description: 'Tendencias de ratings' },
  
  // Notificaciones Push (no implementado en frontend)
  { path: '/push-notifications/subscriptions', method: 'GET', description: 'Suscripciones push' }
];

// Función para hacer request HTTP
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 10000,
      path: endpoint.path,
      method: endpoint.method,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ 
            success: true, 
            status: res.statusCode, 
            message: 'OK',
            endpoint: endpoint
          });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          resolve({ 
            success: true, 
            status: res.statusCode, 
            message: 'Auth required',
            endpoint: endpoint
          });
        } else if (res.statusCode === 404) {
          resolve({ 
            success: false, 
            status: res.statusCode, 
            message: 'Not found',
            endpoint: endpoint
          });
        } else {
          resolve({ 
            success: false, 
            status: res.statusCode, 
            message: 'Error',
            endpoint: endpoint
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ 
        success: false, 
        status: 0, 
        message: error.message,
        endpoint: endpoint
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ 
        success: false, 
        status: 0, 
        message: 'Timeout',
        endpoint: endpoint
      });
    });

    // Para POST requests, enviar un body básico
    if (endpoint.method === 'POST') {
      req.write(JSON.stringify({ test: true }));
    }

    req.end();
  });
}

// Función principal
async function verifyBackendEndpoints() {
  log('\n🔍 Verificando conectividad con endpoints críticos del backend', 'bold');
  log(`🌐 Backend URL: ${BACKEND_URL}`, 'blue');
  log('─'.repeat(80), 'blue');

  const results = [];
  let successCount = 0;
  let authRequiredCount = 0;
  let errorCount = 0;

  for (const endpoint of criticalEndpoints) {
    log(`\n📡 Probando: ${endpoint.method} ${endpoint.path}`, 'yellow');
    log(`   Descripción: ${endpoint.description}`, 'cyan');
    
    const result = await makeRequest(endpoint);
    results.push(result);
    
    if (result.success && result.status === 200) {
      log(`   ✅ Status: ${result.status} - ${result.message}`, 'green');
      successCount++;
    } else if (result.success && (result.status === 401 || result.status === 403)) {
      log(`   ⚠️  Status: ${result.status} - ${result.message}`, 'yellow');
      authRequiredCount++;
    } else {
      log(`   ❌ Status: ${result.status} - ${result.message}`, 'red');
      errorCount++;
    }
  }

  // Resumen
  log('\n' + '─'.repeat(80), 'blue');
  log('📊 RESUMEN DE VERIFICACIÓN', 'bold');
  log('─'.repeat(80), 'blue');

  log(`\n✅ Endpoints funcionando: ${successCount}/${criticalEndpoints.length}`, 'green');
  log(`⚠️  Endpoints que requieren auth: ${authRequiredCount}/${criticalEndpoints.length}`, 'yellow');
  log(`❌ Endpoints con errores: ${errorCount}/${criticalEndpoints.length}`, 'red');

  // Detalles por categoría
  log(`\n📋 DETALLES POR CATEGORÍA:`, 'bold');
  
  const categories = {
    'Auth': results.filter(r => r.endpoint.path.includes('auth')),
    'Admin': results.filter(r => r.endpoint.path.includes('admin')),
    'Analytics': results.filter(r => r.endpoint.path.includes('analytics')),
    'Search': results.filter(r => r.endpoint.path.includes('search')),
    'Images': results.filter(r => r.endpoint.path.includes('images')),
    'Payments': results.filter(r => r.endpoint.path.includes('payment')),
    'Chat': results.filter(r => r.endpoint.path.includes('chat')),
    'Geolocation': results.filter(r => r.endpoint.path.includes('geolocation')),
    'Ratings': results.filter(r => r.endpoint.path.includes('rating')),
    'Notifications': results.filter(r => r.endpoint.path.includes('push'))
  };

  Object.keys(categories).forEach(category => {
    const categoryResults = categories[category];
    if (categoryResults.length > 0) {
      const working = categoryResults.filter(r => r.success && r.status === 200).length;
      const authRequired = categoryResults.filter(r => r.success && (r.status === 401 || r.status === 403)).length;
      const errors = categoryResults.filter(r => !r.success || (r.status !== 200 && r.status !== 401 && r.status !== 403)).length;
      
      log(`\n${category}:`, 'bold');
      log(`   ✅ Funcionando: ${working}/${categoryResults.length}`, 'green');
      log(`   ⚠️  Auth requerida: ${authRequired}/${categoryResults.length}`, 'yellow');
      log(`   ❌ Errores: ${errors}/${categoryResults.length}`, 'red');
    }
  });

  // Recomendaciones
  log(`\n💡 RECOMENDACIONES:`, 'bold');
  
  if (errorCount > 0) {
    log(`   🔧 ${errorCount} endpoints tienen problemas de conectividad`, 'red');
    log(`   📝 Verificar configuración del backend y rutas`, 'yellow');
  }
  
  if (authRequiredCount > 0) {
    log(`   🔐 ${authRequiredCount} endpoints requieren autenticación`, 'yellow');
    log(`   📋 Implementar sistema de autenticación en el frontend`, 'cyan');
  }
  
  if (successCount > 0) {
    log(`   ✅ ${successCount} endpoints están funcionando correctamente`, 'green');
    log(`   🚀 El backend está operativo y accesible`, 'green');
  }

  // Endpoints faltantes en frontend
  const missingInFrontend = results.filter(r => 
    r.success && (r.status === 200 || r.status === 401 || r.status === 403) &&
    (r.endpoint.path.includes('chat') || 
     r.endpoint.path.includes('geolocation') || 
     r.endpoint.path.includes('rating') || 
     r.endpoint.path.includes('push'))
  );

  if (missingInFrontend.length > 0) {
    log(`\n🎯 ENDPOINTS DISPONIBLES PERO NO IMPLEMENTADOS EN FRONTEND:`, 'bold');
    missingInFrontend.forEach(result => {
      log(`   ${result.endpoint.method} ${result.endpoint.path} - ${result.endpoint.description}`, 'cyan');
    });
  }

  log(`\n✨ Verificación completada`, 'green');
}

// Ejecutar verificación
if (require.main === module) {
  verifyBackendEndpoints().catch(console.error);
}

module.exports = { verifyBackendEndpoints }; 