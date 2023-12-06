export type SchemaGenerator<T> = T extends Array<infer U>
	? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]]
	: T extends Record<any, any>
	? { [K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]) } | (() => T)
	: () => T;

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

export class Store {
	private constructor() {} // static only
	private static _data = new Map<string, any>();
	static get = <T>(key: string) => this._data.get(key) as T;
	static set = <T>(key: string, value: T) => {
		this._data.set(key, value);
		return value;
	};
}

export const getIdFn = () => {
	let _id = 0;
	return () => ++_id;
};

export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const randomInt = () => Math.floor(Math.random() * 1000);
export const randomFloat = () => Math.random() * 1000;
export const randomBoolean = () => Math.random() < 0.5;
export const randomDate = () => new Date(Math.random() * 1000000000000);
export const getRandomEnumFn =
	<T>(values: readonly T[]) =>
	() =>
		values[Math.floor(Math.random() * values.length)];
export const getRandomNumberFn = (min: number, max: number, isInt: boolean) =>
	isInt ? () => Math.floor(Math.random() * (max - min + 1) + min) : () => Math.random() * (max - min) + min;
