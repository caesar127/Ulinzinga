import { createSlice } from "@reduxjs/toolkit";
import { usersApiSlice } from "./usersApiSlice";

const initialState = {
  // Current user profile
  currentUser: null,
  // Other users data (for display purposes)
  users: {},
  // User profile editing
  profileEditing: {
    isEditing: false,
    formData: {},
    isDirty: false,
  },
  // Interests management
  interests: [],
  // UI state
  loading: false,
  error: null,
  // Profile completion status
  profileCompletion: {
    isComplete: false,
    missingFields: [],
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // User data management
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    
    updateUserInStore: (state, action) => {
      const { userId, userData } = action.payload;
      state.users[userId] = { ...state.users[userId], ...userData };
      
      // Update current user if it's the same user
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = { ...state.currentUser, ...userData };
      }
    },
    
    // Profile editing
    startProfileEdit: (state, action) => {
      const userData = action.payload || state.currentUser || {};
      state.profileEditing.isEditing = true;
      state.profileEditing.formData = { ...userData };
      state.profileEditing.isDirty = false;
    },
    
    cancelProfileEdit: (state) => {
      state.profileEditing.isEditing = false;
      state.profileEditing.formData = {};
      state.profileEditing.isDirty = false;
    },
    
    updateProfileFormData: (state, action) => {
      const { field, value } = action.payload;
      state.profileEditing.formData[field] = value;
      state.profileEditing.isDirty = true;
    },
    
    setProfileFormData: (state, action) => {
      state.profileEditing.formData = action.payload;
      state.profileEditing.isDirty = true;
    },
    
    // Interests management
    setInterests: (state, action) => {
      state.interests = action.payload;
      if (state.currentUser) {
        state.currentUser.interests = action.payload;
      }
    },
    
    addInterest: (state, action) => {
      const interest = action.payload;
      if (!state.interests.includes(interest)) {
        state.interests.push(interest);
        if (state.currentUser && !state.currentUser.interests?.includes(interest)) {
          state.currentUser.interests = [...(state.currentUser.interests || []), interest];
        }
      }
    },
    
    removeInterest: (state, action) => {
      const interest = action.payload;
      state.interests = state.interests.filter((i) => i !== interest);
      if (state.currentUser) {
        state.currentUser.interests = state.currentUser.interests?.filter((i) => i !== interest) || [];
      }
    },
    
    // Profile completion
    updateProfileCompletion: (state, action) => {
      const { isComplete, missingFields } = action.payload;
      state.profileCompletion.isComplete = isComplete;
      state.profileCompletion.missingFields = missingFields || [];
    },
    
    // UI state management
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetUserState: (state) => {
      state.currentUser = null;
      state.users = {};
      state.profileEditing = {
        isEditing: false,
        formData: {},
        isDirty: false,
      };
      state.interests = [];
      state.error = null;
      state.profileCompletion = {
        isComplete: false,
        missingFields: [],
      };
    },
    
    // Clear profile editing changes
    clearProfileEditing: (state) => {
      state.profileEditing = {
        isEditing: false,
        formData: {},
        isDirty: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user by ID
      .addMatcher(
        usersApiSlice.endpoints.getUserById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const userData = action.payload?.data || action.payload;
          if (userData && userData.id) {
            state.users[userData.id] = userData;
          }
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getUserById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data?.message || action.error?.message || "Failed to fetch user";
        }
      )
      
      // Update user profile
      .addMatcher(
        usersApiSlice.endpoints.updateUserProfile.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.updateUserProfile.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const userData = action.payload?.data || action.payload;
          if (userData) {
            if (state.currentUser && state.currentUser.id === userData.id) {
              state.currentUser = userData;
            }
            if (userData.id) {
              state.users[userData.id] = { ...state.users[userData.id], ...userData };
            }
          }
          // Reset editing state
          state.profileEditing.isEditing = false;
          state.profileEditing.formData = {};
          state.profileEditing.isDirty = false;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.updateUserProfile.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data?.message || action.error?.message || "Failed to update profile";
        }
      )
      
      // Update user interests
      .addMatcher(
        usersApiSlice.endpoints.updateUserInterests.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.updateUserInterests.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const { interests } = action.meta?.arg?.originalArgs || {};
          if (interests) {
            state.interests = interests;
            if (state.currentUser) {
              state.currentUser.interests = interests;
            }
          }
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.updateUserInterests.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data?.message || action.error?.message || "Failed to update interests";
        }
      )
      
      // Get current user profile
      .addMatcher(
        usersApiSlice.endpoints.getCurrentUserProfile.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getCurrentUserProfile.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const userData = action.payload?.data || action.payload;
          if (userData) {
            state.currentUser = userData;
            state.interests = userData.interests || [];
            
            // Calculate profile completion
            const missingFields = [];
            const requiredFields = ["fullName", "email", "phoneNumber"];
            requiredFields.forEach((field) => {
              if (!userData[field]) {
                missingFields.push(field);
              }
            });
            
            state.profileCompletion.isComplete = missingFields.length === 0;
            state.profileCompletion.missingFields = missingFields;
          }
        }
      )
      .addMatcher(
        usersApiSlice.endpoints.getCurrentUserProfile.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.data?.message || action.error?.message || "Failed to fetch user profile";
        }
      );
  },
});

export const {
  setCurrentUser,
  updateUserInStore,
  startProfileEdit,
  cancelProfileEdit,
  updateProfileFormData,
  setProfileFormData,
  setInterests,
  addInterest,
  removeInterest,
  updateProfileCompletion,
  setLoading,
  setError,
  clearError,
  resetUserState,
  clearProfileEditing,
} = usersSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUserById = (state, userId) => state.users.users[userId];
export const selectAllUsers = (state) => Object.values(state.users.users);
export const selectProfileEditing = (state) => state.users.profileEditing;
export const selectInterests = (state) => state.users.interests;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectProfileCompletion = (state) => state.users.profileCompletion;

// Computed selectors
export const selectIsProfileEditing = (state) => state.users.profileEditing.isEditing;
export const selectProfileFormData = (state) => state.users.profileEditing.formData;
export const selectIsProfileDirty = (state) => state.users.profileEditing.isDirty;
export const selectIsProfileComplete = (state) => state.users.profileCompletion.isComplete;
export const selectMissingProfileFields = (state) => state.users.profileCompletion.missingFields;

export default usersSlice.reducer;