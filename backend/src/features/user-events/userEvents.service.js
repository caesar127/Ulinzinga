import User from "../users/users.model.js";
import Event from "../events/events.model.js";

export const getRecommendedEventsService = async (userId, limit = 20) => {
  const user = await User.findById(userId).select("interests location");
  if (!user) throw new Error("User not found");

  const userInterestIds = user.interests || [];
  
  const events = await Event.find({
    is_active: true,
    status: "published",
    categories: { $in: userInterestIds },
  })
    .populate("categories")
    .populate("organizer", "name profile")
    .sort({ createdAt: -1 })
    .limit(limit);

  return events;
};

export const getTrendingEventsService = async (userId, limit = 20) => {
  const user = await User.findById(userId).select("interests");
  if (!user) throw new Error("User not found");

  const interestIds = user.interests || [];

  const trending = await Event.aggregate([
    { 
      $match: { 
        is_active: true,
        status: "published",
        categories: { $in: interestIds }
      }
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$interactions.views", 1] },
            { $multiply: ["$interactions.favorites", 3] },
            { $multiply: ["$interactions.ticketsSold", 5] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);

  return trending;
};

export const addFavoriteEventService = async (userId, eventId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteEvents: eventId } },
    { new: true }
  ).populate("favoriteEvents");

  return user.favoriteEvents;
};

export const removeFavoriteEventService = async (userId, eventId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteEvents: eventId } },
    { new: true }
  ).populate("favoriteEvents");

  return user.favoriteEvents;
};

export const getFavoriteEventsService = async (userId) => {
  const user = await User.findById(userId).populate("favoriteEvents");
  return user.favoriteEvents || [];
};

export const addFavoriteOrganizerService = async (userId, organizerId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteOrganizers: organizerId } },
    { new: true }
  ).populate("favoriteOrganizers");

  return user.favoriteOrganizers;
};

export const removeFavoriteOrganizerService = async (userId, organizerId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteOrganizers: organizerId } },
    { new: true }
  ).populate("favoriteOrganizers");

  return user.favoriteOrganizers;
};

export const getFavoriteOrganizersService = async (userId) => {
  const user = await User.findById(userId).populate("favoriteOrganizers");
  return user.favoriteOrganizers || [];
};

export const getRecentEventsService = async (limit = 20) => {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  return await Event.find({
    createdAt: { $gte: monthAgo },
    is_active: true,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getEventsForYouService = async (userId, limit = 20) => {
  const user = await User.findById(userId).select("interests location");
  if (!user) throw new Error("User not found");

  const interestIds = user.interests || [];

  return await Event.aggregate([
    {
      $match: {
        is_active: true,
        status: "published",
      },
    },
    {
      $addFields: {
        interestMatchCount: {
          $size: { $setIntersection: ["$categories", interestIds] },
        },
        
        score: {
          $add: [
            { $multiply: ["$interestMatchCount", 1.5] },
            { $multiply: ["$interactions.views", 0.5] },
            { $multiply: ["$interactions.favorites", 2] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);
};
