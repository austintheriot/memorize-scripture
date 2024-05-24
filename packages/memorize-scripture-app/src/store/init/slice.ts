/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice } from "@reduxjs/toolkit";
import { wrapActionsWithDispatch } from "@/store/wrapActionsWithDispatch";

export interface InitState {
	appInitialized: boolean;
}

const initialState: InitState = {
	appInitialized: false,
};

export const initSlice = createSlice({
	name: "init",
	initialState,
	reducers: {
		initApp: () => { },
		_setAppInitialized: (state) => {
			state.appInitialized = true;
		},
	},
});

export const { initApp } = initSlice.actions;

export const { setAppInitialized } = wrapActionsWithDispatch(initSlice.actions);

export const initReducer = initSlice.reducer;
