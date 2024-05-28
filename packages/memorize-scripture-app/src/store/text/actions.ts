import {
	BookTitle,
	ChapterNumber,
	CustomJsonChapter,
	Translation,
	bookTitleToBookTitleFileName,
} from "@/utils/textUtils";
import {
	setCurrentChapter,
	setCurrentChapterError,
	setCurrentChapterLoading,
} from "./slice";

export const fetchByzantineText = async (
	translation: Translation,
	bookTitle: BookTitle,
	chapterNumber: ChapterNumber,
) => {
	try {
		void setCurrentChapter(null);
		void setCurrentChapterLoading(true);
		void setCurrentChapterError(false);

		const bookTitleFile = bookTitleToBookTitleFileName(bookTitle);
		const chapter = await fetch(
			`/bible/${translation}/text/by-chapter/${bookTitleFile}/${chapterNumber}.json`,
		).then((request) => request.json() as Promise<CustomJsonChapter>);
		void setCurrentChapter(chapter);
	} catch (e) {
		void setCurrentChapterError(true);
	} finally {
		void setCurrentChapterLoading(false);
	}
};
