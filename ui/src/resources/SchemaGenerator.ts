/**
 * SchemaGenerator for array: [ObjectGenerator, exactNumber | [minNumber, maxNumber] | [0, 10]] \
 * ObjectGenerator: object with a function for each field or a function that returns the object
 */
export type SchemaGenerator<T> = T extends Array<infer U> ? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]] : T extends Record<any, any> ? {
    [K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]);
} | (() => T) : () => T;
/**
 * create a storage that ensures uniqueness of a field in a array of object, this is reset at exit of the generated array
 * @template T type of the field
 * @param gen generator for the field
 * @returns a generator that ensures uniqueness of the field
 */
export declare const unique_: <T>(gen: () => T) => (() => T);
/**
 * generate an object from a generator without limiting the number of elements in the array
 * @see {@link generate_}
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export declare const generate: <T>(generator: SchemaGenerator<T>) => T;
/**
 * generate an object from a generator with a limit of 10 elements in the array
 * @see {@link generate_}
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export declare const generatePreview: <T>(generator: SchemaGenerator<T>) => T;
/** static class that allows to store and retrieve data with a key (be aware that the generation order is the order of the keys) */
export declare class Store {
    private constructor();
    private static _data;
    static get: <T>(key: string) => T;
    static set: <T>(key: string, value: T) => T;
}
/**
 * create a function that returns an incremental id
 * @returns a function that returns a unique id
 */
export declare const getIdFn: () => () => number;
/**
 * randomize the order of the elements in an array, the original array is modified
 * @template T type of the elements in the array
 * @param array array to shuffle
 * @returns the shuffled array
 */
export declare const shuffle: <T>(array: T[]) => T[];
/** @returns a random string of 22 characters */
export declare const randomString: () => string;
/** @returns an integer between 0 and 1_000_000 (excluded) */
export declare const randomInt: () => number;
/** @returns a float between 0 and 1_000_000 (excluded) */
export declare const randomFloat: () => number;
export declare const randomBoolean: () => boolean;
export declare const randomDate: () => Date;
export declare const getRandomElementFn: <T>(values: readonly T[]) => () => T;
export declare const getRandomElementsFn: <T>(values: readonly T[]) => () => T[];
/**
 * @param min minimum value (included)
 * @param max maximum value (included)
 * @returns a function that returns a random number between min and max (included)
 */
export declare const getRandomIntFn: (min: number, max: number) => () => number;
/**
 * @param min minimum value (included)
 * @param max maximum value (excluded)
 * @returns a function that returns a random number between min (included) and max (excluded)
 */
export declare const getRandomFloatFn: (min: number, max: number) => () => number;
