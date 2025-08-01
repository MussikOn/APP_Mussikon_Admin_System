# Guía de Despliegue - APP Mussikon Admin

## 🚀 Introducción

Esta guía proporciona instrucciones completas para desplegar el **APP Mussikon Admin System** en diferentes entornos de producción.

## 📋 Requisitos de Producción

### **Servidor**
- **CPU**: 2 cores mínimo, 4 cores recomendado
- **RAM**: 4GB mínimo, 8GB recomendado
- **Almacenamiento**: 20GB mínimo
- **Sistema Operativo**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### **Software Requerido**
```bash
# Node.js (versión LTS)
Node.js >= 18.0.0

# Nginx (servidor web)
nginx >= 1.18.0

# PM2 (gestor de procesos)
npm install -g pm2

# Certbot (certificados SSL)
sudo apt install certbot python3-certbot-nginx
```

### **Dominio y DNS**
- Dominio configurado (ej: `admin.mussikon.com`)
- Registros DNS apuntando al servidor
- Certificado SSL válido

## 🏗️ Preparación del Proyecto

### **1. Configuración de Variables de Entorno**

#### **Archivo .env.production**
```env
# API Configuration
VITE_API_BASE_URL=https://api.mussikon.com
VITE_API_TIMEOUT=15000

# App Configuration
VITE_APP_NAME=Mussikon Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEBSOCKET=true

# Production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

### **2. Build de Producción**

```bash
# Instalar dependencias
npm ci --only=production

# Crear build optimizado
npm run build

# Verificar build
ls -la dist/
# Debe contener: index.html, assets/, etc.
```

### **3. Optimización del Build**

#### **Configuración de Vite para Producción**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Deshabilitar en producción
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## 🚀 Métodos de Despliegue

### **1. Despliegue con Nginx + PM2**

#### **Estructura del Servidor**
```
/var/www/mussikon-admin/
├── dist/                 # Build de producción
├── logs/                 # Logs de la aplicación
├── ecosystem.config.js   # Configuración de PM2
└── nginx.conf           # Configuración de Nginx
```

#### **Configuración de PM2**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mussikon-admin',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### **Configuración de Nginx**
```nginx
# /etc/nginx/sites-available/mussikon-admin
server {
    listen 80;
    server_name admin.mussikon.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.mussikon.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/admin.mussikon.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.mussikon.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Root directory
    root /var/www/mussikon-admin/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (si es necesario)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

#### **Script de Despliegue**
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando despliegue de Mussikon Admin..."

# Variables
APP_NAME="mussikon-admin"
APP_DIR="/var/www/mussikon-admin"
BACKUP_DIR="/var/backups/mussikon-admin"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Crear directorios si no existen
sudo mkdir -p $APP_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $APP_DIR/logs

# Backup del build anterior
if [ -d "$APP_DIR/dist" ]; then
    echo "📦 Creando backup del build anterior..."
    sudo tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $APP_DIR dist/
fi

# Copiar nuevo build
echo "📁 Copiando nuevo build..."
sudo cp -r dist/ $APP_DIR/

# Configurar permisos
echo "🔐 Configurando permisos..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Reiniciar PM2
echo "🔄 Reiniciando aplicación..."
pm2 restart ecosystem.config.js

# Verificar estado
echo "✅ Verificando estado de la aplicación..."
pm2 status

# Limpiar backups antiguos (mantener últimos 5)
echo "🧹 Limpiando backups antiguos..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm

echo "🎉 Despliegue completado exitosamente!"
```

### **2. Despliegue con Docker**

#### **Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Stage de producción
FROM nginx:alpine

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### **docker-compose.yml**
```yaml
version: '3.8'

services:
  mussikon-admin:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - mussikon-network

  # Backend API (si es necesario)
  api:
    image: mussikon-api:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mussikon
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - mussikon-network

  # Base de datos
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mussikon
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - mussikon-network

volumes:
  postgres_data:

networks:
  mussikon-network:
    driver: bridge
```

#### **Script de Despliegue Docker**
```bash
#!/bin/bash
# deploy-docker.sh

set -e

echo "🐳 Iniciando despliegue con Docker..."

# Build de la imagen
echo "🔨 Construyendo imagen Docker..."
docker build -t mussikon-admin:latest .

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Iniciar nuevos contenedores
echo "🚀 Iniciando nuevos contenedores..."
docker-compose up -d

# Verificar estado
echo "✅ Verificando estado de los contenedores..."
docker-compose ps

# Limpiar imágenes no utilizadas
echo "🧹 Limpiando imágenes no utilizadas..."
docker image prune -f

echo "🎉 Despliegue con Docker completado!"
```

### **3. Despliegue en Cloud Platforms**

#### **Vercel**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.mussikon.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### **Netlify**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "https://api.mussikon.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"
```

## 🔒 Configuración de Seguridad

### **1. Certificados SSL**

#### **Let's Encrypt con Certbot**
```bash
# Instalar certificado
sudo certbot --nginx -d admin.mussikon.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **2. Headers de Seguridad**

#### **Configuración de Nginx**
```nginx
# Headers de seguridad adicionales
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.mussikon.com;" always;
```

### **3. Firewall**

#### **Configuración de UFW**
```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Verificar estado
sudo ufw status
```

## 📊 Monitoreo y Logs

### **1. Configuración de Logs**

#### **Nginx Logs**
```nginx
# Configuración de logs
access_log /var/log/nginx/mussikon-admin-access.log;
error_log /var/log/nginx/mussikon-admin-error.log;

# Log rotation
# /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

#### **PM2 Logs**
```bash
# Ver logs en tiempo real
pm2 logs mussikon-admin

# Ver logs específicos
pm2 logs mussikon-admin --err
pm2 logs mussikon-admin --out

# Limpiar logs
pm2 flush
```

### **2. Monitoreo de Performance**

#### **Configuración de PM2**
```javascript
// ecosystem.config.js con monitoreo
module.exports = {
  apps: [{
    name: 'mussikon-admin',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Monitoreo
    monitor: true,
    max_memory_restart: '1G',
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Métricas
    pmx: true
  }]
};
```

## 🔄 CI/CD Pipeline

### **1. GitHub Actions**

#### **Workflow de Despliegue**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/mussikon-admin
          git pull origin main
          npm ci --only=production
          npm run build
          pm2 restart ecosystem.config.js
```

### **2. Variables de Entorno en CI/CD**

#### **GitHub Secrets**
```bash
# Configurar en GitHub Repository > Settings > Secrets
HOST=your-server-ip
USERNAME=deploy-user
SSH_KEY=your-ssh-private-key
VITE_API_BASE_URL=https://api.mussikon.com
```

## 🚨 Rollback y Recuperación

### **1. Script de Rollback**

```bash
#!/bin/bash
# rollback.sh

set -e

echo "🔄 Iniciando rollback..."

# Variables
APP_NAME="mussikon-admin"
APP_DIR="/var/www/mussikon-admin"
BACKUP_DIR="/var/backups/mussikon-admin"

# Listar backups disponibles
echo "📦 Backups disponibles:"
ls -la $BACKUP_DIR

# Seleccionar backup
read -p "Ingrese el timestamp del backup a restaurar: " BACKUP_TIMESTAMP

# Verificar que existe
if [ ! -f "$BACKUP_DIR/backup_$BACKUP_TIMESTAMP.tar.gz" ]; then
    echo "❌ Backup no encontrado"
    exit 1
fi

# Crear backup del estado actual
echo "📦 Creando backup del estado actual..."
sudo tar -czf $BACKUP_DIR/rollback_$(date +%Y%m%d_%H%M%S).tar.gz -C $APP_DIR dist/

# Restaurar backup
echo "🔄 Restaurando backup..."
sudo rm -rf $APP_DIR/dist
sudo tar -xzf $BACKUP_DIR/backup_$BACKUP_TIMESTAMP.tar.gz -C $APP_DIR

# Reiniciar aplicación
echo "🔄 Reiniciando aplicación..."
pm2 restart ecosystem.config.js

echo "✅ Rollback completado exitosamente!"
```

### **2. Verificación Post-Despliegue**

```bash
#!/bin/bash
# health-check.sh

echo "🏥 Verificando salud de la aplicación..."

# Verificar que el servidor responde
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://admin.mussikon.com/health)

if [ $HTTP_STATUS -eq 200 ]; then
    echo "✅ Servidor respondiendo correctamente"
else
    echo "❌ Error: HTTP $HTTP_STATUS"
    exit 1
fi

# Verificar PM2
PM2_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status')

if [ "$PM2_STATUS" = "online" ]; then
    echo "✅ PM2 proceso online"
else
    echo "❌ Error: PM2 proceso $PM2_STATUS"
    exit 1
fi

# Verificar logs recientes
echo "📋 Últimos logs de error:"
pm2 logs mussikon-admin --err --lines 10

echo "🎉 Verificación completada exitosamente!"
```

## 📈 Optimización de Performance

### **1. Configuración de Caché**

#### **Nginx Cache**
```nginx
# Cache para archivos estáticos
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# Cache para HTML
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### **2. Compresión Gzip**

```nginx
# Configuración de compresión
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/x-javascript
    application/xml+rss
    application/javascript
    application/json;
```

## ✅ Checklist de Despliegue

### **Pre-Despliegue**
- [ ] **Build exitoso** sin errores
- [ ] **Tests pasando** en CI/CD
- [ ] **Variables de entorno** configuradas
- [ ] **Backend API** funcionando
- [ ] **Dominio y DNS** configurados
- [ ] **Certificados SSL** instalados

### **Despliegue**
- [ ] **Backup** del estado anterior
- [ ] **Copia de archivos** completada
- [ ] **Permisos** configurados
- [ ] **Servicios reiniciados** correctamente
- [ ] **Health checks** pasando

### **Post-Despliegue**
- [ ] **Aplicación accesible** via HTTPS
- [ ] **Funcionalidades críticas** funcionando
- [ ] **Logs sin errores** críticos
- [ ] **Performance** dentro de parámetros
- [ ] **Monitoreo** configurado

---

**¡Tu aplicación está lista para producción!** 🚀 