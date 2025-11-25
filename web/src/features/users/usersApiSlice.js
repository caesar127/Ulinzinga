import { apiSlice } from "../../api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, ...updateData }) => ({
        url: `/users/${userId}/profile`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserInterests: builder.mutation({
      query: ({ userId, interests }) => ({
        url: `/users/${userId}/interests`,
        method: 'PUT',
        body: { interests },
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useUpdateUserInterestsMutation,
  useGetCurrentUserProfileQuery,
} = usersApiSlice;