import { createSelector, createSlice } from "@reduxjs/toolkit";
import { createAudioUrl } from "~/utils/createAudioUrl";
import {
	BibleBook,
	bookTitlesAndChapters,
	Chapter,
} from "../pages/Memorize/bible";
import { RootState } from "./store";

export interface SearchState {
	book: string;
	chapter: string;
	numberOfChapters: number;
	audioUrl: string | null;
}

const initialState: SearchState = {
	book: "Psalms",
	chapter: "23",
	numberOfChapters: 150,
	audioUrl: null,
};

export const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		searchInitialized: (
			draft,
			action: { payload: { book: BibleBook; chapter: Chapter } },
		) => {
			draft.book = action.payload.book;
			draft.chapter = action.payload.chapter;
			draft.numberOfChapters = bookTitlesAndChapters[action.payload.book];
		},
		setBook: (draft, action: { payload: string }) => {
			draft.book = action.payload;
		},
		setChapter: (draft, action: { payload: string }) => {
			draft.chapter = action.payload;
		},
		setAudioUrl: (
			draft,
			action: { payload: { book: BibleBook; chapter: Chapter } },
		) => {
			const url = createAudioUrl(action.payload.book, action.payload.chapter);
			draft.audioUrl = url;
		},
	},
});

export const bookSelector = (state: RootState) => state.search.book;
export const chapterSelector = (state: RootState) => state.search.chapter;
export const numberOfChaptersSelector = createSelector(
	bookSelector,
	chapterSelector,
	(book, chapter) => {
		if (!(book in bookTitlesAndChapters)) return 0;
		return bookTitlesAndChapters[book as BibleBook];
	},
);
export const chaptersArraySelector = createSelector(
	numberOfChaptersSelector,
	(numberOfChapters) =>
		Array(numberOfChapters)
			.fill(null)
			.map((el, i) => `${i + 1}`) as Chapter[],
);

export const { searchInitialized, setBook, setChapter, setAudioUrl } =
	searchSlice.actions;

export default searchSlice.reducer;
