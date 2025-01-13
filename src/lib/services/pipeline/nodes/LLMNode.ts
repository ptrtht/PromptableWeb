import { z } from 'zod';
import { BaseNode } from './BaseNode';
import { LoggingService } from '../LoggingService';
import { LLMNodeInputSchema, LLMNodeOutputSchema, LLMProviderSchema } from '$lib/services/schemas/nodes/LLMNode';
import type { ExecutionContext } from '../context/ExecutionContext';
import { LLMService } from '../LLMService';

export const providerMap = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  grok: 'Grok',
};

type LLMProvider = z.infer<typeof LLMProviderSchema>;

export class LLMNode extends BaseNode {
  readonly type = 'llm';
  readonly inputSchema = LLMNodeInputSchema;
  readonly outputSchema = LLMNodeOutputSchema;

  async execute(config: z.infer<typeof this.inputSchema>, context: ExecutionContext) {
    return await this.executeWithRetry(async () => {
      const [provider, modelName] = config.model.split('/') as [LLMProvider, string];

      LoggingService.log('debug', 'Starting execution', { provider, modelName });

      // Get API key through context resolution
      const apiKey = await context.resolveVariable('credentials', providerMap[provider]);

      LoggingService.log('debug', 'Retrieved API key');

      LoggingService.debug('Executing LLM request', { provider, modelName });
      const response = await LLMService.createChatCompletion({
        apiKey,
        provider: provider,
        model: modelName,
        system: config.system,
        messages: config.messages,
        max_tokens: config.max_tokens,
        temperature: config.temperature,
        top_p: config.top_p,
        top_k: config.top_k,
        frequency_penalty: config.frequency_penalty,
        presence_penalty: config.presence_penalty,
        stopSequences: config.stop_sequences,
      });

      return response;
    });
  }
}
