#!/usr/bin/env node

/**
 * Script para verificar la conectividad completa con el backend de MussikOn
 * Verifica todas las rutas principales y reporta el estado
 */

const https = require('https');
const http = require('http');

// Configuración
const BACKEND_URL = 'http://localhost:10000';
const TIMEOUT = 10000; // 10 segundos

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para hacer requests HTTP
function makeRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
            error: 'No JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// Función para log con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para testear un endpoint
async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    log(`🔍 Probando ${name}...`, 'blue');
    const response = await makeRequest(url, method, body);
    
    if (response.status >= 200 && response.status < 300) {
      log(`✅ ${name}: OK (${response.status})`, 'green');
      return { success: true, status: response.status, data: response.data };
    } else if (response.status === 401 || response.status === 403) {
      log(`⚠️  ${name}: Auth required (${response.status})`, 'yellow');
      return { success: true, status: response.status, data: response.data };
    } else if (response.status === 404) {
      log(`❌ ${name}: Not found (${response.status})`, 'red');
      return { success: false, status: response.status, error: 'Not found' };
    } else {
      log(`⚠️  ${name}: Unexpected status (${response.status})`, 'yellow');
      return { success: false, status: response.status, data: response.data };
    }
  } catch (error) {
    log(`❌ ${name}: Error - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// Endpoints a probar
const endpoints = [
  { name: 'Health Check', url: `${BACKEND_URL}/test`, method: 'GET' },
  { name: 'API Root', url: `${BACKEND_URL}/`, method: 'GET' },
  { name: 'Auth Login', url: `${BACKEND_URL}/auth/login`, method: 'POST', body: JSON.stringify({ userEmail: 'test@test.com', userPassword: 'test123' }) },
  { name: 'Admin Auth Login', url: `${BACKEND_URL}/admin-auth/login`, method: 'POST', body: JSON.stringify({ email: 'admin@test.com', password: 'admin123', role: 'admin' }) },
  { name: 'Admin Users', url: `${BACKEND_URL}/admin/users`, method: 'GET' },
  { name: 'Admin Events', url: `${BACKEND_URL}/admin/events`, method: 'GET' },
  { name: 'Admin Musicians', url: `${BACKEND_URL}/admin/musicians`, method: 'GET' },
  { name: 'Musician Requests', url: `${BACKEND_URL}/musician-requests`, method: 'GET' },
  { name: 'Images', url: `${BACKEND_URL}/imgs/getAllImg`, method: 'GET' },
  { name: 'Analytics', url: `${BACKEND_URL}/analytics/dashboard`, method: 'GET' },
  { name: 'Search', url: `${BACKEND_URL}/search/global`, method: 'GET' },
  { name: 'Payments', url: `${BACKEND_URL}/payment-system/statistics`, method: 'GET' },
  { name: 'Notifications', url: `${BACKEND_URL}/notifications`, method: 'GET' },
  { name: 'Geolocation', url: `${BACKEND_URL}/geolocation/search`, method: 'GET' },
  { name: 'Chat', url: `${BACKEND_URL}/chat`, method: 'GET' },
  { name: 'API Documentation', url: `${BACKEND_URL}/api-docs`, method: 'GET' }
];

// Función principal
async function main() {
  log('\n🚀 Iniciando verificación de conectividad con el backend de MussikOn', 'bold');
  log(`📍 Backend URL: ${BACKEND_URL}`, 'blue');
  log(`⏱️  Timeout: ${TIMEOUT}ms`, 'blue');
  log('─'.repeat(60), 'blue');

  const results = [];
  let successCount = 0;
  let totalCount = endpoints.length;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.url, endpoint.method, endpoint.body);
    results.push({ ...endpoint, result });
    
    if (result.success) {
      successCount++;
    }
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Resumen
  log('\n' + '─'.repeat(60), 'blue');
  log(`📊 RESUMEN DE CONECTIVIDAD`, 'bold');
  log(`✅ Exitosos: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`❌ Fallidos: ${totalCount - successCount}/${totalCount}`, totalCount - successCount > 0 ? 'red' : 'green');

  // Detalles de endpoints fallidos
  const failedEndpoints = results.filter(r => !r.result.success);
  if (failedEndpoints.length > 0) {
    log('\n❌ ENDPOINTS CON PROBLEMAS:', 'red');
    failedEndpoints.forEach(endpoint => {
      log(`   • ${endpoint.name}: ${endpoint.result.error || `Status ${endpoint.result.status}`}`, 'red');
    });
  }

  // Endpoints que requieren autenticación
  const authRequired = results.filter(r => r.result.status === 401 || r.result.status === 403);
  if (authRequired.length > 0) {
    log('\n🔐 ENDPOINTS QUE REQUIEREN AUTENTICACIÓN:', 'yellow');
    authRequired.forEach(endpoint => {
      log(`   • ${endpoint.name}`, 'yellow');
    });
  }

  // Recomendaciones
  log('\n💡 RECOMENDACIONES:', 'blue');
  if (successCount === totalCount) {
    log('   ✅ El backend está completamente funcional', 'green');
    log('   ✅ Todas las rutas están respondiendo correctamente', 'green');
    log('   ✅ El frontend puede conectarse sin problemas', 'green');
  } else if (successCount > totalCount * 0.8) {
    log('   ⚠️  El backend está mayormente funcional', 'yellow');
    log('   ⚠️  Algunos endpoints pueden requerir configuración adicional', 'yellow');
  } else {
    log('   ❌ El backend tiene problemas significativos', 'red');
    log('   ❌ Revisar la configuración del servidor', 'red');
    log('   ❌ Verificar que todas las rutas estén implementadas', 'red');
  }

  log('\n🎯 PRÓXIMOS PASOS:', 'blue');
  log('   1. Si hay endpoints fallidos, revisar la implementación en el backend', 'blue');
  log('   2. Si hay endpoints que requieren auth, configurar credenciales válidas', 'blue');
  log('   3. Actualizar la configuración del frontend si es necesario', 'blue');
  log('   4. Probar la funcionalidad completa del sistema', 'blue');

  log('\n✨ Verificación completada', 'green');
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testEndpoint, makeRequest }; 