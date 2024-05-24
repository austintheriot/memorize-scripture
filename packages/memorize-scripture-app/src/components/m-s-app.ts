import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import {
  selectChapterText,
  selectChapterTextError,
  selectChapterTextLoading,
} from "@/store/text";
import "@/components/m-s-text-picker";
import { SC } from "@/controllers/SelectorController";
import { store } from "@/store";
import { selectAppIsInitialized } from "@/store/init";

export const M_S_APP_NAME = "m-s-app";

export type MSAppName = typeof M_S_APP_NAME;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(M_S_APP_NAME)
export class MSApp extends LitElement {
  private _appIsInitialized = new SC(this, store, selectAppIsInitialized);
  private _chapterText = new SC(this, store, selectChapterText);
  private _chapterTextLoading = new SC(this, store, selectChapterTextLoading);
  private _chapterTextError = new SC(this, store, selectChapterTextError);

  // prettier-ignore
  protected render() {
    console.log("init", this._appIsInitialized.value, "prev", this._appIsInitialized.preValue)
    if (!this._appIsInitialized.value) return null

    return html`
<m-s-text-picker></m-s-text-picker>
<span>
${this._chapterTextLoading.value
        ? "Loading"
        : this._chapterTextError.value
          ? "Error"
          : this._chapterText.value}
</span>`;
  }

  public static styles = css`
    span {
      white-space: pre-wrap;
    }
  `;
}

declare global {
  type MSAppNameMap = {
    [K in MSAppName]: MSApp;
  };

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}
