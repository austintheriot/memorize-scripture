import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
	fetchBibleChapter,
	selectSelectedBookTitle,
	selectSelectedChapterNumber,
	selectSelectedTranslation,
} from "@/store/text";
import type { RootState, AppDispatch } from "./store";
import { initApp, setAppInitialized } from "./init/slice";
import { selectAppIsInitialized } from "./init";

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
	RootState,
	AppDispatch
>();

startAppListening({
	predicate: (action, currentState, previousState) =>
		initApp.match(action) ||
		selectSelectedTranslation(currentState) !==
		selectSelectedTranslation(previousState) ||
		selectSelectedChapterNumber(currentState) !==
		selectSelectedChapterNumber(previousState) ||
		selectSelectedBookTitle(currentState) !==
		selectSelectedBookTitle(previousState),
	effect: async (_action, listenerApi) => {
		const state = listenerApi.getState();
		const appIsInitialized = selectAppIsInitialized(state);
		const translation = selectSelectedTranslation(state);
		const bookTitle = selectSelectedBookTitle(state);
		const chapterNumber = selectSelectedChapterNumber(state);

		await fetchBibleChapter(translation, bookTitle, chapterNumber);

		if (!appIsInitialized) {
			void setAppInitialized();

			// remove app loading indicator
			const loadingIndicator = document.querySelector(
				".loading-indicator",
			) as HTMLDivElement;
			loadingIndicator.style.display = "none";
		}
	},
});
