import { createSlice } from '@reduxjs/toolkit';

interface State {
	search: {
		book: string;
		chapter: string;
		numberOfChapters: number;
	};
}

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

export const selectSearch = (state: State) => state.search;

export default searchSlice.reducer;
