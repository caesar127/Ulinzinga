import { apiSlice } from "@/api/apiSlice";

const EVENT_URL = "/api/events";

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* -------- LIST EVENTS (with pagination & search) -------- */
    getEvents: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        merchantName,
        is_active,
        is_past,
      }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        if (merchantName) params.append("merchantName", merchantName);
        if (is_active !== undefined) params.append("is_active", is_active);
        if (is_past !== undefined) params.append("is_past", is_past);

        return { url: `${EVENT_URL}?${params.toString()}`, method: "GET" };
      },
      providesTags: ["Event"],
    }),

    /* -------- GET EVENT BY ID -------- */
    getEventById: builder.query({
      query: (id) => ({ url: `${EVENT_URL}/id/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    /* -------- GET EVENT BY SLUG -------- */
    getEventBySlug: builder.query({
      query: (slug) => ({ url: `${EVENT_URL}/slug/${slug}`, method: "GET" }),
      providesTags: (result, error, slug) => [{ type: "Event", slug }],
    }),

    /* -------- UPCOMING EVENTS -------- */
    getUpcomingEvents: builder.query({
      query: (limit = 10) => ({
        url: `${EVENT_URL}/upcoming?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    /* -------- PAST EVENTS -------- */
    getPastEvents: builder.query({
      query: (limit = 10) => ({
        url: `${EVENT_URL}/past?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    /* -------- TRENDING EVENTS -------- */
    getTrendingEvents: builder.query({
      query: (limit = 10) => ({
        url: `${EVENT_URL}/trending?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    /* -------- RECOMMENDED EVENTS -------- */
    getRecommendedEvents: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${EVENT_URL}/recommended?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Event"],
    }),

    /* -------- EVENTS BY MERCHANT -------- */
    getEventsByMerchant: builder.query({
      query: ({ merchantName, page = 1, limit = 10 }) => ({
        url: `${EVENT_URL}/merchant/${merchantName}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    /* -------- CREATE EVENT -------- */
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: EVENT_URL,
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Event"],
    }),

    /* -------- UPDATE EVENT -------- */
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `${EVENT_URL}/${id}`,
        method: "PUT",
        body: eventData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Event", id }],
    }),

    /* -------- DELETE EVENT -------- */
    deleteEvent: builder.mutation({
      query: (id) => ({ url: `${EVENT_URL}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Event"],
    }),

    /* -------- SOFT DELETE EVENT (deactivate) -------- */
    softDeleteEvent: builder.mutation({
      query: (id) => ({
        url: `${EVENT_URL}/${id}/deactivate`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),

    /* -------- RESTORE EVENT -------- */
    restoreEvent: builder.mutation({
      query: (id) => ({ url: `${EVENT_URL}/${id}/restore`, method: "PUT" }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useLazyGetEventsQuery,
  useGetEventByIdQuery,
  useGetEventBySlugQuery,
  useGetUpcomingEventsQuery,
  useGetPastEventsQuery,
  useGetTrendingEventsQuery,
  useGetRecommendedEventsQuery,
  useGetEventsByMerchantQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useSoftDeleteEventMutation,
  useRestoreEventMutation,
} = eventsApiSlice;
