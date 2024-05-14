// import { BookTitle, ChapterNumber, TextJson, Translation } from "@/types/textTypes";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TextManager {
  // private _translationCache = new Map<Translation, TextJson>();

  // public async getChapter(
  //   bookTitle: BookTitle,
  //   _chapterNumber: ChapterNumber,
  //   _translation: Translation,
  // ): Promise<string | null> {
  //   if (textAppearance === "hidden") return null;

  // // const text = await this._fetchTranslation(translation);
  // const res = await fetch("api.scripture.api.bible/v1/bibles", {
  //   headers: {
  //     "api-key": import.meta.env.VITE_API_BIBLE_KEY,
  //   }
  // })
  //
  // console.log(res);
  // return

  //  const bookIndex = this._getBookTitleIndex(bookTitle);
  //
  // if (bookIndex === null) return null;
  //
  // // todo: sanitize chapter number here
  //
  // const chapter = text.books[bookIndex]?.chapters[chapterNumber];
  //
  // if (!chapter) return null;
  //
  // if (textAppearance === "full") {
  //   return chapter.verses
  //     .map((verse, i) => `[${i + 1}] ${verse.text}\n`)
  //     .join("");
  // }
  //
  // // todo: provide actual condensation logic here
  // return chapter.verses
  //   .map((verse) => {
  //     return verse.text
  //       .split(" ")
  //       .map((word) => word[0])
  //       .join(" ");
  //   })
  //   .join("");

  // return null;
  // }

  // private _getBookTitleIndex(bookTitle: BookTitle): number | null {
  //   const index = booksAndTitlesArray.findIndex(
  //     ([title]) => title === bookTitle,
  //   );
  //
  //   if (index < 0) return null;
  //
  //   return index;
  // }
  //
  // private async _fetchTranslation(translation: Translation): Promise<TextJson> {
  //   if (!this._translationCache.has(translation)) {
  //     let text: TextJson;
  //     switch (translation) {
  //       case "esv":
  //         text = (await import("../texts/kjv.json")) as unknown as TextJson;
  //         break;
  //     }
  //
  //     this._translationCache.set(translation, text);
  //   }
  //
  //   return this._translationCache.get(translation) as TextJson;
  // }
}

export const textManager = new TextManager();
