import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "..";
import {
  CustomJsonChapter,
  CustomJsonVerse,
  bookTitleToFinalChapterNumber,
} from "@/types/textTypes";

export const selectCurrentChapter = (s: RootState) => s.text.currentChapter;

export const selectCurrentChapterLoading = (s: RootState) =>
  s.text.currentChapterLoading;

export const selectCurrentChapterError = (s: RootState) =>
  s.text.currentChapterError;

const customJsonVerseToString = (verse: CustomJsonVerse): string =>
  verse.text.replace(/\n/g, `\n\n     [${verse.verseNumber.toString()}] `);

const customJsonChapterToString = (chapter: CustomJsonChapter): string => {
  console.log("raw chapter: ", chapter);
  return (
    " ".repeat(5) +
    "[1] " +
    chapter.verses.map(customJsonVerseToString).join(" ")
  );
};

export const selectCurrentChapterString = createSelector(
  selectCurrentChapter,
  (chapter) => (chapter ? customJsonChapterToString(chapter) : null),
);

const condenseChapterString = (s: string): string => s[0];

export const selectCondensedChapterString = createSelector(
  selectCurrentChapterString,
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

export const selectChapterNumberForBookTitle = createSelector(
  selectFinalChapterNumberForBookTitle,
  (finalChapterNumber) => {
    return Array.from({ length: finalChapterNumber }, (_, i) => i + 1);
  },
);

export const selectSelectedChapterNumber = (s: RootState) =>
  s.text.selectedChapterNumber;
