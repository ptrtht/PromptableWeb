import { LoggingService } from '../pipeline/LoggingService';
import type { LLMPriceUsage, LLMProvider, LLMUsage } from '../schemas/nodes/LLMNode';

export class LLMPricingStore {
  static async getLLMPromptCost({
    provider,
    model,
    tokens_input,
    tokens_output,
  }: {
    provider: LLMProvider;
    model: string;
    tokens_input: number;
    tokens_output: number;
  }): Promise<LLMPriceUsage> {
    if (provider === 'openai') {
      return LLMPricingStore.getOpenaiPromptCost({ model, tokens_input, tokens_output });
    }

    if (provider === 'anthropic') {
      return LLMPricingStore.getAnthropicPromptCost({ model, tokens_input, tokens_output });
    }

    if (provider === 'grok') {
      return LLMPricingStore.getGrokPromptCost({ model, tokens_input, tokens_output });
    }

    LoggingService.warn(`Provider ${provider} not found in LLMPricingStore`);
    return {
      prompt_tokens_cost: 0,
      completion_tokens_cost: 0,
      total_cost: 0,
    };
  }

  static async getOpenaiPromptCost({
    model,
    tokens_input,
    tokens_output,
  }: {
    model: string;
    tokens_input: number;
    tokens_output: number;
  }): Promise<LLMPriceUsage> {
    // a model is either fine tuned:
    // ft:gpt-4o-mini:my-org:custom_suffix:id

    // or not fine tuned:
    // gpt-4o

    let isFineTuned = model.startsWith('ft:');

    // if the model is fine tuned, get the base model
    let modelName = isFineTuned ? model.split(':')[1] : model;

    if (!modelName) {
      LoggingService.warn(`Model name not found in ${model}`);
      return {
        prompt_tokens_cost: 0,
        completion_tokens_cost: 0,
        total_cost: 0,
      };
    }

    let pricing = openaiPricing[modelName];

    // if the model is not found, return 0
    if (!pricing) {
      LoggingService.warn(`Model ${model} not found in pricing store`);
      return {
        prompt_tokens_cost: 0,
        completion_tokens_cost: 0,
        total_cost: 0,
      };
    }

    // if the model is fine tuned, get the fine tuned pricing
    let input_tokens_cost = isFineTuned ? pricing.fine_tuned?.input : pricing.input;
    let output_tokens_cost = isFineTuned ? pricing.fine_tuned?.output : pricing.output;

    if (!input_tokens_cost || !output_tokens_cost) {
      LoggingService.warn(`Model ${model} has no pricing`);
      return {
        prompt_tokens_cost: 0,
        completion_tokens_cost: 0,
        total_cost: 0,
      };
    }

    let prompt_tokens_cost = (input_tokens_cost * tokens_input) / 1_000_000;
    let completion_tokens_cost = (output_tokens_cost * tokens_output) / 1_000_000;
    let total_cost = prompt_tokens_cost + completion_tokens_cost;

    return {
      prompt_tokens_cost,
      completion_tokens_cost,
      total_cost,
    };
  }

  static async getAnthropicPromptCost({
    model,
    tokens_input,
    tokens_output,
  }: {
    model: string;
    tokens_input: number;
    tokens_output: number;
  }): Promise<LLMPriceUsage> {
    // the model name is like claude-3-haiku-20240307, or claude-X-ASD-DSA-20240307
    let modelName = model.split('-').slice(0, -1).join('-');

    let pricing = anthropicPricing[modelName];

    if (!pricing) {
      LoggingService.warn(`Model ${model} not found in pricing store`);
      return {
        prompt_tokens_cost: 0,
        completion_tokens_cost: 0,
        total_cost: 0,
      };
    }

    let prompt_tokens_cost = (pricing.input * tokens_input) / 1_000_000;
    let completion_tokens_cost = (pricing.output * tokens_output) / 1_000_000;
    let total_cost = prompt_tokens_cost + completion_tokens_cost;

    return {
      prompt_tokens_cost,
      completion_tokens_cost,
      total_cost,
    };
  }

  static async getGrokPromptCost({
    model,
    tokens_input,
    tokens_output,
  }: {
    model: string;
    tokens_input: number;
    tokens_output: number;
  }): Promise<LLMPriceUsage> {
    let pricing = grokPricing[model];

    if (!pricing) {
      LoggingService.warn(`Model ${model} not found in pricing store`);
      return {
        prompt_tokens_cost: 0,
        completion_tokens_cost: 0,
        total_cost: 0,
      };
    }

    let prompt_tokens_cost = (pricing.input * tokens_input) / 1_000_000;
    let completion_tokens_cost = (pricing.output * tokens_output) / 1_000_000;
    let total_cost = prompt_tokens_cost + completion_tokens_cost;

    return {
      prompt_tokens_cost,
      completion_tokens_cost,
      total_cost,
    };
  }
}

type LLMPricing = {
  /**
   * @description Price is per 1,000,000 tokens
   */
  [model: string]: {
    input: number;
    output: number;
    fine_tuned: {
      input: number;
      output: number;
    } | null;
  };
};

const openaiPricing: LLMPricing = {
  'gpt-4o': {
    input: 2.5,
    output: 10.0,
    fine_tuned: {
      input: 3.75,
      output: 15.0,
    },
  },
  'gpt-4o-mini': {
    input: 0.15,
    output: 0.6,
    fine_tuned: {
      input: 0.3,
      output: 1.2,
    },
  },
  o1: {
    input: 15.0,
    output: 60.0,
    fine_tuned: null,
  },
  'o1-mini': {
    input: 3.0,
    output: 12.0,
    fine_tuned: null,
  },
  'chatgpt-4o-latest': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'gpt-4-turbo': {
    input: 10.0,
    output: 30.0,
    fine_tuned: null,
  },
  'gpt-4-turbo-2024-04-09': {
    input: 10.0,
    output: 30.0,
    fine_tuned: null,
  },
  'gpt-4': {
    input: 30.0,
    output: 60.0,
    fine_tuned: null,
  },
  'gpt-4-32k': {
    input: 60.0,
    output: 120.0,
    fine_tuned: null,
  },
  'gpt-4-0125-preview': {
    input: 10.0,
    output: 30.0,
    fine_tuned: null,
  },
  'gpt-4-1106-preview': {
    input: 10.0,
    output: 30.0,
    fine_tuned: null,
  },
  'gpt-4-vision-preview': {
    input: 10.0,
    output: 30.0,
    fine_tuned: null,
  },
  'gpt-3.5-turbo': {
    input: 0.5,
    output: 1.5,
    fine_tuned: {
      input: 3.0,
      output: 6.0,
    },
  },
  'gpt-3.5-turbo-0125': {
    input: 0.5,
    output: 1.5,
    fine_tuned: null,
  },
  'gpt-3.5-turbo-instruct': {
    input: 1.5,
    output: 2.0,
    fine_tuned: null,
  },
  'gpt-3.5-turbo-1106': {
    input: 1.0,
    output: 2.0,
    fine_tuned: null,
  },
  'gpt-3.5-turbo-0613': {
    input: 1.5,
    output: 2.0,
    fine_tuned: null,
  },
  'gpt-3.5-turbo-16k-0613': {
    input: 3.0,
    output: 4.0,
    fine_tuned: null,
  },
  'gpt-3.5-turbo-0301': {
    input: 1.5,
    output: 2.0,
    fine_tuned: null,
  },
  'davinci-002': {
    input: 2.0,
    output: 2.0,
    fine_tuned: {
      input: 12.0,
      output: 12.0,
    },
  },
  'babbage-002': {
    input: 0.4,
    output: 0.4,
    fine_tuned: {
      input: 1.6,
      output: 1.6,
    },
  },
};

const anthropicPricing: LLMPricing = {
  'claude-3-5-sonnet': {
    input: 3.0,
    output: 15.0,
    fine_tuned: null,
  },
  'claude-3-5-haiku': {
    input: 0.8,
    output: 4.0,
    fine_tuned: null,
  },
  'claude-3-opus': {
    input: 15.0,
    output: 75.0,
    fine_tuned: null,
  },
  'claude-3-haiku': {
    input: 0.25,
    output: 1.25,
    fine_tuned: null,
  },
  'claude-3-sonnet': {
    input: 3.0,
    output: 15.0,
    fine_tuned: null,
  },
};

const grokPricing: LLMPricing = {
  'grok-beta': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'grok-2': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'grok-2-latest': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'grok-2-1212': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'grok-vision-beta': {
    input: 5.0,
    output: 15.0,
    fine_tuned: null,
  },
  'grok-2-vision-1212': {
    input: 2.0,
    output: 10.0,
    fine_tuned: null,
  },
  'grok-2-vision': {
    input: 2.0,
    output: 10.0,
    fine_tuned: null,
  },
  'grok-2-vision-latest': {
    input: 2.0,
    output: 10.0,
    fine_tuned: null,
  },
};
