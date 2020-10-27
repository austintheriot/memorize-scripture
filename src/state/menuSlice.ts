import { createSlice } from '@reduxjs/toolkit';
import { MenuSlice } from '../utilities/types';

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

export const selectMenu = (state: MenuSlice) => state.menu;

export default searchSlice.reducer;
