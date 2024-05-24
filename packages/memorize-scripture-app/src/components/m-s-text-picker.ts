import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import {
  type BookTitle,
  booksAndTitlesArray,
  translations,
  Translation,
  ChapterNumber,
} from "@/types/textTypes";
import {
  selectChapterNumberForBookTitle,
  setSelectedBookTitle,
  setSelectedChapterNumber,
  setSelectedTranslation,
} from "@/store/text";
import { SC } from "@/controllers/SelectorController";
import { store } from "@/store";

export const M_S_TEXT_PICKER_NAME = "m-s-text-picker";

export type MSTextPickerName = typeof M_S_TEXT_PICKER_NAME;

@customElement(M_S_TEXT_PICKER_NAME)
export class MSTextPicker extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  private _chapterNumbersForBookTitle = new SC(
    this,
    store,
    selectChapterNumberForBookTitle,
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
    return html`<ul>
      ${booksAndTitlesArray.map(
      ([title]) => html`
          <button @click=${this._makeHandleBookClick(title)}>${title}</button>
        `,
    )}
    </ul>`;
  }

  private _renderChapterNumbers() {
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
      setSelectedTranslation(translation);
    };
    return callback.bind(this);
  }

  private _makeHandleChapterNumberClick(chapterNumber: ChapterNumber) {
    const callback = () => {
      setSelectedChapterNumber(chapterNumber);
    };
    return callback.bind(this);
  }

  private _makeHandleBookClick(bookTitle: BookTitle) {
    const callback = () => {
      setSelectedBookTitle(bookTitle);
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
