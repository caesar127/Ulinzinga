import Stall from "./stalls.model.js";

export const configureStall = async ({ eventId, organizerId, stall_types }) => {
  const exists = await Stall.findOne({ event: eventId });
  if (exists) throw new Error("Stall configuration for this event already exists.");

  return await Stall.create({
    event: eventId,
    organizer: organizerId,
    stall_types,
  });
};

export const getStallByEvent = async (eventId) => {
  return await Stall.findOne({ event: eventId })
    .populate("event")
    .populate("organizer");
};

export const listStallsByOrganizer = async (organizerId) => {
  return await Stall.find({ organizer: organizerId }).populate("event");
};

export const updateStall = async (stallId, data) => {
  return await Stall.findByIdAndUpdate(stallId, data, { new: true });
};

export const setStallActive = async (stallId, isActive) => {
  return await Stall.findByIdAndUpdate(stallId, { is_active: isActive }, { new: true });
};

export const addStallType = async (stallId, typeData) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  stall.stall_types.push(typeData);
  await stall.save();
  return stall;
};

export const updateStallType = async (stallId, typeId, updates) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  const type = stall.stall_types.id(typeId);
  if (!type) throw new Error("Stall type not found");

  Object.assign(type, updates);
  await stall.save();
  return stall;
};

export const deleteStallType = async (stallId, typeId) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  stall.stall_types = stall.stall_types.filter(t => t._id.toString() !== typeId);
  await stall.save();
  return stall;
};

export const bookStall = async ({ stallId, stall_type, quantity, vendor }) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  const type = stall.stall_types.find(t => t.size === stall_type);
  if (!type) throw new Error("Stall type not found");

  if (type.available_count < quantity) throw new Error("Not enough stalls available.");

  type.available_count -= quantity;

  stall.bookings.push({
    stall_type,
    quantity,
    ...vendor,
  });

  await stall.save();
  return stall;
};

export const updateBookingStatus = async (stallId, bookingId, status) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  const booking = stall.bookings.id(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.status = status;
  await stall.save();
  return stall;
};

export const cancelBooking = async (stallId, bookingId) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  const booking = stall.bookings.id(bookingId);
  if (!booking) throw new Error("Booking not found");

  const type = stall.stall_types.find(t => t.size === booking.stall_type);
  if (type) type.available_count += booking.quantity;

  booking.status = "cancelled";
  await stall.save();
  return stall;
};

export const listBookings = async (stallId) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");
  return stall.bookings;
};

export const getAvailability = async (stallId) => {
  const stall = await Stall.findById(stallId);
  if (!stall) throw new Error("Stall not found");

  return stall.stall_types.map(t => ({
    size: t.size,
    available: t.available_count,
    price: t.price,
    electricity: t.electricity,
  }));
};

export const getStallSummary = async (eventId) => {
  const stall = await Stall.findOne({ event: eventId });
  if (!stall) throw new Error("No stall setup for event");

  return {
    total_types: stall.stall_types.length,
    total_bookings: stall.bookings.length,
    pending: stall.bookings.filter(b => b.status === "pending").length,
    confirmed: stall.bookings.filter(b => b.status === "confirmed").length,
    cancelled: stall.bookings.filter(b => b.status === "cancelled").length,
    available: stall.stall_types.map(t => ({
      size: t.size,
      available: t.available_count,
    })),
  };
};
