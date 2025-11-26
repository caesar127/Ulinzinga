import axios from "axios";

const BASE_URL = "https://dashboard.paychangu.com/mobile/api/public";
const AUTH_HEADER = {
  Accept: "application/json",
  Authorization: "Bearer 123",
};

const stripHtml = (html = "") => {
  return html.replace(/<[^>]*>?/gm, "").trim();
};

export const getAllEventsService = async (queryParams = {}) => {
  const options = {
    method: "GET",
    url: `${BASE_URL}/events`,
    params: queryParams,
    headers: AUTH_HEADER,
  };

  try {
    const { data } = await axios.request(options);

    const sortedEvents = data?.data
      ?.map((event) => ({
        ...event,
        description: stripHtml(event.description),
      }))
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    return sortedEvents;
  } catch (error) {
    console.error(
      "Error fetching events:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEventByIdService = async (id) => {
  const options = {
    method: "GET",
    url: `${BASE_URL}/events/${id}`,
    headers: AUTH_HEADER,
  };

  try {
    const { data } = await axios.request(options);

    const cleanedEvent = {
      ...data.data,
      description: stripHtml(data?.data?.description),
    };

    return {
      ...data,
      data: cleanedEvent,
    };
  } catch (error) {
    console.error(
      "Error fetching event by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const purchaseTicket = async (purchaseData) => {
  try {
    const options = {
      method: "POST",
      url: `${BASE_URL}/events/${purchaseData.eventSlug}/initiate-purchase`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer 123",
      },
      data: {
        package_id: purchaseData.package_id,
        name: purchaseData.name,
        email: purchaseData.email,
        quantity: purchaseData.quantity,
        coupon_code: purchaseData.coupon_code || null,
        redirect_url:
          purchaseData.redirect_url ||
          "https://ulinzinga.vercel.app/ticketpurchase",
        cancel_url:
          purchaseData.cancel_url ||
          "https://ulinzinga.vercel.app/ticketpurchasecancel",
      },
    };
    console.log(options);
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(
      "Error initiating ticket purchase:",
      error.response?.data || error.message
    );
    throw error;
  }
};
