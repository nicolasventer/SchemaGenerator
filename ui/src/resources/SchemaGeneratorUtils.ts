export { addTime, getIdFn, getRandomDateFn, getRandomElementFn, getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat, randomInt, randomString, shuffle, Store, unique_, type SchemaGenerator, type TimeUnitT, } from "schema-generator";
/** The result of the generation. */
export type Result = {
    /** The name of the file. */
    name: string;
    /** The data generated. */
    data: unknown[];
}[];
/**
 * Generate an object from a generator. It has a limit of 10 elements in the array whether the `--preview` argument is provided. \
 * For complex objects, you will need to specify the type of the generator. \
 * If the number of elements to generate for an array is not specified, it will be between 0 (included) and 10 (included). \
 * If the number of elements to generate for an array is specified, it will be between min (included) and max (included).
 * @template T type of the object
 * @param generator generator for the object
 * @returns the generated object
 */
export declare const generate: <T>(generator: import("schema-generator").SchemaGenerator<T>) => T, generatePreview: <T>(generator: import("schema-generator").SchemaGenerator<T>) => T;
/** Options for writing the result to a file. */
export type WriteToFileOptions = {
    /** The folder where to write the files. */
    folder?: string;
    /** Whether to zip the files. */
    bZip?: boolean;
    /** Whether to make the json pretty. */
    bPretty?: boolean;
};
/**
 * Write the result to multiple files or a zip file.
 * @param result
 * @param options options
 * @param options.folder the folder where to write the files, can be set with the `--output` flag followed by the folder
 * @param options.bZip whether to zip the files, can be set with the `--zip` flag
 * @param options.bPretty whether to make the json pretty, can be set with the `--pretty` flag
 */
export declare const WriteToFile: (result: Result, options?: WriteToFileOptions) => Promise<void>;
