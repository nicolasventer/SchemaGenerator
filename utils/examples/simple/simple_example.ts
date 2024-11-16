import { getIdFn, getRandomIntFn, randomString, type SchemaGenerator } from "schema-generator";
import { generate, WriteToFile, type Result } from "../../src/SchemaGeneratorUtils";

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
