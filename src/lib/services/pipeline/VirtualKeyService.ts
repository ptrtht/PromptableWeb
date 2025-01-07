import { z } from 'zod';
import { VirtualKeyServerStore } from '../stores/VirtualKeyStore.server';

const SupportedProviderSchema = z.string();

const VirtualKeyResponseSchema = z.object({
  id: z.string().regex(/^virtual_/),
  key: z.string(),
  provider: SupportedProviderSchema,
});

type VirtualKeyResponse = z.infer<typeof VirtualKeyResponseSchema>;

export class VirtualKeyService {
  static async getKey(params: {
    user_id?: string;
    virtualKeyId: string;
    provider?: string;
  }): Promise<VirtualKeyResponse> {
    const result = await VirtualKeyServerStore.getKey(params);

    if (!result?.key || typeof result.key !== 'string') {
      throw new Error('Invalid virtual key: key must be a string');
    }

    if (params.provider) {
      try {
        SupportedProviderSchema.parse(result.provider);
      } catch (e) {
        throw new Error(`Invalid provider: ${result.provider}. Must be one of: openai, anthropic`);
      }

      if (result.provider !== params.provider) {
        throw new Error(`Provider mismatch: Expected ${params.provider}, got ${result.provider}`);
      }
    }

    return VirtualKeyResponseSchema.parse({
      id: result.id,
      key: result.key,
      provider: result.provider,
    });
  }
}
