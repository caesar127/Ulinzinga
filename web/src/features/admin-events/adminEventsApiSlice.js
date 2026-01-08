import { apiSlice } from "@/api/apiSlice";

const ADMIN_EVENTS_URL = "/api/admin/events";

export const adminEventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminEvents: builder.query({
      query: () => ({
        url: ADMIN_EVENTS_URL,
        method: "GET",
      }),
      providesTags: ["AdminEvent"],
      keepUnusedDataFor: 300, // Keep data for 5 minutes
    }),

    getAdminEventById: builder.query({
      query: (id) => ({
        url: `${ADMIN_EVENTS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminEvent", id }],
      keepUnusedDataFor: 600, // Keep data for 10 minutes
    }),

    syncAdminEvents: builder.mutation({
      query: () => ({
        url: `${ADMIN_EVENTS_URL}/sync`,
        method: "POST",
      }),
      invalidatesTags: ["AdminEvent"],
    }),

    cleanupOrphanedAdminEvents: builder.mutation({
      query: () => ({
        url: `${ADMIN_EVENTS_URL}/cleanup-orphaned`,
        method: "POST",
      }),
      invalidatesTags: ["AdminEvent"],
    }),

    updateAdminEventVisibility: builder.mutation({
      query: ({ id, isVisible }) => ({
        url: `${ADMIN_EVENTS_URL}/${id}/visibility`,
        method: "PUT",
        body: { isVisible },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminEvent", id },
        "AdminEvent",
      ],
    }),

    updateAdminEventStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `${ADMIN_EVENTS_URL}/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminEvent", id },
        "AdminEvent",
      ],
    }),

    deleteAdminEvent: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_EVENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminEvent"],
    }),
  }),
});

export const {
  useGetAdminEventsQuery,
  useLazyGetAdminEventsQuery,
  useGetAdminEventByIdQuery,
  useSyncAdminEventsMutation,
  useCleanupOrphanedAdminEventsMutation,
  useUpdateAdminEventVisibilityMutation,
  useUpdateAdminEventStatusMutation,
  useDeleteAdminEventMutation,
} = adminEventsApiSlice;