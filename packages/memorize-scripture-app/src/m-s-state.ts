import { signal, effect } from "@lit-labs/preact-signals";
import { BookTitle, TextAppearance, Translation } from "./types/textTypes";
import { textManager } from "./utils/TextManager";
import { apiBible } from "./api";
import { BibleSummary, Chapter } from "./api/ApiBible";

interface UntrackedValue<T> {
  value: T;
}

export const textLoadingRequestNumber: UntrackedValue<number> = { value: 0 };

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

export const currentTranslation = signal<Translation>("esv");
export const currentBookTitle = signal<BookTitle>("Genesis");
export const currentChapterNumber = signal<number>(1);
export const currentTextAppearance = signal<TextAppearance>("full");
export const currentText = signal<string | null>(null);
const textRequestManager = new RequestManager();
export const textIsLoading = signal<boolean>(false);

export const bibleSummaries = signal<BibleSummary[] | null>(null);
export const bibleSummariesLoading = signal<boolean>(false);
export const bibleSummariesError = signal<boolean>(false);

export const bibleChapter = signal<Chapter[] | null>(null);
export const bibleChapterLoading = signal<boolean>(false);
export const bibleChapterError = signal<boolean>(false);

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

export const fetchChapter = async (bibleId: BibleSummary["id"]) => {
  const searchResponse = apiBible.v1
    .getBooks(bibleId)
    .then((res) => res.json());
  console.log(searchResponse);
};

// export const fetchNewNext = effect(async () => {
//   console.log("running fetch next");
//   const id = textRequestManager.getNewId();
//   textIsLoading.value = true;
//
//   const newText = await textManager.getChapter(
//     currentBookTitle.value,
//     currentChapterNumber.value,
//     currentTranslation.value,
//   );
//
//   console.log({ newText });
//
//   if (textRequestManager.isMostRecentRequest(id)) {
//     currentText.value = newText;
//     textIsLoading.value = false;
//   }
// });
