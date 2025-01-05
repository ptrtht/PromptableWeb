import OpenAI from 'openai';
import { z } from 'zod';
import { LoggingService } from './LoggingService';

// Response schema to ensure we get what we expect from OpenAI
const OpenAIResponseSchema = z.object({
  role: z.literal('assistant'),
  content: z.string(),
});

const OpenAIUsageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
});

export class OpenAIService {
  static async createChatCompletion(params: {
    apiKey: string;
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
      name?: string;
    }>;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string | string[];
  }) {
    if (!params.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({
      apiKey: params.apiKey,
      timeout: 30000, // 30 second timeout
    });

    try {
      LoggingService.log('info', 'Making OpenAI API call', {
        model: params.model,
        messagesCount: params.messages.length,
      });

      const completion = await openai.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty,
        stop: params.stop,
      });

      if (!completion.choices?.[0]?.message) {
        throw new Error('Invalid response from OpenAI API: No message in response');
      }

      // Validate response format
      const response = OpenAIResponseSchema.parse({
        role: completion.choices[0]?.message?.role,
        content: completion.choices[0]?.message?.content || 'CONTENT_NOT_FOUND',
      });

      const usage = OpenAIUsageSchema.parse({
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      });

      LoggingService.log('info', 'OpenAI API call successful', { usage });

      return {
        response,
        usage,
      };
    } catch (error: any) {
      // Handle specific OpenAI error types
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error: ${error?.message} (Status: ${error.status})`);
      }

      // Handle timeout errors
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error('OpenAI API timeout');
      }

      // Handle validation errors
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid OpenAI API response format: ${error.message}`);
      }

      // Generic error handler
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
  }
}
