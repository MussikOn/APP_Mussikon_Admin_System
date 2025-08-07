# 🖼️ Guía para Implementar Endpoint de Actualización de Imagen de Voucher

## 📋 Resumen

Esta guía te ayudará a implementar el endpoint `PUT /vouchers/:voucherId/image` en el backend para permitir la actualización de imágenes de vouchers.

## 🎯 Endpoint a Implementar

```
PUT /vouchers/:voucherId/image
Content-Type: multipart/form-data
```

### Parámetros:
- `voucherId` (path): ID del voucher a actualizar
- `voucherImage` (form-data): Archivo de imagen (JPG, PNG, etc.)

### Respuesta Exitosa (200):
```json
{
  "success": true,
  "data": {
    "id": "voucher123",
    "depositId": "dep123",
    "userId": "user123",
    "amount": 500.00,
    "currency": "USD",
    "status": "pending",
    "voucherUrl": "https://storage.example.com/vouchers/voucher123_updated.jpg",
    "voucherFile": {
      "url": "https://storage.example.com/vouchers/voucher123_updated.jpg",
      "filename": "voucher123_updated.jpg",
      "uploadedAt": "2024-01-20T15:30:00Z",
      "fileSize": 1024000,
      "mimeType": "image/jpeg",
      "hash": "abc123def456"
    },
    "hasVoucherFile": true,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  },
  "message": "Imagen del voucher actualizada exitosamente"
}
```

### Respuesta de Error (400/404/500):
```json
{
  "success": false,
  "error": "Descripción del error",
  "message": "Mensaje de error para el usuario"
}
```

## 🛠️ Implementación en Backend

### 1. **Middleware de Autenticación**
```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Token inválido'
    });
  }
};
```

### 2. **Middleware de Validación de Archivos**
```javascript
// middleware/fileValidation.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes.'), false);
  }

  // Validar tamaño (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return cb(new Error('El archivo es demasiado grande. Máximo 10MB permitido.'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
```

### 3. **Controlador del Endpoint**
```javascript
// controllers/voucherController.js
const Voucher = require('../models/Voucher');
const { uploadToStorage, deleteFromStorage } = require('../services/storageService');
const { generateHash } = require('../utils/cryptoUtils');

const updateVoucherImage = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { user } = req;

    // Verificar que el voucher existe
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Voucher no encontrado'
      });
    }

    // Verificar permisos (opcional: solo el propietario o admin puede actualizar)
    if (voucher.userId.toString() !== user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para actualizar este voucher'
      });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó ningún archivo de imagen'
      });
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileExtension = path.extname(originalname);
    const fileName = `voucher_${voucherId}_${timestamp}${fileExtension}`;
    const filePath = `vouchers/${fileName}`;

    // Eliminar imagen anterior si existe
    if (voucher.voucherFile && voucher.voucherFile.url) {
      try {
        await deleteFromStorage(voucher.voucherFile.url);
      } catch (deleteError) {
        console.warn('Error eliminando imagen anterior:', deleteError);
      }
    }

    // Subir nueva imagen al storage
    const uploadResult = await uploadToStorage(buffer, filePath, mimetype);

    // Generar hash del archivo
    const fileHash = generateHash(buffer);

    // Actualizar voucher en la base de datos
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      {
        voucherFile: {
          url: uploadResult.url,
          filename: fileName,
          uploadedAt: new Date().toISOString(),
          fileSize: size,
          mimeType: mimetype,
          hash: fileHash
        },
        voucherUrl: uploadResult.url,
        hasVoucherFile: true,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'id name lastName userEmail');

    res.json({
      success: true,
      data: updatedVoucher,
      message: 'Imagen del voucher actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando imagen del voucher:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la imagen del voucher'
    });
  }
};

module.exports = {
  updateVoucherImage
};
```

### 4. **Ruta del Endpoint**
```javascript
// routes/voucherRoutes.js
const express = require('express');
const router = express.Router();
const { updateVoucherImage } = require('../controllers/voucherController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/fileValidation');

// Endpoint para actualizar imagen del voucher
router.put(
  '/:voucherId/image',
  authenticateToken,
  upload.single('voucherImage'),
  updateVoucherImage
);

module.exports = router;
```

### 5. **Servicio de Storage (Ejemplo con AWS S3)**
```javascript
// services/storageService.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToStorage = async (buffer, filePath, mimeType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filePath,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  
  return {
    url: result.Location,
    key: result.Key
  };
};

const deleteFromStorage = async (fileUrl) => {
  const key = fileUrl.split('/').pop(); // Extraer key del URL
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  };

  await s3.deleteObject(params).promise();
};

module.exports = {
  uploadToStorage,
  deleteFromStorage
};
```

### 6. **Utilidad para Generar Hash**
```javascript
// utils/cryptoUtils.js
const crypto = require('crypto');

const generateHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = {
  generateHash
};
```

## 🔧 Configuración del Servidor Principal

```javascript
// app.js o server.js
const express = require('express');
const voucherRoutes = require('./routes/voucherRoutes');

const app = express();

// Middleware para manejar errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Máximo 10MB permitido.'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
});

app.use('/api/vouchers', voucherRoutes);
```

## 📦 Dependencias Necesarias

```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1450.0",
    "uuid": "^9.0.0",
    "crypto": "^1.0.1"
  }
}
```

## 🧪 Testing del Endpoint

### Con cURL:
```bash
curl -X PUT \
  http://localhost:3001/api/vouchers/voucher123/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "voucherImage=@/path/to/image.jpg"
```

### Con Postman:
1. **Method**: PUT
2. **URL**: `http://localhost:3001/api/vouchers/voucher123/image`
3. **Headers**: 
   - `Authorization: Bearer YOUR_JWT_TOKEN`
4. **Body**: 
   - Type: `form-data`
   - Key: `voucherImage` (File)
   - Value: Seleccionar archivo de imagen

## 🔒 Consideraciones de Seguridad

1. **Validación de Archivos**: Verificar tipo MIME y extensión
2. **Límite de Tamaño**: Máximo 10MB por archivo
3. **Autenticación**: JWT token requerido
4. **Autorización**: Solo propietario o admin puede actualizar
5. **Sanitización**: Limpiar nombres de archivo
6. **Rate Limiting**: Limitar número de subidas por usuario
7. **Virus Scanning**: Escanear archivos subidos (opcional)

## 🚀 Pasos de Implementación

1. ✅ Instalar dependencias necesarias
2. ✅ Crear middleware de autenticación
3. ✅ Crear middleware de validación de archivos
4. ✅ Implementar servicio de storage
5. ✅ Crear controlador del endpoint
6. ✅ Configurar rutas
7. ✅ Agregar manejo de errores
8. ✅ Probar endpoint
9. ✅ Documentar API

## 📝 Notas Adicionales

- **Backup**: Hacer backup de imágenes antes de reemplazar
- **Logging**: Registrar todas las actualizaciones de imágenes
- **Monitoreo**: Monitorear uso de storage y costos
- **CDN**: Considerar usar CDN para mejor rendimiento
- **Compresión**: Comprimir imágenes automáticamente
- **Thumbnails**: Generar miniaturas para vista previa

¡Con esta implementación tendrás un endpoint robusto y seguro para actualizar imágenes de vouchers! 🎉 