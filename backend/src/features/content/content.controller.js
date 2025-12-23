import {
  uploadToStorage,
  createContentItem,
  getEventContent,
  getUserContent,
  getVault,
  getPendingEventContent,
  approveContentItem,
  rejectContentItem,
  deleteContentItemWithStorage,
  verifyUserTicketForEvent,
} from "./content.service.js";

export const uploadContent = async (req, res) => {
  try {
    const { visibilityScope, privacy, caption, eventId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    let resolvedEventId = null;

    if (visibilityScope === "event") {
      if (!eventId) {
        return res.status(400).json({
          message: "eventId is required for event content uploads",
        });
      }

      const { hasTicket, event } = await verifyUserTicketForEvent(
        req.user.email,
        eventId
      );

      if (!hasTicket) {
        return res.status(403).json({
          message: "A paid ticket is required to upload for this event",
        });
      }

      resolvedEventId = event._id;
    }

    const uploadData = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const type = uploadData.mimetype.startsWith("video") ? "video" : "image";

    const contentItem = await createContentItem({
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

    res.status(201).json({ success: true, data: contentItem });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const fetchEventContent = async (req, res) => {
  const { eventId } = req.params;
  const { page, limit } = req.query;

  const data = await getEventContent(
    eventId,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );

  res.json({ success: true, data });
};

export const fetchUserContent = async (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;

  const data = await getUserContent(
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

export const fetchPendingContent = async (req, res) => {
  const { eventId } = req.params;

  const data = await getPendingEventContent(eventId);

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

export const approveContent = async (req, res) => {
  const { contentId } = req.params;

  const data = await approveContentItem(contentId, req.user.id);

  res.json({ success: true, data });
};

export const rejectContent = async (req, res) => {
  const { contentId } = req.params;
  const { reason } = req.body;

  const data = await rejectContentItem(contentId, req.user.id, reason);

  res.json({ success: true, data });
};

export const deleteContent = async (req, res) => {
  const { contentId } = req.params;

  await deleteContentItemWithStorage(
    contentId,
    req.user.id,
    req.user.role === "admin"
  );

  res.json({ success: true });
};
