import { faker } from "@faker-js/faker";
import { SchemaGenerator, Store, getIdFn, generate, randomBoolean } from "../SchemaGenerator";

type Team = { id: number; name: string };
type User = { email: string; isAdmin: boolean; teamIds: number[]; teamNames: string[] };
// teamIds and teamNames are redundant, but we want to show how to use Store

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

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "Teams_10.json");
fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
console.log(`File ${filePath} written.`);

const userGenerator: SchemaGenerator<User[]> = [
	{
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
