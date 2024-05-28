import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  type BookTitle,
  translations,
  Translation,
  ChapterNumber,
  bookTitleToChapterNumberArray,
  translationToBookTitles,
} from "@/utils/textUtils";
import {
  selectSelectedTranslation,
  setSelectedBookTitle,
  setSelectedChapterNumber,
  setSelectedTranslation,
} from "@/store/text";
import { store } from "@/store";
import { MC } from "@/controllers/MemoizeController";

export const M_S_TEXT_PICKER_NAME = "m-s-text-picker";

export type MSTextPickerName = typeof M_S_TEXT_PICKER_NAME;

@customElement(M_S_TEXT_PICKER_NAME)
export class MSTextPicker extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _localTranslation: Translation | null = selectSelectedTranslation(
    store.getState(),
  );

  private _bookTitlesForTranslation = new MC(
    this,
    () => this._localTranslation,
    (translation) => translation && translationToBookTitles(translation),
  );

  @state()
  private _localBookTitle: BookTitle | null = null;

  private _chapterNumbersForBookTitle = new MC(
    this,
    () => this._localBookTitle,
    (bookTitle) => bookTitle && bookTitleToChapterNumberArray(bookTitle),
  );

  private _renderTranslations() {
    return html`<ul>
      ${translations.map(
      (translation) => html`
          <button @click=${this._makeHandleTranslationClick(translation)}>
            ${translation}
          </button>
        `,
    )}
    </ul>`;
  }

  private _renderBookTitles() {
    if (!this._bookTitlesForTranslation.value) return;

    return html`<ul>
      ${this._bookTitlesForTranslation.value.map(
      (title) => html`
          <button @click=${this._makeHandleBookClick(title)}>${title}</button>
        `,
    )}
    </ul>`;
  }

  private _renderChapterNumbers() {
    if (!this._localBookTitle || !this._chapterNumbersForBookTitle.value)
      return null;

    return html`<ul>
      ${this._chapterNumbersForBookTitle.value.map(
      (n) => html`
          <button @click=${this._makeHandleChapterNumberClick(n)}>${n}</button>
        `,
    )}
    </ul>`;
  }

  // prettier-ignore
  public render() {
    return html`
${this._renderTranslations()}
${this._renderBookTitles()}
${this._renderChapterNumbers()}
`;
  }

  private _makeHandleTranslationClick(translation: Translation) {
    const callback = () => {
      this._localTranslation = translation;
      this._localBookTitle = null;
    };
    return callback.bind(this);
  }

  private _makeHandleBookClick(bookTitle: BookTitle) {
    const callback = () => {
      this._localBookTitle = bookTitle;
    };
    return callback.bind(this);
  }

  // only "commit" local selections to Redux once a chapter number has been chosen
  private _makeHandleChapterNumberClick(chapterNumber: ChapterNumber) {
    const callback = () => {
      if (!this._localTranslation) {
        throw new Error("Translation should be locally defined");
      }

      if (!this._localBookTitle) {
        throw new Error("Book title should be locally defined");
      }

      setSelectedTranslation(this._localTranslation);
      setSelectedBookTitle(this._localBookTitle);
      setSelectedChapterNumber(chapterNumber);
    };
    return callback.bind(this);
  }
}

declare global {
  type MSTextPickerNameMap = {
    [K in MSTextPickerName]: MSTextPicker;
  };

  interface HTMLElementTagNameMap extends MSTextPickerNameMap { }
}
