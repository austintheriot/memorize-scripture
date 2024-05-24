/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

export function wrapActionsWithDispatch<
  Actions extends Record<string, (...args: any[]) => any>,
>(
  actions: Actions,
): {
    [K in keyof Actions as K extends `_${infer S}` ? S : K]: (
      ...args: Parameters<Actions[K]>
    ) => Promise<void>;
  } {
  return Object.entries(actions).reduce((acc, [key, action]) => {
    (acc as any)[key.slice(1)] = async (...args: any) => {
      // to prevent circular dependencies and trying to access th
      // store before it's initialized, we must import this dynamically
      const { store } = await import("@/store/store");
      store.dispatch(action(...args));
    };
    return acc;
  }, {}) as any;
}
