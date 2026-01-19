import axios from "axios";
import mongoose from "mongoose";
import Event from "./events.model.js";
import EventCategory from "../category/category.model.js";
import { PAGINATION, SORT_OPTIONS } from "../../core/utils/constants.js";

const BASE_URL = "https://dashboard.paychangu.com/mobile/api/public";
const AUTH_HEADER = {
  Accept: "application/json",
  Authorization: "Bearer 123",
};

const stripHtml = (html = "") => {
  return html.replace(/<[^>]*>?/gm, "").trim();
};

const safeLower = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.toLowerCase();
  return String(value).toLowerCase();
};

export const getAllEventsService = async (queryParams = {}) => {
  try {
    const page = Math.max(1, parseInt(queryParams.page) || 1);
    const limit = Math.max(
      PAGINATION.EVENTS_MIN_LIMIT,
      Math.min(
        PAGINATION.EVENTS_MAX_LIMIT,
        parseInt(queryParams.limit) || PAGINATION.EVENTS_DEFAULT_LIMIT
      )
    );
    const skip = (page - 1) * limit;

    const sortBy = Object.values(SORT_OPTIONS.EVENTS_SORT_BY).includes(
      queryParams.sortBy
    )
      ? queryParams.sortBy
      : SORT_OPTIONS.EVENTS_SORT_BY.DATE;
    const sortOrder =
      queryParams.sortOrder === SORT_OPTIONS.EVENTS_SORT_ORDER.ASC ? 1 : -1;

    const filter = {};

    if (queryParams.visible !== undefined)
      filter.visible = queryParams.visible === "true";
    if (queryParams.isActive !== undefined)
      filter.isActive = queryParams.isActive === "true";

    const dateFilter = {};
    if (queryParams.isPast !== undefined) {
      dateFilter[queryParams.isPast === "true" ? "$lt" : "$gte"] = new Date();
    }
    if (queryParams.startDate)
      dateFilter.$gte = new Date(queryParams.startDate);
    if (queryParams.endDate) dateFilter.$lte = new Date(queryParams.endDate);
    if (queryParams.onDate) {
      const d = new Date(queryParams.onDate);
      dateFilter.$gte = new Date(d.setHours(0, 0, 0, 0));
      dateFilter.$lte = new Date(d.setHours(23, 59, 59, 999));
    }
    if (Object.keys(dateFilter).length) filter.end_date = dateFilter;

    if (queryParams.search)
      filter.$text = { $search: queryParams.search.trim() };

    const totalCount = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const processedEvents = events.map((e) => ({
      ...e,
      description: stripHtml(e.description || ""),
      externalApiStatus: "local",
    }));

    return {
      events: processedEvents,
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
  } catch (err) {
    throw new Error(`Failed to fetch events: ${err.message}`);
  }
};

export const getEventByIdService = async (id) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let localEvent;
    if (isObjectId) {
      localEvent = await Event.findById(id);
    } else {
      localEvent = await Event.findOne({
        $or: [{ slug: id }, { eventId: id }],
      });
    }

    if (!localEvent) {
      throw new Error(`Event not found with ID: ${id}`);
    }

    let eventSlug = localEvent.slug || localEvent.eventId;

    if (!eventSlug) {
      return {
        status: "success",
        data: {
          ...localEvent.toObject(),
          title: "Untitled Event",
          description: "Event details temporarily unavailable",
        },
      };
    }

    const options = {
      method: "GET",
      url: `${BASE_URL}/events/${eventSlug}`,
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
        data: {
          ...localEvent.toObject(),
          ...cleanedEvent,
        },
      };
    } catch {
      return {
        status: "success",
        data: {
          ...localEvent.toObject(),
          title: localEvent.slug || "Untitled Event",
          description:
            "Event details not available from external source (may have been deleted or expired)",
          externalApiStatus: "not_found",
          lastSyncedAt: localEvent.lastSyncedAt,
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

export const syncEvents = async () => {
  const options = {
    method: "GET",
    url: "https://dashboard.paychangu.com/general/api/admin/events",
    params: { per_page: "200" },
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.ULINZINGA_ADMIN_TOKEN}`,
    },
  };

  try {
    const { data } = await axios.request(options);
    const externalEvents = data?.data || [];

    const syncResults = [];
    let deletedEvents = 0;

    for (const event of externalEvents) {
      try {
        let endDateValue = null;
        if (event.end_date) {
          endDateValue = new Date(event.end_date);
        }

        let startDateValue = null;
        if (event.start_date) {
          startDateValue = new Date(event.start_date);
        }

        let isPastValue = event.is_past === true;
        if (endDateValue && !isNaN(endDateValue.getTime())) {
          isPastValue = endDateValue < new Date();
        }

        const eventData = {
          eventId: event.id.toString(),
          visible: event.featured === true,
          isActive: event.is_active === true,
          is_past: isPastValue,
          start_date: startDateValue,
          end_date: endDateValue,
          lastSyncedAt: new Date(),
          interests: [],
          title: event.title,
          venue: event.venue,
          description: event.description,
          banner_url: event.banner_url,
          logo_url: event.logo_url,
          terms_text: event.terms_text,
          start_time: event.start_time,
          end_time: event.end_time,
        };

        // Store merchant information from PayChangu
        if (event.merchant) {
          eventData.merchant = {
            id: event.merchant.id,
            name: event.merchant.name,
            email: event.merchant.email,
          };
        }

        // Store balance information from PayChangu
        if (event.balance) {
          eventData.balance = {
            currency: event.balance.currency,
            ref_id: event.balance.ref_id,
          };
        }

        // Handle category mapping to interests
        if (event.category_id) {
          try {
            const category = await EventCategory.findOne({
              categoryId: event.category_id,
            });
            if (category) {
              eventData.interests = [category._id];
            }
          } catch (categoryError) {
            console.warn(
              `Failed to find category for categoryId ${event.category_id}:`,
              categoryError.message
            );
          }
        }

        if (event.slug) {
          eventData.slug = event.slug;
        }

        const result = await Event.findOneAndUpdate(
          { eventId: eventData.eventId },
          eventData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        syncResults.push({
          eventId: eventData.eventId,
          status: "success",
          action: "upserted",
          data: result,
        });
      } catch (error) {
        syncResults.push({
          eventId: event.id,
          status: "error",
          action: "sync_failed",
          error: error.message,
        });
      }
    }

    const externalEventIds = externalEvents.map((e) => e.id.toString());
    const externalSlugs = externalEvents
      .filter((event) => event.slug)
      .map((event) => event.slug);

    const orphanedEvents = await Event.find({
      $and: [
        { eventId: { $nin: externalEventIds } },
        { slug: { $nin: externalSlugs } },
        { eventId: { $ne: null } },
      ],
    });

    for (const orphanedEvent of orphanedEvents) {
      try {
        await Event.findByIdAndDelete(orphanedEvent._id);
        deletedEvents++;

        syncResults.push({
          eventId: orphanedEvent.eventId,
          status: "success",
          action: "deleted",
          reason: "not_found_in_external_api",
        });
      } catch (error) {
        syncResults.push({
          eventId: orphanedEvent.eventId,
          status: "error",
          action: "deletion_failed",
          error: error.message,
        });
      }
    }

    const successfulSyncs = syncResults.filter(
      (r) => r.status === "success"
    ).length;
    const failedSyncs = syncResults.filter((r) => r.status === "error").length;
    const upsertedEvents = syncResults.filter(
      (r) => r.action === "upserted"
    ).length;

    return {
      success: true,
      totalExternalEvents: externalEvents.length,
      upsertedEvents,
      deletedOrphanedEvents: deletedEvents,
      successfulSyncs,
      failedSyncs,
      results: syncResults,
      summary: {
        externalEvents: externalEvents.length,
        localEventsBefore: await Event.countDocuments(),
        localEventsAfter: await Event.countDocuments(),
        netChange: deletedEvents - (externalEvents.length - upsertedEvents),
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to sync events: ${error.response?.data?.message || error.message}`
    );
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
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLocalEventsService = async (queryParams = {}) => {
  try {
    let localEventsQuery = Event.find({}).sort({ createdAt: -1 });

    if (queryParams.visible !== undefined) {
      localEventsQuery = localEventsQuery
        .where("visible")
        .equals(queryParams.visible);
    }
    if (queryParams.isActive !== undefined) {
      localEventsQuery = localEventsQuery
        .where("isActive")
        .equals(queryParams.isActive);
    }
    if (queryParams.isPast !== undefined) {
      const isPastFilter =
        queryParams.isPast === true || queryParams.isPast === "true";
      if (isPastFilter) {
        localEventsQuery = localEventsQuery.where({
          $or: [
            { isPast: true },
            {
              end_date: {
                $exists: true,
                $ne: null,
                $lt: new Date(),
              },
            },
          ],
        });
      } else {
        localEventsQuery = localEventsQuery.where({
          $and: [
            { isPast: false },
            {
              $or: [
                { end_date: null },
                { end_date: { $exists: false } },
                { end_date: { $gte: new Date() } },
              ],
            },
          ],
        });
      }
    }

    if (queryParams.startDate) {
      const startDate = new Date(queryParams.startDate);
      if (!isNaN(startDate.getTime())) {
        localEventsQuery = localEventsQuery.where("end_date").gte(startDate);
      }
    }

    if (queryParams.endDate) {
      const endDate = new Date(queryParams.endDate);
      if (!isNaN(endDate.getTime())) {
        localEventsQuery = localEventsQuery.where("end_date").lte(endDate);
      }
    }

    if (queryParams.onDate) {
      const onDate = new Date(queryParams.onDate);
      if (!isNaN(onDate.getTime())) {
        const startOfDay = new Date(onDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(onDate.setHours(23, 59, 59, 999));

        localEventsQuery = localEventsQuery
          .where("end_date")
          .gte(startOfDay)
          .lte(endOfDay);
      }
    }

    if (queryParams.slug) {
      localEventsQuery = localEventsQuery
        .where("slug")
        .equals(queryParams.slug);
    }

    return await localEventsQuery.exec();
  } catch (error) {
    throw error;
  }
};

export const getEventSyncStats = async () => {
  try {
    const totalEvents = await Event.countDocuments();
    const recentlySynced = await Event.countDocuments({
      lastSyncedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const activeEvents = await Event.countDocuments({ isActive: true });
    const visibleEvents = await Event.countDocuments({ visible: true });

    return {
      totalEvents,
      recentlySynced,
      activeEvents,
      visibleEvents,
      syncHealth:
        totalEvents > 0
          ? ((recentlySynced / totalEvents) * 100).toFixed(1) + "%"
          : "0%",
    };
  } catch (error) {
    throw error;
  }
};

export const cleanupOrphanedEvents = async () => {
  const options = {
    method: "GET",
    url: `${BASE_URL}/events`,
    headers: AUTH_HEADER,
  };

  try {
    const { data } = await axios.request(options);
    const externalEvents = data?.data || [];

    const externalEventIds = externalEvents
      .map((event) => event.id?.toString())
      .filter(Boolean);
    const externalSlugs = externalEvents
      .map((event) => event.slug)
      .filter((slug) => slug && slug.trim())
      .map((slug) => slug.trim());

    const orphanedEvents = await Event.find({
      $and: [
        { eventId: { $nin: externalEventIds } },
        { slug: { $nin: externalSlugs } },
        { eventId: { $ne: null } },
      ],
    });

    let deletedCount = 0;
    const deletionResults = [];

    for (const orphanedEvent of orphanedEvents) {
      try {
        await Event.findByIdAndDelete(orphanedEvent._id);
        deletedCount++;

        deletionResults.push({
          eventId: orphanedEvent.eventId,
          slug: orphanedEvent.slug,
          status: "deleted",
          reason: "not_found_in_external_api",
        });
      } catch (error) {
        deletionResults.push({
          eventId: orphanedEvent.eventId,
          slug: orphanedEvent.slug,
          status: "error",
          error: error.message,
        });
      }
    }

    return {
      success: true,
      externalEventsFound: externalEvents.length,
      orphanedEventsFound: orphanedEvents.length,
      deletedCount,
      results: deletionResults,
    };
  } catch (error) {
    throw new Error(
      `Failed to cleanup orphaned events: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Admin management services
export const updateEventVisibilityService = async (eventId, isVisible) => {
  try {
    let event;

    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(eventId)) {
      event = await Event.findByIdAndUpdate(
        eventId,
        {
          visible: isVisible,
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    // If not found by ObjectId, try by eventId (string from external API)
    if (!event) {
      event = await Event.findOneAndUpdate(
        { eventId: eventId },
        {
          visible: isVisible,
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error) {
    throw new Error(`Failed to update event visibility: ${error.message}`);
  }
};

export const updateEventStatusService = async (eventId, isActive) => {
  try {
    let event;

    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(eventId)) {
      event = await Event.findByIdAndUpdate(
        eventId,
        {
          isActive: isActive,
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    // If not found by ObjectId, try by eventId (string from external API)
    if (!event) {
      event = await Event.findOneAndUpdate(
        { eventId: eventId },
        {
          isActive: isActive,
          updatedAt: new Date(),
        },
        { new: true }
      );
    }

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error) {
    throw new Error(`Failed to update event status: ${error.message}`);
  }
};

export const deleteEventService = async (eventId) => {
  try {
    let event;

    if (mongoose.Types.ObjectId.isValid(eventId)) {
      event = await Event.findByIdAndDelete(eventId);
    }

    if (!event) {
      event = await Event.findOneAndDelete({ eventId: eventId });
    }

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      success: true,
      message: "Event deleted successfully",
      deletedEvent: {
        id: event._id,
        title: event.title,
        eventId: event.eventId,
      },
    };
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

export const searchEventsService = async (queryParams = {}) => {
  try {
    const {
      q: searchTerm,
      category,
      organizer,
      tags,
      limit = 20,
      page = 1,
    } = queryParams;

    if (!searchTerm && !category && !organizer && !tags) {
      throw new Error("At least one search parameter is required");
    }

    let searchQuery = { visible: true, isActive: true };
    let textSearchConditions = [];

    // Build search conditions for database fields only
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm.trim(), "i");
      textSearchConditions.push(
        { slug: searchRegex },
        { tags: { $in: [searchRegex] } }
      );
    }

    if (category) {
      const categoryDoc = await EventCategory.findOne({
        $or: [{ name: new RegExp(category, "i") }],
      });
      if (categoryDoc) {
        searchQuery.interests = categoryDoc._id;
      }
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      searchQuery.tags = { $in: tagArray.map((tag) => new RegExp(tag, "i")) };
    }

    if (textSearchConditions.length > 0) {
      searchQuery.$or = textSearchConditions;
    }

    const skip = (page - 1) * limit;
    const localEvents = await Event.find(searchQuery)
      .populate("interests", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    if (!localEvents.length) {
      return { events: [], total: 0, page, limit };
    }

    // Fetch external data for found events
    const eventSlugs = localEvents
      .filter((event) => event.slug)
      .map((event) => event.slug);
    const externalEventPromises = eventSlugs.map(async (slug) => {
      try {
        const options = {
          method: "GET",
          url: `${BASE_URL}/events/${slug}`,
          headers: AUTH_HEADER,
        };
        const { data } = await axios.request(options);
        return { slug, externalData: data.data };
      } catch {
        return { slug, externalData: null };
      }
    });

    const externalResults = await Promise.all(externalEventPromises);

    // Merge local and external data
    const mergedEvents = localEvents.map((localEvent) => {
      const externalResult = externalResults.find(
        (result) => result.slug === localEvent.slug
      );
      const externalData = externalResult?.externalData;

      if (externalData) {
        return {
          ...localEvent.toObject(),
          ...externalData,
          description: stripHtml(externalData.description),
        };
      }
      return localEvent.toObject();
    });

    // Apply text search filters on merged data
    let filteredEvents = mergedEvents;
    if (searchTerm || organizer) {
      const searchLower = searchTerm ? searchTerm.toLowerCase() : "";
      const organizerLower = organizer ? organizer.toLowerCase() : "";

      const filteredEvents = processedEvents.filter((event) => {
        const searchableText = [
          event.title,
          event.description,
          event.venue,
          event.organizer,
          event.merchant?.name,
          ...(event.tags || []),
          ...(event.interests?.map((i) => i.name) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchLower);
      });
    }

    return {
      events: filteredEvents,
      total: filteredEvents.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredEvents.length / limit),
    };
  } catch (error) {
    throw error;
  }
};

export const getUserTicketsByEmailService = async (email) => {
  try {
    const options = {
      method: "GET",
      url: "https://dashboard.paychangu.com/general/api/admin/events/tickets/by-email",
      params: { email: email },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ULINZINGA_ADMIN_TOKEN}`,
      },
    };

    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    throw new Error(
      `Failed to get user tickets: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};
