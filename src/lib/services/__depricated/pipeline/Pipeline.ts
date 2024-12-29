// import { browser } from '$app/environment';
// import { writable } from 'svelte/store';
// import type { Connection } from './Connections';
// import { BaseNode } from './BaseNode';
// import { Errors } from '../Errors';

// export class Pipeline {
//   private nodes: Map<string, BaseNode<any, any>> = new Map();
//   private connections: Connection<any, any>[] = [];

//   addNode<T extends BaseNode<any, any>>(node: T): Pipeline {
//     // check if node already exists
//     if (this.nodes.has(node.id)) {
//       if (browser) alert(`Node with id ${node.id} already exists`);
//       return this;
//     }

//     this.nodes.set(node.id, node);
//     return this;
//   }

//   setNode<T extends BaseNode<any, any>>(node: T): Pipeline {
//     this.nodes.set(node.id, node);
//     return this;
//   }

//   getNode<T extends BaseNode<any, any>>(nodeId: string): T | undefined {
//     const node = this.nodes.get(nodeId);
//     if (!node) {
//       if (browser) alert(`Node with id ${nodeId} not found`);
//       throw Errors.error(`Node with id ${nodeId} not found`);
//     }
//     return node as T;
//   }

//   connect<TSource extends BaseNode<any, any>, TTarget extends BaseNode<any, any>>(
//     connection: Connection<TSource, TTarget>
//   ) {
//     const sourceNode = this.nodes.get(connection.sourceNodeId) as TSource;
//     const targetNode = this.nodes.get(connection.targetNodeId) as TTarget;

//     if (!sourceNode || !targetNode) {
//       throw new Error('Source or target node not found');
//     }

//     sourceNode.addOutputConnection(connection);
//     targetNode.addInputConnection(connection);
//     this.connections.push(connection);
//   }

//   private async executeNode<T extends BaseNode<any, any>>(
//     nodeId: string,
//     executedNodes: Map<string, any>
//   ): Promise<Map<string, any>> {
//     console.log(`⭐ Starting execution of node: ${nodeId}`);

//     const node = this.nodes.get(nodeId) as T;
//     if (!node) {
//       console.error(`❌ Node ${nodeId} not found`);
//       throw new Error(`Node ${nodeId} not found`);
//     }

//     if (executedNodes.has(nodeId)) {
//       console.log(`🔄 Node ${nodeId} already executed, reusing result`);
//       return executedNodes;
//     }

//     console.log(`📥 Collecting inputs for node ${nodeId}`);
//     const inputPromises = node.inputConnections.map(async (connection) => {
//       console.log(`  ⛓️  Following connection from ${connection.sourceNodeId} to ${nodeId}`);
//       await this.executeNode(connection.sourceNodeId, executedNodes);
//       return {
//         connection,
//         sourceOutput: executedNodes.get(connection.sourceNodeId),
//       };
//     });

//     const resolvedInputs = await Promise.all(inputPromises);

//     const inputs = { ...node.inputs };
//     resolvedInputs.forEach(({ connection, sourceOutput }) => {
//       console.log(
//         `  🔗 Mapping ${connection.sourceNodeId}.${String(connection.sourceOutput)} -> ${nodeId}.${String(
//           connection.targetInput
//         )}`
//       );
//       if (connection.transform) {
//         inputs[connection.targetInput as keyof T['inputs']] = connection.transform(
//           sourceOutput[connection.sourceOutput]
//         );
//       } else {
//         inputs[connection.targetInput as keyof T['inputs']] = sourceOutput[connection.sourceOutput];
//       }
//     });

//     console.log(`🔄 Transforming node ${nodeId} with inputs:`, inputs);
//     const outputs = await node.transform(inputs);
//     console.log(`📤 Node ${nodeId} outputs:`, outputs);
//     executedNodes.set(nodeId, outputs);

//     console.log(`➡️  Processing downstream nodes from ${nodeId}`);
//     await Promise.all(
//       node.outputConnections.map((connection) => this.executeNode(connection.targetNodeId, executedNodes))
//     );

//     console.log(`✅ Completed execution of node: ${nodeId}`);
//     return executedNodes;
//   }

//   async execute<T extends BaseNode<any, any>>(startNodeId: string): Promise<Map<string, any>> {
//     const executedNodes = new Map<string, any>();
//     return this.executeNode<T>(startNodeId, executedNodes);
//   }

//   getJson() {
//     const nodesJson = Array.from(this.nodes.entries()).map(([id, node]) => ({
//       id,
//       type: node.type,
//       inputs: node.inputs,
//     }));

//     const connectionsJson = this.connections.map((conn) => ({
//       sourceNodeId: conn.sourceNodeId,
//       targetNodeId: conn.targetNodeId,
//       sourceOutput: conn.sourceOutput,
//       targetInput: conn.targetInput,
//       transform: conn.transform?.toString(),
//     }));

//     return {
//       nodes: nodesJson,
//       connections: connectionsJson,
//     };
//   }
// }

// export const pipelineEditing = writable<Pipeline>(new Pipeline());
