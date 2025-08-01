# Sistema Centralizado de Sombras - UI/UX

## Descripción

Este documento describe el sistema centralizado de sombras implementado para eliminar las sombras excesivas y parpadeos en la interfaz de usuario, proporcionando una experiencia visual más limpia y profesional.

## Ubicación

El sistema de sombras está definido en: `src/theme/buttonStyles.ts`

## Estilos Disponibles

### Sombras Básicas

```typescript
export const shadowStyles = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',      // Sombra sutil para elementos básicos
  medium: '0 4px 12px rgba(0, 0, 0, 0.15)',    // Sombra media para hover
  strong: '0 8px 24px rgba(0, 0, 0, 0.2)',     // Sombra fuerte para modales/drawers
  none: 'none'                                  // Sin sombra
};
```

### Sombras Coloreadas

```typescript
// Función para generar sombras con colores específicos
shadowStyles.colored(color: string, opacity: number = 0.2)
shadowStyles.hover(color: string, opacity: number = 0.3)
```

## Uso en Componentes

### Importación

```typescript
import { buttonStyles, shadowStyles } from '../theme/buttonStyles';
```

### Aplicación Directa

```typescript
// En un componente
<Box sx={{ boxShadow: shadowStyles.subtle }}>
  Contenido
</Box>
```

### En Estilos de Botones

```typescript
// Los estilos de botones ya incluyen las sombras optimizadas
<Button sx={buttonStyles.primary}>
  Botón Primario
</Button>
```

## Componentes Actualizados

### Sidebar
- ✅ Botón de expandir/contraer: `buttonStyles.sidebarIcon`
- ✅ Botón móvil (hamburger): `buttonStyles.sidebarMobile`
- ✅ Drawer móvil: `shadowStyles.strong`

### Botones del Sistema
- ✅ Botón primario: `buttonStyles.primary`
- ✅ Botón secundario: `buttonStyles.secondary`
- ✅ Botón de peligro: `buttonStyles.danger`
- ✅ Botón de texto: `buttonStyles.text`
- ✅ Botón pequeño: `buttonStyles.small`
- ✅ Botón de icono: `buttonStyles.icon`

### Cards y Contenedores
- ✅ Cards por defecto: `cardStyles.default`
- ✅ Cards oscuros: `cardStyles.dark`

## Beneficios

1. **Consistencia Visual**: Todas las sombras siguen el mismo patrón
2. **Mantenibilidad**: Cambios centralizados en un solo archivo
3. **Rendimiento**: Sombras optimizadas que no causan parpadeos
4. **Accesibilidad**: Contraste adecuado sin distracciones visuales
5. **Responsividad**: Sombras que se adaptan a diferentes dispositivos

## Migración de Estilos Antiguos

### Antes (Sombras Excesivas)
```typescript
boxShadow: '0 0 20px rgba(0, 255, 247, 0.4)',
boxShadow: '0 0 25px rgba(0, 255, 247, 0.6)',
```

### Después (Sombras Sutiles)
```typescript
boxShadow: shadowStyles.subtle,
boxShadow: shadowStyles.medium,
```

## Recomendaciones

1. **Usar `shadowStyles.subtle`** para elementos básicos y botones
2. **Usar `shadowStyles.medium`** para efectos hover
3. **Usar `shadowStyles.strong`** solo para modales y drawers
4. **Evitar sombras inline** - siempre usar el sistema centralizado
5. **Probar en diferentes dispositivos** para asegurar consistencia

## Próximos Pasos

- [ ] Migrar sombras restantes en componentes de eventos
- [ ] Migrar sombras restantes en componentes de músicos
- [ ] Migrar sombras restantes en componentes de solicitudes
- [ ] Migrar sombras restantes en componentes de usuarios móviles
- [ ] Migrar sombras restantes en componentes de imágenes
- [ ] Crear pruebas visuales para validar consistencia

## Comandos Útiles

### Buscar Sombras Excesivas
```bash
grep -r "boxShadow.*0.*[0-9]+px" src/ --include="*.tsx"
```

### Buscar Sombras con Colores Específicos
```bash
grep -r "boxShadow.*rgba.*0\.255.*247" src/ --include="*.tsx"
```

## Contacto

Para preguntas sobre el sistema de sombras, consultar la documentación de UI/UX o crear un issue en el repositorio. 