# Documentación de Desarrollo: APP_MussikOn_Admin_System

> **Ruta del backend (Express):** `../APP_mussikon_express`
> 
> Todos los endpoints y lógica de negocio se encuentran en esa carpeta. Consulta ahí para detalles de implementación y rutas.

---

## Visión de Diseño Futurista / Sci-Fi

La interfaz de la app está inspirada en sistemas de ciencia ficción y paneles de control futuristas. Los principios y efectos visuales clave son:

- **Gradients vivos:** púrpura pastel, azul, cian y toques de rosa neón.
- **Glassmorphism:** paneles translúcidos con desenfoque y bordes brillantes.
- **Glow/Neon:** sombras y bordes con efecto glow (resplandor) en botones, tarjetas y títulos.
- **Animaciones suaves:** transiciones, hover y microinteracciones con movimiento fluido.
- **Iconografía moderna:** íconos minimalistas y animados.
- **Tipografía bold y geométrica:** títulos grandes, espaciado generoso.
- **Detalles sci-fi:** líneas, divisores y acentos con efecto “láser” o “holograma”.
- **Modo oscuro predominante:** fondo oscuro con acentos brillantes.
- **Tarjetas flotantes:** paneles y métricas con efecto de levitación.
- **Fondos animados:** partículas, líneas en movimiento o efectos de circuito para dar sensación de tecnología avanzada.

El objetivo es que la experiencia transmita modernidad, tecnología y elegancia, diferenciando la app de un panel administrativo tradicional.

---

## Arquitectura Frontend Moderna

### 1. Servicios Centralizados (API Layer)
- Todas las llamadas a la API se realizan a través de servicios en `src/services/`.
- Cada módulo (usuarios, eventos, imágenes, etc.) tiene su propio archivo de servicio (`usersService.ts`, `eventsService.ts`, ...).
- Se utiliza un cliente HTTP centralizado (`httpClient.ts`) que envuelve Axios y maneja errores, autenticación y parseo de respuestas.
- Ejemplo de uso en un servicio:

```ts
// src/services/usersService.ts
import { get, post, put, del } from './httpClient';
export async function getAllUsers() { return await get('/getAllUsers'); }
export async function createUser(data) { return await post('/auth/Register', data); }
// ...
```

### 2. Hooks Reutilizables
- Se utiliza el hook `useApiRequest` para manejar loading, error y datos en cualquier petición:

```ts
const { data, loading, error, execute } = useApiRequest(getAllUsers);
useEffect(() => { execute(); }, [execute]);
```
- Esto permite componentes limpios y desacoplados de la lógica de red.

### 3. Componentes y Features
- Cada feature (usuarios, eventos, dashboard, etc.) tiene su propio directorio en `src/features/`.
- Los componentes usan los servicios y hooks para obtener y manipular datos.
- Ejemplo de listado:

```tsx
const { data: users, loading, error, execute: fetchUsers } = useApiRequest(getAllUsers);
useEffect(() => { fetchUsers(); }, [fetchUsers]);
return (
  <div>
    {loading && 'Cargando...'}
    {error && <span>{error}</span>}
    {users && users.map(u => <div key={u.userEmail}>{u.name}</div>)}
  </div>
);
```

### 4. Manejo Global de Errores y Autenticación
- El archivo `api.ts` configura Axios con interceptores para agregar el token JWT y manejar errores globales (401, etc).
- El hook `useAuth` gestiona la sesión y el usuario actual.

### 5. Estructura Recomendada de Carpetas
```
src/
  components/         // Componentes UI reutilizables
  features/
    auth/             // Login, registro, gestión de sesión
    dashboard/        // Dashboard principal
    users/            // CRUD de usuarios
    events/           // CRUD de eventos
    musicianRequests/ // CRUD de solicitudes directas
    images/           // CRUD de galería
    musicians/        // Perfiles de músicos
    admin/            // Herramientas superadmin
  hooks/              // Custom hooks (ej: useAuth, useApiRequest)
  store/              // Zustand stores
  services/           // Axios API services y httpClient centralizado
  routes/             // Definición de rutas
  theme/              // Configuración de tema y estilos globales
  utils/              // Utilidades generales
  App.tsx
  main.tsx
```

---

## Funcionalidades y Endpoints Clave

### 1. Autenticación y Gestión de Sesión
- POST `/auth/login`
- GET `/auth/verToken`
- POST `/auth/logout` (o limpiar token local)

### 2. Dashboard General
- Métricas y accesos rápidos a cada módulo CRUD.

### 3. Gestión de Usuarios (CRUD)
- POST `/auth/Register`
- GET `/getAllUsers`
- PUT `/auth/update/:userEmail`
- DELETE `/auth/delete/:userEmail`
- DELETE `/superAdmin/deleteAllUsers`

### 4. Gestión de Eventos y Matching (CRUD)
- POST `/events/request-musician`
- GET `/getAllEvents`
- ...otros endpoints según backend

### 5. Gestión de Solicitudes Directas de Músicos (CRUD)
- POST `/musician-requests/`
- GET `/getAllMusicianRequests`
- ...otros endpoints según backend

### 6. Gestión de Imágenes y Galería (CRUD)
- GET `/getAllImages`
- ...otros endpoints según backend

---

## Buenas Prácticas y Diseño
- **UI/UX:** Glassmorphism, gradientes, animaciones, responsive, feedback visual en todas las acciones.
- **Código:** Separación estricta de lógica de red, hooks reutilizables, servicios tipados, componentes limpios.
- **Escalabilidad:** Fácil de agregar nuevos módulos y endpoints.
- **Mantenimiento:** Cambios en la API solo requieren modificar los servicios, no los componentes.

---

## Ejemplo CRUD Completo (Usuarios)

### Listar usuarios
```tsx
import { useEffect } from 'react';
import { useApiRequest } from '../hooks/useApiRequest';
import { getAllUsers } from '../services/usersService';

const UsersList = () => {
  const { data: users, loading, error, execute: fetchUsers } = useApiRequest(getAllUsers);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  return (
    <div>
      {loading && 'Cargando...'}
      {error && <span>{error}</span>}
      {users && users.map(u => <div key={u.userEmail}>{u.name}</div>)}
    </div>
  );
};
```

### Crear usuario
```tsx
import { useApiRequest } from '../hooks/useApiRequest';
import { createUser } from '../services/usersService';

const { loading, error, execute: create } = useApiRequest(createUser);
const handleCreate = async (form) => {
  await create(form);
};
```

### Editar usuario
```tsx
import { useApiRequest } from '../hooks/useApiRequest';
import { updateUser } from '../services/usersService';

const { loading, error, execute: update } = useApiRequest(updateUser);
const handleUpdate = async (email, form) => {
  await update(email, form);
};
```

### Eliminar usuario
```tsx
import { useApiRequest } from '../hooks/useApiRequest';
import { deleteUserByEmail } from '../services/usersService';

const { loading, error, execute: remove } = useApiRequest(deleteUserByEmail);
const handleDelete = async (email) => {
  await remove(email);
};
```

---

## Troubleshooting / Preguntas Frecuentes

### 1. ¿Por qué recibo un error 404 al eliminar un usuario que aparece en la tabla?
- Asegúrate de enviar el email en minúsculas y sin espacios (`email.trim().toLowerCase()`).
- El backend busca por email exacto y lo guarda en minúsculas.
- Si el usuario ya fue eliminado, refresca la lista tras cada operación.

### 2. ¿Cómo manejo errores globales de autenticación?
- El interceptor de Axios en `api.ts` puede detectar errores 401 y forzar logout o mostrar un mensaje global.

### 3. ¿Cómo refresco los datos tras crear/editar/eliminar?
- Llama a la función `execute` del hook correspondiente después de la operación para recargar la lista.

### 4. ¿Cómo agrego nuevos endpoints o módulos?
- Crea un nuevo archivo de servicio en `src/services/` y expón funciones tipadas.
- Usa `useApiRequest` en tus componentes para consumirlos.

### 5. ¿Cómo centralizo el manejo de tokens?
- El token JWT se agrega automáticamente en cada request por el interceptor de Axios en `api.ts`.

### 6. ¿Cómo adapto la UI a la arquitectura?
- Usa los estados `loading`, `error` y `data` de los hooks para mostrar feedback visual y controlar la UI.

---

## Siguientes pasos sugeridos
1. Implementar login y protección de rutas.
2. Crear dashboard con navegación y tarjetas resumen.
3. Desarrollar CRUD de usuarios.
4. Desarrollar CRUD de eventos.
5. Desarrollar CRUD de solicitudes directas.
6. Desarrollar CRUD de imágenes.
7. Desarrollar gestión de perfiles de músicos.
8. Añadir herramientas de superadmin.
9. Pulir UI/UX y añadir animaciones/diseño futurista.
10. Testear y documentar cada módulo. 

---

## Guía de Pruebas Manuales para el CRUD de Usuarios

Sigue estos pasos para validar que todo el flujo de gestión de usuarios funciona correctamente. Puedes usar esta guía para pruebas manuales o como base para automatizar tests end-to-end en el futuro.

### 1. Listar usuarios
- Accede a la sección “Usuarios” desde el menú.
- Verifica que ves una tabla con los usuarios actuales.
- Si la tabla está vacía, debe aparecer el mensaje: “No hay usuarios para mostrar”.

### 2. Crear usuario
- Haz clic en el botón “+ Nuevo usuario”.
- Completa todos los campos del formulario (nombre, apellido, email, rol, contraseña).
- Haz clic en “Guardar”.
- Verifica:
  - El usuario aparece en la tabla.
  - El formulario se cierra y se limpia.
  - No aparecen errores.
- Intenta crear otro usuario con el mismo email: debe mostrar un error de “usuario ya existe”.

### 3. Editar usuario
- Haz clic en “Editar” en cualquier usuario.
- Cambia el nombre, rol o estado.
- Haz clic en “Guardar”.
- Verifica:
  - Los cambios se reflejan en la tabla.
  - El email no se puede editar.
  - El formulario se cierra y se limpia.
- Intenta guardar con campos vacíos o email inválido: debe mostrar error de validación.

### 4. Eliminar usuario
- Haz clic en “Eliminar” en cualquier usuario.
- Confirma en el modal.
- Verifica:
  - El usuario desaparece de la tabla.
  - Si intentas eliminarlo de nuevo, debe mostrar “Usuario no encontrado”.
- Refresca la lista y confirma que ya no aparece.

### 5. Buscar y paginar
- Usa el campo de búsqueda para filtrar usuarios.
- Cambia de página con los botones de paginación y verifica que los datos cambian correctamente.

### 6. Errores y feedback
- Desconecta el backend y prueba crear, editar o eliminar: debe mostrar mensajes de error claros.
- Intenta crear/editar con datos inválidos y verifica la validación.

---

## Guía de Pruebas Manuales para el CRUD de Eventos

### 1. Listar eventos
- Accede a la sección “Eventos” desde el menú.
- Verifica que ves una tabla/listado con los eventos actuales.
- Si la tabla está vacía, debe aparecer el mensaje: “No hay eventos para mostrar”.

### 2. Crear evento
- Haz clic en el botón “+ Nuevo evento”.
- Completa todos los campos requeridos del formulario (nombre, fecha, etc.).
- Haz clic en “Guardar”.
- Verifica:
  - El evento aparece en la tabla.
  - El formulario se cierra y se limpia.
  - No aparecen errores.
- Intenta crear un evento con datos inválidos o duplicados y verifica la validación.

### 3. Editar evento
- Haz clic en “Editar” en cualquier evento.
- Cambia algún dato (nombre, fecha, etc.).
- Haz clic en “Guardar”.
- Verifica:
  - Los cambios se reflejan en la tabla.
  - El formulario se cierra y se limpia.
- Intenta guardar con campos vacíos o datos inválidos: debe mostrar error de validación.

### 4. Eliminar evento
- Haz clic en “Eliminar” en cualquier evento.
- Confirma en el modal.
- Verifica:
  - El evento desaparece de la tabla.
  - Si intentas eliminarlo de nuevo, debe mostrar “Evento no encontrado”.
- Refresca la lista y confirma que ya no aparece.

### 5. Buscar y paginar
- Usa el campo de búsqueda para filtrar eventos.
- Cambia de página con los botones de paginación y verifica que los datos cambian correctamente.

### 6. Errores y feedback
- Desconecta el backend y prueba crear, editar o eliminar: debe mostrar mensajes de error claros.
- Intenta crear/editar con datos inválidos y verifica la validación.

---

## Guía de Pruebas Manuales para el CRUD de Imágenes

### 1. Listar imágenes
- Accede a la sección “Imágenes” desde el menú.
- Verifica que ves una galería o tabla con las imágenes actuales.
- Si no hay imágenes, debe aparecer el mensaje: “No hay imágenes para mostrar”.

### 2. Subir imagen
- Haz clic en el botón “Subir imagen” o arrastra una imagen al área correspondiente.
- Selecciona un archivo válido y súbelo.
- Verifica:
  - La imagen aparece en la galería/lista.
  - Se muestra una previsualización.
  - No aparecen errores.
- Intenta subir un archivo no permitido y verifica la validación.

### 3. Editar metadatos de imagen
- Haz clic en “Editar” en cualquier imagen.
- Cambia los metadatos (nombre, descripción, etc.).
- Haz clic en “Guardar”.
- Verifica que los cambios se reflejan correctamente.

### 4. Eliminar imagen
- Haz clic en “Eliminar” en cualquier imagen.
- Confirma en el modal.
- Verifica que la imagen desaparece de la galería/lista.
- Si intentas eliminarla de nuevo, debe mostrar “Imagen no encontrada”.

### 5. Buscar y paginar
- Usa el campo de búsqueda para filtrar imágenes.
- Cambia de página con los botones de paginación y verifica que los datos cambian correctamente.

### 6. Errores y feedback
- Desconecta el backend y prueba subir, editar o eliminar: debe mostrar mensajes de error claros.
- Intenta subir/editar con datos inválidos y verifica la validación.

---

## Guía de Pruebas Manuales para el CRUD de Solicitudes Directas de Músicos

### 1. Listar solicitudes
- Accede a la sección “Solicitudes” desde el menú.
- Verifica que ves una tabla/listado con las solicitudes actuales.
- Si la tabla está vacía, debe aparecer el mensaje: “No hay solicitudes para mostrar”.

### 2. Crear solicitud
- Haz clic en el botón “+ Nueva solicitud”.
- Completa todos los campos requeridos del formulario.
- Haz clic en “Guardar”.
- Verifica:
  - La solicitud aparece en la tabla.
  - El formulario se cierra y se limpia.
  - No aparecen errores.
- Intenta crear una solicitud con datos inválidos o duplicados y verifica la validación.

### 3. Editar solicitud
- Haz clic en “Editar” en cualquier solicitud.
- Cambia algún dato relevante.
- Haz clic en “Guardar”.
- Verifica que los cambios se reflejan en la tabla.
- Intenta guardar con campos vacíos o datos inválidos: debe mostrar error de validación.

### 4. Eliminar solicitud
- Haz clic en “Eliminar” en cualquier solicitud.
- Confirma en el modal.
- Verifica que la solicitud desaparece de la tabla.
- Si intentas eliminarla de nuevo, debe mostrar “Solicitud no encontrada”.

### 5. Buscar y paginar
- Usa el campo de búsqueda para filtrar solicitudes.
- Cambia de página con los botones de paginación y verifica que los datos cambian correctamente.

### 6. Errores y feedback
- Desconecta el backend y prueba crear, editar o eliminar: debe mostrar mensajes de error claros.
- Intenta crear/editar con datos inválidos y verifica la validación.

--- 