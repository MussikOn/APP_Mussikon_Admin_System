// Configuración de tests para Jest y React Testing Library
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage;
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage;
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock de fetch
Object.defineProperty(window, 'fetch', {
  value: vi.fn()
});

// Mock de ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
});

// Mock de IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
});

// Configuración de entorno de test
process.env.NODE_ENV = 'test';
process.env.VITE_API_BASE_URL = 'http://localhost:3001'; 