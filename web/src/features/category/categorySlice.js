import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { categoriesApiSlice } from "./categoryApiSlice";

const initialState = {
  categories: [],
  selectedCategory: null,
  status: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET categories fulfilled
      .addMatcher(
        categoriesApiSlice.endpoints.getCategories.matchFulfilled,
        (state, action) => {
          state.categories = action.payload.categories || action.payload;
          state.status = "succeeded";
        }
      )
      // CREATE category fulfilled
      .addMatcher(
        categoriesApiSlice.endpoints.createCategory.matchFulfilled,
        (state, action) => {
          state.categories.push(action.payload);
          state.status = "succeeded";
        }
      )
      // UPDATE category fulfilled
      .addMatcher(
        categoriesApiSlice.endpoints.updateCategory.matchFulfilled,
        (state, action) => {
          const index = state.categories.findIndex(
            (cat) => cat.categoryId === action.payload.categoryId
          );
          if (index !== -1) state.categories[index] = action.payload;
          state.status = "succeeded";
        }
      )
      // DELETE category fulfilled
      .addMatcher(
        categoriesApiSlice.endpoints.deleteCategory.matchFulfilled,
        (state, action) => {
          const deletedId = action.meta.arg.originalArgs;
          state.categories = state.categories.filter(
            (cat) => cat.categoryId !== deletedId
          );
          state.status = "succeeded";
        }
      )
      // Pending states
      .addMatcher(
        isAnyOf(
          categoriesApiSlice.endpoints.getCategories.matchPending,
          categoriesApiSlice.endpoints.createCategory.matchPending,
          categoriesApiSlice.endpoints.updateCategory.matchPending,
          categoriesApiSlice.endpoints.deleteCategory.matchPending
        ),
        (state) => {
          state.status = "loading";
        }
      )
      // Rejected states
      .addMatcher(
        isAnyOf(
          categoriesApiSlice.endpoints.getCategories.matchRejected,
          categoriesApiSlice.endpoints.createCategory.matchRejected,
          categoriesApiSlice.endpoints.updateCategory.matchRejected,
          categoriesApiSlice.endpoints.deleteCategory.matchRejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
