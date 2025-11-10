import axios from "axios";
import dotenv from "dotenv";
import Event from "./events.model.js";
import User from "../users/users.model.js";

dotenv.config({ quiet: true });

const PAYCHANGU_API_BASE = "https://dashboard.paychangu.com/mobile/api/public";
const PAYCHANGU_E_API_KEY = process.env.PAYCHANGU_E_API_KEY;

export const makePayChanguRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  try {
    const config = {
      method,
      url: `${PAYCHANGU_API_BASE}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYCHANGU_E_API_KEY}`,
      },
      data,
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    throw new Error(errMsg);
  }
};

export const syncEventsFromPayChangu = async () => {
  try {
    const apiResponse = await makePayChanguRequest("/events");
    if (!apiResponse?.data?.length) return 0;

    for (const apiEvent of apiResponse.data) {
      await Event.findOneAndUpdate(
        { eventId: apiEvent.id },
        {
          eventId: apiEvent.id,
          title: apiEvent.title,
          slug: apiEvent.slug,
          description: apiEvent.description,
          banner_url: apiEvent.banner_url,
          logo_url: apiEvent.logo_url,
          color: apiEvent.color || "#ffffff",
          terms_text: apiEvent.terms_text,
          start_date: new Date(apiEvent.start_date),
          end_date: new Date(apiEvent.end_date),
          start_time: apiEvent.start_time,
          end_time: apiEvent.end_time,
          merchantName: apiEvent.merchant_name,
          venue: {
            name: apiEvent.venue?.name || null,
            address: apiEvent.venue?.address || null,
            location: apiEvent.venue?.location || null,
          },
          balance: {
            currency: apiEvent.balance?.currency || "USD",
            symbol: apiEvent.balance?.symbol || "$",
          },
          is_active: apiEvent.is_active !== false,
        },
        { upsert: true, new: true }
      );
    }

    return apiResponse.data.length;
  } catch (error) {
    return 0;
  }
};

export const createEventService = async (eventData) => {
  const existingEvent = await Event.findOne({
    $or: [{ eventId: eventData.eventId }, { slug: eventData.slug }],
  });
  if (existingEvent) {
    throw new Error("Event with this eventId or slug already exists");
  }

  const startDate = new Date(eventData.start_date);
  const endDate = new Date(eventData.end_date);
  if (startDate >= endDate) {
    throw new Error("End date must be after start date");
  }

  let payChanguEvent;
  try {
    payChanguEvent = await makePayChanguRequest("/events", "POST", {
      ...eventData,
      start_date: startDate,
      end_date: endDate,
    });
  } catch (error) {
    throw new Error("Failed to create event on PayChangu: " + error.message);
  }

  const localEventData = {
    ...eventData,
    eventId: payChanguEvent.id,
    slug: payChanguEvent.slug || eventData.slug,
    start_date: startDate,
    end_date: endDate,
    is_past: endDate < new Date(),
  };

  const localEvent = await Event.create(localEventData);
  return localEvent;
};

export const getAllEventsService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    merchantName,
    is_active,
    is_past,
    sortBy = "start_date",
    sortOrder = "asc",
    sync = "true",
  } = query;

  if (sync === "true") await syncEventsFromPayChangu();

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { merchantName: { $regex: search, $options: "i" } },
    ];
  }
  if (merchantName) filter.merchantName = merchantName;
  if (is_active !== undefined) filter.is_active = is_active === "true";
  if (is_past !== undefined) filter.is_past = is_past === "true";

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Event.countDocuments(filter);
  const events = await Event.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  return {
    events,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getEventByIdService = async (id) => {
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");
  return event;
};

export const getEventBySlugService = async (slug) => {
  const event = await Event.findOne({ slug });
  if (!event) throw new Error("Event not found");
  return event;
};

export const updateEventService = async (id, updateData) => {
  delete updateData._id;
  delete updateData.createdAt;
  delete updateData.updatedAt;
  delete updateData.eventId;

  if (updateData.start_date || updateData.end_date) {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");

    const startDate = new Date(updateData.start_date || event.start_date);
    const endDate = new Date(updateData.end_date || event.end_date);

    if (startDate >= endDate)
      throw new Error("End date must be after start date");

    updateData.is_past = endDate < new Date();
  }

  if (updateData.slug) {
    const slugExists = await Event.findOne({
      slug: updateData.slug,
      _id: { $ne: id },
    });
    if (slugExists) throw new Error("Event with this slug already exists");
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedEvent) throw new Error("Event not found");

  return updatedEvent;
};

export const deleteEventService = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new Error("Event not found");
  return event;
};

export const softDeleteEventService = async (id) => {
  const event = await Event.findByIdAndUpdate(
    id,
    { is_active: false },
    { new: true }
  );
  if (!event) throw new Error("Event not found");
  return event;
};

export const restoreEventService = async (id) => {
  const event = await Event.findByIdAndUpdate(
    id,
    { is_active: true },
    { new: true }
  );
  if (!event) throw new Error("Event not found");
  return event;
};

export const getUpcomingEventsService = async (limit = 10) => {
  return await Event.find({ is_active: true, start_date: { $gte: new Date() } })
    .sort({ start_date: 1 })
    .limit(parseInt(limit));
};

export const getPastEventsService = async (limit = 10) => {
  return await Event.find({ is_active: true, end_date: { $lt: new Date() } })
    .sort({ end_date: -1 })
    .limit(parseInt(limit));
};

export const getEventsByMerchantService = async (
  merchantName,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;
  const total = await Event.countDocuments({ merchantName, is_active: true });
  const events = await Event.find({ merchantName, is_active: true })
    .sort({ start_date: -1 })
    .skip(skip)
    .limit(limit);
  return {
    events,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getRecommendedEventsService = async ({
  userId,
  page = 1,
  limit = 10,
  maxDistance = 5000,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const skip = (page - 1) * limit;
  return await Event.find({
    is_active: true,
    interests: { $in: user.interests || [] },
    "venue.geo": { $exists: true },
  })
    .where("venue.geo")
    .near({
      center: {
        type: "Point",
        coordinates: [user.location.lng, user.location.lat],
      },
      maxDistance,
      spherical: true,
    })
    .sort({ start_date: 1 })
    .skip(skip)
    .limit(limit);
};

export const getTrendingEventsService = async (limit = 10) => {
  return await Event.find({ is_active: true })
    .sort({ ticketsSold: -1, viewsCount: -1, start_date: 1 })
    .limit(limit);
};
