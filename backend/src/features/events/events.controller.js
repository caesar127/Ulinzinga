import {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  getEventBySlugService,
  updateEventService,
  deleteEventService,
  softDeleteEventService,
  restoreEventService,
  getUpcomingEventsService,
  getPastEventsService,
  getEventsByMerchantService,
  getRecommendedEventsService,
  getTrendingEventsService,
} from "./events.service.js";

export const createEvent = async (req, res) => {
  try {
    const event = await createEventService(req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const result = await getAllEventsService(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);
    res.json({ event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const event = await getEventBySlugService(req.params.slug);
    res.json({ event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await updateEventService(req.params.id, req.body);
    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await deleteEventService(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const softDeleteEvent = async (req, res) => {
  try {
    const event = await softDeleteEventService(req.params.id);
    res.json({ message: "Event deactivated successfully", event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const restoreEvent = async (req, res) => {
  try {
    const event = await restoreEventService(req.params.id);
    res.json({ message: "Event restored successfully", event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await getUpcomingEventsService(req.query.limit);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPastEvents = async (req, res) => {
  try {
    const events = await getPastEventsService(req.query.limit);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventsByMerchant = async (req, res) => {
  try {
    const result = await getEventsByMerchantService(
      req.params.merchantName,
      req.query.page,
      req.query.limit
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecommendedEvents = async (req, res) => {
  try {
    const events = await getRecommendedEventsService(req.query);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrendingEvents = async (req, res) => {
  try {
    const events = await getTrendingEventsService(req.query.limit);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
