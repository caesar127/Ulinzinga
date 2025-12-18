import {
  getEventsForVendors,
  getEventByIdForVendor,
  getStallAvailabilityForEvent,
  bookStallForVendor,
} from "./vendorEvents.service.js";

export const getAvailableEvents = async (req, res) => {
  try {
    const events = await getEventsForVendors();

    res.status(200).json({
      success: true,
      message: "Available events with stalls retrieved successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load available events",
      error: error.message,
    });
  }
};

export const getVendorEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventByIdForVendor(id);

    res.status(200).json({
      success: true,
      message: "Event details retrieved successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get event details",
      error: error.message,
    });
  }
};

export const getStallAvailability = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const availability = await getStallAvailabilityForEvent(eventId);

    res.status(200).json({
      success: true,
      message: "Stall availability retrieved successfully",
      data: availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get stall availability",
      error: error.message,
    });
  }
};

export const bookStall = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { stall_type, quantity, vendor_info } = req.body;
    
    if (!stall_type || !quantity || !vendor_info?.name || !vendor_info?.email) {
      return res.status(400).json({
        success: false,
        message: "Required fields: stall_type, quantity, vendor_info.name, vendor_info.email",
      });
    }
    
    if (quantity <= 0 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be between 1 and 10",
      });
    }

    const result = await bookStallForVendor({
      eventId,
      stall_type,
      quantity,
      vendor_info,
    });

    res.status(201).json({
      success: true,
      message: "Stall booked successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to book stall",
      error: error.message,
    });
  }
};