import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../services/authService'

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

// Mock de axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            _id: '123',
            name: 'John',
            lastName: 'Doe',
            userEmail: 'john@example.com',
            roll: 'admin',
            status: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          msg: 'Login successful'
        }
      }

      const { default: axios } = await import('axios')
      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse)

      const result = await authService.login({ userEmail: 'john@example.com', userPassword: 'password123' })

      expect(result.success).toBe(true)
      expect(result.token).toBe('mock-jwt-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token')
    })

    it('should throw error with invalid credentials', async () => {
      const { default: axios } = await import('axios')
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          data: { msg: 'Invalid credentials' }
        }
      })

      await expect(authService.login({ userEmail: 'invalid@example.com', userPassword: 'wrongpass' }))
        .rejects.toThrow('Invalid credentials')
    })
  })

  describe('logout', () => {
    it('should clear localStorage and user data', () => {
      authService.logout()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists and is not expired', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.mock'
      localStorageMock.getItem.mockReturnValue(mockToken)

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.isAuthenticated()).toBe(false)
    })

    it('should return false when token is expired', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.expired'
      localStorageMock.getItem.mockReturnValue(expiredToken)

      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
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
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      expect(authService.getCurrentUser()).toEqual(mockUser)
    })

    it('should return null when user does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.getCurrentUser()).toBeNull()
    })
  })


}) 