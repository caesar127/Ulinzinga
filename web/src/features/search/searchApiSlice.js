import { apiSlice } from "../../api/apiSlice";

const SEARCH_URL = "/api/search";

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: (params) => ({
        url: SEARCH_URL,
        params,
      }),
      providesTags: ["Search"],
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = searchApiSlice;