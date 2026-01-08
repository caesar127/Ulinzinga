import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { adminEventsApiSlice } from "./adminEventsApiSlice";

const initialState = {
  adminevents: [],
  selectedAdminEvent: null,
  status: "idle",
  error: null,
};

const adminEventsSlice = createSlice({
  name: "adminEvent",
  initialState,
  reducers: {
    setSelectedAdminEvent: (state, action) => {
      state.selectedAdminEvent = action.payload;
    },
    clearAdminEvents: (state) => {
      state.adminevents = [];
      state.selectedAdminEvent = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adminEventsApiSlice.endpoints.getAdminEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload?.data || action.payload || [];
          state.adminevents = newEvents;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addMatcher(
        adminEventsApiSlice.endpoints.getAdminEvents.matchPending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        adminEventsApiSlice.endpoints.getAdminEvents.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error?.message || "Failed to fetch admin events";
        }
      )
      .addMatcher(
        adminEventsApiSlice.endpoints.getAdminEventById.matchFulfilled,
        (state, action) => {
          const event =
            action.payload?.data?.data ||
            action.payload?.data ||
            action.payload;

          state.selectedAdminEvent = event;
          state.status = "succeeded";
        }
      )
      // Handle UPDATE visibility
      .addMatcher(
        adminEventsApiSlice.endpoints.updateAdminEventVisibility.matchFulfilled,
        (state, action) => {
          const updatedEvent = action.payload?.data;
          if (updatedEvent) {
            const index = state.adminevents.findIndex(
              (event) => event.id === updatedEvent.id
            );
            if (index !== -1) {
              state.adminevents[index] = updatedEvent;
            }
            if (state.selectedAdminEvent?.id === updatedEvent.id) {
              state.selectedAdminEvent = updatedEvent;
            }
          }
          state.status = "succeeded";
        }
      )
      // Handle UPDATE status
      .addMatcher(
        adminEventsApiSlice.endpoints.updateAdminEventStatus.matchFulfilled,
        (state, action) => {
          const updatedEvent = action.payload?.data;
          if (updatedEvent) {
            const index = state.adminevents.findIndex(
              (event) => event.id === updatedEvent.id
            );
            if (index !== -1) {
              state.adminevents[index] = updatedEvent;
            }
            if (state.selectedAdminEvent?.id === updatedEvent.id) {
              state.selectedAdminEvent = updatedEvent;
            }
          }
          state.status = "succeeded";
        }
      )
      // Handle DELETE event
      .addMatcher(
        adminEventsApiSlice.endpoints.deleteAdminEvent.matchFulfilled,
        (state, action) => {
          const deletedId = action.meta.arg.originalArgs;
          state.adminevents = state.adminevents.filter(
            (event) => event.id !== deletedId
          );
          if (state.selectedAdminEvent?.id === deletedId) {
            state.selectedAdminEvent = null;
          }
          state.status = "succeeded";
        }
      );
  },
});

export const { setSelectedAdminEvent, clearAdminEvents } = adminEventsSlice.actions;
export default adminEventsSlice.reducer;