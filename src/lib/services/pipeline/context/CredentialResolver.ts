import type { VirtualKeyService } from '../VirtualKeyService';
import type { ExecutionContext } from './ExecutionContext';
import type { VariableResolver } from './VariableResolver';

export class CredentialResolver implements VariableResolver {
  namespace = 'credentials';
  
  constructor(private virtualKeyService: typeof VirtualKeyService) {}

  async resolve(virtualKeyId: string, context: ExecutionContext): Promise<string> {
    const result = await this.virtualKeyService.getKey({
      virtualKeyId,
    });
    return result.key;
  }
}