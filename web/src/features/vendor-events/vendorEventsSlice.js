import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { vendorEventsApiSlice } from "./vendorEventsApiSlice";

const initialState = {
  availableEvents: [],
  selectedEvent: null,
  stallAvailability: [],
  bookingStatus: "idle",
  status: "idle",
  error: null,
};

const vendorEventsSlice = createSlice({
  name: "vendorEvents",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setStallAvailability: (state, action) => {
      state.stallAvailability = action.payload;
    },
    clearVendorEvents: (state) => {
      state.availableEvents = [];
      state.selectedEvent = null;
      state.stallAvailability = [];
      state.error = null;
    },
    clearBookingStatus: (state) => {
      state.bookingStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle GET available events
      .addMatcher(
        vendorEventsApiSlice.endpoints.getAvailableEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload?.data || [];
          state.availableEvents = newEvents;
          state.status = "succeeded";
        }
      )
      // Handle GET event by ID
      .addMatcher(
        vendorEventsApiSlice.endpoints.getVendorEventById.matchFulfilled,
        (state, action) => {
          state.selectedEvent = action.payload?.data;
          state.status = "succeeded";
        }
      )
      // Handle GET stall availability
      .addMatcher(
        vendorEventsApiSlice.endpoints.getStallAvailability.matchFulfilled,
        (state, action) => {
          state.stallAvailability = action.payload?.data?.stall_types || [];
          state.status = "succeeded";
        }
      )
      // Handle STALL booking
      .addMatcher(
        vendorEventsApiSlice.endpoints.bookStall.matchFulfilled,
        (state, action) => {
          state.bookingStatus = "succeeded";
          // Refresh stall availability after booking
          if (action.payload?.data) {
            // Update available events list if needed
            state.availableEvents = state.availableEvents.map(event => {
              if (event._id === action.payload.data.eventId) {
                return {
                  ...event,
                  stall_availability: event.stall_availability.map(stall => {
                    if (stall.size === action.payload.data.stall_type) {
                      return {
                        ...stall,
                        available_count: stall.available_count - action.payload.data.quantity
                      };
                    }
                    return stall;
                  })
                };
              }
              return event;
            });
          }
        }
      )
      // Handle loading states
      .addMatcher(
        isAnyOf(
          vendorEventsApiSlice.endpoints.getAvailableEvents.matchPending,
          vendorEventsApiSlice.endpoints.getVendorEventById.matchPending,
          vendorEventsApiSlice.endpoints.getStallAvailability.matchPending,
          vendorEventsApiSlice.endpoints.bookStall.matchPending
        ),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      // Handle errors
      .addMatcher(
        isAnyOf(
          vendorEventsApiSlice.endpoints.getAvailableEvents.matchRejected,
          vendorEventsApiSlice.endpoints.getVendorEventById.matchRejected,
          vendorEventsApiSlice.endpoints.getStallAvailability.matchRejected,
          vendorEventsApiSlice.endpoints.bookStall.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error?.message || "An error occurred";
          state.bookingStatus = "failed";
        }
      );
  },
});

export const { 
  setSelectedEvent, 
  setStallAvailability, 
  clearVendorEvents, 
  clearBookingStatus 
} = vendorEventsSlice.actions;

// Selectors
export const selectAvailableEvents = (state) => state.vendorEvents.availableEvents;
export const selectSelectedEvent = (state) => state.vendorEvents.selectedEvent;
export const selectStallAvailability = (state) => state.vendorEvents.stallAvailability;
export const selectVendorEventsStatus = (state) => state.vendorEvents.status;
export const selectVendorEventsError = (state) => state.vendorEvents.error;
export const selectBookingStatus = (state) => state.vendorEvents.bookingStatus;

export default vendorEventsSlice.reducer;