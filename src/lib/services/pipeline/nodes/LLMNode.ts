import { z } from 'zod';
import { BaseNode } from './BaseNode';
import { LoggingService } from '../LoggingService';
import { OpenAIService } from '../OpenAIService';

// Message format schema following OpenAI's structure
const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  name: z.string().optional(),
});

const LLMProviderSchema = z.enum(['openai', 'anthropic']);
type LLMProvider = z.infer<typeof LLMProviderSchema>;

export class LLMNode extends BaseNode {
  readonly type = 'llm';

  readonly inputSchema = z.object({
    model: z
      .string()
      .regex(
        /^(openai|anthropic)\/[a-zA-Z0-9-]+$/,
        'Model must be in format: LLMProvider/model, where LLMProvider is either openai or anthropic'
      ),
    messages: z.array(MessageSchema),
    temperature: z.number().min(0).max(2).optional().default(0.7),
    max_tokens: z.number().positive().optional(),
    top_p: z.number().min(0).max(1).optional(),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    presence_penalty: z.number().min(-2).max(2).optional(),
    stop: z.union([z.string(), z.array(z.string())]).optional(),
    credentials: z.array(
      z.object({
        virtualKeyId: z.string().regex(/^virtual_/),
        provider: LLMProviderSchema,
      })
    ),
    userId: z.string().optional(),
  });

  readonly outputSchema = z.object({
    response: z.object({
      role: z.literal('assistant'),
      content: z.string(),
    }),
    usage: z.object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    }),
  });

  async execute(config: z.infer<typeof this.inputSchema>) {
    return await this.executeWithRetry(async () => {
      //
      const [provider, modelName] = config.model.split('/') as [LLMProvider, string];

      LoggingService.log('debug', 'Starting execution', { provider, modelName });

      const apiKey = await this.getApiKeyForProvider(config.credentials, provider, config.userId);

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
