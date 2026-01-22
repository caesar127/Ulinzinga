import { apiSlice } from "../../api/apiSlice";
const USER_URL = "/api/user/users";
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `${USER_URL}?role=user`,
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (userId) => `${USER_URL}/${userId}`,
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, ...updateData }) => ({
        url: `${USER_URL}/${userId}/profile`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["User"],
    }),
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/picture`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserInterests: builder.mutation({
      query: ({ userId, interests }) => ({
        url: `${USER_URL}/${userId}/interests`,
        method: "PUT",
        body: { interests },
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUserProfile: builder.query({
      query: (userId) => ({
        url: `${USER_URL}/profile/${userId}`,
        method: "POST",
        body: {},
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useUploadProfilePictureMutation,
  useUpdateUserInterestsMutation,
  useGetCurrentUserProfileQuery,
} = usersApiSlice;
