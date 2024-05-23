import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SelectorController } from "@/controllers/SelectorController";
import { store } from "../store";
import { selectBibleSummaries } from "@/store/text";
import { BibleSummary } from "@/api/ApiBible";
import { BookTitle, booksAndTitlesArray } from "@/types/textTypes";

export const M_S_TEXT_PICKER_NAME = "m-s-text-picker";

export type MSTextPickerName = typeof M_S_TEXT_PICKER_NAME;

@customElement(M_S_TEXT_PICKER_NAME)
export class MSTextPicker extends LitElement {
  render() {
    return html` <ul>
      ${booksAndTitlesArray.map(
      ([title]) => html`
          <button @click=${this._makeHandleBookClick(title)}>${title}</button>
        `,
    )}
    </ul>`;
  }

  private _makeHandleBookClick(title: BookTitle) {
    const callback = () => {
      console.log("clicked!", title);
    };
    return callback.bind(this);
  }
}

declare global {
  type MSTextPickerNameMap = {
    [K in MSTextPickerName]: MSTextPicker;
  };

  interface HTMLElementTagNameMap extends MSTextPickerNameMap { }
}
