import { createSlice } from '@reduxjs/toolkit';
import { SearchSlice } from '../types';

export const searchSlice = createSlice({
	name: 'search',
	initialState: {
		book: 'Psalms',
		chapter: '23',
		numberOfChapters: 150,
	},
	reducers: {
		setSearchBook: (state, action) => {
			state.book = action.payload;
		},
		setSearchChapter: (state, action) => {
			state.chapter = action.payload;
		},
		setSearchNumberOfChapters: (state, action) => {
			state.numberOfChapters = action.payload;
		},
	},
});

export const {
	setSearchBook,
	setSearchChapter,
	setSearchNumberOfChapters,
} = searchSlice.actions;

export const selectSearch = (state: SearchSlice) => state.search;

export default searchSlice.reducer;
