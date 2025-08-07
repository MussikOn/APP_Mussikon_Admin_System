// Script de prueba para verificar conexiones con el backend
// Este archivo se puede ejecutar para validar que todos los endpoints estén funcionando

import { API_CONFIG } from '../config/apiConfig';
import { apiService } from '../services/api';

export interface ConnectionTestResult {
  endpoint: string;
  success: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
  data?: any;
}

export interface BackendConnectionSummary {
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  successRate: number;
  averageResponseTime: number;
  results: ConnectionTestResult[];
}

class BackendConnectionTester {
  private results: ConnectionTestResult[] = [];
  private startTime: number = 0;

  async testEndpoint(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<ConnectionTestResult> {
    const testStartTime = Date.now();
    const result: ConnectionTestResult = {
      endpoint,
      success: false
    };

    try {
      console.log(`🧪 Probando endpoint: ${method} ${endpoint}`);
      
      let response;
      switch (method) {
        case 'GET':
          response = await apiService.get(endpoint);
          break;
        case 'POST':
          response = await apiService.post(endpoint, data);
          break;
        case 'PUT':
          response = await apiService.put(endpoint, data);
          break;
        case 'DELETE':
          response = await apiService.delete(endpoint);
          break;
      }

      result.success = true;
      result.status = response.status;
      result.responseTime = Date.now() - testStartTime;
      result.data = response.data;
      
      console.log(`✅ ${endpoint} - OK (${result.responseTime}ms)`);
    } catch (error: any) {
      result.success = false;
      result.status = error.response?.status;
      result.error = error.message || 'Error desconocido';
      result.responseTime = Date.now() - testStartTime;
      
      console.log(`❌ ${endpoint} - ERROR: ${result.error} (${result.status})`);
    }

    this.results.push(result);
    return result;
  }

  async testPaymentSystemEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints del Sistema de Pagos...');
    
    // Endpoints de usuario móvil
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_MY_BALANCE);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_MY_DEPOSITS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_BANK_ACCOUNTS_MY_ACCOUNTS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_MUSICIAN_EARNINGS);
    
    // Endpoints de administración
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_STATS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_PENDING_DEPOSITS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_PENDING_WITHDRAWALS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.PAYMENT_SYSTEM_DEPOSIT_STATS);
  }

  async testAuthenticationEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints de Autenticación...');
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
      email: 'test@example.com',
      password: 'test123'
    });
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, 'POST', {
      email: 'admin@example.com',
      password: 'admin123'
    });
  }

  async testUserManagementEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints de Gestión de Usuarios...');
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.MOBILE_USERS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.MOBILE_USERS_STATS);
  }

  async testEventManagementEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints de Gestión de Eventos...');
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_EVENTS);
  }

  async testAnalyticsEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints de Analytics...');
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_DASHBOARD);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_USERS);
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_ANALYTICS_EVENTS);
  }

  async testImageManagementEndpoints(): Promise<void> {
    console.log('\n🔍 Probando endpoints de Gestión de Imágenes...');
    
    await this.testEndpoint(API_CONFIG.ENDPOINTS.ADMIN_IMAGES);
  }

  async runAllTests(): Promise<BackendConnectionSummary> {
    this.startTime = Date.now();
    console.log('🚀 Iniciando pruebas de conexión con el backend...');
    console.log(`🌐 URL Base: ${API_CONFIG.BASE_URL}`);
    
    // Ejecutar todas las pruebas
    await this.testAuthenticationEndpoints();
    await this.testPaymentSystemEndpoints();
    await this.testUserManagementEndpoints();
    await this.testEventManagementEndpoints();
    await this.testAnalyticsEndpoints();
    await this.testImageManagementEndpoints();

    // Calcular estadísticas
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const successRate = (successfulTests / totalTests) * 100;
    const averageResponseTime = this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests;

    const summary: BackendConnectionSummary = {
      totalTests,
      successfulTests,
      failedTests,
      successRate,
      averageResponseTime,
      results: this.results
    };

    // Mostrar resumen
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log(`Total de pruebas: ${totalTests}`);
    console.log(`Exitosas: ${successfulTests}`);
    console.log(`Fallidas: ${failedTests}`);
    console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);
    console.log(`Tiempo promedio de respuesta: ${averageResponseTime.toFixed(2)}ms`);
    console.log(`Tiempo total de pruebas: ${Date.now() - this.startTime}ms`);

    // Mostrar errores específicos
    if (failedTests > 0) {
      console.log('\n❌ ENDPOINTS CON ERRORES:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.endpoint}: ${r.error} (${r.status})`);
        });
    }

    return summary;
  }

  getResults(): ConnectionTestResult[] {
    return this.results;
  }

  getSummary(): BackendConnectionSummary {
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const successRate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;
    const averageResponseTime = totalTests > 0 
      ? this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalTests 
      : 0;

    return {
      totalTests,
      successfulTests,
      failedTests,
      successRate,
      averageResponseTime,
      results: this.results
    };
  }
}

export const backendConnectionTester = new BackendConnectionTester();

// Función para ejecutar las pruebas desde la consola del navegador
export const runBackendConnectionTests = async (): Promise<BackendConnectionSummary> => {
  return await backendConnectionTester.runAllTests();
};

// Función para probar solo endpoints específicos
export const testSpecificEndpoints = async (endpoints: string[]): Promise<ConnectionTestResult[]> => {
  const results: ConnectionTestResult[] = [];
  
  for (const endpoint of endpoints) {
    const result = await backendConnectionTester.testEndpoint(endpoint);
    results.push(result);
  }
  
  return results;
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Usamos un endpoint que sabemos que existe para verificar conectividad
    const response = await apiService.get('/test');
    // Si obtenemos cualquier respuesta (incluso 401/403), significa que el servidor está funcionando
    const status = response.status || 0;
    return status >= 200 && status < 500;
  } catch (error) {
    console.error('❌ Backend no disponible:', error);
    return false;
  }
}; 