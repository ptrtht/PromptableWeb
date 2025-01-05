import type { BaseNode } from './nodes/BaseNode';
import { LLMNode } from './nodes/LLMNode';
import { APINode } from './nodes/APINode';

export class NodeService {
  private static nodes: Map<string, BaseNode> = new Map<string, BaseNode>([
    ['llm', new LLMNode()],
    ['api', new APINode()],
  ]);

  static getNode(type: string): BaseNode {
    const node = this.nodes.get(type);
    if (!node) throw new Error(`Unknown node type: ${type}`);
    return node;
  }
}
