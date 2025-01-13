import type { VirtualKeyService } from '../VirtualKeyService';
import type { ExecutionContext } from './ExecutionContext';
import type { VariableResolver } from './VariableResolver';
import { LoggingService } from '../LoggingService';
import { UserResolver } from './UserResolver';
import { PipelineCredential } from '$lib/services/schemas/PipelineConfig';
import { VirtualKeyServerStore } from '$lib/services/stores/VirtualKeyStore.server';

export class CredentialResolver implements VariableResolver {
  namespace = 'credentials';
  private credentials: PipelineCredential[] = [];
  private context?: ExecutionContext;

  constructor(private virtualKeyService: typeof VirtualKeyService) {}

  async setCredentials(context: ExecutionContext) {
    this.context = context;

    // Get user resolver
    const userResolver = context.getResolver('user') as UserResolver;
    if (!userResolver) {
      throw new Error('User resolver not found in context');
    }

    // Get user ID
    const userId = await userResolver.resolve('id', context);

    // ! TODO
    const virtualKeys = await VirtualKeyServerStore.getKeysForUser({ user_id: userId });

    let credentials: typeof this.credentials = [];

    virtualKeys.forEach((key) => {
      if (key.status !== 'active') return LoggingService.info('Skipping inactive key', { key });

      credentials = [
        ...credentials,
        {
          provider: key.provider,
          virtualKeyId: key.id,
        },
      ];
    });

    this.credentials = credentials;

    LoggingService.debug('Credentials set in resolver', {
      userId,
      credentialsCount: this.credentials.length,
      providers: this.credentials.map((c) => c.provider),
    });
  }

  async resolve(provider: string, context: ExecutionContext): Promise<string> {
    const credential = this.credentials.find((cred) => cred.provider === provider);

    if (!credential) {
      throw LoggingService.error(`No credential found for provider: ${provider}`);
    }

    const result = await this.virtualKeyService.getKey({
      virtualKeyId: credential.virtualKeyId,
      provider: credential.provider,
    });

    return result.key;
  }
}
