import { createSlice } from '@reduxjs/toolkit';
import { SearchSlice } from './types';
import { bookChapters } from './bible';

export const searchSlice = createSlice({
	name: 'search',
	initialState: {
		book: 'Psalms',
		chapter: '23',
		numberOfChapters: 150,
	},
	reducers: {
		searchInitialized: (
			search,
			action: { payload: { book: string; chapter: string } }
		) => {
			search.book = action.payload.book;
			search.chapter = action.payload.chapter;
			const newNumberOfChapters = bookChapters[action.payload.book];
			search.numberOfChapters = newNumberOfChapters;
		},
		bookSelected: (
			search,
			action: { payload: { bookString: string; chapter: string } }
		) => {
			search.book = action.payload.bookString;
			const newNumberOfChapters = bookChapters[action.payload.bookString]; //get chapter numbers
			search.numberOfChapters = newNumberOfChapters;
			if (Number(action.payload.chapter) <= newNumberOfChapters) return;
			search.chapter = '1';
		},
		chapterSelected: (search, action: { payload: string }) => {
			search.chapter = action.payload;
		},
	},
});

export const {
	searchInitialized,
	bookSelected,
	chapterSelected,
} = searchSlice.actions;

export const selectSearch = (state: SearchSlice) => state.search;

export default searchSlice.reducer;
