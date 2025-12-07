import {
  configureStall,
  getStallByEvent,
  listStallsByOrganizer,
  updateStall,
  setStallActive,
  addStallType,
  updateStallType,
  deleteStallType,
  bookStall,
  updateBookingStatus,
  cancelBooking,
  listBookings,
  getAvailability,
  getStallSummary,
} from "./stalls.service.js";

export const createStallSetup = async (req, res) => {
  try {
    const { eventId, stall_types } = req.body;
    const organizerId = req.user._id;
    const data = await configureStall({ eventId, organizerId, stall_types });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getStall = async (req, res) => {
  try {
    const data = await getStallByEvent(req.params.eventId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getOrganizerStalls = async (req, res) => {
  try {
    const data = await listStallsByOrganizer(req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editStall = async (req, res) => {
  try {
    const data = await updateStall(req.params.stallId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const toggleStallActive = async (req, res) => {
  try {
    const data = await setStallActive(req.params.stallId, req.body.is_active);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createStallType = async (req, res) => {
  try {
    const data = await addStallType(req.params.stallId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editStallType = async (req, res) => {
  try {
    const data = await updateStallType(req.params.stallId, req.params.typeId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const removeStallType = async (req, res) => {
  try {
    const data = await deleteStallType(req.params.stallId, req.params.typeId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const makeBooking = async (req, res) => {
  try {
    const { stall_type, quantity, vendor } = req.body;
    const data = await bookStall({
      stallId: req.params.stallId,
      stall_type,
      quantity,
      vendor,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const data = await updateBookingStatus(
      req.params.stallId,
      req.params.bookingId,
      req.body.status
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cancelStallBooking = async (req, res) => {
  try {
    const data = await cancelBooking(req.params.stallId, req.params.bookingId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const data = await listBookings(req.params.stallId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const data = await getAvailability(req.params.stallId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const stallSummary = async (req, res) => {
  try {
    const data = await getStallSummary(req.params.eventId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
