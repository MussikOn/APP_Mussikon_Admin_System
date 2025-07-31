#!/usr/bin/env node

const http = require('http');

console.log('🔍 Verificando conectividad del backend...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend responde con status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('🎉 Backend está funcionando correctamente');
    process.exit(0);
  } else {
    console.log('⚠️ Backend responde pero con error');
    process.exit(1);
  }
});

req.on('error', (error) => {
  console.error('❌ Error conectando al backend:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 El backend no está corriendo. Inicia el servidor con:');
    console.log('   cd ../app_mussikon_express && npm run dev');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('⏱️ Timeout - El backend no responde en tiempo razonable');
  }
  
  process.exit(1);
});

req.on('timeout', () => {
  console.error('⏱️ Timeout - El backend no responde');
  req.destroy();
  process.exit(1);
});

req.end(); 