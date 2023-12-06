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
