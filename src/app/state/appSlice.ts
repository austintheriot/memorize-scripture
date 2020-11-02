import { createSlice } from '@reduxjs/toolkit';
import { AppSlice } from '../types';

export const textSlice = createSlice({
	name: 'app',
	initialState: {
		isOffline: false,
		showCloseTabs: false,
		showAppIsInstalled: false,
	},
	reducers: {
		setShowIsOffline: (state, action) => {
			state.isOffline = action.payload;
		},
		setShowCloseTabs: (state, action) => {
			state.showCloseTabs = action.payload;
		},
		setShowAppIsInstalled: (state, action) => {
			state.showAppIsInstalled = action.payload;
		},
	},
});

export const {
	setShowIsOffline,
	setShowCloseTabs,
	setShowAppIsInstalled,
} = textSlice.actions;

export const selectApp = (state: AppSlice) => state.app;

export default textSlice.reducer;
