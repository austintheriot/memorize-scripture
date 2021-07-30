import { createSlice } from '@reduxjs/toolkit';
import { Psalm23, Psalm23Split, Psalm23Condensed } from '../app/Psalm23';
import { breakFullTextIntoLines, condenseText } from '../app/condense';
import {
	splitTitleIntoBookAndChapter,
	addToTextArray,
} from '../utils/storageUtils';

import axios from 'axios';
import { ESVApiKey } from '../app/config';
import { AppDispatch } from './store';
import { BibleBook, Chapter, Title } from 'pages/Memorize/bible';
import { Analytics } from 'hooks/useFirebaseContext';
import { setAudioUrl } from './searchSlice';

export interface TextState {
	loading: boolean;
	error: boolean;
	book: BibleBook;
	chapter: string;
	body: string;
	split: readonly string[];
	condensed: readonly string[];
	showCondensed: boolean;
	clickedLine: number;
	reviewInput: string;
	condenseToolInput: string;
	condenseToolOutput: string[];
	copied: boolean;
	copiedError: boolean;
}

const initialState: TextState = {
	loading: false,
	error: false,
	book: 'Psalms',
	chapter: '23',
	body: Psalm23,
	split: Psalm23Split,
	condensed: Psalm23Condensed,
	showCondensed: false,
	clickedLine: -1,
	reviewInput: '',
	condenseToolInput: '',
	condenseToolOutput: [''],
	copied: false,
	copiedError: false,
};

const updateTextState = (
	draft: TextState,
	action: { payload: { book: BibleBook; chapter: string; body: string } },
) => {
	draft.book = action.payload.book;
	draft.chapter = action.payload.chapter;
	draft.body = action.payload.body;
	const lineBrokenText = breakFullTextIntoLines(action.payload.body);
	draft.split = lineBrokenText;
	draft.condensed = condenseText(lineBrokenText);
};

export const textSlice = createSlice({
	name: 'text',
	initialState,
	reducers: {
		userEnteredReviewInput: (draft, action: { payload: string }) => {
			draft.reviewInput = action.payload;
		},
		textSettingsLoaded: (draft, action: { payload: boolean }) => {
			draft.showCondensed = action.payload;
		},
		textInitialized: (
			draft,
			action: { payload: { book: BibleBook; chapter: string; body: string } },
		) => {
			draft.error = false;
			updateTextState(draft, action);
		},
		textMostRecentPassageClicked: (
			draft,
			action: { payload: { title: Title; body: string } },
		) => {
			draft.error = false;
			const splitTitle = splitTitleIntoBookAndChapter(action.payload.title);
			if (
				draft.book === splitTitle.book &&
				draft.chapter === splitTitle.chapter
			)
				return;
			updateTextState(draft, {
				payload: {
					book: splitTitle.book,
					chapter: splitTitle.chapter,
					body: action.payload.body,
				},
			});
		},
		textRetrievedFromLocalStorage: (
			draft,
			action: { payload: { book: BibleBook; chapter: string; body: string } },
		) => {
			draft.clickedLine = -1;
			draft.error = false;
			updateTextState(draft, action);
		},
		textBeingFetchedFromAPI: (draft) => {
			draft.clickedLine = -1;
			draft.error = false;
			draft.loading = true;
		},
		textFetchSucceeded: (
			draft,
			action: { payload: { book: BibleBook; chapter: string; body: string } },
		) => {
			draft.loading = false;
			updateTextState(draft, action);
		},
		textFetchFailed: (draft) => {
			draft.loading = false;
			draft.error = true;
			draft.body = '';
			draft.split = [''];
			draft.condensed = [''];
		},
		viewChangeButtonClicked: (draft, action) => {
			draft.showCondensed = action.payload;
		},
		splitTextClicked: (draft, action) => {
			draft.clickedLine = action.payload;
		},
		condenseToolInputChanged: (draft, action: { payload: string }) => {
			draft.copied = false;
			draft.copiedError = false;
			draft.condenseToolInput = action.payload;
			draft.condenseToolOutput = condenseText(
				breakFullTextIntoLines(action.payload),
			);
		},
		condensedTextCopiedSuccess: (draft) => {
			draft.copied = true;
			draft.copiedError = false;
		},
		condensedTextCopiedFail: (draft) => {
			draft.copied = false;
			draft.copiedError = true;
		},
	},
});

export const {
	userEnteredReviewInput,
	textSettingsLoaded,
	textInitialized,
	textMostRecentPassageClicked,
	textRetrievedFromLocalStorage,
	textBeingFetchedFromAPI,
	textFetchSucceeded,
	textFetchFailed,
	viewChangeButtonClicked,
	splitTextClicked,
	condenseToolInputChanged,
	condensedTextCopiedSuccess,
	condensedTextCopiedFail,
} = textSlice.actions;

export const fetchTextFromESVAPI = (
	book: BibleBook,
	chapter: Chapter,
	analytics: Analytics,
) => async (dispatch: AppDispatch) => {
	console.log(dispatch(textBeingFetchedFromAPI()));

	const title = `${book} ${chapter}` as Title;
	console.log(`Fetching draft body file of ${title} from ESV API`);
	analytics.logEvent('fetched_text_from_ESV_API', {
		book,
		chapter,
		title,
	});

	const textURL =
		'https://api.esv.org/v3/passage/text/?' +
		`q=${title}` +
		'&include-passage-references=false' +
		'&include-verse-numbers=false' +
		'&include-first-verse-numbers=false' +
		'&include-footnotes=false' +
		'&include-footnote-body=false' +
		'&include-headings=false' +
		'&include-selahs=false' +
		'&indent-paragraphs=10' +
		'&indent-poetry-lines=5' +
		'&include-short-copyright=false';

	try {
		const response = await axios.get(textURL, {
			headers: {
				Authorization: ESVApiKey,
			},
		});
		console.log(`Text body of ${title} received from ESV API`);
		const body = response.data.passages[0];
		dispatch(
			textFetchSucceeded({
				book,
				chapter,
				body,
			}),
		);
		dispatch(setAudioUrl({ book, chapter }));
		addToTextArray(title, body);
	} catch (error) {
		console.log(error);
		dispatch(textFetchFailed());
	}
};

export default textSlice.reducer;
