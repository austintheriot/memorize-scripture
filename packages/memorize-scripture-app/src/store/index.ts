import { configureStore } from '@reduxjs/toolkit'
import { textReducer } from '@/store/text/slice'

export const store = configureStore({
  reducer: {
    text: textReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const dispatch = store.dispatch;
