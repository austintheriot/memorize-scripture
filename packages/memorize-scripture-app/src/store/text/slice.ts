/* eslint-disable @typescript-eslint/naming-convention */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { BibleSummary } from '@/api/ApiBible';
import { wrapActionsWithDispatch } from '@/store/utils';

export interface TextState {
  bibleSummaries: BibleSummary[] | null,
  bibleSummariesLoading: boolean,
  bibleSummariesError: boolean,
}

const initialState: TextState = {
  bibleSummaries: null,
  bibleSummariesLoading: false,
  bibleSummariesError: false
}

export const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    _setBibleSummaries: (state, action: PayloadAction<BibleSummary[]>) => {
      state.bibleSummaries = action.payload
    },
    _setBibleSummariesLoading: (state, action: PayloadAction<boolean>) => {
      state.bibleSummariesLoading = action.payload
    },
    _setBibleSummariesError: (state, action: PayloadAction<boolean>) => {
      state.bibleSummariesError = action.payload
    },
  },
})

export const { setBibleSummariesError, setBibleSummaries, setBibleSummariesLoading } = wrapActionsWithDispatch(textSlice.actions)

export const textReducer = textSlice.reducer;

