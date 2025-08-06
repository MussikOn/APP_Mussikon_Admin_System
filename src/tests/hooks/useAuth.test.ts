import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../../hooks/useAuth'

// Mock del servicio authService
vi.mock('../../services/authService', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    isTokenExpired: vi.fn(),
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  }
}))

// Mock del localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false) // El loading se maneja internamente
      expect(result.current.error).toBe('')
    })
  })

  describe('Session Check', () => {
    it('should set user when valid token exists', async () => {
      const mockUser = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        userEmail: 'john@example.com',
        roll: 'admin',
        status: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const mockToken = 'valid-jwt-token'
      localStorageMock.getItem.mockReturnValue(mockToken)

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.isTokenExpired).mockReturnValue(false)
      vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBe('')
    })

    it('should clear session when token is invalid', async () => {
      const mockToken = 'invalid-jwt-token'
      localStorageMock.getItem.mockReturnValue(mockToken)

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.isAuthenticated).mockReturnValue(false)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('should clear session when token is expired', async () => {
      const mockToken = 'expired-jwt-token'
      localStorageMock.getItem.mockReturnValue(mockToken)

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.isTokenExpired).mockReturnValue(true)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        _id: '123',
        name: 'John',
        lastName: 'Doe',
        userEmail: 'john@example.com',
        roll: 'admin',
        status: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        message: 'Login successful',
        token: 'new-jwt-token',
        user: mockUser
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login('john@example.com', 'password123')
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBe('')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-jwt-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should handle login error', async () => {
      const { authService } = await import('../../services/authService')
      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login('invalid@example.com', 'wrongpass')
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toBe('Invalid credentials')
    })
  })

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const { authService } = await import('../../services/authService')
      vi.mocked(authService.logout).mockImplementation(async () => {
        localStorageMock.removeItem('token')
        localStorageMock.removeItem('user')
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('User from Token', () => {
    it('should extract user from JWT token when user not in localStorage', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjMiLCJuYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lLCJ1c2VyRW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sbCI6ImFkbWluIn0.mock'
      localStorageMock.getItem
        .mockReturnValueOnce(mockToken) // token
        .mockReturnValueOnce(null) // user

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.isTokenExpired).mockReturnValue(false)
      vi.mocked(authService.getCurrentUser).mockReturnValue(null)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeTruthy()
      expect(result.current.user?.userEmail).toBe('john@example.com')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', expect.any(String))
    })

    it('should handle invalid JWT token', async () => {
      const invalidToken = 'invalid-token'
      localStorageMock.getItem
        .mockReturnValueOnce(invalidToken) // token
        .mockReturnValueOnce(null) // user

      const { authService } = await import('../../services/authService')
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.isTokenExpired).mockReturnValue(false)
      vi.mocked(authService.getCurrentUser).mockReturnValue(null)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    })
  })
}) 