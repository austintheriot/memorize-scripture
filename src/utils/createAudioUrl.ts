import { BibleBook, Chapter } from "~/pages/Memorize/bible";
import { validateBookAndChapter } from "./validation";

export const createAudioUrl = (book: BibleBook, chapter: Chapter): string => {
  const errors = validateBookAndChapter(book, chapter);
  if (errors) {
    console.error(errors);
    return "";
  }
  return `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
};
