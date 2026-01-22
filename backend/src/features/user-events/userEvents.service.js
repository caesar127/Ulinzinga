import axios from "axios";
import User from "../users/users.model.js";
import Event from "../events/events.model.js";
import { PAGINATION } from "../../core/utils/constants.js";
import { getUserTicketsByEmailService } from "../events/events.service.js";

export const getRecommendedEventsService = async (userId, queryParams = {}) => {
  const user = await User.findById(userId).select("interests");
  if (!user) throw new Error("User not found");

  const interests = user.interests || [];

  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.max(
    PAGINATION.EVENTS_MIN_LIMIT,
    Math.min(
      PAGINATION.EVENTS_MAX_LIMIT,
      parseInt(queryParams.limit) || PAGINATION.EVENTS_DEFAULT_LIMIT
    )
  );
  const skip = (page - 1) * limit;
  
  const events = await Event.aggregate([
    {
      $match: {
        isActive: true,
        visible: true,
      },
    },
    {
      $addFields: {
        interestMatchCount: {
          $size: {
            $setIntersection: ["$interests", interests],
          },
        },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$interestMatchCount", 4] },
            { $multiply: ["$interactions.views", 0.3] },
            { $multiply: ["$interactions.favorites", 2] },
            { $multiply: ["$interactions.ticketsSold", 4] },
            {
              $cond: [
                {
                  $gte: [
                    "$createdAt",
                    new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
                  ],
                },
                3,
                0,
              ],
            },
          ],
        },
      },
    },
    { $match: { score: { $gt: 0 } } },
    { $sort: { score: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalCount = await Event.countDocuments({
    isActive: true,
    visible: true,
    interests: { $in: interests },
  });

  return {
    events,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit,
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
      sortBy: "score",
      sortOrder: "desc",
    },
  };
};

export const getTrendingEventsService = async (userId, queryParams = {}) => {
  const user = await User.findById(userId).select("interests");
  if (!user) throw new Error("User not found");

  const interestIds = user.interests || [];

  let page = parseInt(queryParams.page) || 1;
  let limit = parseInt(queryParams.limit) || PAGINATION.EVENTS_DEFAULT_LIMIT;

  page = Math.max(1, page);
  limit = Math.max(
    PAGINATION.EVENTS_MIN_LIMIT,
    Math.min(PAGINATION.EVENTS_MAX_LIMIT, limit)
  );

  const skip = (page - 1) * limit;

  const allTrending = await Event.aggregate([
    {
      $match: {
        isActive: true,
        visible: true,
        interests: { $in: interestIds },
      },
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
  ]);

  const totalCount = allTrending.length;
  const sortedEvents = allTrending.slice(skip, skip + limit);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    events: sortedEvents,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
      sortBy: "score",
      sortOrder: "desc",
    },
  };
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

export const getRecentEventsService = async (
  limit = PAGINATION.RECENT_EVENTS_LIMIT
) => {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  return await Event.find({
    createdAt: { $gte: monthAgo },
    isActive: true,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getEventsForYouService = async (
  userId,
  limit = PAGINATION.RECOMMENDED_EVENTS_LIMIT
) => {
  const user = await User.findById(userId).select("interests location");
  if (!user) throw new Error("User not found");

  const interestIds = user.interests || [];

  return await Event.aggregate([
    {
      $match: {
        isActive: true,
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

export const getEventsByInterestsService = async (userId, queryParams = {}) => {
  const user = await User.findById(userId).select("interests");
  if (!user) throw new Error("User not found");

  const interests = user.interests || [];

  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.max(
    PAGINATION.EVENTS_MIN_LIMIT,
    Math.min(
      PAGINATION.EVENTS_MAX_LIMIT,
      parseInt(queryParams.limit) || PAGINATION.EVENTS_DEFAULT_LIMIT
    )
  );
  const skip = (page - 1) * limit;

  const sortBy = ["createdAt", "start_date", "title"].includes(
    queryParams.sortBy
  )
    ? queryParams.sortBy
    : "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;

  const filter = {
    isActive: true,
    visible: true,
    interests: { $in: interests },
  };

  const totalCount = await Event.countDocuments(filter);
  const events = await Event.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    events,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit,
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
      sortBy,
      sortOrder: sortOrder === 1 ? "asc" : "desc",
    },
  };
};

export const getUserPurchasedEventsService = async (
  userId,
  limit = 50,
  page = 1
) => {
  try {
    const user = await User.findById(userId).select("email");
    if (!user?.email) {
      throw new Error("User or user email not found");
    }

    const externalRes = await getUserTicketsByEmailService(user.email);
    const allTickets = externalRes?.data ?? [];

    if (!allTickets.length) {
      return {
        events: [],
        total: 0,
        page,
        limit,
        hasNextPage: false,
      };
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const tickets = allTickets.slice(start, end);

    const eventSlugs = [
      ...new Set(tickets.map((t) => t.event.slug).filter(Boolean)),
    ];

    const externalEvents = await Promise.all(
      eventSlugs.map(async (slug) => {
        try {
          const { data } = await axios.get(
            `https://dashboard.paychangu.com/mobile/api/public/events/${slug}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer 123",
              },
            }
          );

          return [slug, data?.data || null];
        } catch {
          return [slug, null];
        }
      })
    );

    const externalEventMap = new Map(externalEvents);

    const events = tickets.map((ticket) => {
      const external = externalEventMap.get(ticket.event.slug);

      return {
        ticketId: ticket.id,
        eventSlug: ticket.event.slug,
        eventId: external.id,
        eventTitle: external.title,
        eventDate: external?.start_date,
        eventVenu: external.venue,
        banner_url: external.banner_url,
        logo_url: external.logo_url,
        description: external.description,
        packageId: ticket.package_id,
        package: ticket.package,
        purchaseDate: ticket.created_at,
        ticketNumber: ticket.ticket_number,
        isRedeemed: Boolean(ticket.is_redeemed),
        isGift: Boolean(ticket.is_gift),
        giftMessage: ticket.gift_message,
      };
    });

    return {
      events,
      total: allTickets.length,
      page,
      limit,
      hasNextPage: end < allTickets.length,
    };
  } catch (error) {
    return {
      events: [],
      total: 0,
      page,
      limit,
      hasNextPage: false,
    };
  }
};

export const getUserEventByIdService = async (userId, eventId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const Ticket = await import("../tickets/tickets.model.js").then(
    (m) => m.default
  );

  const tickets = await Ticket.find({
    customerEmail: user.email,
    paychanguEventId: eventId,
    paymentStatus: "paid",
  }).sort({ purchaseDate: -1 });

  if (tickets.length === 0) {
    throw new Error("No tickets found for this event");
  }

  const event = await Event.findOne({
    $or: [{ slug: eventId }, { _id: eventId }],
  }).populate("organizer", "name profile");

  return {
    tickets,
    event: event
      ? {
          _id: event._id,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          coverImage: event.coverImage,
          description: event.description,
          organizer: event.organizer,
        }
      : null,
  };
};
