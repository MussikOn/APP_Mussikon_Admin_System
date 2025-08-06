// Sistema de validación para producción
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('El email es requerido');
    } else if (!emailPattern.test(email)) {
      errors.push('El formato del email no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('La contraseña es requerida');
    } else {
      if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('La contraseña debe contener al menos un número');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (value === null || value === undefined || value === '') {
      errors.push(`${fieldName} es requerido`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (value && value.length < min) {
      errors.push(`${fieldName} debe tener al menos ${min} caracteres`);
    }
    
    if (value && value.length > max) {
      errors.push(`${fieldName} debe tener máximo ${max} caracteres`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFile(file: File, maxSize: number, allowedTypes: string[]): ValidationResult {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('El archivo es requerido');
      return { isValid: false, errors };
    }
    
    if (file.size > maxSize) {
      errors.push(`El archivo debe ser menor a ${Math.round(maxSize / 1024 / 1024)}MB`);
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Tipo de archivo no permitido. Tipos válidos: ${allowedTypes.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateObject(obj: any, rules: Record<string, ValidationRule>): ValidationResult {
    const errors: string[] = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = obj[field];
      
      // Validación requerida
      if (rule.required && !this.validateRequired(value, field).isValid) {
        errors.push(rule.message || `${field} es requerido`);
        continue;
      }
      
      // Si no es requerido y está vacío, saltar otras validaciones
      if (!rule.required && (value === null || value === undefined || value === '')) {
        continue;
      }
      
      // Validación de longitud
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(rule.message || `${field} debe tener al menos ${rule.minLength} caracteres`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(rule.message || `${field} debe tener máximo ${rule.maxLength} caracteres`);
        }
      }
      
      // Validación de patrón
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(rule.message || `${field} no cumple con el formato requerido`);
      }
      
      // Validación personalizada
      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.message || `${field} no es válido`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Validaciones específicas para el sistema
export const UserValidationRules = {
  name: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  userEmail: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'El formato del email no es válido'
  },
  userPassword: { 
    required: true, 
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número'
  },
  roll: { required: true }
};

export const EventValidationRules = {
  eventName: { required: true, minLength: 3, maxLength: 100 },
  eventType: { required: true },
  date: { required: true },
  time: { required: true },
  location: { required: true, minLength: 5, maxLength: 200 },
  budget: { required: true }
};

export const ImageValidationRules = {
  file: { required: true },
  category: { required: true },
  description: { maxLength: 500 }
}; 