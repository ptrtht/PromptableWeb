// routes/api/pipeline/execute/+server.ts
import { CredentialResolver } from '$lib/services/pipeline/context/CredentialResolver';
import { ExecutionContext } from '$lib/services/pipeline/context/ExecutionContext';
import { LoggingService } from '$lib/services/pipeline/LoggingService';
import { Pipeline } from '$lib/services/pipeline/Pipeline';
import { VirtualKeyService } from '$lib/services/pipeline/VirtualKeyService';
import { PipelineRunsServerStore } from '$lib/services/stores/PipelineRunsStore.server';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  const body = await request.json();

  // Validate pipeline configuration
  const validationResult = Pipeline.validate(body);
  if (!validationResult.success) {
    await LoggingService.error('Invalid pipeline configuration', {
      errors: validationResult.error.format(),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid pipeline configuration',
        details: validationResult.error.format(),
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
    await LoggingService.info('Starting pipeline execution', {
      pipelineId: validationResult.data.id,
      name: validationResult.data.name,
    });

    // Create and execute pipeline
    const credentialResolver = new CredentialResolver(VirtualKeyService);
    const context = new ExecutionContext([credentialResolver]);
    const pipeline = new Pipeline(validationResult.data, context);

    const result = await pipeline.execute();

    if (!result.success) {
      await LoggingService.error('Pipeline execution failed', {
        error: result.error,
        state: result.state,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Pipeline execution failed',
          details: result.error?.message,
          state: result.state,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await LoggingService.info(
      'Pipeline execution completed',
      JSON.stringify({
        pipelineId: validationResult.data.id,
        state: result.state,
      })
    );

    await PipelineRunsServerStore.addPipelineRun({
      input: body,
      log: result.state,
      pipeline_id: validationResult.data.id,
      result: 'Success',
      price: 0,
      version: validationResult.data.version,
    });

    return new Response(
      JSON.stringify({
        success: true,
        state: result.state,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    await LoggingService.error('Unexpected error during pipeline execution', {
      error,
    });

    try {
      await PipelineRunsServerStore.addPipelineRun({
        input: body,
        log: {
          error: error?.message,
        },
        pipeline_id: validationResult.data.id,
        result: 'Fail',
        version: validationResult.data.version,
        price: 0,
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
