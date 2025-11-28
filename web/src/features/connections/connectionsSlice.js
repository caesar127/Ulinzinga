import { createSlice } from "@reduxjs/toolkit";
import { connectionsApiSlice } from "./connectionsApiSlice";

const initialState = {
  connections: [],
  suggestedConnections: [],
  advancedSuggestions: [],
  pendingRequests: [],
  sentRequests: [],
  selectedConnection: null,
  status: "idle",
  error: null,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setSelectedConnection: (state, action) => {
      state.selectedConnection = action.payload;
      localStorage.setItem(
        "selectedConnection",
        JSON.stringify(action.payload)
      );
    },
    resetConnectionsState: (state) => {
      (state.connections = []),
        (state.suggestedConnections = []),
        (state.advancedSuggestions = []),
        (state.pendingRequests = []),
        (state.sentRequests = []),
        (state.status = "idle"),
        (state.error = null);
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(
        connectionsApiSlice.endpoints.getUserConnections.matchFulfilled,
        (state, action) => {
          state.connections = action.payload?.data || action.payload || [];
          state.status = "succeeded";
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.getSuggestedConnections.matchFulfilled,
        (state, action) => {
            console.log(action.payload);
          state.suggestedConnections =
            action.payload?.data || action.payload.suggestions || [];
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.getAdvancedSuggestedConnections
          .matchFulfilled,
        (state, action) => {
          state.advancedSuggestions =
            action.payload?.data || action.payload || [];
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.getPendingRequests.matchFulfilled,
        (state, action) => {
          state.pendingRequests = action.payload?.data || action.payload || [];
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.getSentRequests.matchFulfilled,
        (state, action) => {
          state.sentRequests = action.payload?.data || action.payload || [];
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.acceptConnection.matchFulfilled,
        (state, action) => {
          const connection = action.payload?.data || action.payload;

          if (!connection) return;

          state.pendingRequests = state.pendingRequests.filter(
            (req) => req.id !== connection.id
          );

          if (!state.connections.some((c) => c.id === connection.id)) {
            state.connections.push(connection);
          }
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.declineConnection.matchFulfilled,
        (state, action) => {
          const declined = action.payload?.data || action.payload;

          state.pendingRequests = state.pendingRequests.filter(
            (req) => req.id !== declined?.id
          );
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.sendConnectionRequest.matchFulfilled,
        (state, action) => {
          const { targetUserId } = action.meta?.arg?.originalArgs || {};

          if (!targetUserId) return;

          state.suggestedConnections = state.suggestedConnections.filter(
            (s) => s.id !== targetUserId
          );

          state.advancedSuggestions = state.advancedSuggestions.filter(
            (s) => s.id !== targetUserId
          );
        }
      )
      .addMatcher(
        connectionsApiSlice.endpoints.removeConnection.matchFulfilled,
        (state, action) => {
          const connectionId = action.meta?.arg?.originalArgs;

          if (!connectionId) return;

          state.connections = state.connections.filter(
            (c) => c.id !== connectionId
          );
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("connections/") &&
          action.type.endsWith("rejected"),
        (state, action) => {
          state.status = "failed";
          state.error =
            action.error?.data?.message ||
            action.error?.message ||
            "An error occurred";
        }
      );
  },
});

export const { setSelectedConnection, resetConnectionsState } =
  connectionsSlice.actions;

export default connectionsSlice.reducer;
