import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
// require the build of SchemaGenerator (use: npm run build)
import fs from "fs";
import { SchemaGenerator, Store, generate, getIdFn, randomBoolean, randomInt, unique_ } from "../../src/SchemaGenerator";

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
