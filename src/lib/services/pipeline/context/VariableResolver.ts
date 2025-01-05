import type { ExecutionContext } from './ExecutionContext';

export interface VariableResolver {
  namespace: string;
  resolve(key: string, context: ExecutionContext): Promise<string>;
}

// Helper function for accessing nested paths
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}
