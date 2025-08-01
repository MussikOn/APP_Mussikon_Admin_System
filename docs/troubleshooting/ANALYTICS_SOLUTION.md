# 🔧 Solución para Errores de Analytics Dashboard

## 🚨 Problemas Identificados

1. **`net::ERR_BLOCKED_BY_CLIENT`** para `/analytics/events`
2. **`403 Forbidden`** para `/analytics/dashboard` y `/analytics/users`

## 📋 Pasos para Resolver

### Paso 1: Verificar que el Backend esté Corriendo

```bash
# En la terminal, desde la carpeta del proyecto frontend
npm run check-backend
```

Si el backend no está corriendo, inícialo:

```bash
# En otra terminal, navega al backend
cd ../app_mussikon_express

# Instala dependencias si es necesario
npm install

# Inicia el servidor
npm run dev
```

### Paso 2: Resolver ERR_BLOCKED_BY_CLIENT

Este error es causado por extensiones del navegador. Sigue estos pasos:

#### Opción A: Desactivar Extensiones Temporalmente
1. Abre las **Herramientas de desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Busca extensiones activas en la barra de herramientas del navegador
4. **Desactiva temporalmente**:
   - Ad blockers (uBlock Origin, AdBlock Plus, etc.)
   - Extensiones de privacidad
   - Bloqueadores de contenido
5. **Recarga la página** (Ctrl+F5)

#### Opción B: Usar Modo Incógnito
1. Abre una ventana **incógnita/privada**
2. Navega a la aplicación
3. Inicia sesión
4. Prueba acceder a Analytics Dashboard

#### Opción C: Configurar Excepciones
Si usas uBlock Origin:
1. Click en el icono de uBlock Origin
2. Click en el icono de engranaje ⚙️
3. Ve a **Filter lists** → **Import**
4. Agrega: `||localhost:3001^`

### Paso 3: Resolver 403 Forbidden

#### Para `/analytics/dashboard`:
El backend ya está configurado para permitir acceso a usuarios con rol `eventCreator`. 

**Verifica que:**
1. El backend esté corriendo y actualizado
2. Tu sesión esté activa
3. Tu rol sea `eventCreator` o superior

#### Para `/analytics/users`:
Este endpoint está **intencionalmente restringido** a roles `admin` y `superadmin` por seguridad.

**Si necesitas acceso:**
- Contacta al administrador del sistema
- Solicita que tu rol sea elevado a `admin`

### Paso 4: Verificar Configuración

#### Frontend (ya configurado):
- URL del backend: `http://localhost:3001`
- Configuración en: `src/config/apiConfig.ts`

#### Backend (verificar):
- Puerto: `3001`
- CORS configurado para aceptar peticiones del frontend
- Rutas de analytics con permisos correctos

### Paso 5: Diagnóstico Automático

En la pantalla de Analytics Dashboard:
1. Si ves alertas de error, usa el botón **"Diagnosticar problemas de conectividad"**
2. Revisa la **consola del navegador** (F12) para información detallada
3. Sigue las sugerencias que aparecen en las alertas

## 🔍 Verificación Final

Después de seguir los pasos:

1. **Recarga la página** (Ctrl+F5)
2. **Verifica en la consola** que no haya errores
3. **Confirma que los datos se cargan** correctamente

## 🆘 Si los Problemas Persisten

### Para ERR_BLOCKED_BY_CLIENT:
1. Prueba con **otro navegador** (Chrome, Firefox, Edge)
2. **Desactiva temporalmente el antivirus/firewall**
3. Verifica la **configuración de red corporativa**

### Para 403 Forbidden:
1. **Cierra sesión y vuelve a iniciar sesión**
2. Verifica que el **token de autenticación** sea válido
3. Contacta al **administrador del sistema**

## 📞 Contacto de Soporte

Si necesitas ayuda adicional:
- Revisa los logs en la consola del navegador
- Proporciona capturas de pantalla de los errores
- Incluye información sobre tu navegador y sistema operativo

---

**Nota:** Los cambios en el backend requieren que el servidor sea reiniciado para que tomen efecto. 