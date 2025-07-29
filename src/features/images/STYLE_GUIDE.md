# 🎨 Guía de Estilo UI/UX — Admin de Imágenes

## 1. Paleta de Colores
- **Fondo principal:**
  - Degradado radial/linear: `#0a0a23` → `#181c3a` → `#1a1a2e`
- **Acentos y gradientes:**
  - Primario: `#7f5fff`
  - Secundario: `#00e0ff`
  - Extra: `#ff2eec`, `#b993d6`, `#00fff7`
- **Tarjetas y paneles:**
  - Fondo glassmorfismo: `rgba(24,28,58,0.85)` + `backdrop-filter: blur(12px)`
  - Bordes: `1px solid rgba(255,255,255,0.18)`
  - Sombra: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`
- **Texto:**
  - Títulos: `#fff`
  - Secundario: `#b0b8c1`
  - Descripciones: `#b0b8c1`, `#888`

---

## 2. Tipografía
- **Fuente:** `Poppins, Inter, Arial, sans-serif`
- **Títulos:**
  - Peso: 700-800
  - Tamaño: grande, con letter-spacing negativo
- **Botones:**
  - Peso: 700
  - Sin transformación de texto
- **Cuerpo:**
  - Regular, alto contraste

---

## 3. Componentes y Layout

### Header
- Logo a la izquierda, navegación centrada, botón destacado a la derecha
- Fondo degradado, glassmorfismo, sombra

### Hero
- Título grande, subtítulo, botón CTA, imagen/ilustración a la derecha
- Fondo con gradiente y/o imagen decorativa

### Estadísticas
- Tarjetas glassmorfismo, números grandes, iconos, colores de acento

### Galería de Imágenes
- Grid responsivo, tarjetas flotantes con:
  - Imagen (con border-radius)
  - Nombre, descripción, categoría, tamaño
  - Chips de categoría y tamaño
  - Botones de acción (ver, editar, eliminar) con gradiente
  - Hover: sombra y escala
- Filtros arriba: chips, selectores, búsqueda prominente

### Usuarios/Artistas Destacados
- Avatares circulares, nombres, stats, tarjetas glass

### Footer
- Fondo degradado, links, redes sociales, info legal

---

## 4. Ejemplo de Tarjeta de Imagen
```tsx
<Card sx={{
  p: 2,
  borderRadius: 4,
  background: 'rgba(31, 38, 135, 0.15)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.18)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 16px 40px 0 rgba(31, 38, 135, 0.37)',
  }
}}>
  <img src={image.url} alt={image.originalName} style={{
    width: '100%', borderRadius: 16, marginBottom: 16, objectFit: 'cover', height: 180
  }} />
  <Typography variant='h6' sx={{ color: '#fff', fontWeight: 700 }}>{image.originalName}</Typography>
  <Typography variant='body2' sx={{ color: '#b0b8c1' }}>{image.description}</Typography>
  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
    <Chip label={image.category} color='primary' size='small' />
    <Chip label={image.size + ' KB'} color='secondary' size='small' />
  </Box>
  <Button variant='contained' sx={{
    mt: 2, background: 'linear-gradient(90deg,#7f5fff,#00e0ff)', color: '#fff', fontWeight: 700
  }}>Ver Detalles</Button>
</Card>
```

---

## 5. Animaciones y Detalles
- **Hover:** Sombra y escala en tarjetas y botones
- **Transiciones:** Suaves en cambios de estado
- **Botones:** Gradiente, sombra, feedback visual
- **Inputs:** Bordes redondeados, fondo translúcido, foco con acento

---

## 6. Experiencia de Usuario
- **Accesibilidad:** Contraste alto, foco visible, textos descriptivos
- **Responsivo:** Todo el layout debe adaptarse a móvil/tablet/escritorio
- **Feedback:** Mensajes claros de éxito/error, loaders animados

---

## 7. Inspiración visual
- NFT marketplaces modernos (ej: OpenSea, Rarible)
- Glassmorfismo, neumorfismo, gradientes vivos
- Tarjetas flotantes, avatares, iconografía bold 