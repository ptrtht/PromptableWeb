import { z } from 'zod';
import { BaseNode } from './BaseNode';
import { LoggingService } from '../LoggingService';
import { OpenAIService } from '../OpenAIService';
import {
  LLMNodeInputSchema,
  LLMNodeOutputSchema,
  LLMProviderSchema,
  MessageSchema,
} from '$lib/services/schemas/nodes/LLMNode';

// Message format schema following OpenAI's structure
export const providerMap = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
};

type LLMProvider = z.infer<typeof LLMProviderSchema>;

export class LLMNode extends BaseNode {
  readonly type = 'llm';

  readonly inputSchema = LLMNodeInputSchema;
  readonly outputSchema = LLMNodeOutputSchema;

  async execute(config: z.infer<typeof this.inputSchema>) {
    return await this.executeWithRetry(async () => {
      //
      const [provider, modelName] = config.model.split('/') as [LLMProvider, string];

      LoggingService.log('debug', 'Starting execution', { provider, modelName });

      const apiKey = await this.getApiKeyForProvider(config.credentials, providerMap[provider], config.userId);

      LoggingService.log('debug', 'Retrieved API key');

      if (provider === 'openai') {
        LoggingService.log('debug', 'Calling OpenAI service', {
          model: modelName,
          messagesCount: config.messages.length,
        });

        const openAIResponse = await OpenAIService.createChatCompletion({
          apiKey,
          model: modelName,
          messages: config.messages,
          temperature: config.temperature,
          max_tokens: config.max_tokens,
          top_p: config.top_p,
          frequency_penalty: config.frequency_penalty,
          presence_penalty: config.presence_penalty,
          stop: config.stop,
        });

        LoggingService.log('debug', 'OpenAI response received', {
          contentLength: openAIResponse.response.content.length,
          usage: openAIResponse.usage,
          fullResponse: openAIResponse, // Log the full response for debugging
        });

        // TODO: Add validation check
        // const outputValidation = this.outputSchema.safeParse(result.data);
        // if (!outputValidation.success) {
        //   LoggingService.error('Output validation failed', {
        //     errors: outputValidation.error.errors,
        //     data: result.data,
        //   });
        //   throw new Error('Output validation failed');
        // }

        // Return the data in the exact format expected by our schema
        return openAIResponse;
      }

      throw new Error(`Unsupported LLM provider: ${provider}`);
    });
  }
}

// Export types for use in other parts of the application
export type Message = z.infer<typeof MessageSchema>;
export type LLMNodeInput = z.infer<typeof LLMNode.prototype.inputSchema>;
export type LLMNodeOutput = z.infer<typeof LLMNode.prototype.outputSchema>;
export type { LLMProvider };
