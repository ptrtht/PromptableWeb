import { z } from 'zod';
import { BaseNode } from './BaseNode';
import { LoggingService } from '../LoggingService';
import { APINodeInputSchema, APINodeOutputSchema } from '$lib/services/schemas/nodes/APINode';

export class APINode extends BaseNode {
  readonly type = 'api';
  readonly inputSchema = APINodeInputSchema;
  readonly outputSchema = APINodeOutputSchema;

  private async buildRequestInit(config: z.infer<typeof APINodeInputSchema>): Promise<RequestInit> {
    const init: RequestInit = {
      method: config.method,
      headers: config.headers ?? undefined,
    };

    // Only add body if not GET or HEAD
    if (config.method !== 'GET') {
      // Handle mutually exclusive payloads
      if (config.body !== undefined) {
        init.body = JSON.stringify(config.body);
        // Ensure content-type is set for JSON
        init.headers = {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        };
      } else if (config.formData !== undefined) {
        const formData = new FormData();
        Object.entries(config.formData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        init.body = formData;
        // FormData sets its own content-type header with boundary
      } else if (config.formUrlEncoded !== undefined) {
        const params = new URLSearchParams();
        Object.entries(config.formUrlEncoded).forEach(([key, value]) => {
          params.append(key, value);
        });
        init.body = params;
        init.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(init.headers || {}),
        };
      }
    } else if (config.body || config.formData || config.formUrlEncoded) {
      // If GET/HEAD and any payload is provided, log a warning
      LoggingService.warn('Request body ignored for GET/HEAD request', {
        method: config.method,
        url: config.url,
      });
    }

    return init;
  }

  private buildUrl(url: string, queryParams?: Record<string, string>): string {
    if (!queryParams) return url;

    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });

    return urlObj.toString();
  }

  private async parseResponse(response: Response): Promise<z.infer<typeof APINodeOutputSchema>['data']> {
    // Always get the raw text first
    const rawText = await response.text();
    const result: z.infer<typeof APINodeOutputSchema>['data'] = {
      raw: rawText,
    };

    // Try to parse as JSON if it looks like JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json') || rawText.trim().match(/^[\[{]/)) {
      try {
        result.json = JSON.parse(rawText);
      } catch (error) {
        LoggingService.warn('Failed to parse response as JSON', {
          contentType,
          error,
        });
        // No json field set if parsing fails
      }

      // TODO: Add more content types, such as XML, csv, file, binary etc.
    }

    return result;
  }

  async execute(config: z.infer<typeof APINodeInputSchema>) {
    return this.executeWithRetry(async () => {
      try {
        const url = this.buildUrl(config.url, config.queryParams);
        const init = await this.buildRequestInit(config);

        LoggingService.debug('Making API request', {
          url,
          method: init.method,
          headers: init.headers,
          hasBody: !!init.body,
        });

        const response = await fetch(url, init);
        const data = await this.parseResponse(response);

        const result = {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers),
        };

        // Validate output
        const outputValidation = this.outputSchema.safeParse(result);
        if (!outputValidation.success) {
          throw new Error(`Invalid response format: ${outputValidation.error.message}`);
        }

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        LoggingService.error('API request failed', {
          url: config.url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        return {
          success: false,
          error: error instanceof Error ? error : new Error('API request failed'),
        };
      }
    });
  }
}
