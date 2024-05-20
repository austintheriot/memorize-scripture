import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

// Function to rename files based on their existing name
const renameFile = (filePath: string) => {
	const dir = path.dirname(filePath);
	const ext = path.extname(filePath);
	const baseName = path.basename(filePath, ext);
	if (baseName.startsWith(".")) {
		return;
	}
	const splitName = baseName.split("_");
	const newName = `${splitName[splitName.length - 1]}.mp3`;
	const newFilePath = path.join(dir, newName);

	fs.rename(filePath, newFilePath, (err) => {
		if (err) {
			console.error(`Error renaming file ${filePath}:`, err);
		} else {
			console.log(`Renamed: ${filePath} -> ${newFilePath}`);
		}
	});
};

// Function to convert CSV to JSON
const convertCsvToJson = (csvFilePath: string) => {
	const dir = path.dirname(csvFilePath);
	const ext = path.extname(csvFilePath);
	const fileName = path.basename(csvFilePath, ext);
	const jsonDirPath = path.resolve(dir, `${dir}/../by-chapter/${fileName}`);
	console.log(dir, fileName, ext, jsonDirPath);

	const parser = fs
		.createReadStream(csvFilePath)
		.pipe(parse({ columns: true }));

	interface ParsedCsvValue {
		chapter: string;
		verse: string;
		text: string;
	}

	const records: ParsedCsvValue[] = [];

	parser.on("data", (record) => {
		records.push(record);
	});

	const chapters: Array<Array<ParsedCsvValue>> = [];

	parser.on("end", () => {
		// sort by chapter number/verse
		records.forEach((record) => {
			const chapterNumber = parseInt(record.chapter, 10);
			const verseNumber = parseInt(record.verse, 10);
			chapters[chapterNumber] ??= [];
			chapters[chapterNumber][verseNumber] = record;
		});

		// make chapters and verses 0-indexed
		chapters.forEach((chapter) => {
			chapter.shift();
		});
		chapters.shift();

		console.log(fileName, chapters[0]?.[0]);

		fs.writeFile(jsonDirPath, JSON.stringify(records, null, 2), (err) => {
			if (err) {
				console.error(`Error writing JSON file ${jsonDirPath}:`, err);
			} else {
				console.log(`Successfully converted ${csvFilePath} to ${jsonDirPath}`);
			}
		});
	});

	parser.on("error", (err) => {
		console.error(`Error parsing CSV file ${csvFilePath}:`, err);
	});
};

// Function to recursively traverse the directory and rename files
const traverseDirectory = (dir: string) => {
	fs.readdir(dir, { withFileTypes: true }, (err, files) => {
		if (err) {
			console.error(`Error reading directory ${dir}:`, err);
			return;
		}

		files.forEach((file) => {
			const fullPath = path.join(dir, file.name);
			if (file.isDirectory()) {
				traverseDirectory(fullPath);
			} else if (file.isFile()) {
				if (!file.name.includes("-")) return;
				convertCsvToJson(fullPath);
			}
		});
	});
};

// uncomment if accepting command line input for directory
// const startDir = process.argv[2] || ".";

const START_DIR = "./public/bible/byzantine/text/by-book";

// Start the traversal
traverseDirectory(START_DIR);
