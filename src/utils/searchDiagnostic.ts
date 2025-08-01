/**
 * 🔍 Script de Diagnóstico para Problemas de Búsqueda
 * 
 * Este script ayuda a identificar y resolver problemas con el sistema de búsqueda
 * del panel de administración.
 */

import { apiService } from '../services/api';

export interface DiagnosticResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export class SearchDiagnostic {
  private results: DiagnosticResult[] = [];

  /**
   * Ejecutar diagnóstico completo del sistema de búsqueda
   */
  async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    console.log('🔍 Iniciando diagnóstico completo del sistema de búsqueda...');
    
    this.results = [];
    
    // Paso 1: Verificar autenticación
    await this.checkAuthentication();
    
    // Paso 2: Verificar conexión al backend
    await this.checkBackendConnection();
    
    // Paso 3: Verificar endpoint de búsqueda
    await this.checkSearchEndpoint();
    
    // Paso 4: Verificar configuración de red
    await this.checkNetworkConfiguration();
    
    // Paso 5: Verificar localStorage
    await this.checkLocalStorage();
    
    console.log('🔍 Diagnóstico completado:', this.results);
    return this.results;
  }

  /**
   * Verificar estado de autenticación
   */
  private async checkAuthentication(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token) {
        this.addResult('authentication', 'error', 'No se encontró token de autenticación', {
          token: null,
          user: user ? JSON.parse(user) : null
        });
        return;
      }
      
      if (!user) {
        this.addResult('authentication', 'warning', 'Token encontrado pero no hay datos de usuario', {
          token: token.substring(0, 20) + '...',
          user: null
        });
        return;
      }
      
      // Verificar si el token es válido
      try {
        await apiService.get('/auth/verify');
        this.addResult('authentication', 'success', 'Autenticación válida', {
          token: token.substring(0, 20) + '...',
          user: JSON.parse(user)
        });
      } catch (error: any) {
        this.addResult('authentication', 'error', 'Token inválido o expirado', {
          error: error.message,
          token: token.substring(0, 20) + '...'
        });
      }
      
    } catch (error: any) {
      this.addResult('authentication', 'error', 'Error verificando autenticación', {
        error: error.message
      });
    }
  }

  /**
   * Verificar conexión al backend
   */
  private async checkBackendConnection(): Promise<void> {
    try {
      // Intentar conectar al backend
      const response = await fetch('http://192.168.54.86:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.addResult('backend-connection', 'success', 'Conexión al backend exitosa', {
          status: response.status,
          statusText: response.statusText
        });
      } else {
        this.addResult('backend-connection', 'error', 'Backend respondió con error', {
          status: response.status,
          statusText: response.statusText
        });
      }
      
    } catch (error: any) {
      this.addResult('backend-connection', 'error', 'No se pudo conectar al backend', {
        error: error.message,
        url: 'http://192.168.54.86:3001/health'
      });
    }
  }

  /**
   * Verificar endpoint de búsqueda
   */
  private async checkSearchEndpoint(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        this.addResult('search-endpoint', 'warning', 'No se puede probar endpoint sin token');
        return;
      }
      
      // Probar endpoint de búsqueda global
      const response = await fetch('http://192.168.54.86:3001/search/global?query=test', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.addResult('search-endpoint', 'success', 'Endpoint de búsqueda funcionando', {
          status: response.status,
          data: data
        });
      } else if (response.status === 401) {
        this.addResult('search-endpoint', 'error', 'Endpoint requiere autenticación válida', {
          status: response.status,
          statusText: response.statusText
        });
      } else {
        this.addResult('search-endpoint', 'error', 'Endpoint de búsqueda no disponible', {
          status: response.status,
          statusText: response.statusText
        });
      }
      
    } catch (error: any) {
      this.addResult('search-endpoint', 'error', 'Error probando endpoint de búsqueda', {
        error: error.message
      });
    }
  }

  /**
   * Verificar configuración de red
   */
  private async checkNetworkConfiguration(): Promise<void> {
    try {
      // Verificar si hay problemas de CORS
      const corsTest = await fetch('http://192.168.54.86:3001', {
        method: 'OPTIONS'
      });
      
      this.addResult('network-config', 'success', 'Configuración de red correcta', {
        cors: corsTest.status === 200 || corsTest.status === 204
      });
      
    } catch (error: any) {
      // Verificar si es un problema de CORS
      if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
        this.addResult('network-config', 'error', 'Problema de CORS detectado', {
          error: error.message,
          suggestion: 'Verificar configuración CORS en el backend'
        });
      } else {
        this.addResult('network-config', 'warning', 'Problema de red detectado', {
          error: error.message
        });
      }
    }
  }

  /**
   * Verificar localStorage
   */
  private async checkLocalStorage(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const theme = localStorage.getItem('theme');
      
      const storageData = {
        token: token ? 'Presente' : 'Ausente',
        user: user ? 'Presente' : 'Ausente',
        theme: theme || 'No configurado',
        totalItems: localStorage.length
      };
      
      if (token && user) {
        this.addResult('local-storage', 'success', 'Datos de sesión presentes', storageData);
      } else {
        this.addResult('local-storage', 'warning', 'Datos de sesión incompletos', storageData);
      }
      
    } catch (error: any) {
      this.addResult('local-storage', 'error', 'Error accediendo a localStorage', {
        error: error.message
      });
    }
  }

  /**
   * Agregar resultado al diagnóstico
   */
  private addResult(step: string, status: 'success' | 'error' | 'warning', message: string, details?: any): void {
    this.results.push({
      step,
      status,
      message,
      details
    });
  }

  /**
   * Obtener resumen del diagnóstico
   */
  getSummary(): {
    total: number;
    success: number;
    errors: number;
    warnings: number;
    recommendations: string[];
  } {
    const total = this.results.length;
    const success = this.results.filter(r => r.status === 'success').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    
    const recommendations: string[] = [];
    
    if (errors > 0) {
      recommendations.push('🔧 Revisar errores críticos antes de continuar');
    }
    
    if (warnings > 0) {
      recommendations.push('⚠️ Atender advertencias para mejorar el funcionamiento');
    }
    
    if (success === total) {
      recommendations.push('✅ Sistema funcionando correctamente');
    }
    
    return {
      total,
      success,
      errors,
      warnings,
      recommendations
    };
  }

  /**
   * Generar reporte de diagnóstico
   */
  generateReport(): string {
    const summary = this.getSummary();
    
    let report = `# 🔍 Reporte de Diagnóstico - Sistema de Búsqueda\n\n`;
    report += `**Fecha**: ${new Date().toLocaleString()}\n`;
    report += `**Total de pruebas**: ${summary.total}\n`;
    report += `**Éxitos**: ${summary.success}\n`;
    report += `**Errores**: ${summary.errors}\n`;
    report += `**Advertencias**: ${summary.warnings}\n\n`;
    
    report += `## 📊 Resultados Detallados\n\n`;
    
    this.results.forEach((result, index) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
      report += `### ${index + 1}. ${icon} ${result.step}\n`;
      report += `**Estado**: ${result.status}\n`;
      report += `**Mensaje**: ${result.message}\n`;
      if (result.details) {
        report += `**Detalles**: \`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n`;
      }
      report += `\n`;
    });
    
    report += `## 🎯 Recomendaciones\n\n`;
    summary.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    
    return report;
  }
}

// Función de conveniencia para ejecutar diagnóstico
export const runSearchDiagnostic = async (): Promise<{
  results: DiagnosticResult[];
  summary: any;
  report: string;
}> => {
  const diagnostic = new SearchDiagnostic();
  const results = await diagnostic.runFullDiagnostic();
  const summary = diagnostic.getSummary();
  const report = diagnostic.generateReport();
  
  return { results, summary, report };
};

// Función para mostrar diagnóstico en consola
export const showDiagnosticInConsole = async (): Promise<void> => {
  console.log('🔍 Iniciando diagnóstico del sistema de búsqueda...');
  
  const { results, summary, report } = await runSearchDiagnostic();
  
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log(`Total: ${summary.total} | Éxitos: ${summary.success} | Errores: ${summary.errors} | Advertencias: ${summary.warnings}`);
  
  console.log('\n📋 RESULTADOS DETALLADOS:');
  results.forEach((result, index) => {
    const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
    console.log(`${index + 1}. ${icon} ${result.step}: ${result.message}`);
    if (result.details) {
      console.log(`   Detalles:`, result.details);
    }
  });
  
  console.log('\n🎯 RECOMENDACIONES:');
  summary.recommendations.forEach((rec: string) => {
    console.log(`- ${rec}`);
  });
  
  console.log('\n📄 REPORTE COMPLETO:');
  console.log(report);
}; 