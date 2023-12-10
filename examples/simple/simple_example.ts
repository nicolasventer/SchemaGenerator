import { SchemaGenerator, generate, getIdFn, getRandomElementFn, getRandomIntFn, randomString } from "../../src/SchemaGenerator";

const CarModels = ["Audi", "BMW", "Mercedes", "Porsche"] as const;

type Person = { name: string; age: number };
type Car = { model: (typeof CarModels)[number]; id: number; owner: Person };

const carsGenerator: SchemaGenerator<Car[]> = [
	{
		id: getIdFn(),
		model: getRandomElementFn(CarModels),
		owner: {
			name: randomString,
			age: getRandomIntFn(18, 100),
		},
	},
	[0, 5], // generate between 0 (included) and 5 (included) cars
];

const cars = generate<Car[]>(carsGenerator);
console.log("cars:", cars);
