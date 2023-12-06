import { getRandomNumberFn } from "../../build/SchemaGenerator";
import { SchemaGenerator, generate, getIdFn, getRandomEnumFn, randomString } from "../../src/SchemaGenerator";

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
