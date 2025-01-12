import { z } from 'zod';
import { publicPipelinesRowSchemaSchema } from './supabase.schemas';
import { LLMNodeInputSchema } from './nodes/LLMNode';
import { APINodeInputSchema } from './nodes/APINode';

const BaseNodeConfigSchema = z.object({
  name: z.string().optional(),
  credentials: z
    .array(
      z.object({
        virtualKeyId: z.string().regex(/^virtual_/),
        provider: z.string(),
      })
    )
    .optional(),
});

export const NodeConfigSchema = z.discriminatedUnion('type', [
  BaseNodeConfigSchema.extend({
    type: z.literal('llm'),
    config: LLMNodeInputSchema,
  }),
  BaseNodeConfigSchema.extend({
    type: z.literal('api_call'),
    config: APINodeInputSchema,
  }),
]);

export const SchemaTypeEnum = z.enum(['string', 'number', 'boolean', 'object', 'array']);

export const WebhookTriggerConfigSchema = z.object({
  type: z.literal('webhook'),
  validate: z.boolean(),
  schema: z.record(SchemaTypeEnum),
  name: z.string().optional(),
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
