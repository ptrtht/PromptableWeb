// lib/services/LoggingService.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
}

export class LoggingService {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000; // Prevent memory leaks

  static async log(level: LogLevel, message: string, data?: any): Promise<void> {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
    };

    // Add to in-memory logs
    this.logs.push(entry);

    // Prevent memory leaks by removing old logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    console.log(`[${level.toUpperCase()}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  // Helper methods for different log levels
  static async debug(message: string, data?: any): Promise<void> {
    return this.log('debug', message, data);
  }

  static async info(message: string, data?: any): Promise<void> {
    return this.log('info', message, data);
  }

  static async warn(message: string, data?: any): Promise<void> {
    return this.log('warn', message, data);
  }

  static async error(message: string, data?: any): Promise<void> {
    return this.log('error', message, data);
  }
}
