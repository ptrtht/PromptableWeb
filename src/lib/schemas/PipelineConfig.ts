import { z } from 'zod';

const NodeConfigSchema = z.object({
  type: z.string(),
  config: z.record(z.any()),
  credentials: z
    .array(
      z.object({
        virtualKeyId: z.string().regex(/^virtual_/),
        provider: z.string(),
      })
    )
    .optional(),
});

export const PipelineConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  executionOrder: z.array(z.string()),
  nodes: z.record(z.string(), NodeConfigSchema),
  metadata: z
    .object({
      created: z.string().datetime(),
      modified: z.string().datetime(),
      version: z.number(),
    })
    .transform((metadata) => ({
      ...metadata,
      created: new Date(metadata.created),
      modified: new Date(metadata.modified),
    })),
});

// Export types
export type NodeConfig = z.infer<typeof NodeConfigSchema>;
export type PipelineConfig = z.infer<typeof PipelineConfigSchema>;