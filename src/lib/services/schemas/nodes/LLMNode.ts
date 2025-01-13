import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  name: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const LLMProviderSchema = z.enum(['openai', 'anthropic', 'grok']);
export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const LLMModelSchema = z
  .string()
  .regex(
    /^(openai|anthropic)\/[a-zA-Z0-9-]+$/,
    'Model must be in format: LLMProvider/model, where LLMProvider is either openai or anthropic'
  );

// @format: LLMProvider/model
// @example: openai/gpt-4o-mini
export type LLMModel = z.infer<typeof LLMModelSchema>;

export const LLMNodeInputSchema = z.object({
  model: LLMModelSchema,
  messages: z.array(MessageSchema),
  system: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7).optional(),
  max_tokens: z.number().positive().optional(),
  top_p: z.number().min(0).max(1).optional(),
  top_k: z.number().positive().optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  stop_sequences: z.array(z.string()).optional(),
});
export type LLMNodeInput = z.infer<typeof LLMNodeInputSchema>;

export const LLMNodeOutputSchema = z.object({
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
export type LLMNodeOutput = z.infer<typeof LLMNodeOutputSchema>;
