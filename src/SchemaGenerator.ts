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
 * @returns the generated object
 */
export const generate = <T>(generator: SchemaGenerator<T>): T => {
	if (generator === null) throw new Error("Generator cannot be null");
	if (Array.isArray(generator)) {
		const [gen, counts] = generator;
		const [minCount, maxCount] = counts ? (Array.isArray(counts) ? [counts[0], counts[1]] : [counts, counts]) : [0, 10];
		const count = Math.floor(Math.random() * (maxCount - minCount + 1) + minCount);
		const result = Array.from({ length: count }, () => generate(gen)) as T;
		if ("reset" in gen && typeof gen.reset === "function") gen.reset();
		for (const value of Object.values(gen)) if ("reset" in value && typeof value.reset === "function") value.reset();
		return result;
	}
	if (typeof generator === "function") return generator();
	if (typeof generator === "object") {
		const result: any = {};
		for (const [key, value] of Object.entries(generator)) {
			result[key] = generate(value as any);
		}
		return result as T;
	}
	throw new Error("Generator must be a function, array, or object");
};

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

export const shuffle = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

/** @returns a function that returns a random string of 22 characters */
export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
/** @returns a function that returns an integer between 0 and 1_000_000 (excluded) */
export const randomInt = () => Math.floor(Math.random() * 1_000_000);
/** @returns a function that returns a float between 0 and 1_000_000 (excluded) */
export const randomFloat = () => Math.random() * 1_000_000;
export const randomBoolean = () => Math.random() < 0.5;
export const randomDate = () => new Date(Math.random() * 1_000_000_000_000);
export const getRandomElementFn =
	<T>(values: readonly T[]) =>
	() =>
		values[Math.floor(Math.random() * values.length)];
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

// ========== DEPRECATED ==========

/** @deprecated use getRandomElementFn */
export const getRandomEnumFn = getRandomElementFn;
/** @deprecated use getRandomIntFn or getRandomFloatFn */
export const getRandomNumberFn = (min: number, max: number, isInt: boolean) =>
	isInt ? getRandomIntFn(min, max) : getRandomFloatFn(min, max);
