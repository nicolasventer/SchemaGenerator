export default "import { faker } from \"@faker-js/faker\"; // here faker-js is used, it is not mandatory but should match perfectly with this library\r\nimport dayjs from \"dayjs\"; // here dayjs is used, it is not mandatory but should match perfectly with this library\r\nimport { Result } from \"Result\";\r\nimport { Store, addTime, generate, generatePreview, getIdFn, getRandomDateFn, getRandomElementFn,\r\n\tgetRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat,\r\n\trandomInt, randomString, shuffle, unique_, type TimeUnitT, type SchemaGenerator } from \"schema-generator\";\r\n\r\nconst getResult = async (): Promise<Result> => {\r\n\t// DO NOT CHANGE TEXT ABOVE\r\n";