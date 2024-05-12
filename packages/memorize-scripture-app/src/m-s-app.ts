import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/preact-signals';
import { currentText, textIsLoading, currentChapterNumber, currentBookTitle, currentTextAppearance } from './m-s-state';

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
      <button @click=${this._handleIncrementChapter}>Increment Chapter</button>
      <button @click=${this._handleChangeApperance}>Change appearancd</button>
${textIsLoading.value ? html`Loading...` : html`
      <div>
        ${currentText}
      </div>
`}
    `;
  }

  private _handleIncrementChapter() {
    currentChapterNumber.value = currentChapterNumber.value + 1;
  }

  private _handleChangeApperance() {
    switch (currentTextAppearance.value) {
      case "full":
        break;
    }
  }
}

declare global {

  type MSAppNameMap = {
    [K in MSAppName]: MSApp
  }

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}

