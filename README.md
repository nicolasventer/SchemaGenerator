# SchemaGenerator

SchemaGenerator is a typescript library for generating mock data through a schema.
## Features

- type checking
- works with javascript ts-check (cf. below [Js-example](#Js-example))
- `unique_` function to ensure uniqueness of a generated field
- `randomString`, `randomInt`, ... functions to generate random data (quick alternative to [faker.js](https://fakerjs.dev/))
- `Store` static class that allows to use a generated field in another

## Examples

TODO: Examples

### Simple example

Content of [examples/simple/simple_example.ts](examples/simple/simple_example.ts)

```ts

```

### Advanced example

Content of [examples/advanced/advanced_example.ts](examples/advanced/advanced_example.ts)

```ts

```

### Js-example

Content of [examples/js/js_example.js](examples/js/js_example.js)

```js

```

## Usage

```ts
export type SchemaGenerator<T> = T extends Array<infer U> ? [SchemaGenerator<U>, number?] | [SchemaGenerator<U>, [number, number]] : T extends Record<any, any> ? {
    [K in keyof T]: SchemaGenerator<T[K]> | (() => T[K]);
} | (() => T) : () => T;
export declare const unique_: <T>(gen: () => T) => () => T;
export declare const generate: <T>(generator: SchemaGenerator<T>) => T;
export declare class Store {
    private static _data;
    static get: <T>(key: string) => T;
    static set: <T>(key: string, value: T) => T;
}
export declare const randomString: () => string;
export declare const randomInt: () => number;
export declare const randomFloat: () => number;
export declare const randomBoolean: () => boolean;
export declare const randomDate: () => Date;
export declare const getRandomEnumFn: <T>(values: T[]) => () => T;
export declare const getRandomNumberFn: (min: number, max: number, isInt: boolean) => () => number;
export declare const getIdFn: () => () => number;
```

# Licence

MIT Licence. See [LICENSE file](LICENSE).
Please refer me with:

	Copyright (c) Nicolas VENTER All rights reserved.