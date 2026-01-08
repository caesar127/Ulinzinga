import { apiSlice } from "../../api/apiSlice";

const USER_EVENTS_URL = "/api/user/events";

export const userEventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserPurchasedEvents: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${USER_EVENTS_URL}/purchasedevents?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["UserTickets"],
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
        },
      }),
    }),

    getUserTickets: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `/api/user/purchased-events?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["UserTickets"],
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
        },
      }),
    }),

    getUserEventDetails: builder.query({
      query: (eventId) => ({
        url: `${USER_EVENTS_URL}/tickets/${eventId}`,
        method: "GET",
      }),
      providesTags: (_, __, eventId) => [{ type: "UserTickets", id: eventId }],
      keepUnusedDataFor: 600,
      transformResponse: (response) => response?.data || response,
    }),

    getRecommendedEvents: builder.query({
      query: (limit = 20) => ({
        url: `${USER_EVENTS_URL}/recommended?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["RecommendedEvents"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response?.events || [],
    }),

    getTrendingEvents: builder.query({
      query: (limit = 20) => ({
        url: `${USER_EVENTS_URL}/trending?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["TrendingEvents"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response?.events || [],
    }),

    addFavoriteEvent: builder.mutation({
      query: ({ eventId }) => ({
        url: `${USER_EVENTS_URL}/favorites/events`,
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: ["UserTickets"],
    }),

    removeFavoriteEvent: builder.mutation({
      query: (eventId) => ({
        url: `${USER_EVENTS_URL}/favorites/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserTickets"],
    }),

    addFavoriteOrganizer: builder.mutation({
      query: ({ organizerId }) => ({
        url: `${USER_EVENTS_URL}/favorites/organizers`,
        method: "POST",
        body: { organizerId },
      }),
      invalidatesTags: ["UserTickets"],
    }),

    removeFavoriteOrganizer: builder.mutation({
      query: (organizerId) => ({
        url: `${USER_EVENTS_URL}/favorites/organizers/${organizerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserTickets"],
    }),
  }),
});

export const {
  useGetUserPurchasedEventsQuery,
  useGetUserTicketsQuery,
  useGetUserEventDetailsQuery,
  useGetRecommendedEventsQuery,
  useGetTrendingEventsQuery,
  useAddFavoriteEventMutation,
  useRemoveFavoriteEventMutation,
  useAddFavoriteOrganizerMutation,
  useRemoveFavoriteOrganizerMutation,
} = userEventsApiSlice;