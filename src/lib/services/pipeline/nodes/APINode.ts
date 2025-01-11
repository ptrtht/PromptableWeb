import { z } from 'zod';
import { BaseNode } from './BaseNode';
import { LoggingService } from '../LoggingService';
import { APINodeInputSchema, APINodeOutputSchema } from '$lib/services/schemas/nodes/APINode';

export class APINode extends BaseNode {
  readonly type = 'api';

  readonly inputSchema = APINodeInputSchema;

  readonly outputSchema = APINodeOutputSchema;

  async execute(config: z.infer<typeof this.inputSchema>) {
    return this.executeWithRetry(async () => {
      try {
        const response = await fetch(config.url, {
          method: config.method,
          headers: config.headers ?? undefined,
          body: config.body ? JSON.stringify(config.body) : null,
        });

        const data = await response.json();

        return {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers),
        };
      } catch {
        LoggingService.error('Error making API request, ' + config.url, config);
        return {
          status: 500,
          data: { message: 'Error' },
          headers: {},
        };
      }
    });
  }
}
