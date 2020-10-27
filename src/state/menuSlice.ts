import { createSlice } from '@reduxjs/toolkit';

interface State {
	menu: {
		isOpen: boolean;
	};
}

export const searchSlice = createSlice({
	name: 'menu',
	initialState: {
		isOpen: false,
	},
	reducers: {
		setMenuIsOpen: (state, action) => {
			state.isOpen = action.payload;
		},
	},
});

export const { setMenuIsOpen } = searchSlice.actions;

export const selectMenu = (state: State) => state.menu;

export default searchSlice.reducer;
