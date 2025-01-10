/*
 * ==========================================
 * |          GENERATED BY SUPAZOD          |
 * ==========================================
 */

import { z } from "zod";
import type { Json } from "./supabase.types";

export const publicApiKeyStatusEnumSchema = z.union([
  z.literal("active"),
  z.literal("revoked"),
  z.literal("deleted"),
]);

export const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.record(z.union([jsonSchema, z.undefined()])),
      z.array(jsonSchema),
    ])
    .nullable(),
);

export const publicApiKeysRowSchemaSchema = z.object({
  created_at: z.string(),
  id: z.number(),
  key: z.string().nullable(),
  name: z.string().nullable(),
  status: publicApiKeyStatusEnumSchema,
  user_id: z.string().nullable(),
});

export const publicApiKeysInsertSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.number().optional(),
  key: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  status: publicApiKeyStatusEnumSchema.optional(),
  user_id: z.string().optional().nullable(),
});

export const publicApiKeysUpdateSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.number().optional(),
  key: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  status: publicApiKeyStatusEnumSchema.optional(),
  user_id: z.string().optional().nullable(),
});

export const publicApiKeysRelationshipsSchemaSchema = z.tuple([]);

export const publicPipelinesRowSchemaSchema = z.object({
  created_at: z.string(),
  id: z.string(),
  modified_at: z.string(),
  name: z.string(),
  pipeline: jsonSchema,
  user_id: z.string(),
  version: z.number(),
});

export const publicPipelinesInsertSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.string().optional(),
  modified_at: z.string().optional(),
  name: z.string().optional(),
  pipeline: jsonSchema,
  user_id: z.string(),
  version: z.number().optional(),
});

export const publicPipelinesUpdateSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.string().optional(),
  modified_at: z.string().optional(),
  name: z.string().optional(),
  pipeline: jsonSchema.optional(),
  user_id: z.string().optional(),
  version: z.number().optional(),
});

export const publicPipelinesRelationshipsSchemaSchema = z.tuple([]);

export const publicPromptLogsRowSchemaSchema = z.object({
  created_at: z.string(),
  id: z.number(),
  input: jsonSchema.nullable(),
  output: jsonSchema.nullable(),
  user_id: z.string().nullable(),
});

export const publicPromptLogsInsertSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.number().optional(),
  input: jsonSchema.optional().nullable(),
  output: jsonSchema.optional().nullable(),
  user_id: z.string().optional().nullable(),
});

export const publicPromptLogsUpdateSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.number().optional(),
  input: jsonSchema.optional().nullable(),
  output: jsonSchema.optional().nullable(),
  user_id: z.string().optional().nullable(),
});

export const publicPromptLogsRelationshipsSchemaSchema = z.tuple([]);

export const publicProvidersRowSchemaSchema = z.object({
  created_at: z.string(),
  description: z.string(),
  id: z.number(),
  link: z.string(),
  logo_url: z.string(),
  name: z.string(),
});

export const publicProvidersInsertSchemaSchema = z.object({
  created_at: z.string().optional(),
  description: z.string(),
  id: z.number().optional(),
  link: z.string(),
  logo_url: z.string(),
  name: z.string(),
});

export const publicProvidersUpdateSchemaSchema = z.object({
  created_at: z.string().optional(),
  description: z.string().optional(),
  id: z.number().optional(),
  link: z.string().optional(),
  logo_url: z.string().optional(),
  name: z.string().optional(),
});

export const publicProvidersRelationshipsSchemaSchema = z.tuple([]);

export const publicVirtualKeysRowSchemaSchema = z.object({
  created_at: z.string(),
  id: z.string(),
  key: z.string(),
  name: z.string(),
  provider: z.string(),
  status: publicApiKeyStatusEnumSchema,
  user_id: z.string(),
});

export const publicVirtualKeysInsertSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.string().optional(),
  key: z.string(),
  name: z.string(),
  provider: z.string(),
  status: publicApiKeyStatusEnumSchema.optional(),
  user_id: z.string(),
});

export const publicVirtualKeysUpdateSchemaSchema = z.object({
  created_at: z.string().optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  provider: z.string().optional(),
  status: publicApiKeyStatusEnumSchema.optional(),
  user_id: z.string().optional(),
});

export const publicVirtualKeysRelationshipsSchemaSchema = z.tuple([]);

export const publicVOrphanedVirtualKeysRowSchemaSchema = z.object({
  created_at: z.string().nullable(),
  id: z.string().nullable(),
  key: z.string().nullable(),
  name: z.string().nullable(),
  provider: z.string().nullable(),
  status: publicApiKeyStatusEnumSchema.nullable(),
  user_id: z.string().nullable(),
});

export const publicVOrphanedVirtualKeysRelationshipsSchemaSchema = z.tuple([]);
