// routes/api/pipeline/execute/+server.ts
import type { PipelineConfig } from '$lib/schemas/PipelineConfig';
import { CredentialResolver } from '$lib/services/pipeline/context/CredentialResolver';
import { ExecutionContext } from '$lib/services/pipeline/context/ExecutionContext';
import { InputResolver } from '$lib/services/pipeline/context/InputResolver';
import { LoggingService } from '$lib/services/pipeline/LoggingService';
import { Pipeline } from '$lib/services/pipeline/Pipeline';
import { VirtualKeyService } from '$lib/services/pipeline/VirtualKeyService';
import { PipelineServerStore } from '$lib/services/stores/PipelineStore.server';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request, params }) => {
  try {
    const webhookPayload = await request.json();
    const pipelineId = params.pipelineId;

    if (!pipelineId) throw LoggingService.error('Pipeline ID not provided');

    // this is a mock request body for testing purposes
    const pipelineConfig = await PipelineServerStore.getPipeline(pipelineId);

    // Setup context with both resolvers
    const credentialResolver = new CredentialResolver(VirtualKeyService);
    const inputResolver = new InputResolver(webhookPayload);
    const context = new ExecutionContext([credentialResolver, inputResolver]);

    // Create and execute pipeline
    const pipeline = new Pipeline(pipelineConfig, context);
    const result = await pipeline.execute();

    if (!result.success) {
      console.error('Pipeline execution failed:', result.error);
      return new Response(JSON.stringify({ error: result.error?.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    await LoggingService.error('Webhook pipeline execution failed', {
      error,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error?.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}) satisfies RequestHandler;
