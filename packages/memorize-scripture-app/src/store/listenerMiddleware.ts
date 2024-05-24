import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./store";
import { initApp, setAppInitialized } from "./init/slice";
import { fetchByzantineText } from "./utils/byzantineText";

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
	RootState,
	AppDispatch
>();

startAppListening({
	actionCreator: initApp,
	effect: async (_action, _listenerApi) => {
		console.log("Initializing app");

		await fetchByzantineText();

		// remove app loading indicator
		const loadingIndicator = document.querySelector(
			".loading-indicator",
		) as HTMLDivElement;
		loadingIndicator.style.display = "none";

		void setAppInitialized();
		console.log("App initialized");
	},
});
