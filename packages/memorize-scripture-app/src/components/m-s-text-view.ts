import { LitElement, TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SC } from "@/controllers/SelectorController";
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
  protected createRenderRoot() {
    return this;
  }

  private _fullText = new SC(this, store, selectCurrentChapter);
  private _condensedText = new SC(this, store, selectCondensedChapterString);
  private _textView = new SC(this, store, selectTextView);

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
        const value = this._renderFullTextView();
        return value;
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
