import { type RootState } from "..";

export const selectAppIsInitialized = (s: RootState) => s.init.appInitialized;
