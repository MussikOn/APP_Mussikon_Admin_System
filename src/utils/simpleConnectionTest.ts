// Script simple para probar la conectividad básica con el backend
import { API_CONFIG } from '../config/apiConfig';

export const testBasicConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('🔍 Probando conexión básica con el backend...');
    console.log(`🌐 URL Base: ${API_CONFIG.BASE_URL}`);
    
    // Intentar hacer una petición simple al backend usando un endpoint que sabemos que existe
    // Usamos /test que debería estar disponible según la configuración del backend
    const response = await fetch(`${API_CONFIG.BASE_URL}/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout de 5 segundos
      signal: AbortSignal.timeout(5000)
    });

    // Si obtenemos cualquier respuesta (incluso 401/403), significa que el servidor está funcionando
    if (response.status >= 200 && response.status < 500) {
      console.log('✅ Conexión exitosa con el backend');
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      return {
        success: true,
        message: 'Conexión exitosa con el backend',
        details: { status: response.status, statusText: response.statusText }
      };
    } else {
      console.log(`❌ Error de conexión: ${response.status} ${response.statusText}`);
      return {
        success: false,
        message: `Error de conexión: ${response.status} ${response.statusText}`,
        details: { status: response.status, statusText: response.statusText }
      };
    }
  } catch (error: any) {
    console.error('❌ Error al conectar con el backend:', error);
    
    let errorMessage = 'Error desconocido';
    if (error.name === 'AbortError') {
      errorMessage = 'Timeout: El servidor no respondió en 5 segundos';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Error de red: No se pudo conectar al servidor';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
      details: { error: error.toString() }
    };
  }
};

export const testEndpointAvailability = async (endpoint: string): Promise<{ success: boolean; message: string; status?: number }> => {
  try {
    console.log(`🧪 Probando endpoint: ${endpoint}`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    return {
      success: response.ok,
      message: response.ok ? 'Endpoint disponible' : `Error: ${response.status} ${response.statusText}`,
      status: response.status
    };
  } catch (error: any) {
    console.error(`❌ Error probando ${endpoint}:`, error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      status: 0
    };
  }
};

export const testPaymentSystemEndpoints = async (): Promise<void> => {
  console.log('\n🔍 Probando endpoints del Sistema de Pagos...');
  
  const endpoints = [
    '/payment-system/my-balance',
    '/payment-system/my-deposits',
    '/payment-system/bank-accounts/my-accounts',
    '/payment-system/statistics',
    '/payment-system/pending-deposits',
    '/payment-system/pending-withdrawals'
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpointAvailability(endpoint);
    console.log(`${result.success ? '✅' : '❌'} ${endpoint}: ${result.message}`);
  }
};

export const testAuthEndpoints = async (): Promise<void> => {
  console.log('\n🔍 Probando endpoints de Autenticación...');
  
  const endpoints = [
    '/test',
    '/auth',
    '/admin-auth'
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpointAvailability(endpoint);
    console.log(`${result.success ? '✅' : '❌'} ${endpoint}: ${result.message}`);
  }
};

export const runSimpleConnectionTests = async (): Promise<void> => {
  console.log('🚀 Iniciando pruebas simples de conexión...');
  
  // Prueba básica de conectividad
  const basicTest = await testBasicConnection();
  console.log(`📊 Resultado básico: ${basicTest.success ? '✅' : '❌'} ${basicTest.message}`);
  
  if (basicTest.success) {
    // Si la conexión básica funciona, probar endpoints específicos
    await testPaymentSystemEndpoints();
    await testAuthEndpoints();
  } else {
    console.log('⚠️ No se pueden probar endpoints específicos porque la conexión básica falló');
  }
  
  console.log('\n🏁 Pruebas completadas');
}; 