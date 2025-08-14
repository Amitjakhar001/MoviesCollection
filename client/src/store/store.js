import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import homeSlice from "./slices/homeSlice.js";
import moviesSlice from "./slices/moviesSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    home: homeSlice,
    movies: moviesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
