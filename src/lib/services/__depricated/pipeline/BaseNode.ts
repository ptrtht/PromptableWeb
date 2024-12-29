// import type { Connection } from './Connections';
// import type { NodeJson, NodeTypes, NodeTypeString } from './types';

// export abstract class BaseNode<TInputs extends Record<string, any> = {}, TOutputs extends Record<string, any> = {}> {
//   id: string;
//   inputs: TInputs;
//   outputs: TOutputs;
//   inputConnections: Connection<any, this>[] = [];
//   outputConnections: Connection<this, any>[] = [];
//   readonly type: NodeTypeString;

//   constructor(id: string, type: NodeTypeString) {
//     this.id = id;
//     this.inputs = {} as TInputs;
//     this.outputs = {} as TOutputs;
//     this.type = type;
//   }

//   getJson(): NodeJson<this> {
//     return {
//       id: this.id,
//       type: this.constructor.name as NodeTypeString,
//       inputs: this.inputs,
//       outputs: this.outputs,
//       inputConnections: this.inputConnections.map((conn) => `${conn.sourceNodeId} -> ${conn.targetNodeId}`),
//       outputConnections: this.outputConnections.map((conn) => `${conn.sourceNodeId} -> ${conn.targetNodeId}`),
//     };
//   }

//   abstract transform(inputs: TInputs): Promise<TOutputs>;

//   addInputConnection(connection: Connection<any, this>) {
//     this.inputConnections.push(connection);
//   }

//   addOutputConnection(connection: Connection<this, any>) {
//     this.outputConnections.push(connection);
//   }
// }
