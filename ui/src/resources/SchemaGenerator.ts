/**
 * SchemaGenerator for array: [ObjectGenerator, exactNumber | [minNumber, maxNumber] | [0, 10]] \
 * ObjectGenerator: object with a function for each field or a function that returns the object
 */
export type SchemaGenerator<T> = T extends Array<infer U>
	? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]]
	: T extends Record<any, any>
	?
			| {
					[K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]);
			  }
			| (() => T)
	: () => T;
/**
 * create a storage that ensures uniqueness of a field in a array of object, this is reset at exit of the generated array
 * @template T type of the field
 * @param gen generator for the field
 * @returns a generator that ensures uniqueness of the field
 */
export declare const unique_: <T>(gen: () => T) => () => T;
/**
 * Generate an object from a generator without limiting the number of elements in the array. \
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included). \
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export declare const generate: <T>(generator: SchemaGenerator<T>) => T;
/**
 * Generate an object from a generator with a limit of 10 elements in the array. \
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included). \
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
/** @returns a boolean */
export declare const randomBoolean: () => boolean;
/** @returns a random date between today minus 120 days and today plus 120 days */
export declare const randomDate: () => Date;
/**
 * @template T type of the values
 * @param values array of values
 * @returns a function that returns a random element from the array
 */
export declare const getRandomElementFn: <T>(values: readonly T[]) => () => T;
/**
 * @template T type of the values
 * @param values array of values
 * @returns a function that returns a random unordered subset of the provided array.
 */
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
/** Object that contains the time units in milliseconds */
declare const TimeUnitObj: {
	millisecond: number;
	second: number;
	minute: number;
	hour: number;
	day: number;
	week: number;
	month: number;
	year: number;
};
/** Type of the time units, used in {@link addTime} */
export type TimeUnitT = keyof typeof TimeUnitObj;
/**
 * Add time to a date
 * @param date date to which the time will be added
 * @param amount amount of time to add
 * @param unit unit of time
 * @returns the new date
 */
export declare const addTime: (date: Date, amount: number, unit: TimeUnitT) => Date;
/**
 * @param min minimum value (included)
 * @param max maximum value (excluded)
 * @returns a function that returns a random date between min (included) and max (excluded)
 */
export declare const getRandomDateFn: (min: Date, max: Date) => () => Date;
export {};
