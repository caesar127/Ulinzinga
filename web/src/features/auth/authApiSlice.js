import { apiSlice } from "../../api/apiSlice";

const AUTH_URL = "/api/user/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Merchant Authentication (PayChangu) - Vendors & Organizers
    getMerchantConnectUrl: builder.mutation({
      query: ({ role = 'organizer' } = {}) => ({
        url: `${AUTH_URL}/merchant/login`,
        method: "POST",
        body: { role },
      }),
    }),
    verifyMerchantToken: builder.mutation({
      query: ({ access_token, selected_role }) => ({
        url: `${AUTH_URL}/merchant/verify-token`,
        method: "POST",
        body: { access_token, selected_role },
      }),
      invalidatesTags: ["User"],
    }),

    completeMerchantAuth: builder.mutation({
      query: (accessToken) => ({
        url: `${AUTH_URL}/merchant/register`,
        method: "POST",
        body: { access_token: accessToken },
      }),
      invalidatesTags: ["User"],
    }),

    // User Authentication (Local)
    userSignup: builder.mutation({
      query: (userData) => ({
        url: `${AUTH_URL}/user/signup`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_URL}/user/signin`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Google OAuth
    getGoogleAuthUrl: builder.query({
      query: () => `${AUTH_URL}/google/login`,
    }),

    // Common endpoints
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/merchant/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query({
      query: () => `${AUTH_URL}/me`,
      providesTags: ["User"],
    }),

    // User interests management
    updateUserInterests: builder.mutation({
      query: ({ userId, interests }) => ({
        url: `/api/user/users/${userId}/interests`,
        method: "PUT",
        body: { interests },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  // Merchant
  useGetMerchantConnectUrlMutation,
  useVerifyMerchantTokenMutation,
  useCompleteMerchantAuthMutation,
  // User
  useUserSignupMutation,
  useUserLoginMutation,
  // Google
  useGetGoogleAuthUrlQuery,
  // Common
  useLogoutMutation,
  useGetCurrentUserQuery,
  // User interests
  useUpdateUserInterestsMutation,
} = authApiSlice;
