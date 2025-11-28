import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import eventReducer from "./features/events/eventsSlice";
import categoryReducer from "./features/category/categorySlice";
import organizerEventsReducer from "./features/organizer-events/organizerEventsSlice";
import connectionsReducer from "./features/connections/connectionsSlice";
import usersReducer from "./features/users/usersSlice";
import walletReducer from "./features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    event: eventReducer,
    category: categoryReducer,
    organizerEvents: organizerEventsReducer,
    connections: connectionsReducer,
    users: usersReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
