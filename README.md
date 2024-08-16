# Schema Generator UI

Branch with the UI of the Schema Generator.

There are also all the TODOs of the project.

# In Schema Generator UI

- [ ] make a sample with import of dayjs/moment
- [ ] implement import data
- [ ] make schema-generator-api executable

<!-- 
schema-generator-api executable commands:
[exe] [encoded-schema] - create data, then execute serve (with /_reset for resetting the data)
[exe] - display a page where you can paste the code for data generation and retrieve the encoded schema (or in the other direction)
[exe] -f [encoded-schema-file] - same as 1st but with a file
-->

# In Schema Generator

- [ ] handle function in Store (i.e Store.set('name', () => 'value') should be transformed to () => Store.set('name', 'value'))
- [ ] randomDateFn
- [ ] extractElements/limitedExtractElements ? (generate while there is elements extracted)
- [ ] jsonToType: convert json to type with this rules:
	- [ ] if it's an array, check if it has the fields name and data, in this case parse the data and name as the value of name
	- [ ] if it's a string, check if it's a date, an email or an enum (with a default maximum of 5 values, and at least 3 of them repeated)
	- [ ] if it's a number, check if it's an integer or a float, check uniqueness and get range
	- [ ] if it's an object, check if the type already exists
- [ ] typeToGenerator: convert type to generator
- [ ] publish on npm

# License

MIT License. See [LICENSE file](LICENSE).
Please refer me with:

	Copyright (c) Nicolas VENTER All rights reserved.