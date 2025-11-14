import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { eventsApiSlice } from "./eventsApiSlice";

const initialState = {
  events: [],
  selectedEvent: null,
  status: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle GET all events
      .addMatcher(
        eventsApiSlice.endpoints.getEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload.events || [];
          const newUniqueEvents = newEvents.filter(
            (newEvent) =>
              !state.events.some((event) => event._id === newEvent._id)
          );
          state.events = [...state.events, ...newUniqueEvents];
          state.status = "succeeded";
        }
      )
      // Handle GET event by ID
      .addMatcher(
        eventsApiSlice.endpoints.getEventById.matchFulfilled,
        (state, action) => {
          state.selectedEvent = action.payload.event;
          state.status = "succeeded";
        }
      )
      // Handle CREATE event
      .addMatcher(
        eventsApiSlice.endpoints.createEvent.matchFulfilled,
        (state, action) => {
          state.events.push(action.payload.event);
          state.status = "succeeded";
        }
      )
      // Handle UPDATE event
      .addMatcher(
        eventsApiSlice.endpoints.updateEvent.matchFulfilled,
        (state, action) => {
          const index = state.events.findIndex(
            (event) => event._id === action.payload.event._id
          );
          if (index !== -1) {
            state.events[index] = action.payload.event;
          }
          state.status = "succeeded";
        }
      )
      // Handle DELETE event
      .addMatcher(
        eventsApiSlice.endpoints.deleteEvent.matchFulfilled,
        (state, action) => {
          const deletedId = action.meta.arg.originalArgs;
          state.events = state.events.filter(
            (event) => event._id !== deletedId
          );
          state.status = "succeeded";
        }
      )
      // Handle SOFT DELETE (deactivate)
      .addMatcher(
        eventsApiSlice.endpoints.softDeleteEvent.matchFulfilled,
        (state, action) => {
          const updated = action.payload.event;
          const index = state.events.findIndex((e) => e._id === updated._id);
          if (index !== -1) state.events[index] = updated;
          state.status = "succeeded";
        }
      )
      // Handle RESTORE event
      .addMatcher(
        eventsApiSlice.endpoints.restoreEvent.matchFulfilled,
        (state, action) => {
          const updated = action.payload.event;
          const index = state.events.findIndex((e) => e._id === updated._id);
          if (index !== -1) state.events[index] = updated;
          state.status = "succeeded";
        }
      )
      // Handle loading states
      .addMatcher(
        isAnyOf(
          eventsApiSlice.endpoints.getEvents.matchPending,
          eventsApiSlice.endpoints.getEventById.matchPending,
          eventsApiSlice.endpoints.createEvent.matchPending,
          eventsApiSlice.endpoints.updateEvent.matchPending,
          eventsApiSlice.endpoints.deleteEvent.matchPending,
          eventsApiSlice.endpoints.softDeleteEvent.matchPending,
          eventsApiSlice.endpoints.restoreEvent.matchPending
        ),
        (state) => {
          state.status = "loading";
        }
      )
      // Handle errors
      .addMatcher(
        isAnyOf(
          eventsApiSlice.endpoints.getEvents.matchRejected,
          eventsApiSlice.endpoints.getEventById.matchRejected,
          eventsApiSlice.endpoints.createEvent.matchRejected,
          eventsApiSlice.endpoints.updateEvent.matchRejected,
          eventsApiSlice.endpoints.deleteEvent.matchRejected,
          eventsApiSlice.endpoints.softDeleteEvent.matchRejected,
          eventsApiSlice.endpoints.restoreEvent.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { setSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
