// // src/store/store.js
// import { configureStore } from "@reduxjs/toolkit";
// import billingReducer from "./billingSlice";

// export const store = configureStore({
//   reducer: {
//     billing: billingReducer,
//   },
// });

// // export RootState and AppDispatch if you want typed hooks (TS)
// /*
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// */
import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";
import itemsReducer from "./itemsSlice";
import sectionsReducer from "./sectionsSlice";
import billingReducer from "./billingSlice";

const store = configureStore({
  reducer: {
    customers: customersReducer,
    items: itemsReducer,
    sections: sectionsReducer,
    billing: billingReducer,
  },
});

export default store;
