import { LitElement, type TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Select } from "@/controllers/SelectorController";
import { store } from "@/store";
import {
  selectCondensedChapterString,
  selectCurrentChapter,
  selectTextView,
} from "@/store/text";

export const M_S_TEXT_VIEW_NAME = "m-s-text-view";

export type MSTextViewName = typeof M_S_TEXT_VIEW_NAME;

@customElement(M_S_TEXT_VIEW_NAME)
export class MSTextView extends LitElement {
  private _fullText = new Select(this, store, selectCurrentChapter);
  private _condensedText = new Select(
    this,
    store,
    selectCondensedChapterString,
  );
  private _textView = new Select(this, store, selectTextView);

  private _renderFullTextView(): TemplateResult {
    return html`<span>${this._fullText.value}</span>`;
  }

  private _renderCondensedTextView(): TemplateResult {
    return html`<span>${this._condensedText.value}</span>`;
  }

  private _renderHiddenTextView(): TemplateResult {
    return html`Text is hidden`;
  }

  public render(): TemplateResult {
    switch (this._textView.value) {
      case "hidden":
        return this._renderHiddenTextView();
      case "condensed":
        return this._renderCondensedTextView();
      case "full":
      default:
        return this._renderFullTextView();
    }
  }

  public static styles = css`
    span {
      white-space: pre-wrap;
    }
  `;
}

declare global {
  type MSTextViewNameMap = {
    [K in MSTextViewName]: MSTextViewName;
  };

  interface HTMLElementTagNameMap extends MSTextViewNameMap { }
}
