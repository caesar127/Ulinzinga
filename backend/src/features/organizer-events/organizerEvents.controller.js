import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  uploadEventBanner,
  uploadEventLogo,
  deleteEvent,
} from "./organizerEvents.service.js";

export const create = async (req, res) => {
  try {
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");
    console.log(organizerToken)
    console.log(req.body);
    const {
      title,
      description,
      slug,
      venue_name,
      venue_address,
      location,
      start_date,
      end_date,
      start_time,
      end_time,
      timezone,
      terms_text,
      balance_ref,
      isActive,
      color,
      package_data,
      category,
      capacity,
      isVisible,
      isDraft,
    } = req.body;

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    if (!title || !description || !venue_name || !location || !start_date) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: title, description, venue_name, location, start_date",
      });
    }

    const eventData = {
      title,
      description,
      slug,
      venue_name,
      venue_address,
      location,
      start_date,
      end_date,
      start_time,
      end_time,
      timezone: timezone || "UTC",
      terms_text,
      balance_ref,
      isActive: isActive !== undefined ? (isActive ? "1" : "0") : "1",
      color: color || "",
      package: package_data || {},
      category: category || "other",
      capacity: capacity || null,
      isVisible: isVisible !== undefined ? isVisible : true,
      organizerId: organizerToken,
      banner: req.files?.banner?.[0] || null,
      logo: req.files?.logo?.[0] || null,
      isDraft: isDraft || false,
    };

    const result = await createEvent(eventData);

    res.status(201).json({
      success: true,
      message: isDraft ? "Event draft saved successfully" : "Event created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const list = async (req, res) => {
  try {
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");
    const queryParams = req.query;

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    const result = await getEvents(organizerToken, queryParams);

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: result.data || result,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load events",
      error: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    const result = await getEvent(id, organizerToken);

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get event",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    const result = await updateEvent({
      ...eventData,
      eventId: id,
      organizer: organizerToken,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner file is required",
      });
    }

    const result = await uploadEventBanner({
      eventId: id,
      organizer: organizerToken,
      file: req.file,
    });

    res.status(200).json({
      success: true,
      message: "Banner uploaded successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload event banner",
      error: error.message,
    });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Logo file is required",
      });
    }

    const result = await uploadEventLogo({
      eventId: id,
      organizer: organizerToken,
      file: req.file,
    });

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload event logo",
      error: error.message,
    });
  }
};

export const deleteOrganizerEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!organizerToken) {
      return res.status(400).json({
        success: false,
        message: "Organizer token is required",
      });
    }

    const result = await deleteEvent({
      eventId: id,
      organizer: organizerToken,
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};
