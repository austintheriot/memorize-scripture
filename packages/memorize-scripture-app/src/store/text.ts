import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

class RequestManager {
  private _id = 0;

  public getNewId(): number {
    this._id += 1;
    return this._id;
  }

  public isMostRecentRequest(id: number): boolean {
    return this._id === id;
  }
}



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
    setBibleSummaries: (state, action: PayloadAction<BibleSummary[]>) => {
      state.bibleSummaries = action.payload
    },
  },
})

const fetchAllBibles = async () => {
  bibleSummariesLoading.value = true;
  bibleSummariesError.value = false;
  console.log(import.meta.env.VITE_API_BIBLE_KEY);
  try {
    const response = await apiBible.v1.getBibles(
      {},
      {
        headers: {
          "api-key": import.meta.env.VITE_API_BIBLE_KEY,
        },
      },
    );
    const data = (await response.json()).data as BibleSummary[];
    console.log(data);
    bibleSummaries.value = data;
  } catch (e) {
    console.error("Error fetching Bible summaries", e);
    bibleSummariesError.value = true;
  }
  bibleSummariesLoading.value = false;
};

void fetchAllBibles();


// Action creators are generated for each case reducer function
export const { setBibleSummaries } = textSlice.actions

export const counterReducer = textSlice.reducer;

import { signal, effect } from "@lit-labs/preact-signals";
import { BookTitle, TextAppearance, Translation } from "./types/textTypes";
import { textManager } from "./utils/TextManager";
import { apiBible } from "./api";
import { BibleSummary, Chapter } from "./api/ApiBible";

interface UntrackedValue<T> {
  value: T;
}

export const textLoadingRequestNumber: UntrackedValue<number> = { value: 0 };

