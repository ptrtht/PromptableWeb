import type { ExecutionContext } from './ExecutionContext';
import type { VariableResolver } from './VariableResolver';
import { LoggingService } from '../LoggingService';

export class UserResolver implements VariableResolver {
  namespace = 'user';
  private userId: string;
  
  constructor(userId: string) {
    this.userId = userId;
    LoggingService.debug('UserResolver initialized', { userId });
  }

  async resolve(key: string, context: ExecutionContext): Promise<string> {
    // Handle different user-related keys
    switch (key) {
      case 'id':
        return this.userId;
      default:
        throw LoggingService.error(`Unknown user key: ${key}`);
    }
  }
}