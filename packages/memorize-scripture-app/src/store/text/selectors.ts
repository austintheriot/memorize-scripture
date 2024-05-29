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

export const selectCondenserOptions = (s: RootState) => s.text.condenserOptions;

export const selectCondenser = (s: RootState) => s.text.condenser;

export const selectCondensedChapterString = createSelector(
  selectCondenser,
  selectCondenserOptions,
  selectCurrentChapter,
  (condenser, condenserOptions, chapterString) =>
    chapterString
      ? condenser.condenseWithOptions(chapterString, condenserOptions)
      : null,
);
