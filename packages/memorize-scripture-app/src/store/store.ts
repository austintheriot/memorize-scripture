import { __DO_NOT_USE__ActionTypes, configureStore } from "@reduxjs/toolkit";
import { textReducer } from "@/store/text/slice";
import { initApp, initReducer } from "@/store/init/slice";
import { listenerMiddleware } from "./listenerMiddleware";

export const store = configureStore({
  reducer: {
    text: textReducer,
    init: initReducer,
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should go before the serializability check middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const dispatch = store.dispatch;

dispatch(initApp());
