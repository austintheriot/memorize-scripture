import { RootState } from "..";

export const selectChapterText = (s: RootState) => s.text.chapterText;

export const selectChapterTextLoading = (s: RootState) =>
  s.text.chapterTextLoading;

export const selectChapterTextError = (s: RootState) => s.text.chapterTextError;
