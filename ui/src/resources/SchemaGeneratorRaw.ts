export default "/**\n * SchemaGenerator for array: [ObjectGenerator, exactNumber | [minNumber, maxNumber] | [0, 10]] \\\n * ObjectGenerator: object with a function for each field or a function that returns the object\n */\nexport type SchemaGenerator<T> = T extends Array<infer U> ? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]] : T extends Record<any, any> ? {\n    [K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]);\n} | (() => T) : () => T;\n/**\n * create a storage that ensures uniqueness of a field in a array of object, this is reset at exit of the generated array\n * @template T type of the field\n * @param gen generator for the field\n * @returns a generator that ensures uniqueness of the field\n */\nexport declare const unique_: <T>(gen: () => T) => (() => T);\n/**\n * generate an object from a generator without limiting the number of elements in the array\n * @see {@link generate_}\n * @template T type of the object\n * @param generator generator for the object\n * @returns the generated object\n */\nexport declare const generate: <T>(generator: SchemaGenerator<T>) => T;\n/**\n * generate an object from a generator with a limit of 10 elements in the array\n * @see {@link generate_}\n * @template T type of the object\n * @param generator generator for the object\n * @returns the generated object\n */\nexport declare const generatePreview: <T>(generator: SchemaGenerator<T>) => T;\n/** static class that allows to store and retrieve data with a key (be aware that the generation order is the order of the keys) */\nexport declare class Store {\n    private constructor();\n    private static _data;\n    static get: <T>(key: string) => T;\n    static set: <T>(key: string, value: T) => T;\n}\n/**\n * create a function that returns an incremental id\n * @returns a function that returns a unique id\n */\nexport declare const getIdFn: () => () => number;\n/**\n * randomize the order of the elements in an array, the original array is modified\n * @template T type of the elements in the array\n * @param array array to shuffle\n * @returns the shuffled array\n */\nexport declare const shuffle: <T>(array: T[]) => T[];\n/** @returns a random string of 22 characters */\nexport declare const randomString: () => string;\n/** @returns an integer between 0 and 1_000_000 (excluded) */\nexport declare const randomInt: () => number;\n/** @returns a float between 0 and 1_000_000 (excluded) */\nexport declare const randomFloat: () => number;\nexport declare const randomBoolean: () => boolean;\nexport declare const randomDate: () => Date;\nexport declare const getRandomElementFn: <T>(values: readonly T[]) => () => T;\nexport declare const getRandomElementsFn: <T>(values: readonly T[]) => () => T[];\n/**\n * @param min minimum value (included)\n * @param max maximum value (included)\n * @returns a function that returns a random number between min and max (included)\n */\nexport declare const getRandomIntFn: (min: number, max: number) => () => number;\n/**\n * @param min minimum value (included)\n * @param max maximum value (excluded)\n * @returns a function that returns a random number between min (included) and max (excluded)\n */\nexport declare const getRandomFloatFn: (min: number, max: number) => () => number;\n";