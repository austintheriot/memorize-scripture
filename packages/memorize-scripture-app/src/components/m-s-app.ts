import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { fetchAllBibles } from "@/store/text";
import "@/components/m-s-bible-list";

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
  public connectedCallback(): void {
    super.connectedCallback();
    const loadingIndicator = document.querySelector(
      ".loading-indicator",
    ) as HTMLDivElement;
    loadingIndicator.style.display = "none";
  }

  protected render() {
    return html`<m-s-bible-list></m-s-bible-list>`;
  }
}

declare global {
  type MSAppNameMap = {
    [K in MSAppName]: MSApp;
  };

  interface HTMLElementTagNameMap extends MSAppNameMap { }
}
