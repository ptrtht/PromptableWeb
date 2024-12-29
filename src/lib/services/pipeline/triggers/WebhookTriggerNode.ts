import { Logger } from '$lib/services/Logger';
import { z } from 'zod';
import { BaseNodeSchema, BaseNode } from '../BaseNode';
import { browser } from '$app/environment';

// Define the schema for WebhookTriggerNode
export const WebhookTriggerNodeSchema = BaseNodeSchema.extend({
  type: z.literal('WebhookTriggerNode'),
  inputs: z.object({
    url: z.string(),
    method: z.enum(['POST', 'GET', 'PUT', 'PATCH', 'DELETE']),
    expectedHeaders: z.record(z.string()).optional(),
    validatePayload: z.boolean().optional(),
    payloadSchema: z.any().optional(),
  }),
  outputs: z
    .object({
      payload: z.any().optional(),
      headers: z.record(z.string()).optional(),
      query: z.record(z.string()).optional(),
      timestamp: z.number().optional(),
    })
    .optional(),
});

export type WebhookTriggerNodeType = z.infer<typeof WebhookTriggerNodeSchema>;

export class WebhookTriggerNode extends BaseNode {
  inputs: {
    url: string;
    webhookId?: string;
    method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
    expectedHeaders?: { [key: string]: string };
    validatePayload?: boolean;
    payloadSchema?: z.ZodSchema;
  };

  outputs: {
    payload?: any;
    headers?: { [key: string]: string };
    query?: { [key: string]: string };
    timestamp?: number;
  };

  constructor({
    id,
    inputs = {
      webhookId: browser ? crypto.randomUUID() : 'ERROR',
      url: 'ERROR',
      method: 'POST',
      expectedHeaders: {},
      validatePayload: false,
    },
  }: {
    id: string;
    inputs?: {
      url: string;
      webhookId?: string;
      method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
      expectedHeaders?: { [key: string]: string };
      validatePayload?: boolean;
      payloadSchema?: z.ZodSchema;
    };
  }) {
    super(id, 'WebhookTriggerNode');
    this.description = 'Webhook endpoint trigger';
    this.inputs = inputs;
    this.inputs.url = 'http://api.getpromptable.com/webhook/' + this.inputs.webhookId;
    this.outputs = {};
  }

  // Override execute to throw an error since WebhookTriggerNode doesn't support execution
  async execute(): Promise<void> {
    throw new Error('WebhookTriggerNode cannot be executed directly. It is triggered by incoming webhooks.');
  }

  // Method to handle incoming webhook requests
  async handleWebhook(
    payload: any,
    headers: { [key: string]: string },
    query: { [key: string]: string }
  ): Promise<void> {
    Logger.log(`Received webhook at ${this.inputs.url} with payload: ${JSON.stringify(payload)}`);

    // Validate headers if expectedHeaders are configured
    if (this.inputs.expectedHeaders) {
      for (const [key, value] of Object.entries(this.inputs.expectedHeaders)) {
        if (headers[key] !== value) {
          throw new Error(`Invalid header value for ${key}. Expected ${value}, got ${headers[key]}`);
        }
      }
    }

    // Validate payload if validatePayload is true and payloadSchema is provided
    if (this.inputs.validatePayload && this.inputs.payloadSchema) {
      try {
        this.inputs.payloadSchema.parse(payload);
      } catch (error) {
        Logger.error(`Payload validation failed: ${error}`);
        throw new Error(`Invalid webhook payload: ${error}`);
      }
    }

    // Store the webhook data in outputs
    this.outputs = {
      payload,
      headers,
      query,
      timestamp: Date.now(),
    };

    Logger.log(`Webhook processed successfully for node ${this.id}`);
  }

  // Override toJSON to include webhook-specific properties
  override toJSON() {
    return {
      ...super.toJSON(),
      inputs: {
        ...this.inputs,
        // Convert ZodSchema to JSON-serializable format if present
        payloadSchema: this.inputs.payloadSchema ? this.inputs.payloadSchema.toString() : undefined,
      },
    };
  }

  // Override fromJSON to handle webhook-specific properties
  static override fromJSON(json: any): WebhookTriggerNode {
    WebhookTriggerNodeSchema.parse(json); // Validate the JSON against the schema
    Logger.log(`Creating a WebhookTriggerNode ${JSON.stringify(json)}`);

    // Convert string representation of schema back to ZodSchema if present
    const payloadSchema = json.inputs.payloadSchema ? eval(json.inputs.payloadSchema) : undefined;

    const node = new WebhookTriggerNode({
      id: json.id,
      inputs: {
        ...json.inputs,
        payloadSchema,
      },
    });

    node.outputs = json.outputs || {};
    return node;
  }
}
