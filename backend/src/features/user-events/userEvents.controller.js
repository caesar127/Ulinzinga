import * as userEventsService from "./userEvents.service.js";

export const getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queryParams = req.query;
    const result = await userEventsService.getRecommendedEventsService(userId, queryParams);
    return res.status(200).json({
      status: "success",
      message: "Recommended events fetched successfully",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch recommended events",
      error: error.response?.data || error.message,
    });
  }
};

export const getTrendingEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queryParams = req.query;
    const result = await userEventsService.getTrendingEventsService(userId, queryParams);
    return res.status(200).json({
      status: "success",
      message: "Trending events fetched successfully",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch trending events",
      error: error.response?.data || error.message,
    });
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

export const getEventsByInterests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queryParams = req.query;
    const result = await userEventsService.getEventsByInterestsService(userId, queryParams);
    return res.status(200).json({
      status: "success",
      message: "Events by interests fetched successfully",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch events by interests",
      error: error.response?.data || error.message,
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
