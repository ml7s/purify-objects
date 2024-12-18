export const isNil = (value: unknown): value is null | undefined => 
  value === null || value === undefined;

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const cloneDeep = <T>(obj: T): T => {
  if (!isObject(obj)) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep) as unknown as T;
  }
  
  return Object.entries(obj).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: cloneDeep(value)
  }), {}) as T;
}; 