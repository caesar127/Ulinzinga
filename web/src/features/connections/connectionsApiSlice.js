import { apiSlice } from "../../api/apiSlice";

const CONNECTIONS_URL = "/api/user/connections";

export const connectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user connections
    getUserConnections: builder.query({
      query: () => `${CONNECTIONS_URL}`,
      providesTags: ["Connections"],
    }),

    // Get suggested connections
    getSuggestedConnections: builder.query({
      query: () => `${CONNECTIONS_URL}/suggestions`,
      providesTags: ["Connections"],
    }),

    // Get advanced suggested connections
    getAdvancedSuggestedConnections: builder.query({
      query: () => `${CONNECTIONS_URL}/suggestions/advanced`,
      providesTags: ["Connections"],
    }),

    // Send connection request
    sendConnectionRequest: builder.mutation({
      query: ({ targetUserId }) => ({
        url: `${CONNECTIONS_URL}`,
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: ["Connections"],
    }),

    // Accept connection request
    acceptConnection: builder.mutation({
      query: (connectionId) => ({
        url: `${CONNECTIONS_URL}/${connectionId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),

    // Decline connection request
    declineConnection: builder.mutation({
      query: (connectionId) => ({
        url: `${CONNECTIONS_URL}/${connectionId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),

    // Remove connection
    removeConnection: builder.mutation({
      query: (connectionId) => ({
        url: `${CONNECTIONS_URL}/${connectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),

    // Get pending connection requests (received)
    getPendingRequests: builder.query({
      query: () => `${CONNECTIONS_URL}/pending`,
      providesTags: ["Connections"],
    }),

    // Get sent connection requests
    getSentRequests: builder.query({
      query: () => `${CONNECTIONS_URL}/sent`,
      providesTags: ["Connections"],
    }),
  }),
});

export const {
  useGetUserConnectionsQuery,
  useGetSuggestedConnectionsQuery,
  useGetAdvancedSuggestedConnectionsQuery,
  useSendConnectionRequestMutation,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
  useRemoveConnectionMutation,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
} = connectionsApiSlice;