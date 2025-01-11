// routes/api/pipeline/execute/+server.ts
import type { PipelineConfig } from '$lib/services/schemas/PipelineConfig';
import { CredentialResolver } from '$lib/services/pipeline/context/CredentialResolver';
import { ExecutionContext } from '$lib/services/pipeline/context/ExecutionContext';
import { InputResolver } from '$lib/services/pipeline/context/InputResolver';
import { LoggingService } from '$lib/services/pipeline/LoggingService';
import { Pipeline } from '$lib/services/pipeline/Pipeline';
import { VirtualKeyService } from '$lib/services/pipeline/VirtualKeyService';
import { PipelineServerStore } from '$lib/services/stores/PipelineStore.server';
import type { RequestHandler } from '@sveltejs/kit';
import { PipelineRunsServerStore } from '$lib/services/stores/PipelineRunsStore.server';

export const POST = (async ({ request, params }) => {
  const webhookPayload = await request.json();
  const pipelineId = params.pipelineId;
  let version: number = -1

  if (!pipelineId) {
    LoggingService.error('Pipeline ID not provided');

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Pipeline ID not provided',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  try {
    // this is a mock request body for testing purposes
    const pipelineConfig = await PipelineServerStore.getPipeline(pipelineId);
    version = pipelineConfig.version;

    // Setup context with both resolvers
    const credentialResolver = new CredentialResolver(VirtualKeyService);
    const inputResolver = new InputResolver(webhookPayload);
    const context = new ExecutionContext([credentialResolver, inputResolver]);

    // Create and execute pipeline
    const pipeline = new Pipeline(pipelineConfig, context);
    const result = await pipeline.execute();

    if (!result.success) {
      console.error('Pipeline execution failed:', result.error);
      throw new Error('Pipeline execution failed', result.error);
    }

    await PipelineRunsServerStore.addPipelineRun({
      pipeline_id: pipelineId,
      input: webhookPayload,
      log: result.state,
      result: 'Success',
      version: pipelineConfig.version,
      price: 0
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    await LoggingService.error('Webhook pipeline execution failed', {
      error,
    });

    try {
      await PipelineRunsServerStore.addPipelineRun({
        pipeline_id: pipelineId,
        input: webhookPayload,
        log: { error: error?.message },
        result: 'Fail',
        price: 0,
        version: version
      });
    } catch (error: any) {
      await LoggingService.error('Failed to save pipeline run', {
        error,
      });
    }

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
