import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  type BookTitle,
  translations,
  type Translation,
  type ChapterNumber,
  bookTitleToChapterNumberArray,
  translationToBookTitles,
  isValidBookForTranslation,
  isValidChapterNumber,
} from "@/utils/textUtils";
import {
  selectSelectedTranslation,
  setSelectedBookTitle,
  setSelectedChapterNumber,
  setSelectedTranslation,
} from "@/store/text";
import { store } from "@/store";
import { Memo } from "@/controllers/MemoizeController";
import { Effect } from "@/controllers/EffectController";

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

  private _bookTitlesForTranslation = new Memo(
    this,
    () => this._localTranslation,
    (translation) => translation && translationToBookTitles(translation),
  );

  @state()
  private _localBookTitle: BookTitle | null = null;
  private _checkBookTitle = new Effect(
    this,
    () => {
      if (
        this._localTranslation &&
        this._localBookTitle &&
        !isValidBookForTranslation(this._localTranslation, this._localBookTitle)
      ) {
        this._localBookTitle = null;
      }
    },
    () => [this._localTranslation, this._localBookTitle],
  );

  private _chapterNumbersForBookTitle = new Memo(
    this,
    () => this._localBookTitle,
    (bookTitle) => bookTitle && bookTitleToChapterNumberArray(bookTitle),
  );

  @state()
  private _localChapterNumber: ChapterNumber | null = null;
  private _checkChapterNumber = new Effect(
    this,
    () => {
      if (
        this._localBookTitle &&
        this._localChapterNumber &&
        !isValidChapterNumber(this._localBookTitle, this._localChapterNumber)
      ) {
        this._localChapterNumber = null;
      }
    },
    () => [this._localBookTitle, this._localChapterNumber],
  );

  private _submitWhenTruthy = new Effect(
    this,
    () => {
      if (
        this._localTranslation &&
        this._localBookTitle &&
        this._localChapterNumber &&
        isValidBookForTranslation(
          this._localTranslation,
          this._localBookTitle,
        ) &&
        isValidChapterNumber(this._localBookTitle, this._localChapterNumber)
      ) {
        this._submitSelections();
      }
    },
    () => [
      this._localTranslation,
      this._localBookTitle,
      this._localChapterNumber,
    ],
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
    };
    return callback.bind(this);
  }

  private _makeHandleBookClick(bookTitle: BookTitle) {
    const callback = () => {
      this._localBookTitle = bookTitle;
    };
    return callback.bind(this);
  }

  private _makeHandleChapterNumberClick(chapterNumber: ChapterNumber) {
    const callback = () => {
      this._localChapterNumber = chapterNumber;
    };
    return callback.bind(this);
  }

  private _submitSelections() {
    if (!this._localTranslation) {
      throw new Error("Translation should be locally defined");
    }

    if (!this._localBookTitle) {
      throw new Error("Book title should be locally defined");
    }

    if (!this._localChapterNumber) {
      throw new Error("Chapter number should be locally defined");
    }

    void setSelectedTranslation(this._localTranslation);
    void setSelectedBookTitle(this._localBookTitle);
    void setSelectedChapterNumber(this._localChapterNumber);
  }
}

declare global {
  type MSTextPickerNameMap = {
    [K in MSTextPickerName]: MSTextPicker;
  };

  interface HTMLElementTagNameMap extends MSTextPickerNameMap { }
}
