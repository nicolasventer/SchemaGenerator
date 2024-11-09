import { faker } from "@faker-js/faker"; // here faker-js is used, it is not mandatory but should match perfectly with this library
import dayjs from "dayjs"; // here dayjs is used, it is not mandatory but should match perfectly with this library
import { Result } from "Result";
import { Store, addTime, generate, generatePreview, getIdFn, getRandomDateFn, getRandomElementFn,
	getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat,
	randomInt, randomString, shuffle, unique_, type TimeUnitT, type SchemaGenerator } from "schema-generator";

const getResult = async (): Promise<Result> => {
	// DO NOT CHANGE TEXT ABOVE

	const result: Result = [];

	type Driver = {
		id: number;
		name: string;
	};

	const driverGenerator: SchemaGenerator<Driver> = {
		id: getIdFn(),
		name: faker.person.fullName,
	};

	const drivers = generate<Driver[]>([driverGenerator, 100]);

	result.push({ name: "Drivers", data: drivers });

	const CarModelValues = ["Audi", "BMW", "Mercedes", "Porsche"] as const;
	type CarModelType = (typeof CarModelValues)[number];

	type Car = {
		id: number;
		model: CarModelType;
		driver: number | null;
		price: number | null;
	};

	const carGenerator: SchemaGenerator<Car> = {
		id: getIdFn(),
		model: getRandomElementFn(CarModelValues),
		driver: () => Store.set("driver", randomBoolean() ? getRandomElementFn(drivers)().id : null),
		price: () => (Store.get("driver") ? null : getRandomIntFn(1e5, 1e7)() / 100),
	};

	const cars = generate<Car[]>([carGenerator, [10, 20]]);

	result.push({ name: "Cars", data: cars });

	return result;
};
