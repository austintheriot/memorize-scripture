import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/preact-signals';
import { a, b, bothAreEven } from './m-s-state';
import { textManager } from './utils/TextManager';

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
      <p>A is ${a.value}</p>
      <p>B is ${b.value}</p>
      <p>Both are even: ${bothAreEven.value.toString().toUpperCase()}</p>
      <button @click=${this._onClick}>Increment<button></button></button>
      <div>
        ${textManager.getChapter("Genesis", 1, "kjv")}
      </div>
    `;
  }

  private _onClick() {
    a.value = a.value + 1;
  }
}

declare global {

  type MSAppNameMap = {
    [K in MSAppName]: MSApp
  }

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}

