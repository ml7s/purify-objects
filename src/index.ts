import { isNil, isEmpty, isObject, cloneDeep } from 'lodash';
import { CleanerOptions, AnyObject } from './types';

const INITIAL_OPTIONS: Required<Omit<CleanerOptions, 'customCleaner'>> & Pick<CleanerOptions, 'customCleaner'> = {
  customCleaner: undefined,
  keepFields: [],
  recursive: true,
  safe: true
};

const evaluateEmptiness = <T>(value: T): boolean => (
  isNil(value) ||
  value === '' ||
  (Array.isArray(value) && !value.length) ||
  (isObject(value) && !Object.keys(value as object).length)
);

function processNestedObject<T extends AnyObject>(
  target: T,
  customCleaner: CleanerOptions['customCleaner'],
  preservedFields: string[],
  config: Required<CleanerOptions>
): T {
  const workingCopy = config.safe ? cloneDeep(target) : target;
  
  for (const key in workingCopy) {
    const value = workingCopy[key];
    
    if (preservedFields.includes(key)) continue;
    
    if (customCleaner?.(key, value)) {
      delete workingCopy[key];
      continue;
    }
    
    if (evaluateEmptiness(value)) {
      delete workingCopy[key];
      continue;
    }
    
    if (config.recursive && isObject(value) && !Array.isArray(value)) {
      const processed = processNestedObject(
        value as T[Extract<keyof T, string>] & AnyObject,
        customCleaner,
        preservedFields,
        config
      );
      
      if (!Object.keys(processed).length) {
        delete workingCopy[key];
      } else {
        workingCopy[key] = processed as T[Extract<keyof T, string>];
      }
    }
  }
  
  return workingCopy;
}

function cleanObject<T extends AnyObject>(
  obj: T,
  customCleaner?: CleanerOptions['customCleaner'],
  keepFields: string[] = [],
  options: CleanerOptions = {}
): T {
  const config = { ...INITIAL_OPTIONS, ...options } as Required<CleanerOptions>;
  return processNestedObject(obj, customCleaner, keepFields, config);
}

export { cleanObject };
export default cleanObject; 