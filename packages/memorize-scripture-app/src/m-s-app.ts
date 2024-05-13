import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SignalWatcher } from "@lit-labs/preact-signals";
import {
  currentChapterNumber,
  currentBookTitle,
  bibleSummaries,
  bibleSummariesLoading,
  bibleSummariesError,
} from "./m-s-state";
import { BibleSummary } from "./api/ApiBible";

export const M_S_APP_NAME = "m-s-app";

export type MSAppName = typeof M_S_APP_NAME;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(M_S_APP_NAME)
export class MSApp extends SignalWatcher(LitElement) {
  render() {
    return html`
      <h1>${currentBookTitle.value} ${currentChapterNumber.value}</h1>
      ${bibleSummariesError.value
        ? "Error loading Bible summaries"
        : bibleSummariesLoading.value
          ? "Loading Bible summaries"
          : html`
              <ul>
                ${bibleSummaries.value?.map(
            (bible) =>
              html`<li @click=${this._makeHandleBibleClick(bible.id)}>
                      ${bible.name}
                    </li>`,
          )}
              </ul>
            `}
    `;
  }

  private _makeHandleBibleClick(id: BibleSummary["id"]) {
    const callback = () => {
      console.log("clicked!", id);
    };
    return callback.bind(this);
  }
}

declare global {
  type MSAppNameMap = {
    [K in MSAppName]: MSApp;
  };

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}
