import { createSlice } from '@reduxjs/toolkit';
import { SearchSlice } from '../types';
import { bookChapters } from '../../views/Home/bible';

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
		bookSelected: (search, action) => {
			search.book = action.payload;
		},
		chapterAdjustedWithNewBook: (search, action) => {
			search.chapter = action.payload;
		},
		chapterSelected: (search, action) => {
			search.chapter = action.payload;
		},
		numberOfChaptersAdjustedWithNewBook: (search, action) => {
			search.numberOfChapters = action.payload;
		},
	},
});

export const {
	searchInitialized,
	bookSelected,
	chapterSelected,
	chapterAdjustedWithNewBook,
	numberOfChaptersAdjustedWithNewBook,
} = searchSlice.actions;

export const selectSearch = (state: SearchSlice) => state.search;

export default searchSlice.reducer;
