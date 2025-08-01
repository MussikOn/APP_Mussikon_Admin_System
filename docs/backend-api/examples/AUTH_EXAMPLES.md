# 🔐 Ejemplos de Autenticación - APP_Mussikon_Express

## 📋 Índice
- [Configuración Inicial](#configuración-inicial)
- [Registro de Usuario](#registro-de-usuario)
- [Login y Gestión de Sesión](#login-y-gestión-de-sesión)
- [Recuperación de Contraseña](#recuperación-de-contraseña)
- [Gestión de Perfil](#gestión-de-perfil)
- [Manejo de Errores](#manejo-de-errores)
- [Integración Completa](#integración-completa)

---

## ⚙️ Configuración Inicial

### 1. Configuración del Cliente HTTP

```javascript
// Configuración base para todas las requests
const API_BASE_URL = 'https://tu-backend.com/api/v1';

// Cliente HTTP con interceptores
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Interceptor para agregar token automáticamente
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Manejar token expirado
      if (response.status === 401) {
        this.handleTokenExpired();
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Error en la request');
      }

      return data;
    } catch (error) {
      console.error('Error en request:', error);
      throw error;
    }
  }

  // Manejar token expirado
  handleTokenExpired() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Actualizar token
  updateToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }
}

// Instancia global del cliente
const apiClient = new ApiClient();
```

### 2. Configuración con Axios

```javascript
import axios from 'axios';

// Configuración de Axios
const api = axios.create({
  baseURL: 'https://tu-backend.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 👤 Registro de Usuario

### 1. Registro Básico

```javascript
// Función de registro básica
const registerUser = async (userData) => {
  try {
    const response = await apiClient.request('/auth/Register', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        lastName: userData.lastName,
        roll: userData.roll,
        userEmail: userData.email,
        userPassword: userData.password,
        status: true
      })
    });

    // Guardar token y datos del usuario
    apiClient.updateToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Uso
const handleRegister = async () => {
  try {
    const result = await registerUser({
      name: 'Juan',
      lastName: 'Pérez',
      roll: 'user',
      email: 'juan.perez@email.com',
      password: 'MiContraseña*123'
    });

    console.log('Usuario registrado:', result.user);
    alert('Registro exitoso');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

### 2. Registro con Validaciones

```javascript
// Validaciones de registro
const validateRegistration = (userData) => {
  const errors = [];

  // Validar nombre
  if (!userData.name || userData.name.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  // Validar apellido
  if (!userData.lastName || userData.lastName.length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push('Email inválido');
  }

  // Validar contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!userData.password || !passwordRegex.test(userData.password)) {
    errors.push('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales');
  }

  // Validar rol
  const validRoles = ['user', 'musician', 'admin', 'super_admin'];
  if (!userData.roll || !validRoles.includes(userData.roll)) {
    errors.push('Rol inválido');
  }

  return errors;
};

// Registro con validaciones
const registerUserWithValidation = async (userData) => {
  // Validar datos
  const errors = validateRegistration(userData);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  // Realizar registro
  return await registerUser(userData);
};
```

### 3. Registro con UI React

```jsx
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    roll: 'user',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar contraseñas
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const result = await registerUserWithValidation({
        name: formData.name,
        lastName: formData.lastName,
        roll: formData.roll,
        email: formData.email,
        password: formData.password
      });

      console.log('Registro exitoso:', result);
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Registro de Usuario</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Apellido:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Rol:</label>
        <select name="roll" value={formData.roll} onChange={handleChange}>
          <option value="user">Usuario</option>
          <option value="musician">Músico</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Confirmar Contraseña:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
```

---

## 🔑 Login y Gestión de Sesión

### 1. Login Básico

```javascript
// Función de login básica
const loginUser = async (email, password) => {
  try {
    const response = await apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: email,
        userPassword: password
      })
    });

    // Guardar token y datos del usuario
    apiClient.updateToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Uso
const handleLogin = async (email, password) => {
  try {
    const result = await loginUser(email, password);
    console.log('Login exitoso:', result.user);
    
    // Redirigir según el rol
    const redirectPath = result.user.roll === 'admin' ? '/admin' : '/dashboard';
    window.location.href = redirectPath;
  } catch (error) {
    alert(`Error de login: ${error.message}`);
  }
};
```

### 2. Login con Persistencia

```javascript
// Clase para gestión de sesión
class SessionManager {
  constructor() {
    this.checkSession();
  }

  // Verificar si hay sesión activa
  checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // Verificar si el token no ha expirado
      try {
        const userData = JSON.parse(user);
        const tokenData = this.parseJwt(token);
        
        if (tokenData.exp * 1000 < Date.now()) {
          this.logout();
          return false;
        }

        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    }

    return false;
  }

  // Parsear JWT token
  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  // Login con persistencia
  async login(email, password) {
    try {
      const response = await loginUser(email, password);
      
      // Guardar en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Configurar cliente
      apiClient.updateToken(response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiClient.token = null;
    window.location.href = '/login';
  }

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return this.checkSession();
  }

  // Verificar rol
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.roll === role;
  }
}

// Instancia global
const sessionManager = new SessionManager();
```

### 3. Login con React Hook

```jsx
import React, { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};

// Componente de login
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

---

## 🔄 Recuperación de Contraseña

### 1. Proceso Completo de Recuperación

```javascript
// Clase para gestión de recuperación de contraseña
class PasswordRecovery {
  constructor() {
    this.step = 1; // 1: solicitar email, 2: verificar código, 3: nueva contraseña
  }

  // Paso 1: Solicitar código de recuperación
  async requestRecoveryCode(email) {
    try {
      const response = await apiClient.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ userEmail: email })
      });

      this.email = email;
      this.step = 2;
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Paso 2: Verificar código
  async verifyCode(code) {
    try {
      const response = await apiClient.request('/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({
          userEmail: this.email,
          code: code
        })
      });

      this.verifiedCode = code;
      this.step = 3;
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Paso 3: Establecer nueva contraseña
  async resetPassword(newPassword) {
    try {
      const response = await apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          userEmail: this.email,
          code: this.verifiedCode,
          newPassword: newPassword
        })
      });

      this.step = 1; // Resetear para futuras recuperaciones
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Obtener paso actual
  getCurrentStep() {
    return this.step;
  }

  // Validar contraseña
  validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  }
}

// Instancia global
const passwordRecovery = new PasswordRecovery();
```

### 2. UI de Recuperación con React

```jsx
import React, { useState } from 'react';

const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await passwordRecovery.requestRecoveryCode(email);
      setStep(2);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await passwordRecovery.verifyCode(code);
      setStep(3);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar contraseñas
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!passwordRecovery.validatePassword(newPassword)) {
      setError('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales');
      setLoading(false);
      return;
    }

    try {
      await passwordRecovery.resetPassword(newPassword);
      alert('Contraseña actualizada exitosamente');
      window.location.href = '/login';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-recovery">
      <h2>Recuperar Contraseña</h2>
      
      {error && <div className="error">{error}</div>}
      
      {step === 1 && (
        <form onSubmit={handleRequestCode}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <div className="form-group">
            <label>Código de Verificación:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      )}
    </div>
  );
};
```

---

## 👤 Gestión de Perfil

### 1. Actualización de Perfil

```javascript
// Función para actualizar perfil
const updateProfile = async (userEmail, updateData) => {
  try {
    const response = await apiClient.request(`/auth/update/${userEmail}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    // Actualizar datos en localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...response.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return response;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

// Uso
const handleUpdateProfile = async (userData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const result = await updateProfile(currentUser.userEmail, userData);
    
    console.log('Perfil actualizado:', result.user);
    alert('Perfil actualizado exitosamente');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

### 2. Obtener Datos de Usuario

```javascript
// Función para obtener datos de usuario
const getUserByEmail = async (userEmail) => {
  try {
    const response = await apiClient.request(`/auth/user/${userEmail}`, {
      method: 'GET'
    });

    return response.user;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

// Uso
const loadUserProfile = async (userEmail) => {
  try {
    const user = await getUserByEmail(userEmail);
    console.log('Datos del usuario:', user);
    return user;
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    throw error;
  }
};
```

### 3. Componente de Perfil con React

```jsx
import React, { useState, useEffect } from 'react';

const ProfileForm = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar datos del usuario actual
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || ''
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await handleUpdateProfile(formData);
      // Recargar datos del usuario
      const updatedUser = await loadUserProfile(user.userEmail);
      setUser(updatedUser);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="profile-form">
      <h2>Mi Perfil</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={user.userEmail}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <input
            type="text"
            value={user.roll}
            disabled
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Perfil'}
        </button>
      </form>
    </div>
  );
};
```

---

## ⚠️ Manejo de Errores

### 1. Clase de Manejo de Errores

```javascript
// Clase para manejo centralizado de errores
class AuthErrorHandler {
  static handleError(error, context = '') {
    console.error(`Error en ${context}:`, error);

    // Errores específicos de autenticación
    if (error.message.includes('contraseña')) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
    }

    if (error.message.includes('email')) {
      return 'Formato de email inválido';
    }

    if (error.message.includes('ya existe')) {
      return 'Ya existe un usuario con este email';
    }

    if (error.message.includes('Credenciales incorrectas')) {
      return 'Email o contraseña incorrectos';
    }

    if (error.message.includes('no encontrado')) {
      return 'Usuario no encontrado';
    }

    if (error.message.includes('Código inválido')) {
      return 'Código de verificación inválido o expirado';
    }

    // Errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet';
    }

    // Error genérico
    return error.message || 'Error inesperado. Intenta nuevamente';
  }

  static showError(message, type = 'error') {
    // Implementar según tu sistema de notificaciones
    if (type === 'error') {
      alert(message);
    } else {
      console.log(message);
    }
  }

  static showSuccess(message) {
    // Implementar según tu sistema de notificaciones
    alert(message);
  }
}
```

### 2. Hook de Manejo de Errores

```jsx
import { useState, useCallback } from 'react';

const useAuthError = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsyncOperation = useCallback(async (operation, successMessage = '') => {
    setError('');
    setLoading(true);

    try {
      const result = await operation();
      
      if (successMessage) {
        AuthErrorHandler.showSuccess(successMessage);
      }
      
      return result;
    } catch (error) {
      const errorMessage = AuthErrorHandler.handleError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    error,
    loading,
    handleAsyncOperation,
    clearError
  };
};

// Uso en componentes
const LoginComponent = () => {
  const { error, loading, handleAsyncOperation } = useAuthError();

  const handleLogin = async (email, password) => {
    await handleAsyncOperation(
      () => loginUser(email, password),
      'Login exitoso'
    );
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* Resto del formulario */}
    </div>
  );
};
```

---

## 🔧 Integración Completa

### 1. Context de Autenticación

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await updateProfile(user.userEmail, updateData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 2. Componente de Ruta Protegida

```jsx
import React from 'react';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  if (requiredRole && user.roll !== requiredRole) {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  return children;
};

// Uso
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Router>
    </AuthProvider>
  );
};
```

---

## 📝 Notas Importantes

1. **Seguridad**: Siempre valida los datos en el frontend y backend.
2. **Tokens**: Maneja la expiración de tokens automáticamente.
3. **Errores**: Implementa un sistema robusto de manejo de errores.
4. **UX**: Proporciona feedback claro al usuario en cada paso.
5. **Persistencia**: Guarda el estado de autenticación apropiadamente.

---

*Última actualización: Enero 2025* 