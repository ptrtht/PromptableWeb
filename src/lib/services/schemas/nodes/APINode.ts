import { z } from 'zod';

export const APINodeInputSchema = z
  .object({
    url: z.string().url(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    headers: z.record(z.string()).optional(),
    queryParams: z.record(z.string()).optional(),

    // payloads
    // raw
    body: z.unknown().optional(),
    // form data
    formData: z.record(z.string()).optional(),
    // url encoded
    formUrlEncoded: z.record(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Count how many payload fields are defined
      const definedPayloads = [data.body, data.formData, data.formUrlEncoded].filter(
        (payload) => payload !== undefined && payload !== null
      ).length;

      // Valid if exactly 0 or 1 payload fields are defined
      return definedPayloads <= 1;
    },
    {
      message: 'Only one type of payload (body, formData, or formUrlEncoded) can be specified',
      path: ['payload'], // This will show the error at the payload level
    }
  );

export type APINodeInput = z.infer<typeof APINodeInputSchema>;

export const APINodeOutputSchema = z.object({
  status: z.number(),
  data: z.object({
    raw: z.string(),  // Always contains the raw response string
    json: z.record(z.any()).optional(), // Contains parsed JSON if valid
  }),
  headers: z.record(z.string()),
});
export type APINodeOutput = z.infer<typeof APINodeOutputSchema>;
