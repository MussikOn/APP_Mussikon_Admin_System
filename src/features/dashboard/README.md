# Dashboard

Este módulo implementa la vista principal del sistema admin. Muestra métricas clave (usuarios, eventos, solicitudes, imágenes), últimos registros, distribución de roles y accesos rápidos a los módulos CRUD. Actualiza automáticamente las métricas cada 10 minutos y adapta el diseño a dispositivos móviles o escritorio.

## Componente principal: `Dashboard`

El componente `Dashboard` es responsable de:
- Renderizar tarjetas de métricas para usuarios, eventos, solicitudes e imágenes.
- Mostrar actividad reciente (últimos usuarios, eventos, solicitudes).
- Visualizar la distribución de roles mediante un gráfico circular.
- Proveer accesos rápidos a los módulos principales.
- Actualizar automáticamente los datos cada 10 minutos.
- Adaptar el diseño a dispositivos móviles o escritorio.

## Hooks y dependencias utilizadas
- `useAuth`: para mostrar información del usuario autenticado.
- `useApiRequest`: para obtener métricas y datos recientes de la API.
- `useNavigate` de React Router: para navegación programática.
- `useEffect`, `useRef`: para efectos secundarios y temporizadores.
- Estilos en línea y clases CSS.

## Explicación línea por línea de `index.tsx`

```tsx
1-9   // Importaciones de hooks, servicios y utilidades para métricas, navegación y datos.
11    // Definición de tarjetas de métricas con label, color y ruta.
13    const Dashboard = () => { // Componente funcional principal.
14-18   // Obtención de usuario autenticado y navegación.
19-44   // Definición de hooks useApiRequest para obtener métricas y datos recientes de usuarios, eventos, solicitudes e imágenes.
45-61   // useEffect para cargar datos al montar y cada 10 minutos (intervalo), y limpiar el intervalo al desmontar.
62-68   // Procesamiento de datos recientes y distribución de roles.
69-74   // Funciones auxiliares para navegación y refresco manual de datos.
75-77   // Detección de dispositivo móvil para adaptar el diseño.
78-369 // Renderizado del dashboard: tarjetas de métricas, actividad reciente, gráfico de roles y accesos rápidos.
371-389 // Componente auxiliar RolesPieChart: genera un gráfico circular SVG para la distribución de roles.
391    export default Dashboard; // Exporta el componente para su uso en el ruteo.
```

---

Consulta DOCUMENTACION.md en la raíz del proyecto para detalles de diseño y prioridades. 