import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrentlyActiveNodeType = null | 'input' | 'addNode' | keyof PipelineConfigJson['nodes'];

// same as CurrentlyActiveNodeType except for null
export type NodeNameType = 'input' | 'addNode' | keyof PipelineConfigJson['nodes'];
