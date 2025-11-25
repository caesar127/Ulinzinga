import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import eventReducer from "./features/events/eventsSlice";
import categoryReducer from "./features/category/categorySlice";
import organizerEventsReducer from "./features/organizer-events/organizerEventsSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    event: eventReducer,
    category: categoryReducer,
    organizerEvents: organizerEventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
