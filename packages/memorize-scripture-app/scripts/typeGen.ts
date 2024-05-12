#!/usr/bin/env ts-node

const main = async () => {
	const response = await fetch("https://api.scripture.api.bible/v1/swagger.json");
	const result = await response.json();

	console.log(result)

}

void main();

