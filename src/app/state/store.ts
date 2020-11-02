import { configureStore } from '@reduxjs/toolkit';
import textReducer from './textSlice';
import searchReducer from './searchSlice';
import audioReducer from './audioSlice';
import appReducer from './appSlice';

export default configureStore({
	reducer: {
		app: appReducer,
		text: textReducer,
		search: searchReducer,
		audio: audioReducer,
	},
});
