export function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result == null) {
      return undefined;
    }
    result = result[key];
  }
  return result;
}

// Utility function to set a value in a nested object using a path
export function setValueByPath(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}

export type URLRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
