import { createContext } from '@lit/context';

export interface MSState {
  test: string
}

export const msState: MSState = { test: "!TEST!" }

export const M_S_STATE_CONTEXT_STRING = 'm-s-state'

export const msStateContext = createContext<MSState>(M_S_STATE_CONTEXT_STRING)
