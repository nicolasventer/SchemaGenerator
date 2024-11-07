/**
 * SchemaGenerator for array: [ObjectGenerator, exactNumber | [minNumber, maxNumber] | [0, 10]] \
 * ObjectGenerator: object with a function for each field or a function that returns the object
 */
export type SchemaGenerator<T> = T extends Array<infer U>
	? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]]
	: T extends Record<any, any>
	? { [K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]) } | (() => T)
	: () => T;

/**
 * create a storage that ensures uniqueness of a field in a array of object, this is reset at exit of the generated array
 * @template T type of the field
 * @param gen generator for the field
 * @returns a generator that ensures uniqueness of the field
 */
export const unique_ = <T>(gen: () => T): (() => T) => {
	const values = new Set<T>();
	const result = () => {
		let value = gen();
		while (values.has(value)) value = gen();
		values.add(value);
		return value;
	};
	result.reset = () => values.clear();
	return result;
};

/**
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included). \
 * @template T type of the object
 * @param generator generator for the object
 * @param bPreview if true, the number of elements in the array will be limited to 10
 * @returns the generated object
 */
const generate_ = <T>(generator: SchemaGenerator<T>, bPreview: boolean): T => {
	if (generator === null) throw new Error("Generator cannot be null");
	if (Array.isArray(generator)) {
		const [gen, counts] = generator;
		const [minCount, maxCount] = counts ? (Array.isArray(counts) ? [counts[0], counts[1]] : [counts, counts]) : [0, 10];
		const count_ = Math.floor(Math.random() * (maxCount - minCount + 1) + minCount);
		const count = bPreview ? Math.min(10, count_) : count_;
		const result = Array.from({ length: count }, () => generate_(gen, bPreview)) as T;
		if ("reset" in gen && typeof gen.reset === "function") gen.reset();
		for (const value of Object.values(gen)) if ("reset" in value && typeof value.reset === "function") value.reset();
		return result;
	}
	if (typeof generator === "function") return generator();
	if (typeof generator === "object") {
		const result: any = {};
		for (const [key, value] of Object.entries(generator)) {
			result[key] = generate_(value as any, bPreview);
		}
		return result as T;
	}
	throw new Error("Generator must be a function, array, or object");
};

/**
 * Generate an object from a generator without limiting the number of elements in the array. \
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included). \
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export const generate = <T>(generator: SchemaGenerator<T>): T => generate_(generator, false);

/**
 * Generate an object from a generator with a limit of 10 elements in the array. \
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included). \
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export const generatePreview = <T>(generator: SchemaGenerator<T>): T => generate_(generator, true);

/** static class that allows to store and retrieve data with a key (be aware that the generation order is the order of the keys) */
export class Store {
	private constructor() {} // static only
	private static _data = new Map<string, any>();
	static get = <T>(key: string) => this._data.get(key) as T;
	static set = <T>(key: string, value: T) => {
		this._data.set(key, value);
		return value;
	};
}

/**
 * create a function that returns an incremental id
 * @returns a function that returns a unique id
 */
export const getIdFn = () => {
	let _id = 0;
	return () => ++_id;
};

/**
 * randomize the order of the elements in an array, the original array is modified
 * @template T type of the elements in the array
 * @param array array to shuffle
 * @returns the shuffled array
 */
export const shuffle = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

/** @returns a random string of 22 characters */
export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
/** @returns an integer between 0 and 1_000_000 (excluded) */
export const randomInt = () => Math.floor(Math.random() * 1_000_000);
/** @returns a float between 0 and 1_000_000 (excluded) */
export const randomFloat = () => Math.random() * 1_000_000;
/** @returns a boolean */
export const randomBoolean = () => Math.random() < 0.5;
/** @returns a random date between today minus 120 days and today plus 120 days */
export const randomDate = () => new Date(Date.now() + Math.random() * 20_000_000_000 - 10_000_000_000);

/**
 * @template T type of the values
 * @param values array of values
 * @returns a function that returns a random element from the array
 */
export const getRandomElementFn =
	<T>(values: readonly T[]) =>
	() =>
		values[Math.floor(Math.random() * values.length)];
/**
 * @template T type of the values
 * @param values array of values
 * @returns a function that returns a random unordered subset of the provided array.
 */
export const getRandomElementsFn =
	<T>(values: readonly T[]) =>
	() =>
		shuffle(values.map((value) => value)).slice(0, Math.floor(Math.random() * (values.length + 1)));
/**
 * @param min minimum value (included)
 * @param max maximum value (included)
 * @returns a function that returns a random number between min and max (included)
 */
export const getRandomIntFn = (min: number, max: number) => () => Math.floor(Math.random() * (max - min + 1) + min);
/**
 * @param min minimum value (included)
 * @param max maximum value (excluded)
 * @returns a function that returns a random number between min (included) and max (excluded)
 */
export const getRandomFloatFn = (min: number, max: number) => () => Math.random() * (max - min) + min;
/** Object that contains the time units in milliseconds */
const TimeUnitObj = {
	millisecond: 1,
	second: 1_000,
	minute: 60_000,
	hour: 3_600_000,
	day: 86_400_000,
	week: 604_800_000,
	month: 2_629_800_000,
	year: 31_557_600_000,
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
export const addTime = (date: Date, amount: number, unit: TimeUnitT) => new Date(date.getTime() + amount * TimeUnitObj[unit]);
/**
 * @param min minimum value (included)
 * @param max maximum value (excluded)
 * @returns a function that returns a random date between min (included) and max (excluded)
 */
export const getRandomDateFn = (min: Date, max: Date) => () =>
	new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
