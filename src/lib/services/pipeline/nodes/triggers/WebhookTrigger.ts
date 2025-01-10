import { z } from 'zod';
import { BaseTrigger } from './BaseTrigger';
import type { WebhookTriggerConfigType } from '$lib/services/schemas/PipelineConfig';
import { LoggingService } from '../../LoggingService';

export class WebhookTrigger extends BaseTrigger {
  readonly type = 'webhook';

  async initialize(config: WebhookTriggerConfigType): Promise<void> {
    this._config = config;
    LoggingService.debug('Initialized webhook trigger', { config });
  }
}
