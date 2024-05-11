import { BookTitle, ChapterNumber, Translation } from "../types/textTypes";
import kjv from "../texts/kjv.json"

export class TextManager {
  public getChapter(_book: BookTitle, _chapter: ChapterNumber, _translation: Translation): string {
    return (kjv as any).books[0].chapters[0].verses[0].text as string
  }
}

export const textManager = new TextManager();
