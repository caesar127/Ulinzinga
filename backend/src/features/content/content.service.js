import mongoose from "mongoose";
import Event from "../events/events.model.js";
import Ticket from "../tickets/tickets.model.js";
import AppError from "../../core/error/AppError.js";
import Content from "./content.model.js";
import { request, FormData, File } from "undici";

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeEmail = (email) => (email || "").toLowerCase().trim();

export const verifyUserTicketForEvent = async (userEmail, eventIdentifier) => {
  if (!userEmail)
    throw new AppError("User email is required to verify event tickets", 400);

  if (!eventIdentifier)
    throw new AppError("Event ID or slug is required", 400);

  const event = await Event.findOne({ slug: eventIdentifier }).select(
    "eventId slug title"
  );

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

  return { event, hasTicket: true };
};

export const createContentItem = async ({
  userId,
  eventId = null,
  medias,
  caption = null,
  visibilityScope,
  privacy = "public",
}) => {
  return Content.create({
    user: userId,
    event: eventId,
    medias,
    caption,
    visibilityScope,
    privacy,
  });
};

export const uploadToStorage = async (fileBuffer, filename, mimetype) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniquePath = `content/${timestamp}-${randomString}-${filename}`;

  const formData = new FormData();
  formData.append("file", new File([fileBuffer], filename, { type: mimetype }));
  formData.append("projectName", "ulinzinga");
  formData.append("path", uniquePath);

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

export const getEventContent = async (eventId, page = 1, limit = 20) => {
  return Content.find({
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

export const getUserContent = async (
  viewerId,
  ownerId,
  page = 1,
  limit = 20
) => {
  const query = {
    user: ownerId,
    visibilityScope: { $in: ["profile", "event"] },
  };

  if (!viewerId || viewerId.toString() !== ownerId.toString()) {
    query.privacy = "public";
    query.approvalStatus = "approved";
  }

  return Content.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getVault = async (userId, page = 1, limit = 20) => {
  return Content.find({
    user: userId,
    visibilityScope: "vault",
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getPendingEventContent = async (eventId) => {
  return Content.find({
    event: eventId,
    visibilityScope: "event",
    approvalStatus: "pending",
  })
    .sort({ createdAt: -1 })
    .populate("user", "name avatar");
};

export const approveContentItem = async (contentId, approverId) => {
  return Content.findByIdAndUpdate(
    contentId,
    {
      approvalStatus: "approved",
      approvedBy: approverId,
      approvedAt: new Date(),
    },
    { new: true }
  );
};

export const rejectContentItem = async (
  contentId,
  approverId,
  reason = null
) => {
  return Content.findByIdAndUpdate(
    contentId,
    {
      approvalStatus: "rejected",
      approvedBy: approverId,
      approvedAt: new Date(),
      rejectionReason: reason,
    },
    { new: true }
  );
};

export const deleteContentItemWithStorage = async (
  contentId,
  userId,
  isAdmin = false
) => {
  const item = await Content.findById(contentId);
  if (!item) throw new Error("Content item not found");

  if (!isAdmin && item.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  for (const media of item.medias) {
    if (media.storage?.projectName && media.storage?.path) {
      const encodedPath = encodeURIComponent(media.storage.path);
      await request(
        `${process.env.STORAGE_URL}/storage?projectName=${media.storage.projectName}&path=${encodedPath}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.STORAGE_SECRET}`,
          },
        }
      );
    }
  }

  await item.deleteOne();
  return true;
};
