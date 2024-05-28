import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Select } from "@/controllers/SelectorController";
import { store } from "@/store";
import { selectAppIsInitialized } from "@/store/init";
import "./m-s-text-view";
import "./m-s-text-picker";

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
  protected createRenderRoot() {
    return this;
  }

  private _appIsInitialized = new Select(this, store, selectAppIsInitialized);

  // prettier-ignore
  protected render() {
    if (!this._appIsInitialized.value) {
      return null
    }

    return html`
<m-s-text-picker></m-s-text-picker>
<m-s-text-view></m-s-text-view>
`;
  }
}

declare global {
  type MSAppNameMap = {
    [K in MSAppName]: MSApp;
  };

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}
