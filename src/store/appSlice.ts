import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
	menuIsOpen: boolean;
	showIsOffline: boolean;
	showCloseTabs: boolean;
	showAppIsInstalled: boolean;
}

const initialState: AppState = {
	menuIsOpen: false,
	showIsOffline: false,
	showCloseTabs: false,
	showAppIsInstalled: false,
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		menuButtonClicked: (draft) => {
			draft.menuIsOpen = !draft.menuIsOpen;
		},
		outsideOfMenuClicked: (draft) => {
			draft.menuIsOpen = false;
		},
		navLinkClicked: (draft) => {
			draft.menuIsOpen = false;
		},
		noInternetConnection: (draft) => {
			draft.showIsOffline = true;
		},
		serviceWorkerInstalled: (draft) => {
			draft.showAppIsInstalled = true;
		},
		updateAvailable: (draft) => {
			draft.showCloseTabs = true;
		},
		offlineMessageClosed: (draft) => {
			draft.showIsOffline = false;
		},
		updateMessageClosed: (draft) => {
			draft.showCloseTabs = false;
		},
		installedMessageClosed: (draft) => {
			draft.showAppIsInstalled = false;
		},
	},
});

export const {
	menuButtonClicked,
	navLinkClicked,
	outsideOfMenuClicked,
	noInternetConnection,
	serviceWorkerInstalled,
	updateAvailable,
	offlineMessageClosed,
	updateMessageClosed,
	installedMessageClosed,
} = appSlice.actions;

export default appSlice.reducer;
