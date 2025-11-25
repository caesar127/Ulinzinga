import * as userEventsService from "./userEvents.service.js";

export const getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await userEventsService.getRecommendedEvents(userId);
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrendingEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await userEventsService.getTrendingEvents(userId);
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavoriteEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;

    const updated = await userEventsService.addFavoriteEvent(userId, eventId);
    return res.json({ success: true, favorites: updated.favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavoriteEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const updated = await userEventsService.removeFavoriteEvent(
      userId,
      eventId
    );
    return res.json({ success: true, favorites: updated.favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavoriteOrganizer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { organizerId } = req.body;

    const updated = await userEventsService.addFavoriteOrganizer(
      userId,
      organizerId
    );
    return res.json({ success: true, organizers: updated.favoriteOrganizers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavoriteOrganizer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { organizerId } = req.params;

    const updated = await userEventsService.removeFavoriteOrganizer(
      userId,
      organizerId
    );
    return res.json({ success: true, organizers: updated.favoriteOrganizers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
