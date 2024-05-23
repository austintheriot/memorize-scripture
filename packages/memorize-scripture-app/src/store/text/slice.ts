/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BibleSummary } from "@/api/ApiBible";
import { wrapActionsWithDispatch } from "@/store/utils";

export interface TextState {
  bibleSummaries: BibleSummary[] | null;
  bibleSummariesLoading: boolean;
  bibleSummariesError: boolean;
  chapterText: string | null;
  chapterTextLoading: boolean;
  chapterTextError: boolean;
}

const initialState: TextState = {
  bibleSummaries: null,
  bibleSummariesLoading: false,
  bibleSummariesError: false,
  chapterText: null,
  chapterTextLoading: false,
  chapterTextError: false,
};

export const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    _setBibleSummaries: (state, action: PayloadAction<BibleSummary[]>) => {
      state.bibleSummaries = action.payload;
    },
    _setBibleSummariesLoading: (state, action: PayloadAction<boolean>) => {
      state.bibleSummariesLoading = action.payload;
    },
    _setBibleSummariesError: (state, action: PayloadAction<boolean>) => {
      state.bibleSummariesError = action.payload;
    },
    _setChapterText: (state, action: PayloadAction<string | null>) => {
      state.chapterText = action.payload;
    },
    _setChapterTextLoading: (state, action: PayloadAction<boolean>) => {
      state.chapterTextLoading = action.payload;
    },
    _setChapterTextError: (state, action: PayloadAction<boolean>) => {
      state.chapterTextError = action.payload;
    },
  },
});

export const {
  setBibleSummariesError,
  setBibleSummaries,
  setBibleSummariesLoading,
  setChapterText,
  setChapterTextError,
  setChapterTextLoading,
} = wrapActionsWithDispatch(textSlice.actions);

export const textReducer = textSlice.reducer;
