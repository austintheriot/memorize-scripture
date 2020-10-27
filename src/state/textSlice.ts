import { createSlice } from '@reduxjs/toolkit';

interface State {
	text: {
		book: string;
		chapter: string;
		body: string;
		split: string[];
		condensed: string[];
	};
}

export const textSlice = createSlice({
	name: 'text',
	initialState: {
		book: 'Psalm',
		chapter: '23',
		body: '',
		split: [],
		condensed: [],
	},
	reducers: {
		setBook: (state, action) => {
			state.book = action.payload;
		},
		setChapter: (state, action) => {
			state.chapter = action.payload;
		},
		setBody: (state, action) => {
			state.body = action.payload;
		},
		setSplit: (state, action) => {
			state.split = action.payload;
		},
		setCondensed: (state, action) => {
			state.condensed = action.payload;
		},
	},
});

export const {
	setBook,
	setChapter,
	setBody,
	setSplit,
	setCondensed,
} = textSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

// export const incrementAsync = (amount) => (dispatch) => {
// 	setTimeout(() => {
// 		dispatch(incrementByAmount(amount));
// 	}, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectText = (state: State) => state.text;

export default textSlice.reducer;
