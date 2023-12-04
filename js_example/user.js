// @ts-check

const sg = require("../build/SchemaGenerator.js");

/** @typedef {{ name: string, age: number, isMale: boolean }} User */

/**
 * @type {sg.SchemaGenerator<User>}
 */
const userGenerator = {
	age: sg.getRandomNumberFn(0, 100, true),
	isMale: sg.randomBoolean,
	name: sg.randomString,
};

console.log(sg.generate(userGenerator));
