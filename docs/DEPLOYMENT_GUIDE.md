# 🚀 Guía de Despliegue - MusikOn Admin System

> **Versión:** 1.0.0  
> **Última Actualización:** Diciembre 2024

## 📋 Prerrequisitos de Despliegue

### Requisitos del Sistema
- **Servidor:** Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js:** 18.0.0 o superior
- **Nginx:** 1.18.0 o superior
- **SSL Certificate:** Certificado válido para HTTPS
- **Dominio:** Dominio configurado (opcional)

### Verificar Requisitos
```bash
# Verificar Node.js
node --version
npm --version

# Verificar Nginx
nginx -v

# Verificar espacio en disco
df -h

# Verificar memoria disponible
free -h
```

---

## 🔧 Preparación del Entorno

### 1. Configurar Variables de Entorno de Producción
```bash
# Crear archivo de variables de entorno de producción
cp .env.example .env.production

# Editar variables de producción
nano .env.production
```

#### Contenido de `.env.production`:
```env
# API Configuration
VITE_API_URL=https://api.musikon.com
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=MusikOn Admin
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

### 2. Build de Producción
```bash
# Instalar dependencias
npm install

# Crear build optimizado
npm run build

# Verificar que el build se creó correctamente
ls -la dist/

# El build estará en la carpeta dist/
```

### 3. Verificar Build
```bash
# Servir el build localmente para verificar
npm run preview

# Verificar que no hay errores en la consola
# Probar funcionalidades básicas
```

---

## 🌐 Despliegue en Servidor

### Opción 1: Despliegue Manual

#### 1. Preparar Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Nginx
sudo apt install nginx -y

# Instalar PM2 (opcional)
sudo npm install -g pm2
```

#### 2. Subir Archivos
```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/admin

# Copiar archivos del build
sudo cp -r dist/* /var/www/admin/

# Configurar permisos
sudo chown -R www-data:www-data /var/www/admin
sudo chmod -R 755 /var/www/admin
```

#### 3. Configurar Nginx
```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/admin
```

#### Contenido de `/etc/nginx/sites-available/admin`:
```nginx
server {
    listen 80;
    server_name admin.musikon.com;
    root /var/www/admin;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api {
        proxy_pass http://192.168.100.101:1000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
}
```

#### 4. Habilitar Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar estado
sudo systemctl status nginx
```

### Opción 2: Despliegue con PM2

#### 1. Configurar PM2
```bash
# Crear archivo de configuración de PM2
nano ecosystem.config.js
```

#### Contenido de `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'musikon-admin',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/admin',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 2. Iniciar con PM2
```bash
# Iniciar aplicación
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### Opción 3: Despliegue con Docker

#### 1. Crear Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Crear nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://192.168.100.101:1000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### 3. Construir y Ejecutar
```bash
# Construir imagen
docker build -t musikon-admin .

# Ejecutar contenedor
docker run -d -p 80:80 --name musikon-admin musikon-admin

# Verificar contenedor
docker ps
```

---

## 🔒 Configuración de SSL/HTTPS

### Opción 1: Let's Encrypt (Gratuito)

#### 1. Instalar Certbot
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Obtener Certificado
```bash
# Obtener certificado SSL
sudo certbot --nginx -d admin.musikon.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

### Opción 2: Certificado Comercial

#### 1. Instalar Certificado
```bash
# Copiar certificado
sudo cp certificate.crt /etc/ssl/certs/
sudo cp private.key /etc/ssl/private/

# Configurar Nginx para SSL
sudo nano /etc/nginx/sites-available/admin
```

#### 2. Configuración SSL en Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name admin.musikon.com;
    
    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Resto de configuración...
}
```

---

## 📊 Monitoreo y Logs

### 1. Configurar Logs de Nginx
```bash
# Ver logs de acceso
sudo tail -f /var/log/nginx/access.log

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

### 2. Monitoreo con PM2
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs musikon-admin

# Monitorear recursos
pm2 monit
```

### 3. Monitoreo del Sistema
```bash
# Ver uso de CPU y memoria
htop

# Ver espacio en disco
df -h

# Ver procesos de Nginx
ps aux | grep nginx
```

---

## 🔄 Actualizaciones y Mantenimiento

### 1. Proceso de Actualización
```bash
# 1. Crear backup
sudo cp -r /var/www/admin /var/www/admin.backup.$(date +%Y%m%d)

# 2. Subir nuevo build
sudo cp -r dist/* /var/www/admin/

# 3. Verificar permisos
sudo chown -R www-data:www-data /var/www/admin
sudo chmod -R 755 /var/www/admin

# 4. Verificar que funciona
curl -I http://admin.musikon.com
```

### 2. Rollback
```bash
# Si algo sale mal, hacer rollback
sudo rm -rf /var/www/admin
sudo cp -r /var/www/admin.backup.$(date +%Y%m%d) /var/www/admin
sudo systemctl restart nginx
```

### 3. Limpieza Automática
```bash
# Crear script de limpieza
nano /usr/local/bin/cleanup-admin.sh
```

#### Contenido del script:
```bash
#!/bin/bash
# Limpiar backups antiguos (más de 7 días)
find /var/www/admin.backup.* -type d -mtime +7 -exec rm -rf {} \;

# Limpiar logs de Nginx (más de 30 días)
find /var/log/nginx -name "*.log" -mtime +30 -delete

# Limpiar cache de PM2
pm2 flush
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error 502 Bad Gateway
```bash
# Verificar que el backend esté corriendo
curl http://192.168.100.101:1000/health

# Verificar configuración de proxy en Nginx
sudo nginx -t

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

#### 2. Error de Permisos
```bash
# Corregir permisos
sudo chown -R www-data:www-data /var/www/admin
sudo chmod -R 755 /var/www/admin

# Verificar permisos
ls -la /var/www/admin/
```

#### 3. Error de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew

# Verificar configuración SSL
sudo nginx -t
```

#### 4. Error de Memoria
```bash
# Ver uso de memoria
free -h

# Reiniciar servicios
sudo systemctl restart nginx
pm2 restart musikon-admin
```

### Logs de Debugging

#### 1. Habilitar Logs Detallados
```bash
# Configurar logs detallados en Nginx
sudo nano /etc/nginx/sites-available/admin
```

#### Agregar en la configuración:
```nginx
# Logs detallados
access_log /var/log/nginx/admin_access.log;
error_log /var/log/nginx/admin_error.log debug;
```

#### 2. Monitoreo en Tiempo Real
```bash
# Ver logs en tiempo real
sudo tail -f /var/log/nginx/admin_access.log
sudo tail -f /var/log/nginx/admin_error.log

# Monitorear requests
watch -n 1 'curl -s -o /dev/null -w "%{http_code}" http://admin.musikon.com'
```

---

## 📈 Performance y Optimización

### 1. Optimización de Nginx
```nginx
# Configuración optimizada
worker_processes auto;
worker_connections 1024;

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Cache headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Optimización de Build
```bash
# Build optimizado
npm run build

# Analizar bundle
npm install -g bundle-analyzer
bundle-analyzer dist/assets/*.js
```

### 3. CDN Configuration
```bash
# Configurar CDN para assets estáticos
# Subir assets a CDN y actualizar URLs en el build
```

---

## 🔐 Seguridad

### 1. Headers de Seguridad
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 2. Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=admin:10m rate=10r/s;

location / {
    limit_req zone=admin burst=20 nodelay;
    # resto de configuración...
}
```

### 3. Firewall
```bash
# Configurar firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- **[INSTALLATION.md](./INSTALLATION.md)** - Guía de instalación
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuración avanzada
- **[MAINTENANCE.md](./MAINTENANCE.md)** - Mantenimiento del sistema

### Herramientas de Monitoreo
- **Prometheus + Grafana:** Monitoreo avanzado
- **Sentry:** Error tracking
- **Google Analytics:** Analytics de usuarios

### Comandos Útiles
```bash
# Verificar estado de servicios
sudo systemctl status nginx
pm2 status

# Ver logs
sudo journalctl -u nginx -f
pm2 logs

# Reiniciar servicios
sudo systemctl restart nginx
pm2 restart all
```

---

## ✅ Checklist de Despliegue

### Preparación
- [ ] Variables de entorno configuradas
- [ ] Build de producción creado
- [ ] Servidor preparado
- [ ] Dominio configurado

### Despliegue
- [ ] Archivos subidos al servidor
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Servicios iniciados

### Verificación
- [ ] Sitio accesible
- [ ] SSL funcionando
- [ ] API conectada
- [ ] Funcionalidades básicas operativas

### Monitoreo
- [ ] Logs configurados
- [ ] Monitoreo activo
- [ ] Backup configurado
- [ ] Alertas configuradas

---

**🎵 MusikOn Admin System** - Guía completa de despliegue para el panel administrativo. 