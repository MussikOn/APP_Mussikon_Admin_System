# Gestión de Eventos

Este módulo implementa la gestión de eventos en el sistema. Permite listar eventos, mostrando nombre y fecha, y está preparado para extenderse a crear, editar, eliminar, asignar músicos y ver historial. Se integra con el backend para obtener los datos y maneja estados de carga y error.

## Componente principal: `Events`

El componente `Events` es responsable de:
- Renderizar la tabla de eventos registrados.
- Mostrar mensajes de carga y error.
- Integrarse con los servicios de backend para obtener la lista de eventos.

## Hooks y dependencias utilizadas
- `useEffect` de React: para ejecutar efectos secundarios al montar el componente.
- **Hook global `useApiRequest`:** Abstrae la lógica de peticiones asíncronas y maneja estados de carga y error.
- Servicio `getAllEvents` de `eventsService`: para obtener los eventos desde la API.
- Estilos en `events.css` (si aplica).

## Explicación línea por línea de `index.tsx`

```tsx
1  import { useEffect } from 'react'; // Importa useEffect para efectos secundarios.
2  import { useApiRequest } from '../../hooks/useApiRequest'; // Importa el hook para peticiones API.
3  import { getAllEvents } from '../../services/eventsService'; // Importa la función para obtener eventos.
4  import type { Event } from '../../services/eventsService'; // Importa el tipo Event.

5  const Events = () => { // Componente funcional principal.
6    const { data: events, loading, error, execute: fetchEvents } = useApiRequest(getAllEvents); // Hook para obtener eventos.

7    useEffect(() => {
8      fetchEvents(); // Obtiene eventos al montar el componente.
9    }, [fetchEvents]);

10   return (
11     <div className="events-container glass-panel">
12       <h2 style={{ marginBottom: 24 }}>Eventos</h2>
13       {loading && <div style={{ color: '#00fff7', fontWeight: 600, margin: '24px 0' }}>Cargando eventos...</div>}
14       {error && <div style={{ color: '#ff5252', margin: '24px 0' }}>{error}</div>}
15       {!loading && !error && events && (
16         <table className="events-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
17           <thead>
18             <tr>
19               <th>Nombre</th>
20               <th>Fecha</th>
21             </tr>
22           </thead>
23           <tbody>
24             {events.length === 0 ? (
25               <tr><td colSpan={2} style={{ textAlign: 'center', color: '#b0b8c1', fontSize: 17, padding: 32 }}>No hay eventos para mostrar.</td></tr>
26             ) : events.map((e: Event, i: number) => (
27               <tr key={i}>
28                 <td>{e.name}</td>
29                 <td>{e.date}</td>
30               </tr>
31             ))}
32           </tbody>
33         </table>
34       )}
35     </div>
36   );
37 };

38 export default Events; // Exporta el componente para su uso en el ruteo.
```

---

Consulta DOCUMENTACION.md en la raíz del proyecto para detalles de endpoints y prioridades. 