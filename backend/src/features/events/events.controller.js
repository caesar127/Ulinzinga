import axios from "axios";
import dotenv from "dotenv";
import Event from "./events.model.js";

dotenv.config();

/* ---------------- PAYCHANGU API INTEGRATION ---------------- */

// PayChangu API configuration
const PAYCHANGU_API_BASE = "https://dashboard.paychangu.com/mobile/api/public";
const PAYCHANGU_E_API_KEY = process.env.PAYCHANGU_E_API_KEY;

// Helper function for PayChangu API requests
const makePayChanguRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const config = {
      method,
      url: `${PAYCHANGU_API_BASE}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYCHANGU_E_API_KEY}`,
      },
    };

    if (data) config.data = data;

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error(`PayChangu API Error (${method} ${endpoint}):`, errMsg);
    throw new Error(errMsg);
  }
};

// Sync events from PayChangu to local database
const syncEventsFromPayChangu = async () => {
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
    console.error("Failed to sync events from PayChangu:", error.message);
    return 0;
  }
};

/* ---------------- CREATE EVENT ---------------- */
export const createEvent = async (req, res) => {
  try {
    const {
      eventId,
      title,
      slug,
      description,
      banner_url,
      logo_url,
      color,
      terms_text,
      start_date,
      end_date,
      start_time,
      end_time,
      merchantName,
      venue,
      balance,
    } = req.body;

    if (
      !eventId ||
      !title ||
      !slug ||
      !start_date ||
      !end_date ||
      !merchantName ||
      !venue ||
      !balance
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: eventId, title, slug, start_date, end_date, merchantName, venue, balance",
      });
    }

    const existingEvent = await Event.findOne({
      $or: [{ eventId }, { slug }],
    });

    if (existingEvent) {
      return res
        .status(400)
        .json({ error: "Event with this eventId or slug already exists" });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const event = await Event.create({
      eventId,
      title,
      slug,
      description,
      banner_url,
      logo_url,
      color,
      terms_text,
      start_date: startDate,
      end_date: endDate,
      start_time,
      end_time,
      is_past: endDate < new Date(),
      merchantName,
      venue,
      balance,
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

/* ---------------- GET ALL EVENTS ---------------- */
export const getAllEvents = async (req, res) => {
  try {
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
    } = req.query;

    if (sync === "true") {
      const syncedCount = await syncEventsFromPayChangu();
      console.log(`Synced ${syncedCount} events from PayChangu`);
    }

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

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Get all events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

/* ---------------- GET EVENT BY ID ---------------- */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ event });
  } catch (err) {
    console.error("Get event by ID error:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

/* ---------------- GET EVENT BY SLUG ---------------- */
export const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ event });
  } catch (err) {
    console.error("Get event by slug error:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

/* ---------------- UPDATE EVENT ---------------- */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.eventId;

    if (updateData.start_date || updateData.end_date) {
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const startDate = new Date(updateData.start_date || event.start_date);
      const endDate = new Date(updateData.end_date || event.end_date);

      if (startDate >= endDate) {
        return res
          .status(400)
          .json({ error: "End date must be after start date" });
      }

      updateData.is_past = endDate < new Date();
    }

    if (updateData.slug) {
      const slugExists = await Event.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (slugExists)
        return res
          .status(400)
          .json({ error: "Event with this slug already exists" });
    }

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

/* ---------------- DELETE EVENT ---------------- */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

/* ---------------- SOFT DELETE / RESTORE ---------------- */
export const softDeleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deactivated successfully", event });
  } catch (err) {
    console.error("Soft delete event error:", err);
    res.status(500).json({ error: "Failed to deactivate event" });
  }
};

export const restoreEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event restored successfully", event });
  } catch (err) {
    console.error("Restore event error:", err);
    res.status(500).json({ error: "Failed to restore event" });
  }
};

/* ---------------- UPCOMING / PAST / BY MERCHANT ---------------- */
export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      is_active: true,
      start_date: { $gte: new Date() },
    })
      .sort({ start_date: 1 })
      .limit(parseInt(req.query.limit) || 10);

    res.json({ events });
  } catch (err) {
    console.error("Get upcoming events error:", err);
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
};

export const getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({
      is_active: true,
      end_date: { $lt: new Date() },
    })
      .sort({ end_date: -1 })
      .limit(parseInt(req.query.limit) || 10);

    res.json({ events });
  } catch (err) {
    console.error("Get past events error:", err);
    res.status(500).json({ error: "Failed to fetch past events" });
  }
};

export const getEventsByMerchant = async (req, res) => {
  try {
    const { merchantName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments({ merchantName, is_active: true });
    const events = await Event.find({ merchantName, is_active: true })
      .sort({ start_date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Get events by merchant error:", err);
    res.status(500).json({ error: "Failed to fetch merchant events" });
  }
};
