import axios from "axios";

const BASE_URL = "https://api.paychangu.com/events/";
const PUBLIC_BASE_URL = "https://dashboard.paychangu.com/mobile/api/public";

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
      console.log(response);
      return response.data;
    }
  } catch (error) {
    console.error("Create Event Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getEvents = async (organizerToken, queryParams = {}) => {
  try {
    const merchantId = queryParams.merchantId || organizerToken;
    console.log("merchantId", merchantId);
    const options = {
      method: "GET",
      url: "https://api.paychangu.com/events/",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${merchantId}`,
      },
    };

    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getEvent = async (eventId, merchantId) => {
  try {
    console.log("eventId", eventId);
    console.log("merchantId", merchantId);
    const options = {
      method: "GET",
      url: `https://api.paychangu.com/events/${eventId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${merchantId}`,
      },
    };
    console.log("options", options);
    const { data } = await axios.request(options);
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error.message);
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
