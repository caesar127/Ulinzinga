import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  business: localStorage.getItem("business")
    ? JSON.parse(localStorage.getItem("business"))
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
      localStorage.removeItem("business");
      state.user = null;
      state.token = null;
      state.business = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
    },

    setVendorCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.business = action.payload.business;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      if (action.payload.business) {
        localStorage.setItem("business", JSON.stringify(action.payload.business));
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle user signup
      .addMatcher(authApiSlice.endpoints.userSignup?.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.userSignup?.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addMatcher(authApiSlice.endpoints.userSignup?.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.data?.message || action.error?.message || "Signup failed";
      })
      
      // Handle user login
      .addMatcher(authApiSlice.endpoints.userSignin?.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.userSignin?.matchFulfilled, (state, action) => {
        state.loading = false;
        console.log("Login fulfilled with payload:", action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addMatcher(authApiSlice.endpoints.userSignin?.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.data?.message || action.error?.message || "Login failed";
      })
      
      // Handle merchant token verification
      .addMatcher(authApiSlice.endpoints.verifyMerchantToken?.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.verifyMerchantToken?.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.business = action.payload.business;
        
        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        if (action.payload.business) {
          localStorage.setItem("business", JSON.stringify(action.payload.business));
        }
      })
      .addMatcher(authApiSlice.endpoints.verifyMerchantToken?.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.data?.message || action.error?.message || "Merchant authentication failed";
      })

      // Handle merchant auth completion (legacy endpoint)
      .addMatcher(authApiSlice.endpoints.completeMerchantAuth?.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApiSlice.endpoints.completeMerchantAuth?.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        // Handle business data if present
        if (action.payload.business) {
          state.business = action.payload.business;
          localStorage.setItem("business", JSON.stringify(action.payload.business));
        }
        
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addMatcher(authApiSlice.endpoints.completeMerchantAuth?.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.data?.message || action.error?.message || "Merchant authentication failed";
      })
      
      // Handle logout
      .addMatcher(authApiSlice.endpoints.logout?.matchFulfilled, (state) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("business");
        state.user = null;
        state.token = null;
        state.business = null;
        state.error = null;
      });
  },
});

export const { logout, clearError, setCredentials, setVendorCredentials, setLoading, setError } = authSlice.actions;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectBusiness = (state) => state.auth.business;
export default authSlice.reducer;
