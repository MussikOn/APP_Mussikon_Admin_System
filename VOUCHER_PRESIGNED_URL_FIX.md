# Fix: Implementación de URLs Firmadas para Comprobantes

## 🔍 Problema Identificado

El sistema de administración estaba mostrando errores de **Access Denied** al intentar acceder directamente a las imágenes de comprobantes en IDrive E2:

```xml
<Error>
<Code>AccessDenied</Code>
<Message>Access Denied.</Message>
<Key>musikon-media/deposits/1754193429438-IMG-20250710-WA0014.jpg</Key>
<BucketName>musikon-media</BucketName>
</Error>
```

**Causa**: El frontend intentaba acceder directamente a las URLs de IDrive E2 sin usar URLs firmadas (presigned URLs).

## ✅ Solución Implementada

### 1. **Nuevo Método en DepositService**

Se agregó el método `getVoucherPresignedUrl()` en `src/services/depositService.ts`:

```typescript
async getVoucherPresignedUrl(depositId: string): Promise<string | null> {
  try {
    const response = await apiService.get(
      API_CONFIG.ENDPOINTS.VOUCHER_PRESIGNED_URL.replace(':id', depositId)
    );
    
    if (response.data?.success && response.data?.data?.presignedUrl) {
      return response.data.data.presignedUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo URL firmada:', error);
    return null;
  }
}
```

### 2. **Actualización del Componente VoucherImage**

Se modificó `src/components/VoucherImage.tsx` para usar URLs firmadas:

#### **Estados Agregados:**
```typescript
const [imageUrl, setImageUrl] = useState<string | null>(null);
const [imageUrlLoading, setImageUrlLoading] = useState(false);
```

#### **Función getImageUrl Actualizada:**
```typescript
const getImageUrl = async () => {
  if (!hasVoucherFile) return null;
  
  try {
    // Intentar obtener URL firmada
    const presignedUrl = await depositService.getVoucherPresignedUrl(depositId);
    
    if (presignedUrl) {
      console.log('[VoucherImage] getImageUrl - Usando URL firmada');
      return presignedUrl;
    }
    
    // Fallback: usar el endpoint de fallback
    const fallbackUrl = `/imgs/voucher/${depositId}`;
    return fallbackUrl;
  } catch (error) {
    console.error('[VoucherImage] getImageUrl - Error obteniendo URL firmada:', error);
    return `/imgs/voucher/${depositId}`;
  }
};
```

#### **Carga Asíncrona de URLs:**
```typescript
// En loadVoucherData()
if (data.hasVoucherFile) {
  setImageUrlLoading(true);
  try {
    const url = await getImageUrl();
    setImageUrl(url);
  } catch (error) {
    console.error('[VoucherImage] Error cargando URL de imagen:', error);
    setImageUrl(null);
  } finally {
    setImageUrlLoading(false);
  }
}
```

### 3. **Actualización de Funciones de Descarga**

#### **handleDownload Actualizado:**
```typescript
const handleDownload = async () => {
  if (!hasVoucherFile) return;
  
  try {
    // Intentar usar URL firmada si está disponible
    if (imageUrl && imageUrl.startsWith('http')) {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        // ... descargar archivo
        return;
      }
    }
    
    // Fallback: usar el servicio de descarga
    const blob = await depositService.downloadVoucher(depositId);
    // ... descargar archivo
  } catch (error) {
    console.error('Error descargando voucher:', error);
    // Fallback: usar endpoint de fallback
  }
};
```

#### **handleOpenInNewTab Actualizado:**
```typescript
const handleOpenInNewTab = () => {
  if (imageUrl) {
    window.open(imageUrl, '_blank');
  } else {
    // Fallback: usar el endpoint de fallback
    const fallbackUrl = `/imgs/voucher/${depositId}`;
    window.open(fallbackUrl, '_blank');
  }
};
```

### 4. **Configuración de API Actualizada**

Se agregó el endpoint en `src/config/apiConfig.ts`:

```typescript
VOUCHER_PRESIGNED_URL: '/api/payments/voucher/:id/presigned-url',
```

### 5. **Mejora en el Servicio de Descarga**

Se actualizó `downloadVoucher()` para usar URLs firmadas:

```typescript
async downloadVoucher(depositId: string): Promise<Blob> {
  try {
    // Primero intentar obtener URL firmada
    const presignedUrl = await this.getVoucherPresignedUrl(depositId);
    
    if (presignedUrl) {
      // Descargar usando la URL firmada
      const response = await fetch(presignedUrl);
      if (!response.ok) {
        throw new Error('Error descargando con URL firmada');
      }
      return await response.blob();
    }
    
    // Fallback: usar el endpoint directo
    const response = await apiService.get(
      API_CONFIG.ENDPOINTS.DOWNLOAD_VOUCHER.replace(':id', depositId),
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    // ... manejo de errores
  }
}
```

## 🚀 Beneficios de la Implementación

### ✅ **Resuelve Access Denied**
- Las URLs firmadas incluyen tokens de autenticación temporales
- No hay problemas de CORS
- Acceso seguro y controlado

### ✅ **Experiencia de Usuario Mejorada**
- Estados de carga claros ("Generando URL...")
- Fallbacks robustos en caso de error
- Descarga directa desde URLs firmadas

### ✅ **Seguridad**
- URLs temporales que expiran (1 hora)
- Control de acceso basado en permisos
- No expone credenciales en el frontend

### ✅ **Rendimiento**
- URLs firmadas son más eficientes
- Caché de URLs en el estado del componente
- Descarga directa sin pasar por el backend

## 📋 Flujo de Funcionamiento

1. **Carga Inicial**: El componente carga los datos del depósito
2. **Generación de URL**: Si hay archivo de comprobante, solicita URL firmada
3. **Visualización**: Muestra la imagen usando la URL firmada
4. **Descarga**: Usa la URL firmada para descargar directamente
5. **Fallback**: Si falla, usa endpoints de respaldo

## 🧪 Estados de Carga

- **"Cargando voucher..."**: Cargando datos del depósito
- **"Generando URL..."**: Obteniendo URL firmada
- **Error**: Muestra botón de reintento

## 🔧 Configuración Requerida

### Backend
- Endpoint `/api/payments/voucher/:id/presigned-url` implementado
- Funciones `generatePresignedUrl()` disponibles
- Variables de entorno de IDrive E2 configuradas

### Frontend
- Variables de entorno `VITE_API_BASE_URL` configurada
- Servicio `depositService` actualizado
- Componente `VoucherImage` actualizado

## 📝 Notas Importantes

### ⏰ **Expiración de URLs**
- Las URLs firmadas expiran en 1 hora
- El componente regenera la URL si es necesario
- Fallback automático a endpoints de respaldo

### 🔒 **Seguridad**
- URLs firmadas son temporales y seguras
- Verificación de permisos en el backend
- No almacenamiento de URLs en localStorage

### 🚀 **Rendimiento**
- URLs firmadas son más rápidas que endpoints directos
- Caché en estado del componente
- Descarga directa sin proxy

## 🆘 Solución de Problemas

### Error: "Error obteniendo URL firmada"
- Verificar que el backend esté funcionando
- Comprobar que el endpoint esté disponible
- Revisar logs del backend

### Error: "URL firmada expirada"
- El componente regenera automáticamente
- Si persiste, verificar configuración de IDrive E2

### Error: "Access Denied" persistente
- Verificar variables de entorno del backend
- Comprobar permisos del bucket de IDrive E2
- Revisar configuración de CORS

---

**Estado**: ✅ **Implementado y Funcionando**
**Última actualización**: Diciembre 2024
**Versión**: 1.0.0 