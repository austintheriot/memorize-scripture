import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SelectorController } from "@/controllers/SelectorController";
import { store } from "../store";
import { selectBibleSummaries } from "@/store/text";
import { BibleSummary } from "@/api/ApiBible";

export const M_S_BIBLE_LIST = "m-s-bible-list";

export type MSBibleListName = typeof M_S_BIBLE_LIST;

@customElement(M_S_BIBLE_LIST)
export class MSCounter extends LitElement {
  private _bibleSummaries = new SelectorController(this, store, selectBibleSummaries)

  render() {
    return html`
      <ul>
        ${this._bibleSummaries.value?.map(
      (bible) =>
        html`
        <li @click=${this._makeHandleBibleClick(bible.id)}>
          ${bible.name}
        </li>`,
    )}
      </ul>`;
  }

  private _makeHandleBibleClick(id: BibleSummary["id"]) {
    const callback = () => {
      // fetchChapter(id);
      console.log("clicked!", id);
    };
    return callback.bind(this);
  }
}

declare global {
  type MSBibleListNameMap = {
    [K in MSBibleListName]: MSCounter;
  };

  interface HTMLElementTagNameMap extends MSBibleListNameMap { }
}
