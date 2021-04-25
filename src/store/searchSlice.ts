import { createSlice } from '@reduxjs/toolkit';
import { BibleBook, bookTitlesAndChapters, Chapter } from '../pages/Learn/bible';

export interface SearchState {
	book: BibleBook;
	chapter: Chapter;
	numberOfChapters: number;
}

const initialState: SearchState = {
	book: 'Psalms',
	chapter: '23',
	numberOfChapters: 150,
};

export const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		searchInitialized: (
			draft,
			action: { payload: { book: BibleBook ; chapter: Chapter } },
		) => {
			draft.book = action.payload.book;
			draft.chapter = action.payload.chapter;
			draft.numberOfChapters = bookTitlesAndChapters[action.payload.book];;
		},
		bookSelected: (
			draft,
			action: { payload: { bookString: BibleBook; chapter: Chapter } },
		) => {
			draft.book = action.payload.bookString;
			//get chapter numbers
			const newNumberOfChapters = bookTitlesAndChapters[action.payload.bookString]; 
			draft.numberOfChapters = newNumberOfChapters;
			if (Number(action.payload.chapter) <= newNumberOfChapters) return;
			draft.chapter = '1';
		},
		chapterSelected: (draft, action: { payload: Chapter }) => {
			draft.chapter = action.payload;
		},
	},
});

export const {
	searchInitialized,
	bookSelected,
	chapterSelected,
} = searchSlice.actions;

export default searchSlice.reducer;
