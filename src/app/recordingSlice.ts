import { createSlice } from '@reduxjs/toolkit';
import { RecordingSlice } from './types';

export const recordingSlice = createSlice({
	name: 'recording',
	initialState: {
		isRecording: false,
		hasError: false,
		isReady: false,
		isPlaying: false,
		position: 0,
		speed: 1,
	},
	reducers: {
		recordingButtonClicked: (recording) => {
			recording.isRecording = !recording.isRecording;
		},
		audioSettingsLoaded: (recording, action: { payload: number }) => {
			recording.speed = action.payload;
		},
		audioInitialized: (
			recording,
			action: {
				payload: { hasErrors: boolean; isReady: boolean; position: number };
			}
		) => {
			recording.hasError = action.payload.hasErrors;
			recording.isReady = action.payload.isReady;
			recording.position = action.payload.position;
		},
		audioFileChanged: (
			recording,
			action: {
				payload: { hasErrors: boolean; isReady: boolean; position: number };
			}
		) => {
			recording.hasError = action.payload.hasErrors;
			recording.isReady = action.payload.isReady;
			recording.position = action.payload.position;
		},
		canPlayEvent: (recording) => {
			recording.isReady = true;
		},
		pauseEvent: (recording) => {
			recording.isPlaying = false;
		},
		playEvent: (recording) => {
			recording.isPlaying = true;
		},
		errorEvent: (recording) => {
			recording.hasError = true;
		},
		playingEvent: (recording) => {
			recording.isReady = true;
		},
		timeupdateEvent: (recording, action: { payload: number }) => {
			recording.position = action.payload;
		},
		ratechangeEvent: (recording, action: { payload: number }) => {
			recording.speed = action.payload;
		},
		rewindButtonClicked: (recording, action) => {
			recording.position = action.payload;
		},
		forwardButtonClicked: (recording, action) => {
			recording.position = action.payload;
		},
		progressBarClicked: (recording, action) => {
			recording.position = action.payload;
		},
		speedButtonClicked: (recording, action) => {
			recording.speed = action.payload;
		},
		playButtonClicked: (recording) => {
			recording.isPlaying = true;
		},
		pauseButtonClicked: (recording) => {
			recording.isPlaying = false;
		},
	},
});

export const {
	recordingButtonClicked,
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
} = recordingSlice.actions;

export const selectRecordingSettings = (state: RecordingSlice) =>
	state.recording;
export default recordingSlice.reducer;
