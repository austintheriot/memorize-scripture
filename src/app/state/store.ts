import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './menuSlice';
import textReducer from './textSlice';
import searchReducer from './searchSlice';
import audioReducer from './audioSlice';
import appReducer from './appSlice';

export default configureStore({
	reducer: {
		app: appReducer,
		menu: menuReducer,
		text: textReducer,
		search: searchReducer,
		audio: audioReducer,
	},
});
