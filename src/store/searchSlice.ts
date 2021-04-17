import { createSlice } from '@reduxjs/toolkit';
import { BibleBook, bookChapters } from '../pages/Learn/bible';

export interface SearchState {
	book: BibleBook;
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
			action: { payload: { book: BibleBook ; chapter: string } },
		) => {
			draft.book = action.payload.book;
			draft.chapter = action.payload.chapter;
			/* For now, afaik, const assertions can be used as index types */
			const copyBook = action.payload.book as string;
			const copyBookChapters: {
				[key: string]: number;
			} = bookChapters as any;
			const newNumberOfChapters = copyBookChapters[copyBook];
			draft.numberOfChapters = newNumberOfChapters;
		},
		bookSelected: (
			draft,
			action: { payload: { bookString: BibleBook; chapter: string } },
		) => {
			draft.book = action.payload.bookString;
			/* For now, afaik, const assertions can be used as index types */
			const copyBookString = action.payload.bookString as string;
			const copyBookChapters: {
				[key: string]: number;
			} = bookChapters as any;
			const newNumberOfChapters = copyBookChapters[copyBookString]; //get chapter numbers
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
