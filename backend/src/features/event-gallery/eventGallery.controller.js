import {
  uploadToStorage,
  createGalleryItem,
  getEventGallery,
  getUserGallery,
  getVault,
  getPendingEventGallery,
  approveGalleryItem,
  rejectGalleryItem,
  deleteGalleryItemWithStorage,
  verifyUserTicketForEvent,
} from "./eventGallery.service.js";

export const uploadGalleryItem = async (req, res) => {
  try {
    const { visibilityScope, privacy, caption, eventId } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    let resolvedEventId = null;
    if (visibilityScope === "event") {
      if (!eventId)
        return res
          .status(400)
          .json({ message: "eventId is required for event gallery uploads" });

      const { hasTicket, event } = await verifyUserTicketForEvent(
        req.user.email,
        eventId
      );

      if (!hasTicket)
        return res
          .status(403)
          .json({ message: "A paid ticket is required to upload for this event" });

      resolvedEventId = event._id;
    }

    const uploadData = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const type = uploadData.mimetype.startsWith("video") ? "video" : "image";

    const galleryItem = await createGalleryItem({
      userId: req.user.userId || req.user.id,
      eventId: resolvedEventId,
      type,
      mediaUrl: uploadData.url,
      caption,
      visibilityScope,
      privacy,
      storage: {
        projectName: uploadData.projectName,
        path: uploadData.path,
      },
    });

    res.status(201).json({ success: true, data: galleryItem });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const fetchEventGallery = async (req, res) => {
  const { eventId } = req.params;
  const { page, limit } = req.query;
  const data = await getEventGallery(
    eventId,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );
  res.json({ success: true, data });
};

export const fetchUserGallery = async (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;
  const data = await getUserGallery(
    req.user?.id,
    userId,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );
  res.json({ success: true, data });
};

export const fetchVault = async (req, res) => {
  const { page, limit } = req.query;
  const data = await getVault(
    req.user.id,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );
  res.json({ success: true, data });
};

export const fetchPendingGallery = async (req, res) => {
  const { eventId } = req.params;
  const data = await getPendingEventGallery(eventId);
  res.json({ success: true, data });
};

export const checkEventUploadAccess = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { hasTicket } = await verifyUserTicketForEvent(
      req.user.email,
      eventId
    );

    res.json({
      success: true,
      hasTicket,
      message: hasTicket
        ? "You are cleared to upload for this event"
        : "A paid ticket is required to post to this event",
    });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const approveGallery = async (req, res) => {
  const { galleryId } = req.params;
  const data = await approveGalleryItem(galleryId, req.user.id);
  res.json({ success: true, data });
};

export const rejectGallery = async (req, res) => {
  const { galleryId } = req.params;
  const { reason } = req.body;
  const data = await rejectGalleryItem(galleryId, req.user.id, reason);
  res.json({ success: true, data });
};

export const deleteGallery = async (req, res) => {
  const { galleryId } = req.params;
  await deleteGalleryItemWithStorage(
    galleryId,
    req.user.id,
    req.user.role === "admin"
  );
  res.json({ success: true });
};
