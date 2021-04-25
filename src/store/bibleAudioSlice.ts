import { createSlice } from '@reduxjs/toolkit';
import { BibleBook, Title } from 'pages/Learn/bible';
import { splitTitleIntoBookAndChapter } from '../utils/storageUtils';

export interface BibleAudioState {
	url: string;
	hasError: boolean;
	isReady: boolean;
	isPlaying: boolean;
	position: number;
	speed: number;
}

const initialState: BibleAudioState = {
	url: 'https://audio.esv.org/hw/mq/Psalm23.mp3',
	hasError: false,
	isReady: false,
	isPlaying: false,
	position: 0,
	speed: 1,
}

const createNewUrl = (book: BibleBook, chapter: string): string => {
	return `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
};

const updateAudio = (draft: BibleAudioState, book: BibleBook, chapter: string) => {
	const newUrl = createNewUrl(book, chapter);
	if (draft.url !== newUrl) {
		draft.url = newUrl;
		draft.isPlaying = false;
		draft.hasError = false;
		draft.position = 0;
	}
};

export const bibleAudioSlice = createSlice({
	name: 'bibleAudio',
	initialState,
	reducers: {
		audioSettingsLoaded: (draft, action: { payload: number }) => {
			draft.speed = action.payload;
		},
		audioInitialized: (
			draft, action: { payload: { book: BibleBook; chapter: string } }
		) => {
			updateAudio(draft, action.payload.book, action.payload.chapter);
		},
		audioFileChanged: (
			draft, action: { payload: { book: BibleBook; chapter: string } }
		) => {
			updateAudio(draft, action.payload.book, action.payload.chapter);
		},
		audioMostRecentPassageClicked: (draft, action: { payload: Title }) => {
			const { book, chapter } = splitTitleIntoBookAndChapter(action.payload);
			updateAudio(draft, book, chapter);
		},
		canPlayEvent: (draft) => {
			draft.isReady = true;
		},
		pauseEvent: (draft) => {
			draft.isPlaying = false;
		},
		playEvent: (draft) => {
			draft.isPlaying = true;
		},
		errorEvent: (draft) => {
			draft.hasError = true;
		},
		playingEvent: (draft) => {
			draft.isReady = true;
		},
		timeupdateEvent: (draft, action: { payload: number }) => {
			draft.position = action.payload;
		},
		ratechangeEvent: (draft, action: { payload: number }) => {
			draft.speed = action.payload;
		},
		rewindButtonClicked: (draft, action) => {
			draft.position = action.payload;
		},
		forwardButtonClicked: (draft, action) => {
			draft.position = action.payload;
		},
		progressBarClicked: (draft, action) => {
			draft.position = action.payload;
		},
		speedButtonClicked: (draft, action) => {
			draft.speed = action.payload;
		},
		playButtonClicked: (draft) => {
			draft.isPlaying = true;
		},
		pauseButtonClicked: (draft) => {
			draft.isPlaying = false;
		},
		spacebarPressed: (draft) => {
			draft.isPlaying = !draft.isPlaying;
		},
		leftArrowPressed: (draft, action) => {
			draft.position = action.payload;
		},
		rightArrowPressed: (draft, action) => {
			draft.position = action.payload;
		},
	},
});

export const {
	audioSettingsLoaded,
	audioInitialized,
	audioFileChanged,
	audioMostRecentPassageClicked,
	canPlayEvent,
	pauseEvent,
	playEvent,
	errorEvent,
	playingEvent,
	timeupdateEvent,
	ratechangeEvent,
	rewindButtonClicked,
	forwardButtonClicked,
	progressBarClicked,
	speedButtonClicked,
	playButtonClicked,
	pauseButtonClicked,
	spacebarPressed,
	leftArrowPressed,
	rightArrowPressed,
} = bibleAudioSlice.actions;

export default bibleAudioSlice.reducer;
