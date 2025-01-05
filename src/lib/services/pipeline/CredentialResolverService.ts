import { VirtualKeyService } from './VirtualKeyService';
import { z } from 'zod';

const SupportedProviderSchema = z.string();

const CredentialConfigSchema = z.object({
  virtualKeyId: z.string().regex(/^virtual_/),
  provider: SupportedProviderSchema,
});

type CredentialConfig = z.infer<typeof CredentialConfigSchema>;

type ResolvedCredential = {
  id: string;
  key: string;
  provider: z.infer<typeof SupportedProviderSchema>;
};

export class CredentialResolverService {
  static async resolveCredentials(params: {
    user_id?: string;
    credentials: CredentialConfig[];
  }): Promise<ResolvedCredential[]> {
    const { user_id, credentials } = params;

    // Validate all credential configs first
    credentials.forEach((cred) => CredentialConfigSchema.parse(cred));

    // Resolve all credentials in parallel
    const resolvedCredentials = await Promise.all(
      credentials.map((cred) =>
        VirtualKeyService.getKey({
          user_id,
          virtualKeyId: cred.virtualKeyId,
          provider: cred.provider,
        })
      )
    );

    return resolvedCredentials;
  }
}
