export interface MultiKeyStrategy<TKey> {
    getBucketKey(key: TKey): object;
    equals(lhs: TKey, rhs: TKey): boolean;
}
/**
 * A weak map with arrays of weakly-referenced objects as key
 *
 * Performance consideration: values are bucketed into the *one element* of the respective key (by default, the first
 * array element). Inside this bucket, a linear search is performed for the correct key. This works fine as long as one
 * element of the key is already very decisive.
 *
 * A key is weakly referenced as soon as there are no entries which contain any element of that key. Again, this is only
 * practical if keys are mostly clustered.
 */
export declare class MultiKeyWeakMap<K, V> {
    private readonly strategy;
    private readonly map;
    constructor(strategy: MultiKeyStrategy<K>);
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    private find(key);
    private findIndex(bucket, key);
}
export declare class ArrayKeyWeakMap<K, V> extends MultiKeyWeakMap<K[], V> {
    constructor();
}
