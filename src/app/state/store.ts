import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './menuSlice';
import textReducer from './textSlice';
import searchReducer from './searchSlice';
import audioReducer from './audioSlice';

export default configureStore({
	reducer: {
		menu: menuReducer,
		text: textReducer,
		search: searchReducer,
		audio: audioReducer,
	},
});
