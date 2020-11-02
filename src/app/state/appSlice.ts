import { createSlice } from '@reduxjs/toolkit';
import { AppSlice } from '../types';

export const textSlice = createSlice({
	name: 'app',
	initialState: {
		showCloseTabs: false,
		showAppIsInstalled: false,
	},
	reducers: {
		setShowCloseTabs: (state, action) => {
			state.showCloseTabs = action.payload;
		},
		setShowAppIsInstalled: (state, action) => {
			state.showAppIsInstalled = action.payload;
		},
	},
});

export const { setShowCloseTabs, setShowAppIsInstalled } = textSlice.actions;

export const selectApp = (state: AppSlice) => state.app;

export default textSlice.reducer;
