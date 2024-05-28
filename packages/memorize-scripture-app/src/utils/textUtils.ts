export const bookTitleFileNameMap = [
	["Genesis", "00-genesis"],
	["Exodus", "01-exodus"],
	["Leviticus", "02-leviticus"],
	["Numbers", "03-numbers"],
	["Deuteronomy", "04-deuteronomy"],
	["Joshua", "05-joshua"],
	["Judges", "06-judges"],
	["Ruth", "07-ruth"],
	["1 Samuel", "08-1samuel"],
	["2 Samuel", "09-2samuel"],
	["1 Kings", "10-1kings"],
	["2 Kings", "11-2kings"],
	["1 Chronicles", "12-1chronicles"],
	["2 Chronicles", "13-2chronicles"],
	["Ezra", "14-ezra"],
	["Nehemiah", "15-nehemiah"],
	["Esther", "16-esther"],
	["Job", "17-job"],
	["Psalms", "18-psalms"],
	["Proverbs", "19-proverbs"],
	["Ecclesiastes", "20-ecclesiastes"],
	["Song of Solomon", "21-songofsolomon"],
	["Isaiah", "22-isaiah"],
	["Jeremiah", "23-jeremiah"],
	["Lamentations", "24-lamentations"],
	["Ezekiel", "25-ezekiel"],
	["Daniel", "26-daniel"],
	["Hosea", "27-hosea"],
	["Joel", "28-joel"],
	["Amos", "29-amos"],
	["Obadiah", "30-obadiah"],
	["Jonah", "31-jonah"],
	["Micah", "32-micah"],
	["Nahum", "33-nahum"],
	["Habakkuk", "34-habakkuk"],
	["Zephaniah", "35-zephaniah"],
	["Haggai", "36-haggai"],
	["Zechariah", "37-zechariah"],
	["Malachi", "38-malachi"],
	["Matthew", "39-matthew"],
	["Mark", "40-mark"],
	["Luke", "41-luke"],
	["John", "42-john"],
	["Acts", "43-acts"],
	["Romans", "44-romans"],
	["1 Corinthians", "45-1corinthians"],
	["2 Corinthians", "46-2corinthians"],
	["Galatians", "47-galatians"],
	["Ephesians", "48-ephesians"],
	["Philippians", "49-philippians"],
	["Colossians", "50-colossians"],
	["1 Thessalonians", "51-1thessalonians"],
	["2 Thessalonians", "52-2thessalonians"],
	["1 Timothy", "53-1timothy"],
	["2 Timothy", "54-2timothy"],
	["Titus", "55-titus"],
	["Philemon", "56-philemon"],
	["Hebrews", "57-hebrews"],
	["James", "58-james"],
	["1 Peter", "59-1peter"],
	["2 Peter", "60-2peter"],
	["1 John", "61-1john"],
	["2 John", "62-2john"],
	["3 John", "63-3john"],
	["Jude", "64-jude"],
	["Revelation", "65-revelation"],
] as const;

export type BookTitleFileNameMap = typeof bookTitleFileNameMap;

export type BookTitleFileName = BookTitleFileNameMap[number][1];

export const isBookTitle = (s: unknown): s is BookTitle => {
	if (typeof s !== "string") return false;
	return !!bookTitleFileNameMap.find((mapping) => s === mapping[0]);
};

export const isBookTitleFileName = (s: unknown): s is BookTitleFileName => {
	if (typeof s !== "string") return false;
	return !!bookTitleFileNameMap.find((mapping) => s === mapping[1]);
};

export const bookTitleFileNameToBookTitle = (
	bookTitleFileName: BookTitleFileName,
): BookTitle | null => {
	const mapping = bookTitleFileNameMap.find(
		(mapping) => mapping[1] === bookTitleFileName,
	);

	if (!mapping) return null;

	return mapping[0];
};

export const bookTitleToBookTitleFileName = (
	bookTitle: BookTitle,
): BookTitleFileName | null => {
	const mapping = bookTitleFileNameMap.find(
		(mapping) => mapping[0] === bookTitle,
	) as BookTitleFileNameMap[number];

	return mapping[1];
};

export const booksAndTitlesArray = [
	["Genesis", 50],
	["Exodus", 40],
	["Leviticus", 27],
	["Numbers", 36],
	["Deuteronomy", 34],
	["Joshua", 24],
	["Judges", 21],
	["Ruth", 4],
	["1 Samuel", 31],
	["2 Samuel", 24],
	["1 Kings", 22],
	["2 Kings", 25],
	["1 Chronicles", 29],
	["2 Chronicles", 36],
	["Ezra", 10],
	["Nehemiah", 13],
	["Esther", 10],
	["Job", 42],
	["Psalms", 150],
	["Proverbs", 31],
	["Ecclesiastes", 12],
	["Song of Solomon", 8],
	["Isaiah", 66],
	["Jeremiah", 52],
	["Lamentations", 5],
	["Ezekiel", 48],
	["Daniel", 12],
	["Hosea", 14],
	["Joel", 3],
	["Amos", 9],
	["Obadiah", 1],
	["Jonah", 4],
	["Micah", 7],
	["Nahum", 3],
	["Habakkuk", 3],
	["Zephaniah", 3],
	["Haggai", 2],
	["Zechariah", 14],
	["Malachi", 4],
	["Matthew", 28],
	["Mark", 16],
	["Luke", 24],
	["John", 21],
	["Acts", 28],
	["Romans", 16],
	["1 Corinthians", 16],
	["2 Corinthians", 13],
	["Galatians", 6],
	["Ephesians", 6],
	["Philippians", 4],
	["Colossians", 4],
	["1 Thessalonians", 5],
	["2 Thessalonians", 3],
	["1 Timothy", 6],
	["2 Timothy", 4],
	["Titus", 3],
	["Philemon", 1],
	["Hebrews", 13],
	["James", 5],
	["1 Peter", 5],
	["2 Peter", 3],
	["1 John", 5],
	["2 John", 1],
	["3 John", 1],
	["Jude", 1],
	["Revelation", 22],
] as const;

export const bookTitleToFinalChapterNumber = (bookTitle: BookTitle) => {
	const mapping = booksAndTitlesArray.find(
		(mapping) => mapping[0] === bookTitle,
	);
	if (!mapping)
		throw new Error(
			`Couldn't find associated chapter numbers for book title ${bookTitle}`,
		);

	return mapping[1];
};

export const makeChapterNumberArray = (
	finalChapterNumber: number,
): ChapterNumber[] => {
	return Array.from({ length: finalChapterNumber }, (_, i) => i + 1);
};

export const bookTitleToChapterNumberArray = (
	bookTitle: BookTitle,
): ChapterNumber[] => {
	return makeChapterNumberArray(bookTitleToFinalChapterNumber(bookTitle));
};

export type BooksAndTitlesMap = typeof bookTitleFileNameMap;

export const isValidChapterNumber = (
	bookTitle: BookTitle,
	chapterNumber: number,
): boolean => {
	if (!Number.isInteger(chapterNumber)) return false;

	if (chapterNumber <= 0) return false;

	const mapping = booksAndTitlesArray.find(
		(mapping) => mapping[0] === bookTitle,
	);
	if (!mapping) return false;

	return chapterNumber <= mapping[1];
};

export const allBookTitles = booksAndTitlesArray.map((mapping) => mapping[0]);

const NEW_TESTAMENT_BOOK_TITLE_INDEX = 39;

export const newTestamentBookTitles = booksAndTitlesArray
	.slice(NEW_TESTAMENT_BOOK_TITLE_INDEX)
	.map((mapping) => mapping[0]) satisfies BookTitle[];

export const oldTestamentBookTitles = booksAndTitlesArray
	.slice(0, NEW_TESTAMENT_BOOK_TITLE_INDEX)
	.map((mapping) => mapping[0]) satisfies BookTitle[];

export const isValidBookForTranslation = (
	translation: Translation,
	bookTitle: BookTitle,
) => {
	return translationToBookTitles(translation).includes(bookTitle);
};

export type BookTitle = BooksAndTitlesMap[number][0];

export type ChapterNumber = number;

export const translations = ["esv", "byzantine"] as const;

export const translationToBookTitles = (
	translation: Translation,
): BookTitle[] => {
	switch (translation) {
		case "esv":
			return allBookTitles;
		case "byzantine":
			return newTestamentBookTitles;
		default:
			throw new Error("Unexpected translation reached");
	}
};

export const textViews = ["full", "condensed", "hidden"] as const;

export type TextView = (typeof textViews)[number];

export type Translation = (typeof translations)[number];

export interface VerseJson {
	chapter: number;
	verse: number;
	name: `${BookTitle} ${number}:${number}`;
	text: string;
}

export interface ChapterJson {
	chapter: number;
	name: `${BookTitle} ${number}`;
	verses: VerseJson[];
}

export interface BookJson {
	nr: number;
	name: BookTitle;
	chapters: ChapterJson[];
}

export interface TextJson {
	translation: string;
	abbreviation: string;
	discription: string;
	lang: string;
	language: string;
	direction: string;
	encoding: string;
	books: BookJson[];
}

export type TextAppearance = "full" | "condensed" | "hidden";

export interface CustomJsonVerse {
	bookTitle: BookTitle;
	chapterNumber: number;
	verseNumber: number;
	text: string;
}

export interface CustomJsonChapter {
	bookTitle: BookTitle;
	chapterNumber: ChapterNumber;
	verses: CustomJsonVerse[];
}

export const customJsonVerseToString = (verse: CustomJsonVerse): string =>
	verse.text.replace(/\n/g, `\n\n     [${verse.verseNumber.toString()}] `);

export const customJsonChapterToString = (
	chapter: CustomJsonChapter,
): string => {
	console.log("raw chapter: ", chapter);
	return (
		" ".repeat(5) +
		"[1] " +
		chapter.verses.map(customJsonVerseToString).join(" ")
	);
};
