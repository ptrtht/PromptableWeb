// import type { ApiNode } from './ApiNode';
// import { BaseNode } from './BaseNode';

// export type NodeTypes = {
//   ['ApiNode']: typeof ApiNode;
//   ['BaseNode']: typeof BaseNode;
// };

// export type NodeTypeString = keyof NodeTypes;

// // Type-safe JSON representations
// export interface NodeJson<T extends BaseNode<any, any>> {
//   id: string;
//   type: NodeTypeString;
//   inputs: T['inputs'];
//   outputs: T['outputs'];
//   inputConnections: string[];
//   outputConnections: string[];
// }
