import {
  type BookTitle,
  type ChapterNumber,
  type CustomJsonChapter,
  type Translation,
  bookTitleToBookTitleFileName,
  customJsonChapterToString,
  isValidBookForTranslation,
  isValidChapterNumber,
} from "./textUtils";

export const fetchEsvText = async (
  bookTitle: BookTitle,
  chapterNumber: ChapterNumber,
): Promise<string> => {
  const title = `${bookTitle} ${chapterNumber}`;
  const textURL =
    "https://api.esv.org/v3/passage/text/?" +
    `q=${title}` +
    "&include-passage-references=false" +
    // "&include-verse-numbers=false" +
    "&include-first-verse-numbers=false" +
    "&include-footnotes=false" +
    "&include-footnote-body=false" +
    "&include-headings=false" +
    "&include-selahs=false" +
    // "&indent-paragraphs=10" +
    // "&indent-poetry-lines=5" +
    "&include-short-copyright=false";

  const res = (await fetch(textURL, {
    headers: {
      Authorization: import.meta.env.VITE_ESV_API_KEY,
    },
  }).then((res) => res.json())) as { passages: string[] };

  return res.passages[0];
};

export const fetchCustomText = async (
  translation: Translation,
  bookTitle: BookTitle,
  chapterNumber: ChapterNumber,
): Promise<string> => {
  const bookTitleFile = bookTitleToBookTitleFileName(bookTitle);
  const customJsonChapter = await fetch(
    `/bible/${translation}/text/by-chapter/${bookTitleFile}/${chapterNumber}.json`,
  ).then((request) => request.json() as Promise<CustomJsonChapter>);
  return customJsonChapterToString(customJsonChapter);
};

type ChapterHash = `${BookTitle},${ChapterNumber}`;

const makeChapterHash = (
  bookTitle: BookTitle,
  chapterNumber: ChapterNumber,
): ChapterHash => `${bookTitle},${chapterNumber}` as const;

export class TextManager {
  private _esvChapterCache = new Map<ChapterHash, string>();
  private _byzantineChapterCache = new Map<ChapterHash, string>();

  public async getChapter(
    translation: Translation,
    bookTitle: BookTitle,
    chapterNumber: ChapterNumber,
  ): Promise<string> {
    if (!isValidBookForTranslation(translation, bookTitle)) {
      throw new Error(
        `Invalid book ${bookTitle} for translation ${translation}`,
      );
    }

    if (!isValidChapterNumber(bookTitle, chapterNumber)) {
      throw new Error(
        `Invalid chapter number ${chapterNumber} for book ${bookTitle}`,
      );
    }

    const chapterHash = makeChapterHash(bookTitle, chapterNumber);
    switch (translation) {
      case "esv": {
        const cached = this._esvChapterCache.get(chapterHash);
        if (cached) return cached;
        const text = await fetchEsvText(bookTitle, chapterNumber);
        this._esvChapterCache.set(chapterHash, text);
        return text;
      }
      case "byzantine": {
        const cached = this._byzantineChapterCache.get(chapterHash);
        if (cached) return cached;
        const text = await fetchCustomText(
          translation,
          bookTitle,
          chapterNumber,
        );
        this._byzantineChapterCache.set(chapterHash, text);
        return text;
      }
    }
  }
}

export const textManager = new TextManager();
