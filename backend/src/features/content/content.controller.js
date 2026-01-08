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
  fetchUserContentService,
} from "./content.service.js";

export const uploadContent = async (req, res) => {
  try {
    const { visibilityScope, privacy, caption, eventId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one file is required" });
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

    const media = [];
    for (const file of req.files) {
      const uploadData = await uploadToStorage(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      const type = uploadData.mimetype.startsWith("video") ? "video" : "image";

      media.push({
        type,
        url: uploadData.url,
        thumbnailUrl: null, 
        storage: {
          projectName: uploadData.projectName,
          path: uploadData.path,
        },
      });
    }

    const contentItem = await createContentItem({
      userId: req.user.userId || req.user.id,
      eventId: resolvedEventId,
      media,
      caption,
      visibilityScope,
      privacy,
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
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const viewerId = req.user?.id || req.user?.userId;

    const result = await fetchUserContentService(userId, viewerId, page, limit);

    res.json({
      success: true,
      data: result.content,
      pagination: result.pagination,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
