import * as userEventsService from "./userEvents.service.js";

export const getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await userEventsService.getRecommendedEvents(userId);
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrendingEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await userEventsService.getTrendingEvents(userId);
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavoriteEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.body;

    const updated = await userEventsService.addFavoriteEvent(userId, eventId);
    return res.json({ success: true, favorites: updated.favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavoriteEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
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
    const userId = req.user.userId;
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

export const getUserTickets = async (req, res) => {
  console.log("here")
  try {
    console.log(req.user)
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const { page = 1, limit = 20 } = req.query;
    
    const result = await userEventsService.getUserTicketsService(
      userId,
      parseInt(limit),
      parseInt(page)
    );
    
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in getUserTickets:', error);
    const status = error.message.includes('User not found') ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const getUserEventDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;
    
    const result = await userEventsService.getUserEventByIdService(userId, eventId);
    
    return res.json({ success: true, data: result });
  } catch (error) {
    const status = error.message === "No tickets found for this event" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFavoriteOrganizer = async (req, res) => {
  try {
    const userId = req.user.userId;
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
