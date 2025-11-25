import {
  getAllEventsService,
  getEventByIdService,
  purchaseTicket,
} from "./events.service.js";

export const getAllEvents = async (req, res) => {
  try {
    const queryParams = req.query;
    const data = await getAllEventsService(queryParams);

    return res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch events",
      error: error.response?.data || error.message,
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
    } = req.body;

    if (!package_id || !name || !email || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
    };

    const result = await purchaseTicket(purchaseData);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Purchase ticket error:", error);
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};
