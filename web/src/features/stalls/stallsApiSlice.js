import { apiSlice } from "@/api/apiSlice";

const STALLS_URL = "/api/stalls";

export const stallsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Stall Setup
    createStallSetup: builder.mutation({
      query: (setupData) => ({
        url: STALLS_URL,
        method: "POST",
        body: setupData,
      }),
      invalidatesTags: ["Stall"],
    }),

    // Get stall by event
    getStallByEvent: builder.query({
      query: (eventId) => ({
        url: `${STALLS_URL}/event/${eventId}`,
        method: "GET",
      }),
      providesTags: (result, error, eventId) => [{ type: "Stall", id: eventId }],
    }),

    // Get organizer stalls
    getOrganizerStalls: builder.query({
      query: () => ({
        url: `${STALLS_URL}/organizer`,
        method: "GET",
      }),
      providesTags: ["Stall"],
    }),

    // Get stall summary for event
    getStallSummary: builder.query({
      query: (eventId) => ({
        url: `${STALLS_URL}/event/${eventId}/summary`,
        method: "GET",
      }),
      providesTags: (result, error, eventId) => [{ type: "StallSummary", id: eventId }],
    }),

    // Update stall
    updateStall: builder.mutation({
      query: ({ stallId, ...updateData }) => ({
        url: `${STALLS_URL}/${stallId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    // Toggle stall active status
    toggleStallActive: builder.mutation({
      query: ({ stallId, is_active }) => ({
        url: `${STALLS_URL}/${stallId}/active`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    // Stall Types
    createStallType: builder.mutation({
      query: ({ stallId, ...typeData }) => ({
        url: `${STALLS_URL}/${stallId}/types`,
        method: "POST",
        body: typeData,
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    updateStallType: builder.mutation({
      query: ({ stallId, typeId, ...updates }) => ({
        url: `${STALLS_URL}/${stallId}/types/${typeId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { stallId, typeId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    deleteStallType: builder.mutation({
      query: ({ stallId, typeId }) => ({
        url: `${STALLS_URL}/${stallId}/types/${typeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    // Bookings
    makeBooking: builder.mutation({
      query: ({ stallId, bookingData }) => ({
        url: `${STALLS_URL}/${stallId}/book`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "Stall",
      ],
    }),

    getAllBookings: builder.query({
      query: (stallId) => ({
        url: `${STALLS_URL}/${stallId}/bookings`,
        method: "GET",
      }),
      providesTags: (result, error, stallId) => [{ type: "StallBookings", id: stallId }],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ stallId, bookingId, status }) => ({
        url: `${STALLS_URL}/${stallId}/bookings/${bookingId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "StallBookings",
      ],
    }),

    cancelStallBooking: builder.mutation({
      query: ({ stallId, bookingId }) => ({
        url: `${STALLS_URL}/${stallId}/bookings/${bookingId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { stallId }) => [
        { type: "Stall", id: stallId },
        "StallBookings",
      ],
    }),

    // Availability
    checkAvailability: builder.query({
      query: (stallId) => ({
        url: `${STALLS_URL}/${stallId}/availability`,
        method: "GET",
      }),
      providesTags: (result, error, stallId) => [{ type: "StallAvailability", id: stallId }],
    }),
  }),
});

export const {
  // Setup
  useCreateStallSetupMutation,
  useGetStallByEventQuery,
  useLazyGetStallByEventQuery,
  useGetOrganizerStallsQuery,
  useLazyGetOrganizerStallsQuery,
  useGetStallSummaryQuery,
  useLazyGetStallSummaryQuery,

  // Management
  useUpdateStallMutation,
  useToggleStallActiveMutation,

  // Types
  useCreateStallTypeMutation,
  useUpdateStallTypeMutation,
  useDeleteStallTypeMutation,

  // Bookings
  useMakeBookingMutation,
  useGetAllBookingsQuery,
  useLazyGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useCancelStallBookingMutation,

  // Availability
  useCheckAvailabilityQuery,
  useLazyCheckAvailabilityQuery,
} = stallsApiSlice;