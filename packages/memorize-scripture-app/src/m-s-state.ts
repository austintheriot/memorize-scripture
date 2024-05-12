import { signal, effect } from '@lit-labs/preact-signals';
import { BookTitle, TextAppearance, Translation } from './types/textTypes';
import { textManager } from './utils/TextManager';

interface UntrackedValue<T> {
  value: T
}

export const textLoadingRequestNumber: UntrackedValue<number> = { value: 0 };

class RequestManager {
  private _id = 0;

  public getNewId(): number {
    this._id += 1;
    return this._id;
  }

  public isMostRecentRequest(id: number): boolean {
    return this._id === id
  }
}

export const currentTranslation = signal<Translation>("kjv");
export const currentBookTitle = signal<BookTitle>("Genesis");
export const currentChapterNumber = signal<number>(1);
export const currentTextAppearance = signal<TextAppearance>("full");
export const currentText = signal<string | null>(null);
const textRequestManager = new RequestManager();
export const textIsLoading = signal<boolean>(false);

export const fetchNewNext = effect(async () => {
  console.log("running fetch next")
  const id = textRequestManager.getNewId();
  textIsLoading.value = true;

  const newText = await textManager.getChapter(currentBookTitle.value, currentChapterNumber.value, currentTranslation.value, currentTextAppearance.value);

  console.log({ newText })

  if (textRequestManager.isMostRecentRequest(id)) {
    currentText.value = newText;
    textIsLoading.value = false
  }
})

