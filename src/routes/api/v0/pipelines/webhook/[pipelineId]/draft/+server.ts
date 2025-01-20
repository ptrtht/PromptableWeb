import type { PipelineConfig } from '$lib/services/schemas/PipelineConfig';
import { CredentialResolver } from '$lib/services/pipeline/context/CredentialResolver';
import { ExecutionContext, NodeStateSchema } from '$lib/services/pipeline/context/ExecutionContext';
import { InputResolver } from '$lib/services/pipeline/context/InputResolver';
import { LoggingService } from '$lib/services/pipeline/LoggingService';
import { Pipeline } from '$lib/services/pipeline/Pipeline';
import { VirtualKeyService } from '$lib/services/pipeline/VirtualKeyService';
import { PipelineServerStore } from '$lib/services/stores/PipelineStore.server';
import type { RequestHandler } from '@sveltejs/kit';
import { PipelineRunsServerStore } from '$lib/services/stores/PipelineRunsStore.server';
import { UserResolver } from '$lib/services/pipeline/context/UserResolver';
import { z } from 'zod';

// Optional exe cution parameters schema
const ExecutionParamsSchema = z
  .object({
    initialState: z.record(NodeStateSchema).optional(),
    untilNodeId: z.string().optional(),
  })
  .optional();

export const POST = (async ({ request, params, url }) => {
  const pipelineId = params.pipelineId;
  let version: number = -1;
  const env = url.searchParams.get('env');

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

  // Parse request body - could be just webhook payload or payload with execution params
  const rawBody = await request.json();
  const executionParams = ExecutionParamsSchema.safeParse(rawBody);

  try {
    // Extract webhook payload or input
    const webhookPayload = executionParams.success ? rawBody.input ?? rawBody : rawBody;
    const { initialState, untilNodeId } = executionParams.success ? rawBody : {};

    // Get pipeline configuration
    const draftPipelineConfig = await PipelineServerStore.getPipelineDraft(pipelineId);
    const pipelineConfig = await PipelineServerStore.getPipeline(pipelineId);

    pipelineConfig.pipeline = draftPipelineConfig.pipeline as any;
    pipelineConfig.version = draftPipelineConfig.version;

    version = pipelineConfig.version;

    // Setup context with all resolvers
    const credentialResolver = new CredentialResolver(VirtualKeyService);
    const inputResolver = new InputResolver(webhookPayload);
    const userResolver = new UserResolver(pipelineConfig.user_id);
    const context = new ExecutionContext([credentialResolver, inputResolver, userResolver]);

    // Create and execute pipeline
    const pipeline = new Pipeline(pipelineConfig, context);
    await pipeline.initialize();

    const result = await pipeline.execute({
      initialState,
      untilNodeId,
    });

    if (!result.success) {
      console.error('Pipeline execution failed:', result.error);
      throw new Error('Pipeline execution failed: ' + JSON.stringify(result));
    }

    // Only save to pipeline runs if this is a complete execution
    if (!untilNodeId) {
      await PipelineRunsServerStore.addPipelineRun({
        pipeline_id: pipelineId,
        input: webhookPayload,
        log: result.state,
        result: 'Success',
        version: pipelineConfig.version,
        price: result.price,
        environment: env ?? 'Live',
      });
    }

    // Get the appropriate output node
    const outputNodeId =
      untilNodeId || pipelineConfig.pipeline.executionOrder[pipelineConfig.pipeline.executionOrder.length - 1];

    return Response.json(
      {
        executionData: result,
        output: result.state[outputNodeId]?.output,
        partial: !!untilNodeId,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    await LoggingService.error('Webhook pipeline execution failed', {
      error,
    });

    // Only save failed runs if this was a complete execution attempt
    if (!rawBody?.untilNodeId) {
      try {
        await PipelineRunsServerStore.addPipelineRun({
          pipeline_id: pipelineId,
          input: rawBody,
          log: { error: error?.message },
          result: 'Fail',
          price: 0,
          version: version,
          environment: env ?? 'Live',
        });
      } catch (error: any) {
        await LoggingService.error('Failed to save pipeline run', {
          error,
        });
      }
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
