import { z } from 'zod';
import { BaseNode, BaseNodeSchema } from './BaseNode';
import { Logger } from '../Logger';
import OpenAI from 'openai';

// Define the schema for an OpenAINode
export const OpenAINodeSchema = BaseNodeSchema.extend({
  type: z.literal('OpenAINode'),
  inputs: z.object({
    prompt: z.string(),
    model: z.string(),
    // Optional parameters that could be useful
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().positive().optional(),
  }),
  outputs: z
    .object({
      completion: z.string().optional(),
      fullResponse: z.any().optional(),
    })
    .optional(),
});

const openai = new OpenAI({
  apiKey:
    'XXX',
  dangerouslyAllowBrowser: true,
});

export type OpenAINodeType = z.infer<typeof OpenAINodeSchema>;

export class OpenAINode extends BaseNode {
  inputs: {
    prompt: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
  };
  outputs: {
    completion?: string;
    fullResponse?: any;
  };

  constructor({
    id,
    inputs = {
      prompt: '',
      model: 'gpt-3.5-turbo',
    },
  }: {
    id: string;
    inputs?: {
      prompt: string;
      model: string;
      temperature?: number;
      maxTokens?: number;
    };
  }) {
    super(id, 'OpenAINode');
    this.inputs = inputs;
    this.outputs = {};
  }

  async execute(): Promise<void> {
    const { prompt, model, temperature = 0.7, maxTokens } = this.inputs;

    Logger.log(`Making OpenAI API request with model: ${model}, prompt: ${prompt}`);

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        ...(maxTokens && { max_tokens: maxTokens }),
      });

      // Store both the first completion and the full response
      this.outputs.completion = response.choices[0].message.content || '';
      this.outputs.fullResponse = response;
    } catch (error) {
      Logger.error('Error in OpenAI node execution:', error);
      console.error;
      throw error;
    }
  }

  static override fromJSON(json: any): OpenAINode {
    OpenAINodeSchema.parse(json);
    Logger.log(`Creating an OpenAINode ${JSON.stringify(json)}`);
    const node = new OpenAINode({
      id: json.id,
      inputs: json.inputs,
    });
    node.outputs = json.outputs || {};
    return node;
  }
}
