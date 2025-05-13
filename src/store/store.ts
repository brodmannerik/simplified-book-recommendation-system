import { configureStore } from "@reduxjs/toolkit";
import ratingsReducer from "./ratingsSlice";

export const store = configureStore({
  reducer: {
    ratings: ratingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
