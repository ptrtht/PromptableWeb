import type { ExecutionContext } from './ExecutionContext';
import { getNestedValue, type VariableResolver } from './VariableResolver';

export class InputResolver implements VariableResolver {
  readonly namespace = 'input';

  constructor(private inputData: Record<string, any>) {
    if (!inputData || typeof inputData !== 'object' || Array.isArray(inputData)) {
      throw new Error('Input data must be an object');
    }
  }

  async resolve(key: string, context: ExecutionContext): Promise<string> {
    const value = getNestedValue(this.inputData, key);

    if (value === undefined) {
      throw new Error(`Input key not found: ${key}`);
    }

    return typeof value === 'string' ? value : JSON.stringify(value);
  }
}
