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
  static async resolveCredentials(params: { credentials: CredentialConfig[] }): Promise<ResolvedCredential[]> {
    const { credentials } = params;

    // Validate all credential configs first
    credentials.forEach((cred) => CredentialConfigSchema.parse(cred));

    // Resolve all credentials in parallel
    const resolvedCredentials = await Promise.all(
      credentials.map((cred) =>
        VirtualKeyService.getKey({
          virtualKeyId: cred.virtualKeyId,
          provider: cred.provider,
        })
      )
    );

    return resolvedCredentials;
  }
}
