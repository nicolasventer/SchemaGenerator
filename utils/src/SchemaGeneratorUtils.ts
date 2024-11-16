export {
	addTime,
	getIdFn,
	getRandomDateFn,
	getRandomElementFn,
	getRandomElementsFn,
	getRandomFloatFn,
	getRandomIntFn,
	randomBoolean,
	randomDate,
	randomFloat,
	randomInt,
	randomString,
	shuffle,
	Store,
	unique_,
	type SchemaGenerator,
	type TimeUnitT,
} from "schema-generator";
import fs from "fs";
import JSZip from "jszip";
import path from "path";
import { generate as gen, generatePreview as genPreview } from "schema-generator";

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
export const [generate, generatePreview] = process.argv.includes("--preview") ? [genPreview, genPreview] : [gen, gen];

/** Options for writing the result to a file. */
export type WriteToFileOptions = {
	/** The folder where to write the files. */
	folder?: string;
	/** Whether to zip the files. */
	bZip?: boolean;
	/** Whether to make the json pretty. */
	bPretty?: boolean;
};

const defaultFolder = process.argv.includes("--output") ? process.argv[process.argv.indexOf("--output") + 1] : ".";
const defaultBZip = process.argv.includes("--zip");
const defaultBPretty = process.argv.includes("--pretty");

/**
 * Write the result to multiple files or a zip file.
 * @param result
 * @param options options
 * @param options.folder the folder where to write the files, can be set with the `--output` flag followed by the folder
 * @param options.bZip whether to zip the files, can be set with the `--zip` flag
 * @param options.bPretty whether to make the json pretty, can be set with the `--pretty` flag
 */
export const WriteToFile = async (result: Result, options: WriteToFileOptions = {}) => {
	const { folder = defaultFolder, bZip = defaultBZip, bPretty = defaultBPretty } = options;
	const stringify = bPretty ? (data: unknown) => JSON.stringify(data, null, 2) : JSON.stringify;
	fs.mkdirSync(folder, { recursive: true });
	if (bZip) {
		const zip = new JSZip();
		for (const { name, data } of result) {
			const fileName = `${name}.json`;
			zip.file(fileName, stringify(data));
		}
		const content = await zip.generateAsync({ type: "nodebuffer" });
		const zipPath = path.resolve(folder, "data.zip");
		fs.writeFileSync(zipPath, content);
		console.log(`Generated ${zipPath}`);
	} else {
		for (const { name, data } of result) {
			const filePath = path.resolve(folder, `${name}.json`);
			fs.writeFileSync(filePath, stringify(data));
			console.log(`Generated ${filePath}`);
		}
	}
};
