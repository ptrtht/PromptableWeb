import { PipelineConfigSchema, type PipelineConfig } from '$lib/services/schemas/PipelineConfig';
import { z } from 'zod';
import { NodeService } from './NodeService';
import { LoggingService } from './LoggingService';
import { ExecutionContext } from './context/ExecutionContext';
import { getNestedValue } from './context/VariableResolver';
import { type CredentialResolver } from './context/CredentialResolver';

export class Pipeline {
  // Pattern for context variables like {{context.credentials.openai}}
  private static readonly CONTEXT_PATTERN = /\{\{context\.([\w]+)\.([\w\-\.]+)\}\}/g;

  // Pattern for node outputs like {{node1.output.data}}
  private static readonly NODE_PATTERN = /\{\{([\w\-]+)\.([\w\-.\[\]]+)\}\}/g;

  constructor(
    private config: PipelineConfig,
    private context: ExecutionContext
  ) {
    const credentialResolver = this.context.getResolver('credentials') as CredentialResolver;
    if (credentialResolver) {
      credentialResolver.setCredentials(this.context);
    } else {
      throw new Error('Credential resolver not found in context');
    }
  }

  async initialize() {
    // Initialize credentials
    const credentialResolver = this.context.getResolver('credentials') as CredentialResolver;
    if (credentialResolver) {
      await credentialResolver.setCredentials(this.context);
    } else {
      throw new Error('Credential resolver not found in context');
    }
  }

  private getNodeValue(path: string): any {
    const [nodeId, ...pathParts] = path.split('.');

    const nodeOutput = this.context.getNodeOutput(nodeId);
    if (!nodeOutput) {
      throw new Error(`Node ${nodeId} output not found`);
    }

    const value = getNestedValue(nodeOutput, pathParts.join('.'));
    if (value === undefined) {
      throw new Error(`Path ${path} not found in node output`);
    }

    return value;
  }

  private async resolveVariablesDeep(obj: any): Promise<any> {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map((item) => this.resolveVariablesDeep(item)));
    }

    if (obj !== null && typeof obj === 'object') {
      const resolved: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = await this.resolveVariablesDeep(value);
      }
      return resolved;
    }

    if (typeof obj === 'string') {
      let resolvedString = obj;

      // First resolve context variables
      const contextMatches = [...obj.matchAll(Pipeline.CONTEXT_PATTERN)];
      for (const match of contextMatches) {
        const [fullMatch, namespace, key] = match;
        try {
          const value = await this.context.resolveVariable(namespace, key);
          resolvedString = resolvedString.replace(fullMatch, value);
        } catch (error) {
          throw LoggingService.error('Context variable resolution failed', { namespace, key, error });
        }
      }

      // Then resolve node output references
      const nodeMatches = [...resolvedString.matchAll(Pipeline.NODE_PATTERN)];
      for (const match of nodeMatches) {
        const [fullMatch, nodeId, path] = match;
        try {
          const value = this.getNodeValue(`${nodeId}.${path}`);
          resolvedString = resolvedString.replace(fullMatch, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (error) {
          LoggingService.error('Node output resolution failed', { nodeId, path, error });
          throw error;
        }
      }

      return resolvedString;
    }

    return obj;
  }

  async execute(): Promise<{ success: boolean; state: any; error?: Error }> {
    try {
      for (const nodeId of this.config.pipeline.executionOrder) {
        const nodeConfig = this.config.pipeline.nodes[nodeId];
        if (!nodeConfig) {
          throw new Error(`Node ${nodeId} not found in pipeline configuration`);
        }

        const node = NodeService.getNode(nodeConfig.type);
        await LoggingService.log('info', `Executing node ${nodeId}`, { type: nodeConfig.type });

        // Resolve variables in config
        const resolvedConfig = await this.resolveVariablesDeep(nodeConfig.config);
        LoggingService.debug('Resolved node config', resolvedConfig);

        // Execute node
        const result = await node.execute(resolvedConfig, this.context);
        await LoggingService.log('debug', `Node ${nodeId} execution result`, result);

        if (!result.success) {
          await LoggingService.log('error', `Execution failed for node ${nodeId}, result: `, result);
          this.context.setNodeState(nodeId, resolvedConfig, null, 'error');
          throw result.error;
        }

        // Store result with input
        this.context.setNodeState(nodeId, resolvedConfig, result.data);
        await LoggingService.log('info', `Node ${nodeId} completed`, {
          input: resolvedConfig,
          output: result.data,
        });
      }

      return {
        success: true,
        state: this.context.getAllState(),
      };
    } catch (error: any) {
      return {
        success: false,
        state: this.context.getAllState(),
        error,
      };
    }
  }

  static validate(config: unknown): z.SafeParseReturnType<any, PipelineConfig> {
    const result = PipelineConfigSchema.safeParse(config);

    if (result.success) {
      // Additional validation:
      // 1. Check if executionOrder contains all nodes
      const nodeIds = new Set(Object.keys(result.data.pipeline.nodes));
      const orderIds = new Set(result.data.pipeline.executionOrder);

      if (nodeIds.size !== orderIds.size) {
        return {
          success: false,
          error: new z.ZodError([
            {
              code: z.ZodIssueCode.custom,
              path: ['executionOrder'],
              message: 'Execution order must contain all and only the configured nodes',
            },
          ]),
        };
      }

      for (const id of nodeIds) {
        if (!orderIds.has(id)) {
          return {
            success: false,
            error: new z.ZodError([
              {
                code: z.ZodIssueCode.custom,
                path: ['executionOrder'],
                message: `Node ${id} is missing from execution order`,
              },
            ]),
          };
        }
      }
    }

    return result;
  }
}
