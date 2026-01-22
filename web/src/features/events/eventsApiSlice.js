import { apiSlice } from "@/api/apiSlice";

const EVENT_URL = "/api/public/events";

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${EVENT_URL}?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Event"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => ({
        events: response?.data || [],
        pagination: response?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPrevPage: false,
          sortBy: "start_date",
          sortOrder: "desc",
        },
      }),
    }),

    searchEvents: builder.query({
      query: (params) => ({
        url: `${EVENT_URL}/search`,
        params,
      }),
      providesTags: ["Event"],
      transformResponse: (response) => {
        console.log("Search response:", response);
        return {
          events: response?.data || [],
          pagination: response?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            limit: 20,
            hasNextPage: false,
            hasPrevPage: false,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        };
      },
    }),

    getEventById: builder.query({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "Event", id }],
      keepUnusedDataFor: 600,
      transformResponse: (response) => response?.data || response,
    }),

    purchaseTicket: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/${data.eventSlug}/purchase`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    giftTicket: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/${data.eventSlug}/purchase`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    syncEvents: builder.mutation({
      query: () => ({
        url: `${EVENT_URL}/sync`,
        method: "POST",
      }),
      invalidatesTags: ["Event"],
    }),

    cleanupOrphanedEvents: builder.mutation({
      query: () => ({
        url: `${EVENT_URL}/cleanup-orphaned`,
        method: "POST",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useLazyGetEventsQuery,
  useSearchEventsQuery,
  useLazySearchEventsQuery,
  useGetEventByIdQuery,
  usePurchaseTicketMutation,
  useGiftTicketMutation,
  useSyncEventsMutation,
  useCleanupOrphanedEventsMutation,
} = eventsApiSlice;
