import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import {
  fetchAllBibles,
  selectChapterText,
  selectChapterTextError,
  selectChapterTextLoading,
} from "@/store/text";
import "@/components/m-s-bible-list";
import { SelectorController } from "@/controllers/SelectorController";
import { store } from "@/store";

export const M_S_APP_NAME = "m-s-app";

export type MSAppName = typeof M_S_APP_NAME;

void fetchAllBibles();

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(M_S_APP_NAME)
export class MSApp extends LitElement {
  private _chapterText = new SelectorController(this, store, selectChapterText);
  private _chapterTextLoading = new SelectorController(
    this,
    store,
    selectChapterTextLoading,
  );
  private _chapterTextError = new SelectorController(
    this,
    store,
    selectChapterTextError,
  );

  public connectedCallback(): void {
    super.connectedCallback();
    const loadingIndicator = document.querySelector(
      ".loading-indicator",
    ) as HTMLDivElement;
    loadingIndicator.style.display = "none";
  }

  // prettier-ignore
  protected render() {
    return html` <span>
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
