/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { wrapActionsWithDispatch } from "@/store/wrapActionsWithDispatch";
import {
  type BookTitle,
  type ChapterNumber,
  type TextView,
  type Translation,
} from "@/utils/textUtils";

export interface TextState {
  selectedTranslation: Translation;
  selectedBookTitle: BookTitle;
  selectedChapterNumber: ChapterNumber;
  currentChapter: string | null;
  currentChapterLoading: boolean;
  currentChapterError: boolean;
  textView: TextView;
}

const initialState: TextState = {
  selectedBookTitle: "Matthew",
  selectedChapterNumber: 1,
  selectedTranslation: "byzantine",
  currentChapter: null,
  currentChapterLoading: false,
  currentChapterError: false,
  textView: "full",
};

export const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    _setCurrentChapter: (state, action: PayloadAction<string | null>) => {
      state.currentChapter = action.payload;
    },
    _setCurrentChapterLoading: (state, action: PayloadAction<boolean>) => {
      state.currentChapterLoading = action.payload;
    },
    _setCurrentChapterError: (state, action: PayloadAction<boolean>) => {
      state.currentChapterError = action.payload;
    },
    _setSelectedTranslation: (state, action: PayloadAction<Translation>) => {
      state.selectedTranslation = action.payload;
    },
    _setSelectedBookTitle: (state, action: PayloadAction<BookTitle>) => {
      state.selectedBookTitle = action.payload;
    },
    _setSelectedChapterNumber: (
      state,
      action: PayloadAction<ChapterNumber>,
    ) => {
      state.selectedChapterNumber = action.payload;
    },
    _setTextView: (state, action: PayloadAction<TextView>) => {
      state.textView = action.payload;
    },
  },
});

export const {
  setCurrentChapter,
  setCurrentChapterError,
  setCurrentChapterLoading,
  setSelectedTranslation,
  setTextView,
  setSelectedBookTitle,
  setSelectedChapterNumber,
} = wrapActionsWithDispatch(textSlice.actions);

export const textReducer = textSlice.reducer;
