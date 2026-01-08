import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import eventReducer from "./features/events/eventsSlice";
import categoryReducer from "./features/category/categorySlice";
import organizerEventsReducer from "./features/organizer-events/organizerEventsSlice";
import connectionsReducer from "./features/connections/connectionsSlice";
import usersReducer from "./features/users/usersSlice";
import walletReducer from "./features/wallet/walletSlice";
import adminEventsReducer from "./features/admin-events/adminEventsSlice";
import vendorEventsReducer from "./features/vendor-events/vendorEventsSlice";
import stallsReducer from "./features/stalls/stallsSlice";
import contentReducer from "./features/content/contentSlice";

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
    adminEvents: adminEventsReducer,
    vendorEvents: vendorEventsReducer,
    stalls: stallsReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
