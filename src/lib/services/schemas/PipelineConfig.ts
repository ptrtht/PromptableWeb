import { z } from 'zod';
import { publicPipelinesRowSchemaSchema } from './supabase.schemas';

export const NodeConfigSchema = z.object({
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

export const SchemaTypeEnum = z.enum(['string', 'number', 'boolean', 'object', 'array']);

export const WebhookTriggerConfigSchema = z.object({
  type: z.literal('webhook'),
  validate: z.boolean(),
  schema: z.record(SchemaTypeEnum),
});

export const PipelineConfigJsonSchema = z.object({
  executionOrder: z.array(z.string()),
  nodes: z.record(z.string(), NodeConfigSchema),
  input: WebhookTriggerConfigSchema,
});

export const PipelineConfigSchema = publicPipelinesRowSchemaSchema.extend({
  pipeline: PipelineConfigJsonSchema,
});

// Export types
export type NodeConfig = z.infer<typeof NodeConfigSchema>;
export type PipelineConfig = z.infer<typeof PipelineConfigSchema>;
export type WebhookTriggerConfigType = z.infer<typeof WebhookTriggerConfigSchema>;
export type PipelineConfigJson = z.infer<typeof PipelineConfigJsonSchema>;
