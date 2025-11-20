// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import billingReducer from "./billingSlice";

export const store = configureStore({
  reducer: {
    billing: billingReducer,
  },
});

// export RootState and AppDispatch if you want typed hooks (TS)
/*
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/
