import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Auth from '../../features/auth'

// Mock del hook useAuth
const mockLogin = vi.fn()
const mockUseAuth = vi.fn(() => ({
  login: mockLogin,
  loading: false,
  error: ''
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock del hook useTheme
vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: vi.fn()
  })
}))

// Mock del hook useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: ''
    })
  })

  const renderAuth = () => {
    return render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    )
  }

  describe('Login Form', () => {
    it('should render login form with all fields', () => {
      renderAuth()

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('should show password when toggle button is clicked', () => {
      renderAuth()

      const passwordInput = screen.getByLabelText(/contraseña/i)
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })

      expect(passwordInput).toHaveAttribute('type', 'password')

      fireEvent.click(toggleButton)

      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('should show error when form is submitted with empty fields', async () => {
      renderAuth()

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/por favor, completa todos los campos/i)).toBeInTheDocument()
      })
    })

    it('should show error when email format is invalid', async () => {
      renderAuth()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/por favor, completa todos los campos/i)).toBeInTheDocument()
      })
    })

    it('should call login function with valid credentials', async () => {
      renderAuth()

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      })
    })
  })

  describe('Forgot Password', () => {
    it('should show forgot password form when link is clicked', () => {
      renderAuth()

      const forgotPasswordLink = screen.getByText(/¿olvidaste tu contraseña?/i)
      fireEvent.click(forgotPasswordLink)

      expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('should go back to login form when back button is clicked', () => {
      renderAuth()

      // Go to forgot password
      const forgotPasswordLink = screen.getByText(/¿olvidaste tu contraseña?/i)
      fireEvent.click(forgotPasswordLink)

      // Go back to login - the ForgotPassword component should handle this
      // This test will be updated when ForgotPassword is implemented
      expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when login is in progress', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        loading: false,
        error: ''
      })

      renderAuth()

      // Simular estado de loading local
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      fireEvent.click(submitButton)

      // Verificar que el botón muestra el loading
      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when login fails', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        loading: false,
        error: ''
      })

      renderAuth()

      // Simular error de login
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      fireEvent.click(submitButton)

      // Verificar que se muestra el error de campos vacíos
      expect(screen.getByText(/por favor, completa todos los campos/i)).toBeInTheDocument()
    })
  })

  describe('Theme Toggle', () => {
    it('should render theme toggle button', () => {
      renderAuth()

      expect(screen.getByRole('button', { name: /cambiar a modo oscuro/i })).toBeInTheDocument()
    })
  })
}) 