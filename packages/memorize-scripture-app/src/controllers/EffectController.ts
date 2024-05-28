import { type ReactiveController, type ReactiveControllerHost } from "lit";
import { type IsEqual, isEqualDefault } from "./common";

/**
 * Enables running effects when local state changes
 */
export class EffectController<Dependencies extends unknown[]>
  implements ReactiveController {
  private _getDependencies: () => Dependencies;
  private _prevDependencies: Dependencies;
  private _effect: () => void;
  private _isEqual: IsEqual<unknown> = isEqualDefault<unknown>;

  constructor(
    host: ReactiveControllerHost,
    effect: () => void,
    getDependencies: () => Dependencies,
    isEqual: IsEqual<unknown> = isEqualDefault,
  ) {
    host.addController(this);
    this._getDependencies = getDependencies;
    this._isEqual = isEqual;
    this._effect = effect;
    this._prevDependencies = getDependencies();
  }

  public hostUpdate(): void {
    const newDependencies = this._getDependencies();
    if (!this._dependenciesDidChange(this._prevDependencies, newDependencies)) {
      return;
    }
    this._prevDependencies = newDependencies;
    this._effect();
  }

  private _dependenciesDidChange(
    prev: Dependencies,
    next: Dependencies,
  ): boolean {
    if (prev.length !== next.length) {
      return true;
    }

    for (let i = 0; i < next.length; i++) {
      if (!this._isEqual(prev[i], next[i])) {
        return true;
      }
    }

    return false;
  }
}

export const Effect = EffectController;
