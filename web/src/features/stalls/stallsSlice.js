import { createSlice } from "@reduxjs/toolkit";
import { stallsApiSlice } from "./stallsApiSlice";

const initialState = {
  stalls: [],
  selectedStall: JSON.parse(localStorage.getItem("selectedStall")) || null,
  status: "idle",
  error: null,
};

const stallsSlice = createSlice({
  name: "stall",
  initialState,
  reducers: {
    setSelectedStall: (state, action) => {
      state.selectedStall = action.payload;
      localStorage.setItem("selectedStall", JSON.stringify(action.payload));
    },
    clearStalls: (state) => {
      state.stalls = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        stallsApiSlice.endpoints.getStallByEvent.matchFulfilled,
        (state, action) => {
          const data =
            action.payload?.data?.data ||
            action.payload?.data ||
            action.payload ||
            [];

          const incoming = Array.isArray(data) ? data : [data];

          const unique = incoming.filter(
            (item) => !state.stalls.some((s) => s.id === item.id)
          );

          state.stalls = [...state.stalls, ...unique];
          state.status = "succeeded";
        }
      )
      .addMatcher(
        stallsApiSlice.endpoints.getOrganizerStalls.matchFulfilled,
        (state, action) => {
          const data = action.payload?.data || action.payload || [];
          state.stalls = data;
          state.status = "succeeded";
        }
      )
      .addMatcher(
        stallsApiSlice.endpoints.getStallSummary.matchFulfilled,
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        stallsApiSlice.endpoints.updateStall.matchFulfilled,
        (state, action) => {
          const updated = action.payload?.data || action.payload;
          state.stalls = state.stalls.map((s) =>
            s.id === updated.id ? updated : s
          );
        }
      )
      .addMatcher(
        stallsApiSlice.endpoints.toggleStallActive.matchFulfilled,
        (state, action) => {
          const updated = action.payload?.data || action.payload;
          state.stalls = state.stalls.map((s) =>
            s.id === updated.id ? updated : s
          );
        }
      )
      .addMatcher(
        stallsApiSlice.endpoints.createStallSetup.matchFulfilled,
        (state, action) => {
          const newStall = action.payload?.data || action.payload;
          state.stalls.push(newStall);
        }
      );
  },
});

export const { setSelectedStall, clearStalls } = stallsSlice.actions;
export default stallsSlice.reducer;
