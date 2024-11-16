# SchemaGeneratorUtils

SchemaGeneratorUtils is a typescript/javascript library that provides utilities for [SchemaGenerator](..).

## Features

- use of `generate` or `generatePreview` according to the presence of the argument `--preview`
- `WriteToFile` function to write a `Result` into multiple files or a zip file,
  - the folder option can be specified in a parameter or with the argument `--output [folder]`
  - the zip option can be specified in a parameter or with the argument `--zip`
  - the formatting option can be specified in a parameter or with the argument `--pretty`
- works with javascript `ts-check`

## Installation

```bash
npm install https://github.com/nicolasventer/SchemaGenerator/releases/latest/download/schema-generator-utils.tgz
```

*After the first installation, you can update with `npm update schema-generator-utils`.*

## Examples

### Simple example

Content of [examples/simple/simple_example.ts](examples/simple/simple_example.ts)

```ts
import { getIdFn, getRandomIntFn, randomString, type SchemaGenerator } from "schema-generator";
import { generate, WriteToFile, type Result } from "schema-generator-utils";

const getResult = async (): Promise<Result> => {
	const result: Result = [];

	type User = {
		id: number;
		name: string;
		age: number;
	};

	const userGenerator: SchemaGenerator<User> = {
		id: getIdFn(),
		name: randomString,
		age: getRandomIntFn(18, 100),
	};

	const users = generate<User[]>([userGenerator, 100]);

	result.push({ name: "Users", data: users });

	return result;
};

getResult().then(WriteToFile);
```

With the command `ts-node examples/simple/simple_example.ts --output misc --pretty --preview` the output is in the file `misc/Users.json`:
```json
[
  {
    "id": 1,
    "name": "1c2t754oimaxa2e3ju8dob",
    "age": 86
  },
  {
    "id": 2,
    "name": "4buf8e0son3o4qqqpivv68",
    "age": 74
  },
  {
    "id": 3,
    "name": "901dic6ypdak1imc6mlrx",
    "age": 27
  },
  {
    "id": 4,
    "name": "ln583szbw1nzxcw16ajjya",
    "age": 42
  },
  {
    "id": 5,
    "name": "1ha91bpoj82cwn478fqw9g",
    "age": 97
  },
  {
    "id": 6,
    "name": "20e9cq4idnd6hpnzn9wor5",
    "age": 51
  },
  {
    "id": 7,
    "name": "ngpdpsyl2lqqg0j6hnjh",
    "age": 77
  },
  {
    "id": 8,
    "name": "sxthlzaouxfz0cpsp4cu6p",
    "age": 25
  },
  {
    "id": 9,
    "name": "6d2pec0i4o4jpzqlbt3rq",
    "age": 60
  },
  {
    "id": 10,
    "name": "45letd4dihezyg9m2s3kf",
    "age": 22
  }
]
```

## Usage

```ts
export { addTime, getIdFn, getRandomDateFn, getRandomElementFn, getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean,
  randomDate, randomFloat, randomInt, randomString, shuffle, Store, unique_, type SchemaGenerator, type TimeUnitT, } from "schema-generator";
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
export declare const generate: <T>(generator: import("schema-generator").SchemaGenerator<T>) => T,
  generatePreview: <T>(generator: import("schema-generator").SchemaGenerator<T>) => T;
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
```

# License

MIT License. See [LICENSE file](LICENSE).
Please refer me with:

	Copyright (c) Nicolas VENTER All rights reserved.