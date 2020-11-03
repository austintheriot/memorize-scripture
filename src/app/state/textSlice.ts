import { createSlice } from '@reduxjs/toolkit';
import { TextSlice, TextState } from '../types';
import { Psalm23, Psalm23Split, Psalm23Condensed } from './Psalm23';
import {
	breakFullTextIntoLines,
	condenseText,
} from '../../views/Home/condense';
import { splitTitleIntoBookAndChapter } from '../../views/Home/storage';

const updateTextState = (
	text: TextState,
	action: { payload: { book: string; chapter: string; body: string } }
) => {
	text.book = action.payload.book === 'Psalms' ? 'Psalm' : action.payload.book;
	text.chapter = action.payload.chapter;
	text.body = action.payload.body;
	const lineBrokenText = breakFullTextIntoLines(action.payload.body);
	text.split = lineBrokenText;
	text.condensed = condenseText(lineBrokenText);
};

export const textSlice = createSlice({
	name: 'text',
	initialState: {
		loading: false,
		error: false,
		book: 'Psalm',
		chapter: '23',
		body: Psalm23,
		split: Psalm23Split,
		condensed: Psalm23Condensed,
		showCondensed: false,
		clickedLine: -1,
	},
	reducers: {
		textSettingsLoaded: (text, action: { payload: boolean }) => {
			text.showCondensed = action.payload;
		},
		textInitialized: (
			text,
			action: { payload: { book: string; chapter: string; body: string } }
		) => {
			updateTextState(text, action);
		},
		mostRecentPassageClicked: (
			text,
			action: { payload: { title: string; body: string } }
		) => {
			const splitTitle = splitTitleIntoBookAndChapter(action.payload.title);
			if (text.book === splitTitle.book && text.chapter === splitTitle.chapter)
				return;
			updateTextState(text, {
				payload: {
					book: splitTitle.book,
					chapter: splitTitle.chapter,
					body: action.payload.body,
				},
			});
		},
		textRetrievedFromLocalStorage: (
			text,
			action: { payload: { book: string; chapter: string; body: string } }
		) => {
			text.clickedLine = -1;
			text.error = false;
			updateTextState(text, action);
		},
		textBeingFetchedFromAPI: (text) => {
			text.clickedLine = -1;
			text.error = false;
			text.loading = true;
		},
		textFetchSucceeded: (
			text,
			action: { payload: { book: string; chapter: string; body: string } }
		) => {
			text.loading = false;
			updateTextState(text, action);
		},
		textFetchFailed: (text) => {
			text.loading = false;
			text.error = true;
			text.body = '';
			text.split = [''];
			text.condensed = [''];
		},
		viewChangeButtonClicked: (text, action) => {
			text.showCondensed = action.payload;
		},
		splitTextClicked: (text, action) => {
			text.clickedLine = action.payload;
		},
	},
});

export const {
	textSettingsLoaded,
	textInitialized,
	mostRecentPassageClicked,
	textRetrievedFromLocalStorage,
	textBeingFetchedFromAPI,
	textFetchSucceeded,
	textFetchFailed,
	viewChangeButtonClicked,
	splitTextClicked,
} = textSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

// export const incrementAsync = (amount) => (dispatch) => {
// 	setTimeout(() => {
// 		dispatch(incrementByAmount(amount));
// 	}, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectText = (state: TextSlice) => state.text;

export default textSlice.reducer;
