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
		menuButtonClicked: (app) => {
			app.menuIsOpen = !app.menuIsOpen;
		},
		outsideOfMenuClicked: (app) => {
			app.menuIsOpen = false;
		},
		navLinkClicked: (app) => {
			app.menuIsOpen = false;
		},
		noInternetConnection: (app) => {
			app.showIsOffline = true;
		},
		offlineMessageClosed: (app) => {
			app.showIsOffline = false;
		},
		updateMessageClosed: (app) => {
			app.showCloseTabs = false;
		},
		installedMessageClosed: (app) => {
			app.showAppIsInstalled = false;
		},
		serviceWorkerInstalled: (app) => {
			app.showAppIsInstalled = true;
		},
		updateAvailable: (app) => {
			app.showCloseTabs = true;
		},
	},
});

export const {
	menuButtonClicked,
	navLinkClicked,
	outsideOfMenuClicked,
	noInternetConnection,
	offlineMessageClosed,
	updateMessageClosed,
	installedMessageClosed,
	serviceWorkerInstalled,
	updateAvailable,
} = appSlice.actions;

export const selectApp = (state: AppSlice) => state.app;

export default appSlice.reducer;
