import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { TextSlice, TextState, UtilityConfig } from './types';
import { Psalm23, Psalm23Split, Psalm23Condensed } from './Psalm23';
import { breakFullTextIntoLines, condenseText } from './condense';
import {
	splitTitleIntoBookAndChapter,
	addToTextArray,
} from '../views/Learn/storage';

import axios from 'axios';
import { ESVApiKey } from './config';

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
		reviewInput: '',
		condenseToolInput: '',
		condenseToolOutput: [''],
		copied: false,
	},
	reducers: {
		userEnteredReviewInput: (text, action: { payload: string }) => {
			text.reviewInput = action.payload;
		},
		textSettingsLoaded: (text, action: { payload: boolean }) => {
			text.showCondensed = action.payload;
		},
		textInitialized: (
			text,
			action: { payload: { book: string; chapter: string; body: string } }
		) => {
			text.error = false;
			updateTextState(text, action);
		},
		mostRecentPassageClicked: (
			text,
			action: { payload: { title: string; body: string } }
		) => {
			text.error = false;
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
		condenseToolInputChanged: (text, action: { payload: string }) => {
			text.copied = false;
			text.condenseToolInput = action.payload;
			text.condenseToolOutput = condenseText(
				breakFullTextIntoLines(action.payload)
			);
		},
		copyButtonClicked: (text) => {
			text.copied = true;
		},
	},
});

export const {
	userEnteredReviewInput,
	textSettingsLoaded,
	textInitialized,
	mostRecentPassageClicked,
	textRetrievedFromLocalStorage,
	textBeingFetchedFromAPI,
	textFetchSucceeded,
	textFetchFailed,
	viewChangeButtonClicked,
	splitTextClicked,
	condenseToolInputChanged,
	copyButtonClicked,
} = textSlice.actions;

export const fetchTextFromESVAPI = (
	book: string,
	chapter: string,
	config: UtilityConfig
) => (dispatch: Dispatch) => {
	dispatch(textBeingFetchedFromAPI());

	const title = `${book} ${chapter}`;
	console.log(`Fetching text body file of ${title} from ESV API`);
	config.analytics.logEvent('fetched_text_from_ESV_API', {
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

	axios
		.get(textURL, {
			headers: {
				Authorization: ESVApiKey,
			},
		})
		.then((response) => {
			console.log(`Text body of ${title} received from ESV API`);
			const body = response.data.passages[0];
			dispatch(
				textFetchSucceeded({
					book: book === 'Psalms' ? 'Psalm' : book,
					chapter,
					body,
				})
			);
			const newAudioUrl = `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
			config.setTextAudio(new Audio(newAudioUrl));
			addToTextArray(title, body);
		})
		.catch((error) => {
			console.log(error);
			dispatch(textFetchFailed());
		});
};

export const selectText = (state: TextSlice) => state.text;

export default textSlice.reducer;
