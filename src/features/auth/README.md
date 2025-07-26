# Módulo de Autenticación

Este módulo implementa la lógica y la interfaz para el proceso de autenticación de usuarios (admin, organizadores, músicos) en el sistema. Incluye el formulario de login, la gestión de estado de sesión y la integración con el backend para validar credenciales.

## Componente principal: `Auth`

El componente `Auth` es responsable de:
- Renderizar el formulario de login.
- Gestionar el estado de los campos de email y contraseña.
- Mostrar/ocultar la contraseña.
- Manejar errores y estados de carga.
- Realizar la autenticación contra el backend usando el servicio `login`.
- Almacenar el token y los datos del usuario autenticado en `localStorage`.
- Redirigir al dashboard tras un login exitoso.

## Hooks y dependencias utilizadas
- `useState` de React: para gestionar el estado local de los campos y flags.
- `useNavigate` de React Router: para la navegación programática tras el login.
- Servicio `login` de `authService`: realiza la petición de autenticación al backend.
- Estilos en `Login.css`.

## Explicación línea por línea de `index.tsx`

```tsx
1  import React, { useState } from 'react'; // Importa React y el hook useState para gestionar estado local.
2  import { login } from '../../services/authService'; // Importa la función login para autenticar usuarios.
3  import { useNavigate } from 'react-router-dom'; // Importa el hook para navegación programática.
4  import './Login.css'; // Importa los estilos específicos del formulario de login.

5  const Auth = () => { // Define el componente funcional Auth.
6    const [email, setEmail] = useState(''); // Estado para el email ingresado.
7    const [password, setPassword] = useState(''); // Estado para la contraseña ingresada.
8    const [showPassword, setShowPassword] = useState(false); // Flag para mostrar/ocultar contraseña.
9    const [error, setError] = useState(''); // Estado para mensajes de error.
10   const [loading, setLoading] = useState(false); // Flag para indicar si la petición está en curso.
11   const navigate = useNavigate(); // Hook para redireccionar tras login exitoso.

12   const handleLogin = async (e: React.FormEvent) => { // Función manejadora del submit del formulario.
13     e.preventDefault(); // Previene el comportamiento por defecto del form.
14     setError(''); // Limpia errores previos.
15     setLoading(true); // Activa el estado de carga.
16     try {
17       if (!email || !password) { // Valida que ambos campos estén completos.
18         setError('Por favor, completa todos los campos.');
19         setLoading(false);
20         return;
21       }
22       // Usar los nombres de campo correctos
23       const data = await login(email, password); // Llama al servicio de login.
24       if (data.token) { // Si la respuesta contiene token...
25         localStorage.setItem('token', data.token); // Guarda el token en localStorage.
26         if (data.user) {
27           localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario autenticado.
28         }
29         setError(''); // Limpia errores.
30         navigate('/'); // Redirige al dashboard.
31       } else {
32         setError('Respuesta inesperada del servidor.');
33       }
34     } catch (err: any) {
35       setError(err.response?.data?.message || 'Error de autenticación.'); // Muestra error de backend o genérico.
36     } finally {
37       setLoading(false); // Desactiva el estado de carga.
38     }
39   };

40   return (
41     <div className="login-gradient-bg"> {/* Fondo con gradiente */}
42       <form className="login-glass" onSubmit={handleLogin}> {/* Formulario con efecto glassmorphism */}
43         <h2 className="login-title">MussikOn Admin</h2>
44         <div className="login-field"> {/* Campo de email */}
45           <label>Email</label>
46           <input
47             type="email"
48             value={email}
49             onChange={e => setEmail(e.target.value)}
50             autoFocus
51             autoComplete="username"
52             required
53           />
54         </div>
55         <div className="login-field"> {/* Campo de contraseña */}
56           <label>Contraseña</label>
57           <div className="login-password-wrapper">
58             <input
59               type={showPassword ? 'text' : 'password'}
60               value={password}
61               onChange={e => setPassword(e.target.value)}
62               autoComplete="current-password"
63               required
64             />
65             <button
66               type="button"
67               className="login-showpass"
68               onClick={() => setShowPassword(v => !v)}
69               tabIndex={-1}
70               aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
71             >
72               {showPassword ? '🙈' : '👁️'}
73             </button>
74           </div>
75         </div>
76         {error && <div className="login-error">{error}</div>} {/* Muestra errores si existen */}
77         <button className="login-btn" type="submit" disabled={loading}>
78           {loading ? 'Entrando...' : 'Entrar'}
79         </button>
80       </form>
81     </div>
82   );
83 };

84 export default Auth; // Exporta el componente para su uso en el ruteo.
```

---

Consulta DOCUMENTACION.md en la raíz del proyecto para detalles de endpoints y prioridades. 