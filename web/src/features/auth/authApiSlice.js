import { apiSlice } from "../../api/apiSlice";

const AUTH_URL = "/api/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get PayChangu Connect URL for login
    getChanguConnectUrl: builder.query({
      query: () => ({
        url: `${AUTH_URL}/login`,
        method: "GET",
      }),
    }),
    // Complete PayChangu authentication with access token
    completeChanguAuth: builder.mutation({
      query: (accessToken) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: { access_token: accessToken },
      }),
      invalidatesTags: ["User"],
    }),
    // Logout
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    // Get current user
    getCurrentUser: builder.query({
      query: () => ({
        url: `${AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetChanguConnectUrlQuery,
  useCompleteChanguAuthMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApiSlice;
