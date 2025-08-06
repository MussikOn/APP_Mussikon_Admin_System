// Sistema de logging profesional para producción
export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
} as const;

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

class Logger {
  private level: LogLevelType;
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.level = this.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;
  }

  private formatMessage(level: LogLevelType, message: string, data?: any, error?: Error): string {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LogLevel).find(key => LogLevel[key as keyof typeof LogLevel] === level) || 'UNKNOWN';
    
    let formattedMessage = `[${timestamp}] ${levelName}: ${message}`;
    
    if (data) {
      formattedMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    if (error) {
      formattedMessage += ` | Error: ${error.message}`;
    }
    
    return formattedMessage;
  }

  private shouldLog(level: LogLevelType): boolean {
    return level <= this.level;
  }

  error(message: string, data?: any, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage(LogLevel.ERROR, message, data, error);
      
      if (this.isProduction) {
        // En producción, enviar a servicio de logging
        this.sendToLoggingService(LogLevel.ERROR, message, data, error);
      } else {
        console.error(formattedMessage);
      }
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage(LogLevel.WARN, message, data);
      
      if (this.isProduction) {
        this.sendToLoggingService(LogLevel.WARN, message, data);
      } else {
        console.warn(formattedMessage);
      }
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage(LogLevel.INFO, message, data);
      
      if (this.isProduction) {
        this.sendToLoggingService(LogLevel.INFO, message, data);
      } else {
        console.info(formattedMessage);
      }
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, data);
      
      if (!this.isProduction) {
        console.log(formattedMessage);
      }
    }
  }

  private sendToLoggingService(level: LogLevelType, message: string, data?: any, error?: Error): void {
    // En producción, enviar logs a servicio externo (Sentry, LogRocket, etc.)
    // Por ahora, solo console.error en producción para errores críticos
    if (level === LogLevel.ERROR) {
      console.error(this.formatMessage(level, message, data, error));
    }
  }
}

// Instancia global del logger
export const logger = new Logger();

// Funciones de conveniencia
export const logError = (message: string, data?: any, error?: Error) => logger.error(message, data, error);
export const logWarn = (message: string, data?: any) => logger.warn(message, data);
export const logInfo = (message: string, data?: any) => logger.info(message, data);
export const logDebug = (message: string, data?: any) => logger.debug(message, data); 