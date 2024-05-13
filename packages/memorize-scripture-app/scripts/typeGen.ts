#!/usr/bin/env ts-node

import swaggerTypeScrpitAPI from "swagger-typescript-api";
const { generateApi } = swaggerTypeScrpitAPI;
import path from "path";

const main = async () => {
	await generateApi({
		name: "ApiBible.ts",
		// set to `false` to prevent the tool from writing to disk
		output: path.resolve(process.cwd(), "./src/types"),
		input: "https://api.scripture.api.bible/v1/swagger.json",
		url: "https://api.scripture.api.bible/v1/swagger.json",
	});
};

void main();
