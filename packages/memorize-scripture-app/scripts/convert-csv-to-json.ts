import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import {
	type BookTitleFileName,
	type CustomJsonChapter,
	type CustomJsonVerse,
	bookTitleFileNameToBookTitle,
	isBookTitleFileName,
} from "@/types/textTypes";

// Function to convert CSV to JSON
const convertCsvToJson = (csvFilePath: string) => {
	const dir = path.dirname(csvFilePath);
	const ext = path.extname(csvFilePath);
	const bookTitleFileName = path.basename(csvFilePath, ext);

	if (!isBookTitleFileName(bookTitleFileName)) {
		throw new Error(`${bookTitleFileName} is not a vaild book title file name`);
	}

	const bookTitle = bookTitleFileNameToBookTitle(bookTitleFileName);

	if (!bookTitle) {
		throw new Error(`Error parsing valid bookTitle for ${bookTitleFileName}`);
	}

	const jsonDirPath = path.resolve(dir, `../by-chapter/${bookTitleFileName}`);

	if (!fs.existsSync(jsonDirPath)) {
		fs.mkdirSync(jsonDirPath, { recursive: true });
	}

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

	interface SortedCsvValue {
		chapterNumber: number;
		verseNumber: number;
		text: string;
	}

	const sortedRecords: Array<Array<SortedCsvValue>> = [];

	const organizedChapters: Partial<
		Record<BookTitleFileName, CustomJsonChapter[]>
	> = {};

	parser.on("end", () => {
		// sort by chapter number/verse
		records.forEach((record) => {
			const chapterNumber = parseInt(record.chapter, 10);
			const verseNumber = parseInt(record.verse, 10);

			if (!Number.isInteger(chapterNumber)) {
				throw new Error(
					`Couldn't parse chapter number ${chapterNumber} for book ${bookTitle}`,
				);
			}

			if (!Number.isInteger(verseNumber)) {
				throw new Error(
					`Couldn't parse verse numbes ${chapterNumber} for book ${bookTitle}`,
				);
			}

			sortedRecords[chapterNumber] ??= [];
			sortedRecords[chapterNumber][verseNumber] = {
				text: record.text,
				chapterNumber,
				verseNumber,
			};
		});

		// make 0-indexed
		sortedRecords.shift();
		sortedRecords.forEach((chapter) => {
			chapter.shift();
		});

		sortedRecords.forEach((record) => {
			const chapterNumber = record[0].chapterNumber;
			const chapter: CustomJsonChapter = {
				chapterNumber,
				bookTitle,
				verses: record.map(
					(verse) =>
						({
							bookTitle,
							chapterNumber,
							verseNumber: verse.verseNumber,
							text: verse.text,
						}) satisfies CustomJsonVerse,
				),
			};

			organizedChapters[bookTitleFileName] ??= [];
			(organizedChapters as Record<BookTitleFileName, CustomJsonChapter[]>)[
				bookTitleFileName
			][chapterNumber - 1] = chapter;
		});

		console.log(bookTitle, jsonDirPath, sortedRecords[0][0]);

		Object.values(organizedChapters).forEach((chapterList) => {
			chapterList.forEach((chapter) => {
				const jsonFilePath = `${jsonDirPath}/${chapter.chapterNumber}.json`;
				fs.writeFile(jsonFilePath, JSON.stringify(chapter, null, 2), (err) => {
					if (err) {
						console.error(`Error writing JSON file ${jsonFilePath}:`, err);
					} else {
						console.log(
							`Successfully converted ${csvFilePath} to ${jsonFilePath}`,
						);
					}
				});
			});
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
