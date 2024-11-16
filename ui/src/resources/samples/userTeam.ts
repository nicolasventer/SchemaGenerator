import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
import dayjs from "dayjs"; // here dayjs is used, it is not mandatory but should match perfectly with this library
import { Store, WriteToFile, addTime, generate, generatePreview, getIdFn, getRandomDateFn, getRandomElementFn,
	getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat, randomInt,
	randomString, shuffle, unique_, type Result, type SchemaGenerator, type TimeUnitT } from "schema-generator-utils";

const getResult = async (): Promise<Result> => {
	// DO NOT CHANGE TEXT ABOVE

	const result: Result = [];

	type User = {
		id: number;
		name: string;
		email: string;
	};

	const userGenerator: SchemaGenerator<User> = {
		id: getIdFn(),
		name: faker.person.fullName,
		email: faker.internet.email,
	};

	const users = generate<User[]>([userGenerator, 100]);

	result.push({ name: "Users", data: users });

	type Team = {
		id: number;
		name: string;
		memberIdList: number[];
	};

	const teamGenerator: SchemaGenerator<Team> = {
		id: getIdFn(),
		name: faker.company.name,
		memberIdList: () =>
			getRandomElementsFn(users)()
				.map((u) => u.id)
				.toSorted((a, b) => a - b),
	};

	const teams = generate<Team[]>([teamGenerator, [10, 20]]);

	result.push({ name: "Teams", data: teams });

	return result;
};
