import { z } from 'zod';

// Define the base schema for a node
export const BaseNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  inputs: z.record(z.any()),
  outputs: z.record(z.any()),
});

export type BaseNodeType = z.infer<typeof BaseNodeSchema>;

// BaseNode class
export class BaseNode {
  id: string;
  name: string;
  description: string;
  type: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };

  constructor(id: string, type: string) {
    this.id = id.toLowerCase().replace(/\s/g, '-');
    this.type = type;
    this.name = id;
    this.inputs = {};
    this.outputs = {};
    this.description = 'A base node';
  }

  async execute(): Promise<void> {
    // Placeholder for execution logic in derived classes
  }

  toJSON(): BaseNodeType {
    return {
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
    };
  }

  static fromJSON(json: BaseNodeType | any): BaseNode {
    BaseNodeSchema.parse(json); // Validate the JSON against the schema
    const node = new BaseNode(json.id, json.type);
    node.inputs = json.inputs;
    node.outputs = json.outputs;
    return node;
  }
}
