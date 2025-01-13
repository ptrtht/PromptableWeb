import { z } from 'zod';
import { publicPipelinesRowSchemaSchema, publicProvidersEnumSchema } from './supabase.schemas';
import { LLMNodeInputSchema } from './nodes/LLMNode';
import { APINodeInputSchema } from './nodes/APINode';

export const SchemaTypeEnum = z.enum(['string', 'number', 'boolean', 'object', 'array']);
export const WebhookTriggerConfigSchema = z.object({
  type: z.literal('webhook'),
  validate: z.boolean(),
  schema: z.record(SchemaTypeEnum),
  name: z.string().optional(),
});

const BaseNodeConfigSchema = z.object({
  name: z.string().optional(),
});

export const NodeConfigSchema = z.discriminatedUnion('type', [
  BaseNodeConfigSchema.extend({
    type: z.literal('llm'),
    config: LLMNodeInputSchema
  }),
  BaseNodeConfigSchema.extend({
    type: z.literal('api_call'),
    config: APINodeInputSchema,
  }),
]);

// Define credential schema at pipeline level
// The credentials will be resolved at the pipeline level, based on the user's virtual keys
const PipelineCredentialSchema = z.object({
  virtualKeyId: z.string().regex(/^virtual_/),
  provider: publicProvidersEnumSchema.or(z.string()), // Keep generic at base level, specific nodes will validate their providers
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
export type PipelineCredential = z.infer<typeof PipelineCredentialSchema>;
export type WebhookTriggerConfigType = z.infer<typeof WebhookTriggerConfigSchema>;
export type PipelineConfigJson = z.infer<typeof PipelineConfigJsonSchema>;
