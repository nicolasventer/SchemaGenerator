import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
import dayjs from "dayjs"; // here dayjs is used, it is not mandatory but should match perfectly with this library
import { Result } from "Result";
import { type SchemaGenerator, Store, generate, getIdFn, getRandomElementFn,
	getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate,
	randomFloat, randomInt, randomString, shuffle, unique_ } from "schema-generator";

const getResult = async (): Promise<Result> => {
	// DO NOT CHANGE TEXT ABOVE
