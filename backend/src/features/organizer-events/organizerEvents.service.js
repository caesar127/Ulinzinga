import axios from "axios";

const BASE_URL = "https://api.paychangu.com/events/";

const buildHeaders = (token, contentType = "application/json") => ({
  "Content-Type": contentType,
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

export const createEvent = async (eventData) => {
  try {
    if (eventData.banner || eventData.logo) {
      const formData = new FormData();

      const fields = [
        "title",
        "description",
        "slug",
        "venue_name",
        "venue_address",
        "location",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "timezone",
        "color",
        "terms_text",
        "balance_ref",
        "isActive",
      ];

      fields.forEach((field) => {
        if (eventData[field] !== undefined && eventData[field] !== null) {
          formData.append(field, eventData[field]);
        }
      });

      if (eventData.package) {
        formData.append("package_data", JSON.stringify(eventData.package));
      }

      if (eventData.banner) {
        formData.append("banner", eventData.banner);
      }
      if (eventData.logo) {
        formData.append("logo", eventData.logo);
      }

      const response = await axios.post(BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${eventData.organizerId}`,
          Accept: "application/json",
        },
      });

      console.log(response.data);
      return response.data;
    } else {
      const response = await axios.post(
        BASE_URL,
        {
          title: eventData.title,
          description: eventData.description,
          slug: eventData.slug,
          venue_name: eventData.venue_name,
          venue_address: eventData.venue_address,
          location: eventData.location,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          timezone: eventData.timezone,
          color: eventData.color || "",
          terms_text: eventData.terms_text,
          balance_ref: eventData.balance_ref,
          isActive: eventData.isActive || "1",
          package: eventData.package || {},
        },
        { headers: buildHeaders(eventData.organizerId) }
      );

      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Create Event Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getEvents = async (organizerToken, queryParams = {}) => {
  try {
    // Build query parameters for pagination
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (queryParams.page) params.append('page', queryParams.page);
    if (queryParams.limit) params.append('limit', queryParams.limit);
    if (queryParams.per_page) params.append('per_page', queryParams.per_page);
    
    // Add sorting parameters
    if (queryParams.sortBy) params.append('sort_by', queryParams.sortBy);
    if (queryParams.sortOrder) params.append('sort_order', queryParams.sortOrder);
    
    // Add filter parameters
    if (queryParams.status) params.append('status', queryParams.status);
    if (queryParams.isActive !== undefined) params.append('is_active', queryParams.isActive);
    if (queryParams.isPast !== undefined) params.append('is_past', queryParams.isPast);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    
    const response = await axios.get(url, {
      headers: buildHeaders(organizerToken),
    });

    console.log(response.data);
    
    // Transform response to include pagination metadata if not provided by API
    const result = response.data;
    
    // If the API doesn't provide pagination metadata, add it based on the response
    if (!result.pagination && Array.isArray(result.data || result)) {
      const events = result.data || result;
      const currentPage = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || parseInt(queryParams.per_page) || 20;
      const totalCount = result.total || events.length;
      const totalPages = Math.ceil(totalCount / limit);
      
      result.pagination = {
        currentPage,
        totalPages,
        totalCount,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        sortBy: queryParams.sortBy || 'created_at',
        sortOrder: queryParams.sortOrder || 'desc'
      };
    }
    
    return result;
  } catch (error) {
    console.error("Get Events Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getEvent = async (eventId, organizerToken) => {
  try {
    const response = await axios.get(`${BASE_URL}${eventId}`, {
      headers: buildHeaders(organizerToken),
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Get Event Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateEvent = async (eventData) => {
  try {
    const updatePayload = {
      title: eventData.title,
      description: eventData.description,
      slug: eventData.slug,
      venue_name: eventData.venue_name,
      venue_address: eventData.venue_address,
      location: eventData.location,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      timezone: eventData.timezone,
      color: eventData.color,
      terms_text: eventData.terms_text,
      isActive: eventData.isActive,
    };

    const response = await axios.patch(
      `${BASE_URL}${eventData.eventId}`,
      updatePayload,
      { headers: buildHeaders(eventData.organizer) }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Update Event Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const uploadEventBanner = async (bannerData) => {
  try {
    const formData = new FormData();
    formData.append("banner", bannerData.file);

    const response = await axios.post(
      `${BASE_URL}${bannerData.eventId}/banner`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${bannerData.organizer}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Upload Banner Error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const uploadEventLogo = async (logoData) => {
  try {
    const formData = new FormData();
    formData.append("logo", logoData.file);

    const response = await axios.post(
      `${BASE_URL}${logoData.eventId}/logo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${logoData.organizer}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Upload Logo Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteEvent = async (deleteData) => {
  try {
    const response = await axios.delete(`${BASE_URL}${deleteData.eventId}`, {
      headers: buildHeaders(deleteData.organizer),
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Event Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
