#!/usr/bin/env node

/**
 * Script para verificar endpoints del sistema de pagos
 * Uso: node scripts/check-payment-endpoints.js
 */

const axios = require('axios');

// Configuración
const BASE_URL = 'http://192.168.54.90:3001';
const ENDPOINTS = [
  '/admin/payments/pending-deposits',
  '/admin/payments/deposit-stats',
  '/admin/payments/pending-withdrawals',
  '/admin/payments/statistics'
];

// Colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bold');
  console.log('='.repeat(60));
}

function logEndpoint(endpoint, status, responseTime, details = '') {
  const statusColor = status === 200 ? 'green' : status >= 400 ? 'red' : 'yellow';
  const statusText = status === 200 ? '✅ OK' : status >= 400 ? '❌ ERROR' : '⚠️ WARNING';
  
  log(`\n${statusText} ${endpoint}`, statusColor);
  log(`   Status: ${status}`, statusColor);
  log(`   Time: ${responseTime}ms`, 'blue');
  
  if (details) {
    log(`   Details: ${details}`, 'yellow');
  }
}

async function checkEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // Nota: En producción, necesitarías un token válido
        // 'Authorization': 'Bearer <token>'
      }
    });
    
    const responseTime = Date.now() - startTime;
    logEndpoint(endpoint, response.status, responseTime);
    
    return {
      endpoint,
      status: response.status,
      responseTime,
      success: true,
      data: response.data
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const status = error.response?.status || 'NETWORK_ERROR';
    const details = error.response?.data?.message || error.message;
    
    logEndpoint(endpoint, status, responseTime, details);
    
    return {
      endpoint,
      status,
      responseTime,
      success: false,
      error: details
    };
  }
}

async function checkAllEndpoints() {
  logHeader('🔍 VERIFICANDO ENDPOINTS DEL SISTEMA DE PAGOS');
  log(`Base URL: ${BASE_URL}`, 'blue');
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumen
  logHeader('📊 RESUMEN DE VERIFICACIÓN');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  log(`✅ Endpoints funcionando: ${successful.length}/${results.length}`, 'green');
  log(`❌ Endpoints con problemas: ${failed.length}/${results.length}`, failed.length > 0 ? 'red' : 'green');
  
  if (failed.length > 0) {
    log('\n🔧 ENDPOINTS QUE NECESITAN ATENCIÓN:', 'red');
    failed.forEach(result => {
      log(`   • ${result.endpoint} - ${result.status}`, 'red');
      if (result.error) {
        log(`     Error: ${result.error}`, 'yellow');
      }
    });
  }
  
  // Recomendaciones
  logHeader('💡 RECOMENDACIONES');
  
  if (failed.length === results.length) {
    log('🚨 CRÍTICO: Ningún endpoint está funcionando', 'red');
    log('   • Verificar que el servidor esté ejecutándose', 'yellow');
    log('   • Verificar la URL base del servidor', 'yellow');
    log('   • Verificar la configuración de CORS', 'yellow');
  } else if (failed.length > 0) {
    log('⚠️  ALGUNOS ENDPOINTS FALLAN', 'yellow');
    log('   • Implementar los endpoints faltantes en el backend', 'yellow');
    log('   • Verificar la autenticación JWT', 'yellow');
    log('   • Revisar los logs del servidor', 'yellow');
  } else {
    log('🎉 ¡EXCELENTE! Todos los endpoints funcionan correctamente', 'green');
  }
  
  // Información adicional
  logHeader('📋 INFORMACIÓN ADICIONAL');
  log('• Para implementar los endpoints faltantes, revisa:', 'blue');
  log('  docs/backend/PAYMENT_ENDPOINTS.md', 'blue');
  log('\n• Para configurar el backend, necesitas:', 'blue');
  log('  - Base de datos MySQL/PostgreSQL', 'yellow');
  log('  - Configuración de iDrive e2 para almacenamiento', 'yellow');
  log('  - Variables de entorno configuradas', 'yellow');
  log('  - Middleware de autenticación JWT', 'yellow');
  
  return results;
}

// Función para verificar conectividad básica
async function checkBasicConnectivity() {
  logHeader('🌐 VERIFICANDO CONECTIVIDAD BÁSICA');
  
  try {
    const response = await axios.get(BASE_URL, { timeout: 5000 });
    log(`✅ Servidor respondiendo en ${BASE_URL}`, 'green');
    log(`   Status: ${response.status}`, 'blue');
    return true;
  } catch (error) {
    log(`❌ No se puede conectar a ${BASE_URL}`, 'red');
    log(`   Error: ${error.message}`, 'yellow');
    log('\n🔧 SOLUCIONES POSIBLES:', 'yellow');
    log('   • Verificar que el servidor esté ejecutándose', 'yellow');
    log('   • Verificar que el puerto 3001 esté abierto', 'yellow');
    log('   • Verificar la configuración de firewall', 'yellow');
    log('   • Verificar que la IP sea correcta', 'yellow');
    return false;
  }
}

// Función principal
async function main() {
  logHeader('🚀 VERIFICADOR DE ENDPOINTS - SISTEMA DE PAGOS MUSSIKON');
  
  // Verificar conectividad básica
  const isConnected = await checkBasicConnectivity();
  
  if (!isConnected) {
    log('\n❌ No se puede verificar endpoints sin conectividad básica', 'red');
    process.exit(1);
  }
  
  // Verificar endpoints específicos
  await checkAllEndpoints();
  
  logHeader('✅ VERIFICACIÓN COMPLETADA');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 Error inesperado: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  checkEndpoint,
  checkAllEndpoints,
  checkBasicConnectivity
}; 