# 💬 Sistema de Chat y Mensajería

Este módulo implementa un sistema completo de chat y mensajería en tiempo real para la plataforma Mussikon. Permite a los usuarios comunicarse entre sí a través de conversaciones individuales y grupales, con soporte para diferentes tipos de mensajes.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas
- **Conversaciones Individuales**: Chat privado entre dos usuarios
- **Conversaciones Grupales**: Chat grupal con múltiples participantes
- **Tipos de Mensajes**: Texto, imágenes, archivos y audio
- **Búsqueda de Conversaciones**: Filtrado y búsqueda de conversaciones
- **Gestión de Mensajes**: Envío, edición, eliminación y respuesta
- **Indicadores de Estado**: Mensajes leídos/no leídos, estado online
- **Subida de Archivos**: Soporte para imágenes y documentos
- **Interfaz Responsive**: Adaptable a dispositivos móviles y desktop
- **Tiempo Real**: Actualizaciones en tiempo real (preparado para WebSocket)

### 🎯 Componentes Principales

#### **Chat (index.tsx)**
Componente principal que orquesta toda la funcionalidad del chat:
- Gestión de estado global del chat
- Coordinación entre lista de conversaciones y ventana de chat
- Manejo de navegación móvil/desktop
- Integración con el hook `useChat`

#### **ChatHeader**
Header dinámico que muestra:
- Título y búsqueda de conversaciones
- Información de la conversación seleccionada
- Contador de mensajes no leídos
- Botones de acción (nueva conversación, búsqueda)

#### **ConversationList**
Lista de conversaciones con:
- Vista previa del último mensaje
- Indicadores de mensajes no leídos
- Timestamps relativos
- Menú de opciones por conversación
- Estados de carga y error

#### **ChatWindow**
Ventana principal del chat que incluye:
- Lista de mensajes con paginación
- Input para enviar mensajes
- Soporte para archivos e imágenes
- Indicadores de estado de envío

#### **MessageList**
Renderizado de mensajes con:
- Agrupación por fecha
- Diferentes tipos de mensaje (texto, imagen, archivo, audio)
- Indicadores de lectura
- Acciones por mensaje (editar, eliminar, responder)

#### **MessageBubble**
Burbuja individual de mensaje con:
- Estilos diferenciados para mensajes propios/ajenos
- Soporte para edición inline
- Indicadores de tiempo y estado
- Acciones contextuales

#### **MessageInput**
Input para enviar mensajes con:
- Soporte para texto multilínea
- Botones para adjuntar archivos e imágenes
- Indicador de estado de envío
- Atajos de teclado (Enter para enviar, Shift+Enter para nueva línea)

#### **NewConversationModal**
Modal para crear conversaciones con:
- Pestañas para conversación individual/grupal
- Búsqueda de usuarios disponibles
- Selección múltiple de participantes
- Validación de formularios

## 🛠️ Arquitectura Técnica

### **Servicios**
- **`chatService.ts`**: Servicio principal con todos los endpoints del backend
- **`useChat.ts`**: Hook personalizado para gestión de estado del chat

### **Tipos de Datos**
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### **Endpoints del Backend**
- `GET /chat/conversations` - Listar conversaciones
- `POST /chat/conversations` - Crear conversación
- `GET /chat/conversations/:id` - Obtener conversación
- `DELETE /chat/conversations/:id` - Eliminar conversación
- `PATCH /chat/conversations/:id/read` - Marcar como leída
- `GET /chat/conversations/:id/messages` - Obtener mensajes
- `POST /chat/conversations/:id/messages` - Enviar mensaje
- `PUT /chat/conversations/:id/messages/:messageId` - Editar mensaje
- `DELETE /chat/conversations/:id/messages/:messageId` - Eliminar mensaje
- `POST /chat/upload` - Subir archivo
- `GET /chat/users/available` - Usuarios disponibles
- `GET /chat/stats` - Estadísticas del chat

## 🎨 Diseño y UX

### **Principios de Diseño**
- **Interfaz Limpia**: Diseño minimalista centrado en la conversación
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Soporte para navegación por teclado
- **Feedback Visual**: Estados de carga, error y éxito claros

### **Estados de la Interfaz**
- **Carga**: Spinners y skeletons durante las operaciones
- **Error**: Alertas y mensajes de error informativos
- **Vacío**: Estados vacíos con llamadas a la acción
- **Éxito**: Confirmaciones visuales de acciones completadas

## 🔧 Configuración y Uso

### **Instalación**
El módulo está integrado automáticamente en el sistema. No requiere configuración adicional.

### **Uso Básico**
1. Navegar a `/chat` en la aplicación
2. Hacer clic en "Nueva conversación" para crear un chat
3. Seleccionar usuarios y crear conversación individual o grupal
4. Enviar mensajes de texto, imágenes o archivos
5. Gestionar conversaciones desde el menú contextual

### **Atajos de Teclado**
- `Enter`: Enviar mensaje
- `Shift + Enter`: Nueva línea
- `Escape`: Cancelar edición de mensaje
- `Ctrl/Cmd + K`: Búsqueda de conversaciones

## 🚀 Funcionalidades Futuras

### **Próximas Implementaciones**
- **WebSocket**: Conexión en tiempo real para mensajes instantáneos
- **Notificaciones Push**: Alertas de nuevos mensajes
- **Mensajes de Voz**: Grabación y reproducción de audio
- **Emojis**: Selector de emojis integrado
- **Reacciones**: Reacciones a mensajes (like, heart, etc.)
- **Mensajes Temporales**: Mensajes que se autodestruyen
- **Cifrado**: Mensajes cifrados end-to-end
- **Backup**: Exportación de conversaciones

### **Mejoras de Performance**
- **Virtualización**: Para listas largas de mensajes
- **Lazy Loading**: Carga progresiva de mensajes antiguos
- **Caching**: Cache local de conversaciones
- **Optimización**: Compresión de imágenes y archivos

## 🐛 Solución de Problemas

### **Problemas Comunes**
1. **Mensajes no se envían**: Verificar conexión a internet y estado del backend
2. **Archivos no se suben**: Verificar tamaño y tipo de archivo permitido
3. **Conversaciones no cargan**: Verificar autenticación y permisos
4. **Interfaz no responde**: Verificar estado de carga y errores

### **Debugging**
- Usar las herramientas de desarrollo del navegador
- Revisar la consola para errores de JavaScript
- Verificar las peticiones de red en la pestaña Network
- Comprobar el estado del hook `useChat`

## 📱 Compatibilidad

### **Navegadores Soportados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### **Dispositivos**
- Desktop (Windows, macOS, Linux)
- Tablet (iOS, Android)
- Mobile (iOS, Android)

## 🔒 Seguridad

### **Medidas Implementadas**
- Autenticación requerida para todas las operaciones
- Validación de tipos de archivo permitidos
- Límites de tamaño de archivo
- Sanitización de contenido de mensajes
- Verificación de permisos por conversación

### **Consideraciones**
- Los mensajes se almacenan en el backend
- Las conversaciones son persistentes
- Los archivos se almacenan en el servidor
- Se recomienda implementar cifrado para mensajes sensibles

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, contactar al equipo de desarrollo o crear un issue en el repositorio del proyecto. 