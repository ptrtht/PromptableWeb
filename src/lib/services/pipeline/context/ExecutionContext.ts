import type { VariableResolver } from './VariableResolver';

export type NodeState = {
  input: any;
  output: any;
  timestamp: number;
  status: 'completed' | 'error';
};

export class ExecutionContext {
  private nodeState = new Map<string, {
    input: any;
    output: any;
    timestamp: number;
    status: 'completed' | 'error';
  }>();
  private resolvers = new Map<string, VariableResolver>();

  constructor(resolvers: VariableResolver[]) {
    resolvers.forEach(resolver => {
      this.resolvers.set(resolver.namespace, resolver);
    });
  }

  setNodeState(nodeId: string, input: any, output: any, status: 'completed' | 'error' = 'completed') {
    this.nodeState.set(nodeId, {
      input,
      output,
      timestamp: Date.now(),
      status
    });
  }

  getNodeOutput(nodeId: string) {
    return this.nodeState.get(nodeId)?.output;
  }

  getNodeStatus(nodeId: string) {
    return this.nodeState.get(nodeId)?.status;
  }

  getAllState() {
    return Object.fromEntries(this.nodeState);
  }

  async resolveVariable(namespace: string, key: string): Promise<string> {
    const resolver = this.resolvers.get(namespace);
    if (!resolver) {
      throw new Error(`No resolver found for namespace: ${namespace}`);
    }
    return resolver.resolve(key, this);
  }

  getResolver(namespace: string): VariableResolver | undefined {
    return this.resolvers.get(namespace);
  }

  clear() {
    this.nodeState.clear();
  }
}