import { z } from 'zod';

export const APINodeInputSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
});

export type APINodeInput = z.infer<typeof APINodeInputSchema>;

export const APINodeOutputSchema = z.object({
  status: z.number(),
  data: z.any(),
  headers: z.record(z.string()),
});

export type APINodeOutput = z.infer<typeof APINodeOutputSchema>;
