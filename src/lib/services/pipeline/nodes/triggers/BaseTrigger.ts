import { z } from 'zod';
import type { WebhookTriggerConfigType } from '$lib/services/schemas/PipelineConfig';

export abstract class BaseTrigger {
  abstract readonly type: string;
  protected _config: WebhookTriggerConfigType | null = null;

  abstract initialize(config: WebhookTriggerConfigType): Promise<void>;
}
