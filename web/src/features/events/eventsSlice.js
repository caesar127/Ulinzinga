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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        eventsApiSlice.endpoints.getEvents.matchFulfilled,
        (state, action) => {
          const newEvents = action.payload?.data || action.payload || [];

          const unique = newEvents.filter(
            (ev) => !state.events.some((existing) => existing.id === ev.id)
          );

          state.events = [...state.events, ...unique];
          state.status = "succeeded";
        }
      )

      .addMatcher(
        eventsApiSlice.endpoints.getEventById.matchFulfilled,
        (state, action) => {
          const event =
            action.payload?.data?.data ||
            action.payload?.data ||
            action.payload;

          state.selectedEvent = event;

          localStorage.setItem("selectedEvent", JSON.stringify(event));

          state.status = "succeeded";
        }
      );
  },
});

export const { setSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
