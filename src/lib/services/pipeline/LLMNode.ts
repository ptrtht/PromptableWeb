import { z } from 'zod';
import { BaseNode, BaseNodeSchema } from './BaseNode';
import { Logger } from '../Logger';

const OpenAIModels = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] as const;
const AnthropicModels = ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] as const;

type OpenAIModel = (typeof OpenAIModels)[number];
type AnthropicModel = (typeof AnthropicModels)[number];

type ProviderModel = `openai/${OpenAIModel}` | `anthropic/${AnthropicModel}`;

const ProviderModelSchema = z.custom<ProviderModel>((val) => {
  if (typeof val !== 'string') return false;
  const [provider, model] = val.split('/');

  if (provider === 'openai') {
    return OpenAIModels.includes(model as OpenAIModel);
  }
  if (provider === 'anthropic') {
    return AnthropicModels.includes(model as AnthropicModel);
  }
  return false;
}, 'Invalid provider/model combination');

export const LLMNodeSchema = BaseNodeSchema.extend({
  type: z.literal('LLMNode'),
  inputs: z.object({
    provider_model: ProviderModelSchema,
    messages: z.array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })
    ),
    temperature: z.number().min(0).max(2).optional(),
    max_tokens: z.number().positive().optional(),
    stop_sequences: z.array(z.string()).optional(),
  }),
  outputs: z
    .object({
      response: z.string().optional(),
      usage: z
        .object({
          prompt_tokens: z.number(),
          completion_tokens: z.number(),
          total_tokens: z.number(),
        })
        .optional(),
      finish_reason: z.enum(['stop', 'length', 'content_filter']).optional(),
    })
    .optional(),
});

export type LLMNodeType = z.infer<typeof LLMNodeSchema>;

export class LLMNode extends BaseNode {
  inputs: {
    provider_model: ProviderModel;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
    stop_sequences?: string[];
  };

  outputs: {
    response?: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    finish_reason?: 'stop' | 'length' | 'content_filter';
  };

  constructor({
    id,
    inputs = {
      provider_model: 'openai/gpt-4',
      messages: [],
      temperature: 0.7,
    },
  }: {
    id: string;
    inputs?: {
      provider_model: ProviderModel;
      messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }>;
      temperature?: number;
      max_tokens?: number;
      stop_sequences?: string[];
    };
  }) {
    super(id, 'LLMNode');
    this.description = 'Make an LLM API call';
    this.inputs = inputs;
    this.outputs = {};
  }

  private getProviderAndModel(): [provider: 'openai' | 'anthropic', model: OpenAIModel | AnthropicModel] {
    const [provider, model] = this.inputs.provider_model.split('/') as [
      'openai' | 'anthropic',
      OpenAIModel | AnthropicModel
    ];
    return [provider, model];
  }

  async execute(): Promise<void> {
    const [provider, model] = this.getProviderAndModel();
    Logger.log(`Executing LLM call with ${provider}/${model}`);

    try {
      let result;
      switch (provider) {
        case 'openai':
          result = await this.callOpenAI(model as OpenAIModel);
          break;
        case 'anthropic':
          result = await this.callAnthropic(model as AnthropicModel);
          break;
      }

      this.outputs = {
        response: result.response,
        usage: result.usage,
        finish_reason: result.finish_reason,
      };
    } catch (error) {
      Logger.error(`LLM call failed: ${error}`);
      throw error;
    }
  }

  private async callOpenAI(model: OpenAIModel): Promise<any> {
    // OpenAI-specific implementation
    throw new Error('Not implemented');
  }

  private async callAnthropic(model: AnthropicModel): Promise<any> {
    // Anthropic-specific implementation
    throw new Error('Not implemented');
  }

  static override fromJSON(json: any): LLMNode {
    LLMNodeSchema.parse(json);
    return new LLMNode({
      id: json.id,
      inputs: json.inputs,
    });
  }
}
