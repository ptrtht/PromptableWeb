import { z } from 'zod';

export const APINodeInputSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: z.record(z.string()).optional(),
  queryParams: z.record(z.string()).optional(),

  // payloads
  // raw
  body: z.any().optional(),
  // form data
  formData: z.record(z.string()).optional(),
  // url encoded
  formUrlEncoded: z.record(z.string()).optional(),
});

export type APINodeInput = z.infer<typeof APINodeInputSchema>;

export const APINodeOutputSchema = z.object({
  status: z.number(),
  data: z.any(),
  headers: z.record(z.string()),
});

export type APINodeOutput = z.infer<typeof APINodeOutputSchema>;
