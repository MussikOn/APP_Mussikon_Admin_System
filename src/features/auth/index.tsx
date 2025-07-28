import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Por favor, completa todos los campos.');
        setLoading(false);
        return;
      }
      // Usar los nombres de campo correctos
      const data = await login({ userEmail: email, userPassword: password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setError('');
        navigate('/');
      } else {
        setError('Respuesta inesperada del servidor.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-gradient-bg">
      <form className="login-glass" onSubmit={handleLogin}>
        <h2 className="login-title">MussikOn Admin</h2>
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            autoComplete="username"
            required
          />
        </div>
        <div className="login-field">
          <label>Contraseña</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login-showpass"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Auth; 