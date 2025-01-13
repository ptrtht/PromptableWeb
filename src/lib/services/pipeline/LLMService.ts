import { createOpenAI } from '@ai-sdk/openai';
import { generateText, type LanguageModel, Message } from 'ai';
import { z } from 'zod';
import { LoggingService } from './LoggingService';
import type { LLMModel, LLMProvider } from '../schemas/nodes/LLMNode';

// usage is tokens used & cost of the API call
// cost is awlays in USD cents
const LLMUsageSchema = z.object({
  prompt_tokens: z.number(),
  prompt_tokens_cost: z.number(),
  completion_tokens: z.number(),
  completion_tokens_cost: z.number(),
  total_tokens: z.number(),
  total_cost: z.number(),
});

const LLMResponseSchema = z.object({
  warnings: z.array(z.string()).optional(),
  generation: z.string(),
  finishReason: z.enum(['stop', 'length', 'content-filter', 'tool-calls', 'error', 'other', 'unknown']).or(z.string()),
  usage: LLMUsageSchema,
});

export class LLMService {
  static async createChatCompletion(params: {
    apiKey: string;
    provider: LLMProvider;
    model: string;
    system?: string;
    // Message without the ID
    messages: Omit<Message, 'id'>[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stopSequences?: string[];
  }) {
    if (!params.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    let aiProvider: LanguageModel | undefined;

    LoggingService.debug('Creating LLM provider', { provider: params.provider, model: params.model });

    if (params.provider.toLowerCase().includes('openai')) {
      aiProvider = createOpenAI({
        apiKey: params.apiKey,
      })(params.model);
    }

    try {
      if (!aiProvider) throw new Error('Invalid provider: ' + params.provider);

      LoggingService.log('info', 'Making OpenAI API call', {
        model: params.model,
        messagesCount: params.messages.length,
      });

      const generation = await generateText({
        model: aiProvider,
        system: params.system,
        messages: params.messages,
        maxTokens: params.max_tokens,
        temperature: params.temperature,
        topP: params.top_p,
        topK: params.top_k,
        presencePenalty: params.presence_penalty,
        frequencyPenalty: params.frequency_penalty,
        stopSequences: params.stopSequences,
        maxRetries: 0,
      },
    
    );

      LoggingService.debug('LLM API call response', { generation });

      const cost = await this.getUsageCostForModel({
        prompt_tokens: generation.usage.promptTokens,
        completion_tokens: generation.usage.completionTokens,
        model: params.model,
      });

      const usage = LLMUsageSchema.parse({
        prompt_tokens: generation.usage.promptTokens,
        prompt_tokens_cost: cost.prompt_tokens_cost,
        completion_tokens: generation.usage.completionTokens,
        completion_tokens_cost: cost.completion_tokens_cost,
        total_tokens: generation.usage.promptTokens + generation.usage.completionTokens,
        total_cost: cost.total_cost,
      });

      // Validate response format
      const response = LLMResponseSchema.parse({
        warnings: generation.warnings,
        generation: generation.text,
        finishReason: generation.finishReason,
        usage,
      });

      LoggingService.log('info', 'LLM API call successful', { usage });

      return response;
    } catch (error: any) {
      // Handle timeout errors
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error('LLM API timeout');
      }

      // Handle validation errors
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid LLM API response format: ${error.message}`);
      }

      // Generic error handler
      throw new Error(`LLM API call failed: ${error.message}`);
    }
  }

  static async getUsageCostForModel({
    prompt_tokens,
    completion_tokens,
    model,
  }: {
    prompt_tokens: number;
    completion_tokens: number;
    model: LLMModel;
  }) {
    // OPENAI
    const [provider, modelName] = model.split('/');

    //! I'm tired lets just assume all cost is random between 0 and 1
    return {
      prompt_tokens_cost: Math.floor(Math.random() * 1),
      completion_tokens_cost: Math.floor(Math.random() * 1),
      total_cost: Math.floor(Math.random() * 1),
    };
  }
}
