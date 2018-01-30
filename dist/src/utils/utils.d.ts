export declare function objectValues<T>(obj: {
    [name: string]: T;
}): T[];
export declare function objectEntries<T>(obj: {
    [name: string]: T;
}): [string, T][];
export declare function capitalize(string: string): string;
export declare function maybeDo<TIn, TOut>(input: TIn | null | undefined, fn: (input: TIn) => TOut): TOut | undefined;
export declare function arrayToObject<TValue>(array: TValue[], keyFn: (obj: TValue) => string): {
    [name: string]: TValue;
};
export declare function objectFromKeys<TValue>(keys: string[], valueFn: (obj: string) => TValue): {
    [name: string]: TValue;
};
export declare function objectFromKeyValuePairs<TValue>(pairs: [string, TValue][]): {
    [name: string]: TValue;
};
export declare function objectToMap<T>(object: {
    [name: string]: T;
}): Map<string, T>;
export declare function mapValues<TIn, TOut>(obj: {
    [key: string]: TIn;
}, fn: (value: TIn, key: string) => TOut): {
    [key: string]: TOut;
};
export declare function filterValues<TValue>(obj: {
    [key: string]: TValue;
}, predicate: (value: TValue, key: string) => boolean): {
    [key: string]: TValue;
};
/**
 * Removes object properties and array values that do not match a predicate
 */
export declare function filterValuesDeep(obj: any, predicate: (value: any) => boolean): any;
/**
 * Creates a new Map by changing the keys but leaving the values as-is
 * @param map a map
 * @param fn a function that gets an old key and returns the new key
 * @returns the new map
 */
export declare function mapMapKeys<TKey, TNewKey, TValue>(map: Map<TKey, TValue>, fn: (key: TKey) => TNewKey): Map<TNewKey, TValue>;
/**
 * Creates a new Map by changing the keys but leaving the values as-is
 * @param map a map
 * @param fn a function that gets an old key and returns the new key
 * @returns the new map
 */
export declare function mapMapValues<TKey, TValue, TNewValue>(map: Map<TKey, TValue>, fn: (value: TValue, key: TKey) => TNewValue): Map<TKey, TNewValue>;
export declare function flatten<T>(input: T[][]): T[];
export declare function flatMap<TIn, TOut>(input: TIn[], fn: (input: TIn) => TOut[]): TOut[];
export declare function compact<T>(arr: (T | undefined | null)[]): T[];
export declare function mapAndCompact<TIn, TOut>(input: TIn[], fn: (input: TIn) => TOut | undefined | null): TOut[];
export declare function throwError(fn: () => Error): never;
export declare function throwError(message: string): never;
export declare function groupBy<TItem, TKey>(arr: TItem[], keyFn: (key: TItem) => TKey): Map<TKey, TItem[]>;
export declare function intersect<T>(lhs: T[], rhs: T[]): T[];
/**
 * Binds a function, to an object, or returns undefined if the function is undefined
 * @param fn the function to bind
 * @param obj the object to bind the function to
 * @returns the bound function, or undefined
 */
export declare function bindNullable<T>(fn: (T & Function) | undefined, obj: any): (T & Function) | undefined;
/**
 * Takes an array and filters those matching a predicate into one new array, those not matching into a second
 * @param {T[]} items
 * @param {(item: T) => boolean} predicate
 * @returns {[T[] , T[]]} a tuple with the matching ones (first) and the non-matching ones (second)
 */
export declare function divideArrayByPredicate<T>(items: T[], predicate: (item: T) => boolean): [T[], T[]];
export declare function modifyPropertyAtPath(obj: any, fn: (value: any) => any, path: (string | number)[]): any;
export declare function replaceArrayItem(array: any[], index: number, newValue: any): any[];
export declare function repeat(value: any, count: number): any[];
export declare function getOrSetFromMap<K, V>(map: Map<K, V>, key: K, defaultFn: () => V): V;
export declare function isPromise<T>(value: any): value is Promise<T>;
