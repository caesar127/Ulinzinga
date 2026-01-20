import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { eventsApiSlice } from "./eventsApiSlice";

const initialState = {
  events: [],
  selectedEvent: JSON.parse(localStorage.getItem("selectedEvent")) || null,
  status: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
      localStorage.setItem("selectedEvent", JSON.stringify(action.payload));
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        eventsApiSlice.endpoints.getEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload?.events || [];
          const unique = newEvents.filter(
            (ev) => !state.events.some((existing) => existing._id === ev._id)
          );
          console.log(unique.length + " new unique events fetched.");
          state.events = [...state.events, ...unique];
          state.status = "succeeded";
        }
      )
      .addMatcher(
        eventsApiSlice.endpoints.getEventById.matchFulfilled,
        (state, action) => {
          state.selectedEvent = action.payload;
          localStorage.setItem("selectedEvent", JSON.stringify(action.payload));
          state.status = "succeeded";
        }
      )
      .addMatcher(
        isAnyOf(
          eventsApiSlice.endpoints.getEvents.matchPending,
          eventsApiSlice.endpoints.getEventById.matchPending
        ),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        isAnyOf(
          eventsApiSlice.endpoints.getEvents.matchRejected,
          eventsApiSlice.endpoints.getEventById.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { setSelectedEvent, setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
