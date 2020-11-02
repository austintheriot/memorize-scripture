import { createSlice } from '@reduxjs/toolkit';
import { AppSlice } from '../types';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		menuIsOpen: false,
		showIsOffline: false,
		showCloseTabs: false,
		showAppIsInstalled: false,
	},
	reducers: {
		setMenuIsOpen: (state, action) => {
			state.menuIsOpen = action.payload;
		},
		setShowIsOffline: (state, action) => {
			state.showIsOffline = action.payload;
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
	setMenuIsOpen,
	setShowIsOffline,
	setShowCloseTabs,
	setShowAppIsInstalled,
} = appSlice.actions;

export const selectApp = (state: AppSlice) => state.app;

export default appSlice.reducer;
