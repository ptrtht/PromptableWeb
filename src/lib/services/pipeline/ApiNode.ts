import { z } from 'zod';
import { BaseNode, BaseNodeSchema } from './BaseNode';
import { Logger } from '../Logger';
import type { URLRequestMethod } from './utils';

// Define the schema for an ApiNode, extending the BaseNode schema
export const ApiNodeSchema = BaseNodeSchema.extend({
  type: z.literal('ApiNode'),
  inputs: z.object({
    url: z.string(),
    method: z.string(),
    headers: z.record(z.string()).optional(),
    body: z.any().optional(),
  }),
  outputs: z
    .object({
      response: z.any().optional(),
    })
    .optional(),
});

export type ApiNodeType = z.infer<typeof ApiNodeSchema>;

// ApiNode class extending BaseNode
export class ApiNode extends BaseNode {
  inputs: {
    url: string;
    method: URLRequestMethod;
    headers: { [key: string]: string };
    body?: any;
  };
  outputs: {
    response?: Record<string, any>;
    statusCode?: number;
  };

  constructor({
    id,
    inputs = {
      url: '',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  }: {
    id: string;
    inputs?: {
      url: string;
      method: URLRequestMethod;
      headers: { [key: string]: string };
      body?: any;
    };
  }) {
    super(id, 'ApiNode');
    this.description = 'Make an API call';
    this.inputs = inputs;
    this.outputs = {};
  }

  async execute(): Promise<void> {
    const { url, method, headers, body } = this.inputs;

    Logger.log(
      `Making a ${method} request to ${url}, with headers: ${JSON.stringify(headers)}, and body: ${JSON.stringify(
        body
      )}`
    );

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    this.outputs.response = data;
    this.outputs.statusCode = response.status;

    console.log(`Response from ${url}: ${JSON.stringify(data)}`);
  }

  static override fromJSON(json: any): ApiNode {
    ApiNodeSchema.parse(json); // Validate the JSON against the schema
    Logger.log(`Creating an ApiNode ${JSON.stringify(json)}`);
    const node = new ApiNode(json.id);
    node.inputs = json.inputs;
    node.outputs = json.outputs || {};
    return node;
  }
}
