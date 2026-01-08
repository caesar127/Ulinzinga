import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { contentApiSlice } from "./contentApiSlice";

const initialState = {
  content: [],
  vault: [],
  pending: [],
  selectedContentItem: null,
  status: "idle",
  error: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSelectedContentItem: (state, action) => {
      state.selectedContentItem = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setVault: (state, action) => {
      state.vault = action.payload;
    },
    setPendingContent: (state, action) => {
      state.pending = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Event content
      .addMatcher(
        contentApiSlice.endpoints.getEventContent.matchFulfilled,
        (state, action) => {
          const newItems = action.payload?.content || [];
          const unique = newItems.filter(
            (item) =>
              !state.content.some((existing) => existing._id === item._id)
          );
          state.content = [...state.content, ...unique];
          state.status = "succeeded";
        }
      )

      // User content
      .addMatcher(
        contentApiSlice.endpoints.getUserContent.matchFulfilled,
        (state, action) => {
          state.content = action.payload?.content || [];
          state.status = "succeeded";
        }
      )

      // Vault (private content)
      .addMatcher(
        contentApiSlice.endpoints.getVault.matchFulfilled,
        (state, action) => {
          state.vault = action.payload?.content || [];
          state.status = "succeeded";
        }
      )

      // Pending content (organizer)
      .addMatcher(
        contentApiSlice.endpoints.getPendingContent.matchFulfilled,
        (state, action) => {
          state.pending = action.payload || [];
          state.status = "succeeded";
        }
      )

      // Loading
      .addMatcher(
        isAnyOf(
          contentApiSlice.endpoints.getEventContent.matchPending,
          contentApiSlice.endpoints.getUserContent.matchPending,
          contentApiSlice.endpoints.getVault.matchPending,
          contentApiSlice.endpoints.getPendingContent.matchPending
        ),
        (state) => {
          state.status = "loading";
        }
      )

      // Error
      .addMatcher(
        isAnyOf(
          contentApiSlice.endpoints.getEventContent.matchRejected,
          contentApiSlice.endpoints.getUserContent.matchRejected,
          contentApiSlice.endpoints.getVault.matchRejected,
          contentApiSlice.endpoints.getPendingContent.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error?.message;
        }
      );
  },
});

export const {
  setSelectedContentItem,
  setContent,
  setVault,
  setPendingContent,
} = contentSlice.actions;

export default contentSlice.reducer;
