import { z } from 'zod';
import { ApiNodeSchema, ApiNode } from './ApiNode';
import { BaseNodeSchema, BaseNode } from './BaseNode';

// Define the schema for a Pipeline (simplified without connections)
export const PipelineSchema = z.object({
  nodes: z.array(ApiNodeSchema.or(BaseNodeSchema)),
  endNodeId: z.string().optional(),
});

export class Pipeline {
  nodes: Map<string, BaseNode>;
  endNodeId?: string;

  constructor() {
    this.nodes = new Map();
    this.endNodeId = undefined;
  }

  addNode(node: BaseNode): Pipeline {
    this.nodes.set(node.id, node);
    return this;
  }

  getNode<T>(nodeId: string): T {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node '${nodeId}' not found in the pipeline`);
    return node as T;
  }

  // Helper to resolve variable references in a value
  private resolveVariables(value: any, executedNodes: Map<string, BaseNode>): any {
    if (typeof value === 'string') {
      // Match pattern {{nodeId.path.to.value}}
      const matches = value.match(/{{([\w-]+)\.([\w.]+)}}/g);
      if (matches) {
        let resolvedValue = value;
        for (const match of matches) {
          const [nodeId, ...pathParts] = match.replace('{{', '').replace('}}', '').split('.');

          const sourceNode = executedNodes.get(nodeId);
          if (!sourceNode) {
            throw new Error(`Referenced node '${nodeId}' not found or not yet executed`);
          }

          // Start from outputs
          let sourceValue = sourceNode.outputs;

          // Navigate through the path
          for (const part of pathParts) {
            if (sourceValue === undefined || sourceValue === null) {
              throw new Error(`Path '${pathParts.join('.')}' not found in node '${nodeId}' outputs`);
            }
            sourceValue = sourceValue[part];
          }

          if (sourceValue === undefined || sourceValue === null) {
            throw new Error(`Value at path '${pathParts.join('.')}' in node '${nodeId}' is undefined or null`);
          }

          // If the entire path resolves to an object or array, use it directly
          if (typeof sourceValue === 'object') {
            // If this is the entire string (e.g. "{{node.response}}"), return the object
            if (value === match) {
              return sourceValue;
            }
            // Otherwise stringify for embedding in the larger string
            resolvedValue = resolvedValue.replace(match, JSON.stringify(sourceValue));
          } else {
            // For primitive values, convert to string
            resolvedValue = resolvedValue.replace(match, String(sourceValue));
          }
        }
        return resolvedValue;
      }
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) => this.resolveVariables(item, executedNodes));
      }
      const resolvedObj: { [key: string]: any } = {};
      for (const [key, val] of Object.entries(value)) {
        resolvedObj[key] = this.resolveVariables(val, executedNodes);
      }
      return resolvedObj;
    }
    return value;
  }

  // Helper method to build the dependency graph
  private buildDependencyGraph(): Map<string, Set<string>> {
    const dependencies = new Map<string, Set<string>>();

    // Initialize dependencies for each node
    for (const [nodeId, node] of this.nodes.entries()) {
      dependencies.set(nodeId, new Set<string>());

      // Look for variable references in inputs
      const inputStr = JSON.stringify(node.inputs);
      const matches = inputStr.match(/{{([\w-]+)\.([\w.]+)}}/g);

      if (matches) {
        for (const match of matches) {
          const sourceNodeId = match.replace('{{', '').replace('}}', '').split('.')[0];
          // Add the source node as a dependency for the current node
          dependencies.get(nodeId)!.add(sourceNodeId);
        }
      }
    }

    return dependencies;
  }

  // Topological sort with cycle detection
  private topologicalSort(dependencies: Map<string, Set<string>>, endNodeId: string): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: string[] = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) {
        throw new Error(`Cycle detected in the pipeline at node '${nodeId}'`);
      }
      visiting.add(nodeId);

      const nodeDependencies = dependencies.get(nodeId);
      if (nodeDependencies) {
        for (const depNodeId of nodeDependencies) {
          if (!this.nodes.has(depNodeId)) {
            throw new Error(`Node '${depNodeId}' not found in the pipeline`);
          }
          dfs(depNodeId);
        }
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
      result.push(nodeId);
    };

    dfs(endNodeId);
    return result;
  }

  async execute(endNodeId?: string): Promise<Map<string, BaseNode>> {
    const targetNodeId = endNodeId || this.endNodeId;
    if (!targetNodeId) {
      throw new Error('No end node ID provided for execution');
    }
    if (!this.nodes.has(targetNodeId)) {
      throw new Error(`End node '${targetNodeId}' not found in the pipeline`);
    }

    const dependencies = this.buildDependencyGraph();
    const executionOrder = this.topologicalSort(dependencies, targetNodeId);
    const executedNodes = new Map<string, BaseNode>();

    for (const nodeId of executionOrder) {
      const node = this.nodes.get(nodeId)!;

      // Resolve variables in inputs before execution
      const resolvedInputs = this.resolveVariables(node.inputs, executedNodes);
      node.inputs = resolvedInputs;

      await node.execute();
      executedNodes.set(nodeId, node);
    }

    return executedNodes;
  }

  toJSON() {
    const nodesArray = Array.from(this.nodes.values()).map((node) => node.toJSON());
    return {
      nodes: nodesArray,
      endNodeId: this.endNodeId,
    };
  }

  static fromJSON(json: any): Pipeline {
    PipelineSchema.parse(json);
    const pipeline = new Pipeline();
    pipeline.endNodeId = json.endNodeId;

    for (const nodeData of json.nodes) {
      let node: BaseNode;
      if (nodeData.type === 'ApiNode') {
        node = ApiNode.fromJSON(nodeData);
      } else {
        node = BaseNode.fromJSON(nodeData);
      }
      pipeline.addNode(node);
    }
    return pipeline;
  }
}
