import type { TriggerConfigType } from '$lib/schemas/PipelineConfig';
import type { BaseTrigger } from './nodes/triggers/BaseTrigger';
import { WebhookTrigger } from './nodes/triggers/WebhookTrigger';

export class TriggerService {
  private static triggers: Map<string, BaseTrigger> = new Map([['webhook', new WebhookTrigger()]]);

  static async initializeTrigger(config: TriggerConfigType): Promise<BaseTrigger> {
    const trigger = this.triggers.get(config.type);
    if (!trigger) {
      throw new Error(`Unknown trigger type: ${config.type}`);
    }

    await trigger.initialize(config);
    return trigger;
  }

  static async validateTriggerInput(trigger: BaseTrigger, input: unknown) {
    return trigger.validateInput(input);
  }
}
