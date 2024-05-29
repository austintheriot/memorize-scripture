import type { Store, Action as RAction } from "@reduxjs/toolkit";
import { type ReactiveController, type ReactiveControllerHost } from "lit";
import { type IsEqual, isEqualDefault } from "./common";

export type Selector<State, Result> = (state: State) => Result;

/**
 * Enables providing reusable selectors to Lit elements
 * @see https://pr1283-b46091e---lit-dev-5ftespv5na-uc.a.run.app/articles/redux-reactive-controllers/
 */
export class SelectorController<State, Action extends RAction, Result = unknown>
  implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _store: Store<State, Action>;
  private _selector: Selector<State, Result>;
  private _value: Result;
  private _unsubscribe: () => void = () => { };
  private _isEqual: IsEqual<Result> = isEqualDefault<Result>;
  private _prevValue: Result | null = null;

  constructor(
    host: ReactiveControllerHost,
    store: Store<State, Action>,
    selector: Selector<State, Result>,
    isEqual: IsEqual<Result> = isEqualDefault,
  ) {
    this._host = host;
    host.addController(this);
    this._store = store;
    this._selector = selector;
    this._value = selector(store.getState());
    this._isEqual = isEqual;
  }

  public get prevValue(): Result | null {
    return this._prevValue;
  }

  public get value(): Result {
    return this._value;
  }

  public hostConnected() {
    this._unsubscribe = this._store.subscribe(() => {
      const selected = this._selector(this._store.getState());
      if (!this._isEqual(selected, this._value)) {
        this._prevValue = this.value;
        this._value = selected;
        this._host.requestUpdate();
      }
    });
  }

  public hostDisconnected(): void {
    this._unsubscribe();
  }
}

export const Select = SelectorController;