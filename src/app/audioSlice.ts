import { createSlice } from '@reduxjs/toolkit';
import { AudioSlice } from './types';

export const audioSlice = createSlice({
	name: 'audio',
	initialState: {
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
			action: {
				payload: { hasErrors: boolean; isReady: boolean; position: number };
			}
		) => {
			audio.hasError = action.payload.hasErrors;
			audio.isReady = action.payload.isReady;
			audio.position = action.payload.position;
		},
		audioFileChanged: (
			audio,
			action: {
				payload: { hasErrors: boolean; isReady: boolean; position: number };
			}
		) => {
			audio.hasError = action.payload.hasErrors;
			audio.isReady = action.payload.isReady;
			audio.position = action.payload.position;
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
	},
});

export const {
	audioSettingsLoaded,
	audioInitialized,
	audioFileChanged,
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
} = audioSlice.actions;

export const selectAudioSettings = (state: AudioSlice) => state.audio;
export default audioSlice.reducer;
