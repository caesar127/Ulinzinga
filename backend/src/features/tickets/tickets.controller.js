import {
  listTicketsForEventService,
  getTicketDetailsService,
  redeemTicketService,
  unredeemTicketService,
  scanQRCodeService,
  getQRCodeService,
  getLocalTicketsService,
  getTicketStatisticsService,
} from "./tickets.service.js";

export const listTicketsForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { sync, ...filters } = req.query;

    if (sync === "true") {
      const data = await listTicketsForEventService(eventId);
      return res.status(200).json({
        status: "success",
        message: "Tickets fetched and synced successfully",
        data: data.data || data,
      });
    }

    const localTickets = await getLocalTicketsService(eventId, filters);

    return res.status(200).json({
      status: "success",
      message: "Tickets fetched successfully",
      data: localTickets,
      count: localTickets.length,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

export const getTicketDetails = async (req, res) => {
  try {
    const { id: eventId, ticketId } = req.params;
    const { sync } = req.query;

    if (sync === "true") {
      const data = await getTicketDetailsService(eventId, ticketId);
      return res.status(200).json({
        status: "success",
        message: "Ticket details fetched successfully",
        data: data.data || data,
      });
    }

    const tickets = await getLocalTicketsService(eventId, { ticketId });
    const ticket = tickets.find((t) => t.paychanguTicketId === ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Ticket details fetched successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch ticket details",
      error: error.message,
    });
  }
};

export const redeemTicket = async (req, res) => {
  try {
    const { id: eventId, ticketId } = req.params;
    const staffMember = req.user?.email || req.body.staffMember || "System";

    const result = await redeemTicketService(eventId, ticketId, staffMember);

    return res.status(200).json({
      status: "success",
      message: "Ticket redeemed successfully",
      data: result.data || result,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.message.includes("already been redeemed")
      ? "Ticket has already been redeemed"
      : "Failed to redeem ticket";

    return res.status(status).json({
      status: "error",
      message,
      error: error.message,
    });
  }
};

export const unredeemTicket = async (req, res) => {
  try {
    const { id: eventId, ticketId } = req.params;

    const result = await unredeemTicketService(eventId, ticketId);

    return res.status(200).json({
      status: "success",
      message: "Ticket unredeemed successfully",
      data: result.data || result,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to unredeem ticket",
      error: error.message,
    });
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const { uuid } = req.params;

    const result = await scanQRCodeService(uuid);

    return res.status(200).json({
      status: "success",
      message: "QR code scanned successfully",
      data: result.data || result,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to scan QR code",
      error: error.message,
    });
  }
};

export const getQRCode = async (req, res) => {
  try {
    const { uuid } = req.params;

    const result = await getQRCodeService(uuid);

    return res.status(200).json({
      status: "success",
      message: "QR code data fetched successfully",
      data: result.data || result,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch QR code data",
      error: error.message,
    });
  }
};

export const getTicketStatistics = async (req, res) => {
  try {
    const { id: eventId } = req.params;

    const statistics = await getTicketStatisticsService(eventId);

    return res.status(200).json({
      status: "success",
      message: "Ticket statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch ticket statistics",
      error: error.message,
    });
  }
};

export const bulkSyncTickets = async (req, res) => {
  try {
    const { id: eventId } = req.params;

    const data = await listTicketsForEventService(eventId);

    return res.status(200).json({
      status: "success",
      message: "Tickets synced successfully",
      data: data.data || data,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to sync tickets",
      error: error.message,
    });
  }
};

export const getFilteredTickets = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const {
      isRedeemed,
      paymentStatus,
      customerEmail,
      search,
      ticketType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50,
    } = req.query;

    const filters = {};

    if (isRedeemed !== undefined) {
      filters.isRedeemed = isRedeemed === "true";
    }

    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
    }

    if (customerEmail) {
      filters.customerEmail = customerEmail;
    }

    if (search) {
      filters.search = search;
    }

    if (ticketType) {
      filters.ticketType = ticketType;
    }

    if (dateFrom || dateTo) {
      filters.dateRange = {};
      if (dateFrom) {
        filters.dateRange.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filters.dateRange.$lte = new Date(dateTo);
      }
    }

    let tickets = await getLocalTicketsService(eventId, filters);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedTickets = tickets.slice(startIndex, endIndex);

    return res.status(200).json({
      status: "success",
      message: "Filtered tickets fetched successfully",
      data: paginatedTickets,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(tickets.length / limitNum),
        totalCount: tickets.length,
        limit: limitNum,
        hasNextPage: endIndex < tickets.length,
        hasPrevPage: startIndex > 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch filtered tickets",
      error: error.message,
    });
  }
};

export const exportTickets = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { format = "json", ...filters } = req.query;

    const tickets = await getLocalTicketsService(eventId, filters);

    if (format === "csv") {
      const csvHeader =
        "Ticket ID,Customer Name,Customer Email,Type,Quantity,Price,Currency,Payment Status,Is Redeemed,Purchase Date\n";
      const csvRows = tickets
        .map(
          (ticket) =>
            `${ticket.paychanguTicketId},${ticket.customerName},${
              ticket.customerEmail
            },${ticket.ticketType},${ticket.quantity},${ticket.price},${
              ticket.currency
            },${ticket.paymentStatus},${ticket.isRedeemed},${
              ticket.purchaseDate?.toISOString() || ""
            }`
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="tickets-${eventId}.csv"`
      );
      return res.send(csvHeader + csvRows);
    }

    return res.status(200).json({
      status: "success",
      message: "Tickets exported successfully",
      data: tickets,
      exportInfo: {
        format,
        totalRecords: tickets.length,
        exportedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to export tickets",
      error: error.message,
    });
  }
};
