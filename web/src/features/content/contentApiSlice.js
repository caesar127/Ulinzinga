import { apiSlice } from "@/api/apiSlice";

const CONTENT_URL = "/api/user/content";
const PUBLIC_CONTENT_URL = "/api/public/content";

export const contentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadContent: builder.mutation({
      query: ({ files, ...body }) => {
        console.log("uploadContent received files:", files);
        console.log("uploadContent received body:", body);

        if (!files || !Array.isArray(files) || files.length === 0) {
          throw new Error("Files are required for upload");
        }

        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        console.log("FormData entries:");
        for (const pair of formData.entries()) {
          console.log(`  ${pair[0]}:`, pair[1]);
        }

        console.log(formData);
        
        return {
          url: `${CONTENT_URL}/upload`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Content"],
      transformResponse: (response) => response?.data || response,
    }),

    getEventContent: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${CONTENT_URL}/event/${
            params.eventId
          }?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Content"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => ({
        content: response?.data || [],
        pagination: response?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    }),

    getUserContent: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${CONTENT_URL}/user/${
            params.userId
          }?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Content"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => ({
        content: response?.data || [],
        pagination: response?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    }),

    getVault: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${CONTENT_URL}/vault?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Content"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => ({
        content: response?.data || [],
        pagination: response?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    }),

    getGallery: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${PUBLIC_CONTENT_URL}/gallery?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Content"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => ({
        content: response?.data || [],
        pagination: response?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 20,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    }),

    getPendingContent: builder.query({
      query: (eventId) => ({
        url: `${CONTENT_URL}/pending/${eventId}`,
        method: "GET",
      }),
      providesTags: ["Content"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response?.data || [],
    }),

    checkEventUploadAccess: builder.query({
      query: (eventId) => ({
        url: `${CONTENT_URL}/event/${eventId}/access`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response) => ({
        hasTicket: response?.hasTicket || false,
        message: response?.message,
      }),
    }),

    approveContent: builder.mutation({
      query: ({ contentId }) => ({
        url: `${CONTENT_URL}/approve/${contentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Content"],
      transformResponse: (response) => response?.data || response,
    }),

    rejectContent: builder.mutation({
      query: ({ contentId, reason }) => ({
        url: `${CONTENT_URL}/reject/${contentId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Content"],
      transformResponse: (response) => response?.data || response,
    }),

    deleteContent: builder.mutation({
      query: ({ contentId }) => ({
        url: `${CONTENT_URL}/${contentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content"],
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

export const {
  useUploadContentMutation,
  useGetEventContentQuery,
  useLazyGetEventContentQuery,
  useGetUserContentQuery,
  useLazyGetUserContentQuery,
  useGetVaultQuery,
  useLazyGetVaultQuery,
  useGetGalleryQuery,
  useLazyGetGalleryQuery,
  useGetPendingContentQuery,
  useLazyGetPendingContentQuery,
  useCheckEventUploadAccessQuery,
  useApproveContentMutation,
  useRejectContentMutation,
  useDeleteContentMutation,
} = contentApiSlice;
