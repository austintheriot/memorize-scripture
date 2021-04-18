import { configureStore } from '@reduxjs/toolkit';
import textReducer from 'store/textSlice';
import searchReducer from 'store/searchSlice';
import audioReducer from 'store/bibleAudioSlice';
import appReducer from 'store/appSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
	reducer: {
		app: appReducer,
		text: textReducer,
		search: searchReducer,
		bibleAudio: audioReducer,
	}
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppGetState = typeof store.getState
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;