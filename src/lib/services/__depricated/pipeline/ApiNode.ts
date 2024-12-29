// import { BaseNode } from './BaseNode';
// import type { NodeJson } from './types';

// export type ApiNodeInputs = {
//   url: string;
//   method: 'GET' | 'POST';
//   headers: Record<string, string> | null;
//   body?: object | null;
// };

// export interface ApiNodeOutputs {
//   response: object;
//   status: number;
// }

// export class ApiNode extends BaseNode<ApiNodeInputs, ApiNodeOutputs> {
//   constructor(id: string) {
//     super(id, 'ApiNode');
//   }

//   async transform(inputs: ApiNodeInputs): Promise<ApiNodeOutputs> {
//     console.log(`🌐 ${this.id}: Making ${inputs.method} request to ${inputs.url}`);
//     console.log(`📝 ${this.id}: Using inputs:`, inputs);

//     const response = await fetch(inputs.url, {
//       method: inputs.method,
//       headers: {
//         ...inputs.headers,
//         ...inputs.headers,
//       },
//       body: inputs.method === 'POST' ? JSON.stringify(inputs.body) : undefined,
//     });

//     const data = await response.json();
//     console.log(`✅ ${this.id}: Received:`, data);

//     return {
//       response: data,
//       status: response.status,
//     };
//   }

//   static fromJson(json: NodeJson<ApiNode>): ApiNode {
//     const node = new ApiNode(json.id);
//     node.inputs = json.inputs;
//     node.outputs = json.outputs;

//     return node;
//   }
// }
