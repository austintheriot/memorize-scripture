import { createSlice } from '@reduxjs/toolkit';
import { bookChapters } from '../pages/Learn/bible';

export interface SearchState {
	book: string;
	chapter: string;
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
			action: { payload: { book: string; chapter: string } },
		) => {
			draft.book = action.payload.book;
			draft.chapter = action.payload.chapter;
			const newNumberOfChapters = bookChapters[action.payload.book];
			draft.numberOfChapters = newNumberOfChapters;
		},
		bookSelected: (
			draft,
			action: { payload: { bookString: string; chapter: string } },
		) => {
			draft.book = action.payload.bookString;
			const newNumberOfChapters = bookChapters[action.payload.bookString]; //get chapter numbers
			draft.numberOfChapters = newNumberOfChapters;
			if (Number(action.payload.chapter) <= newNumberOfChapters) return;
			draft.chapter = '1';
		},
		chapterSelected: (draft, action: { payload: string }) => {
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
