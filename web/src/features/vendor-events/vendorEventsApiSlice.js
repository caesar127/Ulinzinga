import { apiSlice } from "@/api/apiSlice";

const VENDOR_EVENTS_URL = "/api/vendor";

export const vendorEventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableEvents: builder.query({
      query: () => ({
        url: `${VENDOR_EVENTS_URL}/events`,
        method: "GET",
      }),
      providesTags: ["VendorEvent"],
    }),

    getVendorEventById: builder.query({
      query: (id) => ({
        url: `${VENDOR_EVENTS_URL}/events/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "VendorEvent", id }],
    }),

    getStallAvailability: builder.query({
      query: (eventId) => ({
        url: `${VENDOR_EVENTS_URL}/events/${eventId}/stalls`,
        method: "GET",
      }),
      providesTags: (result, error, eventId) => [{ type: "VendorEvent", id: eventId }],
    }),

    bookStall: builder.mutation({
      query: ({ eventId, bookingData }) => ({
        url: `${VENDOR_EVENTS_URL}/events/${eventId}/stalls/book`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "VendorEvent", id: eventId },
        "VendorEvent",
      ],
    }),
  }),
});

export const {
  useGetAvailableEventsQuery,
  useLazyGetAvailableEventsQuery,
  useGetVendorEventByIdQuery,
  useLazyGetVendorEventByIdQuery,
  useGetStallAvailabilityQuery,
  useLazyGetStallAvailabilityQuery,
  useBookStallMutation,
} = vendorEventsApiSlice;