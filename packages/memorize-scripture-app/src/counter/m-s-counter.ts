import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SelectorController } from "../store/SelectorController";
import { store } from "../store";
import { increment } from "../store/counter";

export const M_S_COUNTER_NAME = "m-s-counter";

export type MSCounterName = typeof M_S_COUNTER_NAME;

@customElement(M_S_COUNTER_NAME)
export class MSCounter extends LitElement {
  private _count = new SelectorController(this, store, (state) => state.counter.value)

  render() {
    return html`
<p>Current count = ${this._count.value}</p>
<button @click=${this._handleClick}>Increment count</button>
`;
  }

  private _handleClick() {
    store.dispatch(increment())
  }
}

declare global {
  type MSCounterNameMap = {
    [K in MSCounterName]: MSCounter;
  };

  interface HTMLElementTagNameMap extends MSCounterNameMap { }
}
