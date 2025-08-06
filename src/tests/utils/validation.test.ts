import { describe, it, expect } from 'vitest'
import { Validator, UserValidationRules, EventValidationRules, ImageValidationRules } from '../../utils/validation'

describe('Validator', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      const result = Validator.validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty email', () => {
      const result = Validator.validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El email es requerido')
    })

    it('should reject invalid email format', () => {
      const result = Validator.validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El formato del email no es válido')
    })

    it('should reject email without domain', () => {
      const result = Validator.validateEmail('test@')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El formato del email no es válido')
    })
  })

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = Validator.validatePassword('StrongPass123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty password', () => {
      const result = Validator.validatePassword('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña es requerida')
    })

    it('should reject password shorter than 8 characters', () => {
      const result = Validator.validatePassword('Short1')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres')
    })

    it('should reject password without lowercase', () => {
      const result = Validator.validatePassword('STRONGPASS123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe contener al menos una letra minúscula')
    })

    it('should reject password without uppercase', () => {
      const result = Validator.validatePassword('strongpass123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe contener al menos una letra mayúscula')
    })

    it('should reject password without number', () => {
      const result = Validator.validatePassword('StrongPass')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La contraseña debe contener al menos un número')
    })
  })

  describe('validateRequired', () => {
    it('should validate non-empty value', () => {
      const result = Validator.validateRequired('test', 'TestField')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject null value', () => {
      const result = Validator.validateRequired(null, 'TestField')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('TestField es requerido')
    })

    it('should reject undefined value', () => {
      const result = Validator.validateRequired(undefined, 'TestField')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('TestField es requerido')
    })

    it('should reject empty string', () => {
      const result = Validator.validateRequired('', 'TestField')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('TestField es requerido')
    })
  })

  describe('validateLength', () => {
    it('should validate string within length limits', () => {
      const result = Validator.validateLength('test', 2, 10, 'TestField')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject string shorter than minimum', () => {
      const result = Validator.validateLength('a', 2, 10, 'TestField')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('TestField debe tener al menos 2 caracteres')
    })

    it('should reject string longer than maximum', () => {
      const result = Validator.validateLength('verylongstring', 2, 10, 'TestField')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('TestField debe tener máximo 10 caracteres')
    })

    it('should accept empty string when not required', () => {
      const result = Validator.validateLength('', 2, 10, 'TestField')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateFile', () => {
    it('should validate valid file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = Validator.validateFile(file, 10 * 1024 * 1024, ['image/jpeg', 'image/png'])
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject null file', () => {
      const result = Validator.validateFile(null as any, 10 * 1024 * 1024, ['image/jpeg'])
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El archivo es requerido')
    })

    it('should reject file larger than max size', () => {
      const file = new File(['x'.repeat(20 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const result = Validator.validateFile(file, 10 * 1024 * 1024, ['image/jpeg'])
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('El archivo debe ser menor a 10MB')
    })

    it('should reject file with invalid type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = Validator.validateFile(file, 10 * 1024 * 1024, ['image/jpeg', 'image/png'])
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Tipo de archivo no permitido. Tipos válidos: image/jpeg, image/png')
    })
  })

  describe('validateObject', () => {
    it('should validate object with all required fields', () => {
      const obj = {
        name: 'John',
        email: 'john@example.com',
        age: 25
      }
      
      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { required: true, custom: (value: number) => value >= 18 }
      }
      
      const result = Validator.validateObject(obj, rules)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject object with missing required fields', () => {
      const obj = {
        name: 'John'
        // email is missing
      }
      
      const rules = {
        name: { required: true },
        email: { required: true }
      }
      
      const result = Validator.validateObject(obj, rules)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('email es requerido')
    })

    it('should reject object with invalid field values', () => {
      const obj = {
        name: 'J', // too short
        email: 'invalid-email' // invalid format
      }
      
      const rules = {
        name: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
      }
      
      const result = Validator.validateObject(obj, rules)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('name debe tener al menos 2 caracteres')
      expect(result.errors).toContain('email no cumple con el formato requerido')
    })
  })
})

describe('Validation Rules', () => {
  describe('UserValidationRules', () => {
    it('should have correct validation rules', () => {
      expect(UserValidationRules.name).toEqual({
        required: true,
        minLength: 2,
        maxLength: 50
      })

      expect(UserValidationRules.userEmail).toEqual({
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'El formato del email no es válido'
      })

      expect(UserValidationRules.userPassword).toEqual({
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número'
      })
    })
  })

  describe('EventValidationRules', () => {
    it('should have correct validation rules', () => {
      expect(EventValidationRules.eventName).toEqual({
        required: true,
        minLength: 3,
        maxLength: 100
      })

      expect(EventValidationRules.location).toEqual({
        required: true,
        minLength: 5,
        maxLength: 200
      })
    })
  })

  describe('ImageValidationRules', () => {
    it('should have correct validation rules', () => {
      expect(ImageValidationRules.file).toEqual({
        required: true
      })

      expect(ImageValidationRules.description).toEqual({
        maxLength: 500
      })
    })
  })
}) 