#!/usr/bin/env node

const http = require('http');

const BACKEND_URL = 'http://localhost:10000';

function testEndpoint(name, path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 10000,
      path: path,
      method: method,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${name}: OK (${res.statusCode})`);
          resolve({ success: true, status: res.statusCode });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          console.log(`⚠️  ${name}: Auth required (${res.statusCode})`);
          resolve({ success: true, status: res.statusCode });
        } else if (res.statusCode === 404) {
          console.log(`❌ ${name}: Not found (${res.statusCode})`);
          resolve({ success: false, status: res.statusCode });
        } else {
          console.log(`⚠️  ${name}: Status ${res.statusCode}`);
          resolve({ success: false, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name}: Error - ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ ${name}: Timeout`);
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function main() {
  console.log('🚀 Verificando conectividad con el backend de MussikOn');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log('─'.repeat(50));

  const endpoints = [
    { name: 'Health Check', path: '/test' },
    { name: 'API Root', path: '/' },
    { name: 'Auth Login', path: '/auth/login' },
    { name: 'Admin Auth', path: '/admin-auth/login' },
    { name: 'Admin Users', path: '/admin/users' },
    { name: 'Admin Events', path: '/admin/events' },
    { name: 'Images', path: '/imgs/getAllImg' },
    { name: 'Analytics', path: '/analytics/dashboard' },
    { name: 'Search', path: '/search/global' },
    { name: 'Payments', path: '/payment-system/statistics' },
    { name: 'API Docs', path: '/api-docs' }
  ];

  let successCount = 0;
  let totalCount = endpoints.length;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, endpoint.path);
    if (result.success) {
      successCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('─'.repeat(50));
  console.log(`📊 RESUMEN: ${successCount}/${totalCount} endpoints funcionando`);
  
  if (successCount === totalCount) {
    console.log('✅ Backend completamente funcional');
  } else if (successCount > totalCount * 0.8) {
    console.log('⚠️  Backend mayormente funcional');
  } else {
    console.log('❌ Backend con problemas');
  }
}

main().catch(console.error); 