import { createSlice } from '@reduxjs/toolkit';

interface State {
	text: {
		book: string;
		chapter: string;
		body: string;
		lineBrokenBody: string[];
		condensedBody: string[];
	};
}

export const textSlice = createSlice({
	name: 'text',
	initialState: {
		book: 'Psalm',
		chapter: '23',
		body: '',
		lineBrokenBody: [],
		condensedBody: [],
	},
	reducers: {
		setBodyBook: (state, action) => {
			state.book = action.payload;
		},
		setBodyChapter: (state, action) => {
			state.chapter = action.payload;
		},
		setBody: (state, action) => {
			state.body = action.payload;
		},
		setLineBrokenBody: (state, action) => {
			state.lineBrokenBody = action.payload;
		},
		setCondensedBody: (state, action) => {
			state.condensedBody = action.payload;
		},
	},
});

export const {
	setBodyBook,
	setBodyChapter,
	setBody,
	setLineBrokenBody,
	setCondensedBody,
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

export const selectBodyBook = (state: State) => state.text.book;
export const selectBodyChapter = (state: State) => state.text.chapter;
export const selectBody = (state: State) => state.text.body;
export const selectLineBrokenBody = (state: State) => state.text.lineBrokenBody;
export const selectCondensedBody = (state: State) => state.text.condensedBody;

export default textSlice.reducer;
