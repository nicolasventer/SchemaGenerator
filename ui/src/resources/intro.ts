import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
import dayjs from "dayjs"; // here dayjs is used, it is not mandatory but should match perfectly with this library
import { Store, WriteToFile, addTime, generate, generatePreview, getIdFn, getRandomDateFn, getRandomElementFn,
	getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat, randomInt,
	randomString, shuffle, unique_, type Result, type SchemaGenerator, type TimeUnitT } from "schema-generator-utils";

const getResult = async (): Promise<Result> => {
	// DO NOT CHANGE TEXT ABOVE