import {
	setChapterText,
	setChapterTextError,
	setChapterTextLoading,
} from "@/store/text/slice";
import type { RootState } from "@/store/index";
import {
	type CustomJsonChapter,
	type CustomJsonVerse,
} from "@/types/textTypes";

export const selectBibleSummaries = (s: RootState) => s.text.bibleSummaries;

const formatVerse = (verse: CustomJsonVerse): string =>
	verse.text.replace(/\n/g, `\n\n     [${verse.verseNumber.toString()}] `);

const formatChapter = (chapter: CustomJsonChapter): string => {
	console.log("raw chapter: ", chapter);
	return " ".repeat(5) + "[1] " + chapter.verses.map(formatVerse).join(" ");
};

export const fetchByzantineText = async () => {
	try {
		void setChapterText(null);
		void setChapterTextLoading(true);
		void setChapterTextError(false);

		const chapter = await fetch(
			"/bible/byzantine/text/by-chapter/40-mark/1.json",
		)
			.then((request) => request.json() as Promise<CustomJsonChapter>)
			.then(formatChapter);
		void setChapterText(chapter);
	} catch (e) {
		void setChapterTextError(true);
	} finally {
		void setChapterTextLoading(false);
	}
};
