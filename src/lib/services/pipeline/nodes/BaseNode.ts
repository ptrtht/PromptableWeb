import { z } from 'zod';
import { CredentialResolverService } from '../CredentialResolverService';
import { LoggingService } from '../LoggingService';

// Schema for node credentials in config
const NodeCredentialSchema = z.object({
  virtualKeyId: z.string().regex(/^virtual_/),
  provider: z.string(), // Keep generic at base level, specific nodes will validate their providers
});

type NodeCredential = z.infer<typeof NodeCredentialSchema>;

type ResolvedCredential = {
  id: string;
  key: string;
  provider: string;
};

export abstract class BaseNode {
  abstract readonly type: string;
  abstract readonly inputSchema: z.ZodSchema;
  abstract readonly outputSchema: z.ZodSchema;

  protected async resolveCredentials(credentials: NodeCredential[], userId?: string): Promise<ResolvedCredential[]> {
    return CredentialResolverService.resolveCredentials({
      credentials,
    });
  }

  protected async getApiKeyForProvider(
    credentials: NodeCredential[],
    provider: string,
    userId?: string
  ): Promise<string> {
    const resolvedCredentials = await this.resolveCredentials(credentials, userId);
    const credential = resolvedCredentials.find((cred) => cred.provider === provider);

    // log all resolved credentials
    LoggingService.log('debug', 'Resolved credentials', resolvedCredentials);

    if (!credential) {
      throw LoggingService.error(`No ${provider} API key found`, { credentials });
    }

    return credential.key;
  }

  protected async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<{ success: boolean; data?: T; error?: Error }> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();

        await LoggingService.log('debug', 'executeWithRetry successful, idx: ' + attempt, result);

        return { success: true, data: result };
      } catch (error: any) {
        await LoggingService.log('debug', 'executeWithRetry failed, idx: ' + attempt, error);

        lastError = error;
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          await LoggingService.error('executeWithRetry failed after max retries', error);
        }
      }
    }

    return { success: false, error: lastError };
  }

  abstract execute(config: any): Promise<any>;

  async validateOutput(output: unknown): Promise<z.SafeParseReturnType<any, any>> {
    return this.outputSchema.safeParse(output);
  }
}
