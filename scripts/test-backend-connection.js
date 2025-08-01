#!/usr/bin/env node

/**
 * Script para probar la conectividad del backend
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:3001';
const ENDPOINTS_TO_TEST = [
  '/auth/login',
  '/analytics/dashboard',
  '/analytics/events',
  '/analytics/users'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      resolve({
        url,
        status: res.statusCode,
        statusText: res.statusMessage,
        responseTime,
        success: res.statusCode >= 200 && res.statusCode < 300
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        url,
        status: 'ERROR',
        statusText: error.message,
        responseTime,
        success: false,
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        statusText: 'Request timeout after 5 seconds',
        responseTime: 5000,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function testBackend() {
  console.log('🔍 Probando conectividad del backend...');
  console.log('🌐 URL base:', BACKEND_URL);
  console.log('');

  for (const endpoint of ENDPOINTS_TO_TEST) {
    const fullUrl = `${BACKEND_URL}${endpoint}`;
    console.log(`🔍 Probando: ${endpoint}`);
    
    const result = await testEndpoint(fullUrl);
    
    if (result.success) {
      console.log(`✅ ${endpoint}: ${result.status} (${result.responseTime}ms)`);
    } else {
      console.log(`❌ ${endpoint}: ${result.status} - ${result.statusText} (${result.responseTime}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log('');
  }

  console.log('📊 Prueba completada');
}

testBackend().catch(error => {
  console.error('💥 Error durante la prueba:', error);
}); 