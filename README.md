# SchemaGenerator

SchemaGenerator is a typescript/javascript library for generating mock data through a schema.

This library does not have any dependencies but it is recommended to use it with [faker.js](https://fakerjs.dev/) for more realistic data.

### [Try it online](https://nicolasventer.github.io/SchemaGenerator/)

![Screenshot](misc/Schema_Generator_screenshot.jpeg)

You should also take a look at [SchemaGeneratorUtils](./utils/) for some useful functions.

## Features

- type checking
- works with javascript ts-check (cf. below [Js-example](#Js-example))
- `unique_` function to ensure uniqueness of a generated field
- `randomString`, `randomInt`, ... functions to generate random data (quick alternative to [faker.js](https://fakerjs.dev/))
- `Store` static class that allows to use a generated field in another

## Installation

```bash
npm install https://github.com/nicolasventer/SchemaGenerator/releases/latest/download/schema-generator.tgz
```

*After the first installation, you can update with `npm update schema-generator`.*

## Examples

### Simple example

Content of [core/examples/simple/simple_example.ts](core/examples/simple/simple_example.ts)

```ts
import { SchemaGenerator, generate, getIdFn, getRandomElementFn, getRandomIntFn, randomString } from "../../src/SchemaGenerator";

const CarModels = ["Audi", "BMW", "Mercedes", "Porsche"] as const;

type Person = { name: string; age: number };
type Car = { model: (typeof CarModels)[number]; id: number; owner: Person };

const carsGenerator: SchemaGenerator<Car[]> = [
	{
		id: getIdFn(),
		model: getRandomElementFn(CarModels),
		owner: {
			name: randomString,
			age: getRandomIntFn(18, 100),
		},
	},
	[0, 5], // generate between 0 (included) and 5 (included) cars
];

const cars = generate<Car[]>(carsGenerator);
console.log("cars:", cars);
```

Example output:

```ts
[
  {
    id: 1,
    model: 'Audi',
    owner: { name: 'k5hhy7eas5skiymrqju9e', age: 61 }
  },
  {
    id: 2,
    model: 'Mercedes',
    owner: { name: 'bzkiwfb2rirs0bmb00czw', age: 22 }
  },
  {
    id: 3,
    model: 'Porsche',
    owner: { name: '9dsgvjpow5vhgjsy7w6rq', age: 45 }
  }
]
```

### Advanced example

<details>

<summary>Show advanced example</summary>

Content of [core/examples/advanced/advanced_example.ts](core/examples/advanced/advanced_example.ts)

```ts
import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
// require the build of SchemaGenerator (use: npm run build)
import { SchemaGenerator, Store, getIdFn, generate, randomBoolean, unique_, randomInt } from "../../build/SchemaGenerator";
import fs from "fs";

type Team = { id: number; name: string };

const teamGenerator: SchemaGenerator<Team[]> = [
	{
		id: getIdFn(),
		name: faker.company.name,
	},
	10, // generate 10 teams
];

const teams = generate<Team[]>(teamGenerator);

const filePath = "Teams_10.json";
fs.writeFileSync(filePath, JSON.stringify(teams, null, "\t"));
console.log(`File ${filePath} written.`);

type User = { id: number; email: string; isAdmin: boolean; teamIds: number[]; teamNames: string[] };
// teamIds and teamNames are redundant, but need to show how to use Store

const userGenerator: SchemaGenerator<User[]> = [
	{
		id: unique_(randomInt), // getIdFn could be used here, but need to show how to use unique_
		email: faker.internet.email,
		isAdmin: randomBoolean,
		teamIds: () => Store.set("teams", faker.helpers.arrayElements(teams)).map((team: Team) => team.id),
		teamNames: () => Store.get<Team[]>("teams").map((team: Team) => team.name),
	},
	100, // generate 100 users
];

const userData = generate<User[]>(userGenerator);

const userFilePath = "Users_100.json";
fs.writeFileSync(userFilePath, JSON.stringify(userData, null, "\t"));
console.log(`File ${userFilePath} written.`);
```

Example output:

[misc/Teams_10.json](misc/Teams_10.json) and [misc/Users_100.json](misc/Users_100.json)

</details>

### Js-example

Content of [core/examples/js/js_example.js](core/examples/js/js_example.js)

```js
// @ts-check

// require the build of SchemaGenerator (use: npm run build)
const sg = require("../../build/SchemaGenerator.js");

/** @typedef {{ name: string, age: number, isMale: boolean }} Person */

/**
 * @type {sg.SchemaGenerator<Person>}
 */
const personGenerator = {
	age: sg.getRandomIntFn(0, 100),
	isMale: sg.randomBoolean,
	name: sg.randomString,
}; // generator for one Person

console.log(sg.generate(personGenerator));
```

## Usage

```ts
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
```

## Planned features

C.f. branch [ui](https://github.com/nicolasventer/SchemaGenerator/tree/ui). 

# License

MIT License. See [LICENSE file](LICENSE).
Please refer me with:

	Copyright (c) Nicolas VENTER All rights reserved.