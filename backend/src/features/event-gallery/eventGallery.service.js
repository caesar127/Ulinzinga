import mongoose from "mongoose";
import Event from "../events/events.model.js";
import Ticket from "../tickets/tickets.model.js";
import AppError from "../../core/error/AppError.js";
import EventGallery from "./eventGallery.model.js";
import { request, FormData, File } from "undici";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeEmail = (email) => (email || "").toLowerCase().trim();

export const verifyUserTicketForEvent = async (userEmail, eventId) => {
  if (!userEmail)
    throw new AppError("User email is required to verify event tickets", 400);

  if (!mongoose.Types.ObjectId.isValid(eventId))
    throw new AppError("Invalid event ID", 400);

  const event = await Event.findById(eventId).select("eventId slug title");
  if (!event) throw new AppError("Event not found", 404);

  if (!event.eventId) {
    return { event, hasTicket: false };
  }

  const normalizedEmail = normalizeEmail(userEmail);
  if (!normalizedEmail)
    throw new AppError("User email is required to verify event tickets", 400);

  const emailRegex = new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i");
  const ticket = await Ticket.findOne({
    paychanguEventId: event.eventId,
    paymentStatus: "paid",
    $or: [{ customerEmail: emailRegex }, { giftRecipientEmail: emailRegex }],
  });

  return { event, hasTicket: Boolean(ticket) };
};

export const createGalleryItem = async ({
  userId,
  eventId = null,
  type,
  mediaUrl,
  thumbnailUrl = null,
  caption = null,
  visibilityScope,
  privacy = "public",
  storage,
}) => {
  return EventGallery.create({
    user: userId,
    event: eventId,
    type,
    mediaUrl,
    thumbnailUrl,
    caption,
    visibilityScope,
    privacy,
    storage,
  });
};

export const uploadToStorage = async (fileBuffer, filename, mimetype) => {
  const formData = new FormData();
  formData.append("file", new File([fileBuffer], filename, { type: mimetype }));
  formData.append("projectName", "event-gallery");

  const { body } = await request(`${process.env.STORAGE_URL}/storage/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STORAGE_SECRET}`,
    },
    body: formData,
  });

  const uploadResult = await body.json();

  if (!uploadResult.success) throw new Error("File upload failed");

  return uploadResult.data;
};

export const getEventGallery = async (eventId, page = 1, limit = 20) => {
  return EventGallery.find({
    event: eventId,
    visibilityScope: "event",
    privacy: "public",
    approvalStatus: "approved",
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "name avatar");
};

export const getUserGallery = async (viewerId, ownerId, page = 1, limit = 20) => {
  const query = { user: ownerId, visibilityScope: { $in: ["profile", "event"] } };

  if (!viewerId || viewerId.toString() !== ownerId.toString()) {
    query.privacy = "public";
    query.approvalStatus = "approved";
  }

  return EventGallery.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getVault = async (userId, page = 1, limit = 20) => {
  return EventGallery.find({ user: userId, visibilityScope: "vault" })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getPendingEventGallery = async (eventId) => {
  return EventGallery.find({
    event: eventId,
    visibilityScope: "event",
    approvalStatus: "pending",
  })
    .sort({ createdAt: -1 })
    .populate("user", "name avatar");
};

export const approveGalleryItem = async (galleryId, approverId) => {
  return EventGallery.findByIdAndUpdate(
    galleryId,
    { approvalStatus: "approved", approvedBy: approverId, approvedAt: new Date() },
    { new: true }
  );
};

export const rejectGalleryItem = async (galleryId, approverId, reason = null) => {
  return EventGallery.findByIdAndUpdate(
    galleryId,
    { approvalStatus: "rejected", approvedBy: approverId, approvedAt: new Date(), rejectionReason: reason },
    { new: true }
  );
};

export const deleteGalleryItemWithStorage = async (galleryId, userId, isAdmin = false) => {
  const item = await EventGallery.findById(galleryId);
  if (!item) throw new Error("Gallery item not found");
  if (!isAdmin && item.user.toString() !== userId.toString()) throw new Error("Unauthorized");

  if (item.storage?.projectName && item.storage?.path) {
    const encodedPath = encodeURIComponent(item.storage.path);
    await request(`${process.env.STORAGE_URL}/storage?projectName=${item.storage.projectName}&path=${encodedPath}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${process.env.STORAGE_SECRET}` },
    });
  }

  await item.deleteOne();
  return true;
};
