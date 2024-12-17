export type CleanerFunction<T = any> = (key: string, value: T) => boolean;

export interface CleanerOptions<T = any> {
  customCleaner?: CleanerFunction<T>;
  keepFields?: Array<keyof T | string>;
  recursive?: boolean;
  safe?: boolean;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type AnyObject = Record<string, unknown>; 