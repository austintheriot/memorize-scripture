import { type ReactiveController, type ReactiveControllerHost } from "lit";
import { type IsEqual, isEqualDefault } from "./common";

/**
 * Enables getting derived state from some local state variable.
 */
export class MemoizeController<State, DerivedState = unknown>
  implements ReactiveController {
  private _selector: () => State;
  private _selectedValue: State;

  private _memoize: (state: State) => DerivedState;
  private _memoizedValue: DerivedState;

  private _isEqual: IsEqual<State> = isEqualDefault<State>;

  constructor(
    host: ReactiveControllerHost,
    selector: () => State,
    derivedSelector: (state: State) => DerivedState,
    isEqual: IsEqual<State> = isEqualDefault,
  ) {
    host.addController(this);
    this._selector = selector;
    this._memoize = derivedSelector;
    this._isEqual = isEqual;
    this._selectedValue = selector();
    this._memoizedValue = derivedSelector(this._selectedValue);
  }

  public get value(): DerivedState {
    return this._memoizedValue;
  }

  public hostUpdate(): void {
    const selectedValue = this._selector();
    if (this._isEqual(this._selectedValue, selectedValue)) return;
    this._selectedValue = selectedValue;

    const memoizedValue = this._memoize(this._selectedValue);
    this._memoizedValue = memoizedValue;
  }
}

export const Memo = MemoizeController;
