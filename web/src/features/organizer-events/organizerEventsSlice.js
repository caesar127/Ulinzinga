import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { organizerEventsApiSlice } from "./organizerEventsApiSlice";

const initialState = {
  events: [],
  selectedEvent: null,
  status: "idle",
  error: null,
};

const organizerEventsSlice = createSlice({
  name: "organizerEvents",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
      state.selectedEvent = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle GET all organizer events
      .addMatcher(
        organizerEventsApiSlice.endpoints.getOrganizerEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload?.data || [];
          const newUniqueEvents = newEvents.filter(
            (newEvent) =>
              !state.events.some((event) => event.id === newEvent.id)
          );
          state.events = [...state.events, ...newUniqueEvents];
          state.status = "succeeded";
        }
      )
      // Handle GET event by ID
      .addMatcher(
        organizerEventsApiSlice.endpoints.getOrganizerEventById.matchFulfilled,
        (state, action) => {
          state.selectedEvent = action.payload?.data;
          state.status = "succeeded";
        }
      )
      // Handle CREATE event
      .addMatcher(
        organizerEventsApiSlice.endpoints.createOrganizerEvent.matchFulfilled,
        (state, action) => {
          const newEvent = action.payload?.data;
          if (newEvent) {
            state.events.push(newEvent);
          }
          state.status = "succeeded";
        }
      )
      // Handle UPDATE event
      .addMatcher(
        organizerEventsApiSlice.endpoints.updateOrganizerEvent.matchFulfilled,
        (state, action) => {
          const updatedEvent = action.payload?.data;
          if (updatedEvent) {
            const index = state.events.findIndex(
              (event) => event.id === updatedEvent.id
            );
            if (index !== -1) {
              state.events[index] = updatedEvent;
            }
            if (state.selectedEvent?.id === updatedEvent.id) {
              state.selectedEvent = updatedEvent;
            }
          }
          state.status = "succeeded";
        }
      )
      // Handle UPLOAD BANNER
      .addMatcher(
        organizerEventsApiSlice.endpoints.uploadEventBanner.matchFulfilled,
        (state, action) => {
          const { id } = action.meta.arg.originalArgs;
          const updatedEvent = action.payload?.data;
          if (updatedEvent) {
            const index = state.events.findIndex((event) => event.id === id);
            if (index !== -1) {
              state.events[index] = updatedEvent;
            }
            if (state.selectedEvent?.id === id) {
              state.selectedEvent = updatedEvent;
            }
          }
          state.status = "succeeded";
        }
      )
      // Handle UPLOAD LOGO
      .addMatcher(
        organizerEventsApiSlice.endpoints.uploadEventLogo.matchFulfilled,
        (state, action) => {
          const { id } = action.meta.arg.originalArgs;
          const updatedEvent = action.payload?.data;
          if (updatedEvent) {
            const index = state.events.findIndex((event) => event.id === id);
            if (index !== -1) {
              state.events[index] = updatedEvent;
            }
            if (state.selectedEvent?.id === id) {
              state.selectedEvent = updatedEvent;
            }
          }
          state.status = "succeeded";
        }
      )
      // Handle DELETE event
      .addMatcher(
        organizerEventsApiSlice.endpoints.deleteOrganizerEvent.matchFulfilled,
        (state, action) => {
          const deletedId = action.meta.arg.originalArgs;
          state.events = state.events.filter((event) => event.id !== deletedId);
          if (state.selectedEvent?.id === deletedId) {
            state.selectedEvent = null;
          }
          state.status = "succeeded";
        }
      )
      // Handle loading states
      .addMatcher(
        isAnyOf(
          organizerEventsApiSlice.endpoints.getOrganizerEvents.matchPending,
          organizerEventsApiSlice.endpoints.getOrganizerEventById.matchPending,
          organizerEventsApiSlice.endpoints.createOrganizerEvent.matchPending,
          organizerEventsApiSlice.endpoints.updateOrganizerEvent.matchPending,
          organizerEventsApiSlice.endpoints.uploadEventBanner.matchPending,
          organizerEventsApiSlice.endpoints.uploadEventLogo.matchPending,
          organizerEventsApiSlice.endpoints.deleteOrganizerEvent.matchPending
        ),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      // Handle errors
      .addMatcher(
        isAnyOf(
          organizerEventsApiSlice.endpoints.getOrganizerEvents.matchRejected,
          organizerEventsApiSlice.endpoints.getOrganizerEventById.matchRejected,
          organizerEventsApiSlice.endpoints.createOrganizerEvent.matchRejected,
          organizerEventsApiSlice.endpoints.updateOrganizerEvent.matchRejected,
          organizerEventsApiSlice.endpoints.uploadEventBanner.matchRejected,
          organizerEventsApiSlice.endpoints.uploadEventLogo.matchRejected,
          organizerEventsApiSlice.endpoints.deleteOrganizerEvent.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error?.message || "An error occurred";
        }
      );
  },
});

export const { setSelectedEvent, clearEvents } = organizerEventsSlice.actions;

// Selectors
export const selectOrganizerEvents = (state) => state.organizerEvents.events;
export const selectSelectedEvent = (state) => state.organizerEvents.selectedEvent;
export const selectOrganizerEventsStatus = (state) => state.organizerEvents.status;
export const selectOrganizerEventsError = (state) => state.organizerEvents.error;

export default organizerEventsSlice.reducer;