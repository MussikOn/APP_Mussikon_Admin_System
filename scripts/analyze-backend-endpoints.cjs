const fs = require('fs');
const path = require('path');

// Configuración
const BACKEND_ROUTES_DIR = '../app_mussikon_express/src/routes';
const OUTPUT_FILE = 'backend-endpoints-analysis.md';

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

// Función para extraer endpoints de un archivo
function extractEndpoints(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const endpoints = [];
    
    // Buscar patrones de rutas
    const routePatterns = [
      // router.get('/path', ...)
      /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // router.get("/path", ...)
      /router\.(get|post|put|delete|patch)\s*\(\s*["'`]([^"'`]+)["'`]/g,
      // app.use('/path', ...)
      /app\.use\s*\(\s*['"`]([^'"`]+)['"`]/g,
      // app.use("/path", ...)
      /app\.use\s*\(\s*["'`]([^"'`]+)["'`]/g
    ];
    
    let match;
    routePatterns.forEach(pattern => {
      while ((match = pattern.exec(content)) !== null) {
        const method = match[1] || 'use';
        const route = match[2] || match[1];
        
        if (route && !route.includes('*')) {
          endpoints.push({
            method: method.toUpperCase(),
            route: route,
            file: path.basename(filePath),
            fullPath: filePath
          });
        }
      }
    });
    
    return endpoints;
  } catch (error) {
    log(`Error leyendo ${filePath}: ${error.message}`, 'red');
    return [];
  }
}

// Función para analizar estructura de datos
function analyzeDataStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const schemas = [];
    
    // Buscar esquemas de Swagger
    const schemaPattern = /@swagger[\s\S]*?components:\s*[\s\S]*?schemas:\s*[\s\S]*?(\w+):\s*[\s\S]*?type:\s*object[\s\S]*?properties:/g;
    let match;
    
    while ((match = schemaPattern.exec(content)) !== null) {
      const schemaName = match[1];
      schemas.push(schemaName);
    }
    
    return schemas;
  } catch (error) {
    return [];
  }
}

// Función para categorizar endpoints
function categorizeEndpoint(endpoint) {
  const route = endpoint.route.toLowerCase();
  
  if (route.includes('auth') || route.includes('login') || route.includes('register')) {
    return 'Authentication';
  } else if (route.includes('admin')) {
    return 'Admin';
  } else if (route.includes('user')) {
    return 'Users';
  } else if (route.includes('event')) {
    return 'Events';
  } else if (route.includes('musician')) {
    return 'Musicians';
  } else if (route.includes('image') || route.includes('img')) {
    return 'Images';
  } else if (route.includes('payment') || route.includes('deposit') || route.includes('withdrawal')) {
    return 'Payments';
  } else if (route.includes('analytics') || route.includes('stats')) {
    return 'Analytics';
  } else if (route.includes('search')) {
    return 'Search';
  } else if (route.includes('chat')) {
    return 'Chat';
  } else if (route.includes('notification')) {
    return 'Notifications';
  } else if (route.includes('geolocation') || route.includes('location')) {
    return 'Geolocation';
  } else if (route.includes('rating') || route.includes('review')) {
    return 'Ratings';
  } else if (route.includes('hiring')) {
    return 'Hiring';
  } else if (route.includes('voucher')) {
    return 'Vouchers';
  } else {
    return 'Other';
  }
}

// Función principal
async function analyzeBackendEndpoints() {
  log('\n🔍 Iniciando análisis exhaustivo de endpoints del backend', 'bold');
  log(`📁 Directorio: ${BACKEND_ROUTES_DIR}`, 'blue');
  log('─'.repeat(80), 'blue');

  const allEndpoints = [];
  const categories = {};
  const dataStructures = {};

  try {
    // Leer todos los archivos de rutas
    const files = fs.readdirSync(BACKEND_ROUTES_DIR);
    const routeFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    log(`📋 Encontrados ${routeFiles.length} archivos de rutas`, 'cyan');

    for (const file of routeFiles) {
      const filePath = path.join(BACKEND_ROUTES_DIR, file);
      log(`\n📄 Analizando: ${file}`, 'yellow');
      
      const endpoints = extractEndpoints(filePath);
      const schemas = analyzeDataStructure(filePath);
      
      log(`   Endpoints encontrados: ${endpoints.length}`, 'green');
      log(`   Esquemas encontrados: ${schemas.length}`, 'green');
      
      allEndpoints.push(...endpoints);
      dataStructures[file] = schemas;
      
      // Categorizar endpoints
      endpoints.forEach(endpoint => {
        const category = categorizeEndpoint(endpoint);
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(endpoint);
      });
    }

    // Generar reporte
    log('\n' + '─'.repeat(80), 'blue');
    log('📊 RESUMEN DEL ANÁLISIS', 'bold');
    log('─'.repeat(80), 'blue');

    // Estadísticas generales
    log(`\n📈 ESTADÍSTICAS GENERALES:`, 'bold');
    log(`   Total de endpoints: ${allEndpoints.length}`, 'cyan');
    log(`   Archivos analizados: ${routeFiles.length}`, 'cyan');
    log(`   Categorías encontradas: ${Object.keys(categories).length}`, 'cyan');

    // Endpoints por categoría
    log(`\n📂 ENDPOINTS POR CATEGORÍA:`, 'bold');
    Object.keys(categories).sort().forEach(category => {
      const count = categories[category].length;
      const percentage = ((count / allEndpoints.length) * 100).toFixed(1);
      log(`   ${category}: ${count} endpoints (${percentage}%)`, 'green');
    });

    // Métodos HTTP
    const methods = {};
    allEndpoints.forEach(endpoint => {
      methods[endpoint.method] = (methods[endpoint.method] || 0) + 1;
    });

    log(`\n🌐 MÉTODOS HTTP:`, 'bold');
    Object.keys(methods).sort().forEach(method => {
      const count = methods[method];
      const percentage = ((count / allEndpoints.length) * 100).toFixed(1);
      log(`   ${method}: ${count} endpoints (${percentage}%)`, 'blue');
    });

    // Detalles por categoría
    log(`\n📋 DETALLES POR CATEGORÍA:`, 'bold');
    Object.keys(categories).sort().forEach(category => {
      log(`\n${category}:`, 'bold');
      categories[category].forEach(endpoint => {
        log(`   ${endpoint.method} ${endpoint.route} (${endpoint.file})`, 'reset');
      });
    });

    // Estructuras de datos
    log(`\n🏗️ ESTRUCTURAS DE DATOS:`, 'bold');
    Object.keys(dataStructures).forEach(file => {
      if (dataStructures[file].length > 0) {
        log(`\n${file}:`, 'yellow');
        dataStructures[file].forEach(schema => {
          log(`   - ${schema}`, 'reset');
        });
      }
    });

    // Comparación con frontend
    log(`\n🔍 COMPARACIÓN CON FRONTEND:`, 'bold');
    log(`   Analizando configuración del frontend...`, 'blue');
    
    // Aquí podrías agregar la lógica para comparar con la configuración del frontend
    // Por ahora, solo mostramos los endpoints que podrían faltar

    // Generar archivo de salida
    const report = generateReport(allEndpoints, categories, dataStructures);
    fs.writeFileSync(OUTPUT_FILE, report);
    
    log(`\n💾 Reporte guardado en: ${OUTPUT_FILE}`, 'green');
    log(`\n✨ Análisis completado exitosamente`, 'green');

  } catch (error) {
    log(`\n💥 Error durante el análisis: ${error.message}`, 'red');
  }
}

// Función para generar reporte en Markdown
function generateReport(endpoints, categories, dataStructures) {
  let report = `# Análisis Exhaustivo de Endpoints del Backend - MussikOn

## 📊 Resumen Ejecutivo

- **Total de endpoints**: ${endpoints.length}
- **Categorías**: ${Object.keys(categories).length}
- **Fecha de análisis**: ${new Date().toISOString()}

## 📂 Endpoints por Categoría

`;

  Object.keys(categories).sort().forEach(category => {
    const count = categories[category].length;
    const percentage = ((count / endpoints.length) * 100).toFixed(1);
    
    report += `### ${category} (${count} endpoints - ${percentage}%)\n\n`;
    
    categories[category].forEach(endpoint => {
      report += `- **${endpoint.method}** \`${endpoint.route}\` - ${endpoint.file}\n`;
    });
    
    report += '\n';
  });

  report += `## 🏗️ Estructuras de Datos

`;

  Object.keys(dataStructures).forEach(file => {
    if (dataStructures[file].length > 0) {
      report += `### ${file}\n\n`;
      dataStructures[file].forEach(schema => {
        report += `- ${schema}\n`;
      });
      report += '\n';
    }
  });

  return report;
}

// Ejecutar análisis
if (require.main === module) {
  analyzeBackendEndpoints().catch(console.error);
}

module.exports = { analyzeBackendEndpoints, extractEndpoints, categorizeEndpoint }; 