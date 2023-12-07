# SchemaGenerator

SchemaGenerator is a typescript/javascript library for generating mock data through a schema.

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

## Examples

### Simple example

Content of [examples/simple/simple_example.ts](examples/simple/simple_example.ts)

```ts
import { SchemaGenerator, generate, getIdFn, getRandomEnumFn, randomString, getRandomNumberFn } from "../../src/SchemaGenerator";

const CarModels = ["Audi", "BMW", "Mercedes", "Porsche"] as const;

type Person = { name: string; age: number };
type Car = { model: (typeof CarModels)[number]; id: number; owner: Person };

const carsGenerator: SchemaGenerator<Car[]> = [
	{
		id: getIdFn(),
		model: getRandomEnumFn(CarModels),
		owner: {
			name: randomString,
			age: getRandomNumberFn(18, 100, true),
		},
	},
	[0, 5], // generate between 0 and 5 cars
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
    owner: { name: '9dsgvjpow5vhgjsy7w6rq', age: 61 }
  }
]
```

### Advanced example

<details>

<summary>Show advanced example</summary>

Content of [examples/advanced/advanced_example.ts](examples/advanced/advanced_example.ts)

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

Content of [examples/js/js_example.js](examples/js/js_example.js)

```js
// @ts-check

// require the build of SchemaGenerator (use: npm run build)
const sg = require("../../build/SchemaGenerator.js");

/** @typedef {{ name: string, age: number, isMale: boolean }} Person */

/**
 * @type {sg.SchemaGenerator<Person>}
 */
const personGenerator = {
	age: sg.getRandomNumberFn(0, 100, true),
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
 * @param gen generator for the field
 * @returns a generator that ensures uniqueness of the field
 */
export declare const unique_: <T>(gen: () => T) => () => T;
export declare const generate: <T>(generator: SchemaGenerator<T>) => T;
/**
 * static class that allows to store and retrieve data with a key (be aware that the generation order is the order of the keys)
 */
export declare class Store {
    private constructor();
    static get: <T>(key: string) => T;
    static set: <T>(key: string, value: T) => T;
}
/**
 * create a function that returns an incremental id
 * @returns a function that returns a unique id
 */
export declare const getIdFn: () => () => number;
export declare const randomString: () => string;
export declare const randomInt: () => number;
export declare const randomFloat: () => number;
export declare const randomBoolean: () => boolean;
export declare const randomDate: () => Date;
export declare const getRandomEnumFn: <T>(values: readonly T[]) => () => T;
export declare const getRandomNumberFn: (min: number, max: number, isInt: boolean) => () => number;
```

# Licence

MIT Licence. See [LICENSE file](LICENSE).
Please refer me with:

	Copyright (c) Nicolas VENTER All rights reserved.