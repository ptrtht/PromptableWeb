import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrentlyActiveNodeType = null | 'input' | 'addNode' | keyof PipelineConfigJson['nodes'];

// same as CurrentlyActiveNodeType except for null
export type NodeNameType = 'input' | 'addNode' | keyof PipelineConfigJson['nodes'];

export const getCurlCommandForPipeline = (params: {
  pipelineId: string;
  apiKey: string;
  body: Record<string, any>;
}) => {
  return `curl -X GET https://api.pipeline.ai/pipeline/${params.pipelineId} \\
    -H x-api-key: ${params.apiKey} \\
    -H "Content-Type: application/json" \\
    -d '${JSON.stringify(params.body)}'
  `;
};

export const getSdkCommandForPipeline = (params: { pipelineId: string; apiKey: string; body: Record<string, any> }) => {
  return `const promptable = new Promptable('${params.apiKey}');
  const result = await promptable.pipeline('${params.pipelineId}', ${JSON.stringify(params.body)});
  console.log(result);`;
};
