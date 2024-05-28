import { createSelector } from "@reduxjs/toolkit";
import {
  bookTitleToFinalChapterNumber,
  translationToBookTitles,
} from "@/utils/textUtils";
import { type RootState } from "..";

export const selectCurrentChapter = (s: RootState) => s.text.currentChapter;

export const selectCurrentChapterLoading = (s: RootState) =>
  s.text.currentChapterLoading;

export const selectCurrentChapterError = (s: RootState) =>
  s.text.currentChapterError;

const condenseChapterString = (s: string): string => s[0];

export const selectCondensedChapterString = createSelector(
  selectCurrentChapter,
  (chapterString) =>
    chapterString ? condenseChapterString(chapterString) : null,
);

export const selectSelectedTranslation = (s: RootState) =>
  s.text.selectedTranslation;

export const selectTextView = (s: RootState) => s.text.textView;

export const selectSelectedBookTitle = (s: RootState) =>
  s.text.selectedBookTitle;

export const selectFinalChapterNumberForBookTitle = createSelector(
  selectSelectedBookTitle,
  bookTitleToFinalChapterNumber,
);

export const selectBookTitlesForTranslation = createSelector(
  selectSelectedTranslation,
  (translation) => translationToBookTitles(translation),
);

export const selectSelectedChapterNumber = (s: RootState) =>
  s.text.selectedChapterNumber;
