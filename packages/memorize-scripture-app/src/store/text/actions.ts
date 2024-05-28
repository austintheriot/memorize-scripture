import { BookTitle, ChapterNumber, Translation } from "@/utils/textUtils";
import {
	setCurrentChapter,
	setCurrentChapterError,
	setCurrentChapterLoading,
} from "./slice";
import { RequestManager } from "@/utils/RequestManager";
import { TextManager } from "@/utils/TextManager";

const textFetchRequestManager = new RequestManager();
const textManager = new TextManager();

export const fetchBibleChapter = async (
	translation: Translation,
	bookTitle: BookTitle,
	chapterNumber: ChapterNumber,
) => {
	const requestId = textFetchRequestManager.getNewId();
	try {
		void setCurrentChapter(null);
		void setCurrentChapterLoading(true);
		void setCurrentChapterError(false);

		const chapterText = await textManager.getChapter(
			translation,
			bookTitle,
			chapterNumber,
		);

		if (textFetchRequestManager.isMostRecentRequest(requestId)) {
			void setCurrentChapter(chapterText);
		}
	} catch (e) {
		void setCurrentChapterError(true);
	} finally {
		void setCurrentChapterLoading(false);
	}
};
