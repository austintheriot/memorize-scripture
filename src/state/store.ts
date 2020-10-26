import { configureStore } from '@reduxjs/toolkit';
import textReducer from './textSlice';
import searchReducer from './searchSlice';
import audioReducer from './audioSlice';

export default configureStore({
	reducer: {
		text: textReducer,
		search: searchReducer,
		audio: audioReducer,
	},
});
