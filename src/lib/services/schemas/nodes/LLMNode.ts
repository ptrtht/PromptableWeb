import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  name: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const LLMProviderSchema = z.enum(['openai', 'anthropic']);
export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const LLMNodeInputSchema = z.object({
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
