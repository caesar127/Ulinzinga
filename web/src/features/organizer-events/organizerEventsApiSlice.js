import { apiSlice } from "@/api/apiSlice";

const ORGANIZER_EVENTS_URL = "/api/organizer/events";

export const organizerEventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizerEvents: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return {
          url: `${ORGANIZER_EVENTS_URL}?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["OrganizerEvent"],
      transformResponse: (response) => {
        return {
          events: response.data || [],
          pagination: response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            limit: 20,
            hasNextPage: false,
            hasPrevPage: false,
            sortBy: 'created_at',
            sortOrder: 'desc'
          }
        };
      },
    }),

    getOrganizerEventById: builder.query({
      query: ({ id, merchantId }) => ({
        url: `${ORGANIZER_EVENTS_URL}/${id}/${merchantId}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "OrganizerEvent", id }],
    }),

    createOrganizerEvent: builder.mutation({
      query: (eventData) => {
        const hasFiles =
          eventData instanceof FormData ||
          eventData.banner ||
          eventData.logo;

        if (hasFiles) {
          const formData = new FormData();

          Object.entries(eventData).forEach(([key, value]) => {
            if (
              key !== "banner" &&
              key !== "logo" &&
              value !== null &&
              value !== undefined
            ) {
              formData.append(key, value);
            }
          });

          if (eventData.banner) formData.append("banner", eventData.banner);
          if (eventData.logo) formData.append("logo", eventData.logo);

          return {
            url: ORGANIZER_EVENTS_URL,
            method: "POST",
            body: formData,
          };
        }

        return {
          url: ORGANIZER_EVENTS_URL,
          method: "POST",
          body: eventData,
        };
      },
      invalidatesTags: ["OrganizerEvent"],
    }),

    updateOrganizerEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `${ORGANIZER_EVENTS_URL}/${id}`,
        method: "PUT",
        body: eventData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OrganizerEvent", id },
        "OrganizerEvent",
      ],
    }),

    uploadEventBanner: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("banner", file);

        return {
          url: `${ORGANIZER_EVENTS_URL}/${id}/banner`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "OrganizerEvent", id },
        "OrganizerEvent",
      ],
    }),

    uploadEventLogo: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("logo", file);

        return {
          url: `${ORGANIZER_EVENTS_URL}/${id}/logo`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "OrganizerEvent", id },
        "OrganizerEvent",
      ],
    }),

    deleteOrganizerEvent: builder.mutation({
      query: (id) => ({
        url: `${ORGANIZER_EVENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrganizerEvent"],
    }),
  }),
});

export const {
  useGetOrganizerEventsQuery,
  useLazyGetOrganizerEventsQuery,
  useGetOrganizerEventByIdQuery,
  useLazyGetOrganizerEventByIdQuery,
  useCreateOrganizerEventMutation,
  useUpdateOrganizerEventMutation,
  useUploadEventBannerMutation,
  useUploadEventLogoMutation,
  useDeleteOrganizerEventMutation,
} = organizerEventsApiSlice;
