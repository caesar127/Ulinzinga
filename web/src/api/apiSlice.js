import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mainUrl = "https://ulinzinga.onrender.com/";
const backupUrl = "http://192.168.116.53:8000";

const baseQuery = fetchBaseQuery({
  baseUrl: mainUrl,
  prepareHeaders(headers, { getState }) {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  },
  tagTypes: ["User"],
  // credentials: "include",
});

const baseQueryWithBackup = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 500) {
    baseQuery({ ...args, baseUrl: backupUrl }, api, extraOptions);
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithBackup,
  tagTypes: ["users"],
  endpoints: (builder) => ({}),
});
