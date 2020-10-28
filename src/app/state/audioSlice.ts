import { createSlice } from '@reduxjs/toolkit';
import { AudioSlice } from '../types';

export const audioSlice = createSlice({
	name: 'search',
	initialState: {
		hasError: false,
		isReady: false,
		isPlaying: false,
		position: 0,
		speed: 1,
	},
	reducers: {
		setAudioHasError: (state, action) => {
			state.hasError = action.payload;
		},
		setAudioIsReady: (state, action) => {
			state.isReady = action.payload;
		},
		setAudioIsPlaying: (state, action) => {
			state.isPlaying = action.payload;
		},
		setAudioPosition: (state, action) => {
			state.position = action.payload;
		},
		setAudioSpeed: (state, action) => {
			state.speed = action.payload;
		},
	},
});

export const {
	setAudioHasError,
	setAudioIsReady,
	setAudioIsPlaying,
	setAudioPosition,
	setAudioSpeed,
} = audioSlice.actions;

export const selectAudioSettings = (state: AudioSlice) => state.audio;
export default audioSlice.reducer;
