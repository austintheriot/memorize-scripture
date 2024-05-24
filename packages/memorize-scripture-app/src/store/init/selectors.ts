import { RootState } from "..";

export const selectAppIsInitialized = (s: RootState) => s.init.appInitialized;
