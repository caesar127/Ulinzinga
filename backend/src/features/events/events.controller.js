import {
  getAllEventsService,
  getEventByIdService,
  purchaseTicket,
  syncEvents,
  cleanupOrphanedEvents,
  updateEventVisibilityService,
  updateEventStatusService,
  deleteEventService,
  getUserTicketsByEmailService,
  searchEventsService,
} from "./events.service.js";

export const getAllEvents = async (req, res) => {
  try {
    const queryParams = req.query;
    const result = await getAllEventsService(queryParams);
    return res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch events",
      error: error.response?.data || error.message,
    });
  }
};

export const cleanupOrphanedEventsController = async (req, res) => {
  try {
    const result = await cleanupOrphanedEvents();

    return res.status(200).json({
      status: "success",
      message: "Orphaned events cleanup completed",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to cleanup orphaned events",
      error: error.message,
    });
  }
};

export const syncEventsController = async (req, res) => {
  try {
    const result = await syncEvents();

    return res.status(200).json({
      status: "success",
      message: "Events synchronized successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to synchronize events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getEventByIdService(id);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch event",
      error: error.response?.data || error.message,
    });
  }
};

export const initiatePurchase = async (req, res) => {
  try {
    const { eventSlug } = req.params;
    const {
      package_id,
      name,
      email,
      quantity,
      coupon_code,
      redirect_url,
      cancel_url,
      isGift,
      recipientName,
      recipientEmail,
      giftMessage,
    } = req.body;

    const requiredFields = {
      package_id,
      name,
      email,
      quantity,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(
        ([_, value]) => value === undefined || value === null || value === ""
      )
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const purchaseData = {
      eventSlug,
      package_id,
      name,
      email,
      quantity,
      coupon_code,
      redirect_url,
      cancel_url,
      isGift: isGift || false,
      recipientName: recipientName || null,
      recipientEmail: recipientEmail || null,
      giftMessage: giftMessage || null,
    };
    
    const result = await purchaseTicket(purchaseData);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

// Admin management controllers
export const updateEventVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be a boolean value",
      });
    }

    const result = await updateEventVisibilityService(id, isVisible);

    return res.status(200).json({
      success: true,
      message: "Event visibility updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update event visibility",
      error: error.message,
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const result = await updateEventStatusService(id, isActive);

    return res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update event status",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteEventService(id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const queryParams = req.query;
    const result = await searchEventsService(queryParams);

    return res.status(200).json({
      status: "success",
      message: "Events search completed successfully",
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to search events",
      error: error.response?.data || error.message,
    });
  }
};

export const getUserTicketsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const tickets = await getUserTicketsByEmailService(email);

    return res.status(200).json({
      success: true,
      message: "User tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch user tickets",
      error: error.response?.data?.message || error.message,
    });
  }
};
