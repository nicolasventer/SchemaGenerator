import { faker } from "@faker-js/faker";
import { SchemaGenerator, Store, getIdFn, generate, randomBoolean, unique_, randomInt } from "../../src/SchemaGenerator";
import fs from "fs";
import path from "path";

type Team = { id: number; name: string };

const teamGenerator: SchemaGenerator<Team[]> = [
	{
		id: getIdFn(),
		name: faker.company.name,
	},
	10,
];

console.log(`Start generating ${"Teams"}...`);
const data = generate<Team[]>(teamGenerator);
console.log(`Generating ${"Teams"} done.`);

const filePath = path.join(__dirname, "Teams_10.json");
fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
console.log(`File ${filePath} written.`);

type User = { id: number; email: string; isAdmin: boolean; teamIds: number[]; teamNames: string[] };
// teamIds and teamNames are redundant, but need to show how to use Store

const userGenerator: SchemaGenerator<User[]> = [
	{
		id: unique_(randomInt), // getIdFn could be used here, but need to show how to use unique_
		email: faker.internet.email,
		isAdmin: randomBoolean,
		teamIds: () => Store.set("teams", faker.helpers.arrayElements(data)).map((team: Team) => team.id),
		teamNames: () => Store.get<Team[]>("teams").map((team: Team) => team.name),
	},
	100,
];

console.log(`Start generating ${"Users"}...`);
const userData = generate<User[]>(userGenerator);
console.log(`Generating ${"Users"} done.`);

const userFilePath = path.join(__dirname, "Users_100.json");
fs.writeFileSync(userFilePath, JSON.stringify(userData, null, "\t"));
console.log(`File ${userFilePath} written.`);
