import { configureStore } from '@reduxjs/toolkit';
import textReducer from './textSlice';
import searchReducer from './searchSlice';

export default configureStore({
	reducer: {
		text: textReducer,
		search: searchReducer,
	},
});
