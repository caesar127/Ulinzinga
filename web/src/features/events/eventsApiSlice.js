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
    }),

    getEventById: builder.query({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    purchaseTicket: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/${data.eventSlug}/purchase`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useLazyGetEventsQuery,
  useGetEventByIdQuery,
  usePurchaseTicketMutation,
} = eventsApiSlice;
