import { createSlice } from '@reduxjs/toolkit';
import { AudioSlice, AudioState } from './types';
import { splitTitleIntoBookAndChapter } from './storage';

const createNewUrl = (book: string, chapter: string): string => {
	return `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
};

const updateAudio = (audio: AudioState, book: string, chapter: string) => {
	const newUrl = createNewUrl(book, chapter);
	if (audio.url !== newUrl) {
		audio.url = newUrl;
		audio.isPlaying = false;
		audio.hasError = false;
		audio.position = 0;
	}
};

export const audioSlice = createSlice({
	name: 'audio',
	initialState: {
		url: 'https://audio.esv.org/hw/mq/Psalm23.mp3',
		hasError: false,
		isReady: false,
		isPlaying: false,
		position: 0,
		speed: 1,
	},
	reducers: {
		audioSettingsLoaded: (audio, action: { payload: number }) => {
			audio.speed = action.payload;
		},
		audioInitialized: (
			audio,
			action: { payload: { book: string; chapter: string } }
		) => {
			updateAudio(audio, action.payload.book, action.payload.chapter);
		},
		audioFileChanged: (
			audio,
			action: { payload: { book: string; chapter: string } }
		) => {
			updateAudio(audio, action.payload.book, action.payload.chapter);
		},
		audioMostRecentPassageClicked: (audio, action: { payload: string }) => {
			const { book, chapter } = splitTitleIntoBookAndChapter(action.payload);
			updateAudio(audio, book, chapter);
		},
		canPlayEvent: (audio) => {
			audio.isReady = true;
		},
		pauseEvent: (audio) => {
			audio.isPlaying = false;
		},
		playEvent: (audio) => {
			audio.isPlaying = true;
		},
		errorEvent: (audio) => {
			audio.hasError = true;
		},
		playingEvent: (audio) => {
			audio.isReady = true;
		},
		timeupdateEvent: (audio, action: { payload: number }) => {
			audio.position = action.payload;
		},
		ratechangeEvent: (audio, action: { payload: number }) => {
			audio.speed = action.payload;
		},
		rewindButtonClicked: (audio, action) => {
			audio.position = action.payload;
		},
		forwardButtonClicked: (audio, action) => {
			audio.position = action.payload;
		},
		progressBarClicked: (audio, action) => {
			audio.position = action.payload;
		},
		speedButtonClicked: (audio, action) => {
			audio.speed = action.payload;
		},
		playButtonClicked: (audio) => {
			audio.isPlaying = true;
		},
		pauseButtonClicked: (audio) => {
			audio.isPlaying = false;
		},
		spacebarPressed: (audio) => {
			audio.isPlaying = !audio.isPlaying;
		},
		leftArrowPressed: (audio, action) => {
			audio.position = action.payload;
		},
		rightArrowPressed: (audio, action) => {
			audio.position = action.payload;
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
} = audioSlice.actions;

export const selectAudioSettings = (state: AudioSlice) => state.audio;
export default audioSlice.reducer;
