import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle PayChangu auth completion
      .addMatcher(authApiSlice.endpoints.completeChanguAuth.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApiSlice.endpoints.completeChanguAuth.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          // Store in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", JSON.stringify(action.payload.token));
        }
      )
      .addMatcher(
        authApiSlice.endpoints.completeChanguAuth.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data?.message || action.error?.message || "Authentication failed";
        }
      )
      // Handle logout
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
