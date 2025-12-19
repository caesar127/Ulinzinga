import User from "../users/users.model.js";
import Event from "../events/events.model.js";
import { PAGINATION } from "../../core/utils/constants.js";
import { getUserTicketsByEmailService } from "../events/events.service.js";

export const getRecommendedEventsService = async (userId, limit = PAGINATION.RECOMMENDED_EVENTS_LIMIT) => {
  const user = await User.findById(userId).select("interests location");
  if (!user) throw new Error("User not found");

  const userInterestIds = user.interests || [];
  
  const events = await Event.find({
    isActive: true,
    status: "published",
    categories: { $in: userInterestIds },
  })
    .populate("categories")
    .populate("organizer", "name profile")
    .sort({ createdAt: -1 })
    .limit(limit);

  return events;
};

export const getTrendingEventsService = async (userId, limit = PAGINATION.TRENDING_EVENTS_LIMIT) => {
  const user = await User.findById(userId).select("interests");
  if (!user) throw new Error("User not found");

  const interestIds = user.interests || [];

  const trending = await Event.aggregate([
    { 
      $match: { 
        isActive: true,
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

export const getRecentEventsService = async (limit = PAGINATION.RECENT_EVENTS_LIMIT) => {
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

export const getEventsForYouService = async (userId, limit = PAGINATION.RECOMMENDED_EVENTS_LIMIT) => {
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

export const getUserTicketsService = async (userId, limit = 50, page = 1) => {
  // Find user by ID to get email
  const user = await User.findById(userId).select('email _id');
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }

  if (!user.email) {
    throw new Error("User email not found");
  }

  try {
    // Fetch tickets from external PayChangu API
    const externalTicketsData = await getUserTicketsByEmailService(user.email);
    
    if (!externalTicketsData || !externalTicketsData.data) {
      return {
        events: [],
        total: 0,
        page,
        limit,
        hasNextPage: false
      };
    }

    const allTickets = externalTicketsData.data || [];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickets = allTickets.slice(startIndex, endIndex);
    
    const eventSlugs = [...new Set(paginatedTickets.map(ticket => ticket.event_slug).filter(Boolean))];
    
    const localEvents = await Event.find({
      slug: { $in: eventSlugs }
    }).populate("organizer", "name profile");
    
    const userEvents = paginatedTickets.map(ticket => {
      const localEvent = localEvents.find(e => e.slug === ticket.event_slug);
      
      return {
        ticketId: ticket.id,
        paychanguTicketId: ticket.ticket_id,
        eventSlug: ticket.event_slug,
        eventId: localEvent?._id,
        eventTitle: localEvent?.title || ticket.event_name || `Event ${ticket.event_slug}`,
        eventDate: localEvent?.start_date || ticket.event_date,
        eventImage: localEvent?.coverImage || "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        eventLocation: localEvent?.location || ticket.venue || "Location TBD",
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        price: ticket.amount,
        currency: ticket.currency,
        purchaseDate: ticket.purchase_date,
        isRedeemed: ticket.is_redeemed || false,
        status: ticket.status,
        qrCodeUuid: ticket.qr_code,
        paymentStatus: ticket.payment_status,
        isGift: ticket.is_gift || false,
        giftMessage: ticket.gift_message
      };
    });

    return {
      events: userEvents,
      total: allTickets.length,
      page,
      limit,
      hasNextPage: endIndex < allTickets.length
    };
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    // Return empty result on error
    return {
      events: [],
      total: 0,
      page,
      limit,
      hasNextPage: false
    };
  }
};

export const getUserEventByIdService = async (userId, eventId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const Ticket = await import("../tickets/tickets.model.js").then(m => m.default);
  
  const tickets = await Ticket.find({
    customerEmail: user.email,
    paychanguEventId: eventId,
    paymentStatus: "paid"
  }).sort({ purchaseDate: -1 });

  if (tickets.length === 0) {
    throw new Error("No tickets found for this event");
  }

  const event = await Event.findOne({
    $or: [
      { slug: eventId },
      { _id: eventId }
    ]
  }).populate("organizer", "name profile");

  return {
    tickets,
    event: event ? {
      _id: event._id,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      coverImage: event.coverImage,
      description: event.description,
      organizer: event.organizer
    } : null
  };
};
