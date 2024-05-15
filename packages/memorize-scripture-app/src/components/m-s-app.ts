import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { fetchAllBibles } from "@/store/text";

import("@/components/m-s-bible-list");

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
  protected render() {
    return html`
<slot></slot>
<m-s-bible-list></m-s-bible-list>`;
  }

  public static styles = css`
:defined .loading-indicator {
  display: none;
}
`
}

declare global {
  type MSAppNameMap = {
    [K in MSAppName]: MSApp;
  };

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}
