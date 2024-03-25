import { ESVApiKey } from "app/config";
import axios from "axios";

const TITLES = [
	"Genesis",
	"Exodus",
	"Leviticus",
	"Numbers",
	"Deuteronomy",
	"Joshua",
	"Judges",
	"Ruth",
	"'1 Samuel'",
	"'2 Samuel'",
	"'1 Kings'",
	"'2 Kings'",
	"'1 Chronicles'",
	"'2 Chronicles'",
	"Ezra",
	"Nehemiah",
	"Esther",
	"Job",
	"Psalms",
	"Proverbs",
	"Ecclesiastes",
	"'Song of Solomon'",
	"Isaiah",
	"Jeremiah",
	"Lamentations",
	"Ezekiel",
	"Daniel",
	"Hosea",
	"Joel",
	"Amos",
	"Obadiah",
	"Jonah",
	"Micah",
	"Nahum",
	"Habakkuk",
	"Zephaniah",
	"Haggai",
	"Zechariah",
	"Malachi",
	"Matthew",
	"Mark",
	"Luke",
	"John",
	"Acts",
	"Romans",
	"'1 Corinthians'",
	"'2 Corinthians'",
	"Galatians",
	"Ephesians",
	"Philippians",
	"Colossians",
	"'1 Thessalonians'",
	"'2 Thessalonians'",
	"'1 Timothy'",
	"'2 Timothy'",
	"Titus",
	"Philemon",
	"Hebrews",
	"James",
	"'1 Peter'",
	"'2 Peter'",
	"'1 John'",
	"'2 John'",
	"'3 John'",
	"Jude",
	"Revelation",
];

const CHAPTERS = [
	50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
	31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
	24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1,
	22,
];

// Function to download data to a file
function download(data: string, filename: string, type: string) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else {
		// Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

const getEsvChapter = async (
	title: string,
	chapter: string | number,
): Promise<string> => {
	console.log("running script");

	const textURL =
		"https://api.esv.org/v3/passage/text/?" +
		`q=${title} ${chapter}` +
		"&include-passage-references=false" +
		"&include-verse-numbers=true" +
		"&include-first-verse-numbers=true" +
		"&include-footnotes=false" +
		"&include-footnote-body=false" +
		"&include-headings=false" +
		"&include-selahs=false" +
		"&indent-paragraphs=10" +
		"&indent-poetry-lines=5" +
		"&include-short-copyright=false";

	const response = await axios.get(textURL, {
		headers: {
			Authorization: ESVApiKey,
		},
	});

	console.log(response);

	return response.data.passages[0];
};

const wait = async (ms: number) => {
	return new Promise((res) => setTimeout(res, ms));
};

const MIN_WAIT = 2_000;

const MAX_WAIT = 4_000;

export const getAllBooks = async (
	startingTitle: string,
	startingChapter: number,
) => {
	console.log("Running getAllBooks", startingTitle, startingChapter);
	if (!startingTitle) {
		console.warn("No starting tile supplied", startingTitle);
		return;
	}

	if (typeof startingChapter !== "number") {
		console.warn("No starting chapter supplied");
		return;
	}

	const startingTitleIndex = TITLES.findIndex(
		(title) => title === startingTitle,
	);

	if (startingTitleIndex < 0) {
		console.warn("No matching tilte found for", startingTitle);
		return;
	}

	for (
		let titleIndex = startingTitleIndex;
		titleIndex < TITLES.length;
		titleIndex++
	) {
		const title = TITLES[titleIndex];
		const maxChapters = CHAPTERS[titleIndex];
		const initialChapter =
			titleIndex === startingTitleIndex ? startingChapter : 1;

		for (let chapter = initialChapter; chapter <= maxChapters; chapter++) {
			const waitTime = Math.random() * (MAX_WAIT - MIN_WAIT) + MIN_WAIT;
			console.log("Waiting ", waitTime);
			await wait(waitTime);
			const text = await getEsvChapter(title, chapter);
			console.log("Dowloading: ", title, chapter);
			download(text, `${title} ${chapter}`, "text/plain");
		}
	}
};
