import axios from "axios";
import Ticket from "./tickets.model.js";

const PAYCHANGU_BASE_URL = "https://api.paychangu.com";
const API_KEY = process.env.PAYCHANGU_API_KEY;

const paychanguHeaders = {
  Accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

const paychanguApi = axios.create({
  baseURL: PAYCHANGU_BASE_URL,
  headers: paychanguHeaders,
});

export const listTicketsForEventService = async (eventId) => {
  try {
    const response = await paychanguApi.get(`/events/${eventId}/tickets`);

    if (response.data && response.data.data) {
      await syncTicketsToDatabase(eventId, response.data.data);
    }

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to list tickets for event: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const getTicketDetailsService = async (eventId, ticketId) => {
  try {
    const response = await paychanguApi.get(
      `/events/${eventId}/tickets/${ticketId}`
    );

    if (response.data && response.data.data) {
      await syncSingleTicketToDatabase(eventId, response.data.data);
    }

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get ticket details: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const redeemTicketService = async (
  eventId,
  ticketId,
  staffMember = "System"
) => {
  try {
    const response = await paychanguApi.post(
      `/events/${eventId}/tickets/${ticketId}/redeem`
    );

    await updateTicketRedeemStatus(eventId, ticketId, true, staffMember);

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to redeem ticket: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const unredeemTicketService = async (eventId, ticketId) => {
  try {
    const response = await paychanguApi.post(
      `/events/${eventId}/tickets/${ticketId}/unredeem`
    );

    await updateTicketRedeemStatus(eventId, ticketId, false);

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to unredeem ticket: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const scanQRCodeService = async (uuid) => {
  try {
    const response = await paychanguApi.get(`/events/qrcode/scan/${uuid}`);

    if (response.data && response.data.data) {
      const ticketData = response.data.data;
      await syncSingleTicketToDatabase(
        ticketData.event_id?.toString(),
        ticketData
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to scan QR code: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const getQRCodeService = async (uuid) => {
  try {
    const response = await paychanguApi.get(`/events/qrcode/${uuid}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get QR code: ${error.response?.data?.message || error.message}`
    );
  }
};

const syncTicketsToDatabase = async (eventId, ticketsData) => {
  try {
    const syncResults = [];

    for (const ticketData of ticketsData) {
      try {
        const ticketUpdateData = {
          paychanguEventId: eventId.toString(),
          paychanguTicketId:
            ticketData.id?.toString() || ticketData.ticket_id?.toString(),
          ticketType: ticketData.type || ticketData.ticket_type || "General",
          quantity: ticketData.quantity || 1,
          price: parseFloat(ticketData.price) || 0,
          currency: ticketData.currency || "MWK",
          customerName:
            ticketData.customer_name || ticketData.name || "Unknown",
          customerEmail: ticketData.customer_email || ticketData.email || "",
          customerPhone: ticketData.customer_phone || ticketData.phone || "",
          paymentStatus: ticketData.payment_status || "pending",
          paymentReference:
            ticketData.payment_reference || ticketData.reference || "",
          isRedeemed: ticketData.is_redeemed || false,
          redeemedAt: ticketData.redeemed_at
            ? new Date(ticketData.redeemed_at)
            : undefined,
          redeemedBy: ticketData.redeemed_by || "",
          qrCodeUuid: ticketData.qr_code_uuid || ticketData.uuid || "",
          qrCodeData: ticketData.qr_code_data || ticketData.qr_code || "",
          isGift: ticketData.is_gift || false,
          giftRecipientName: ticketData.gift_recipient_name || "",
          giftRecipientEmail: ticketData.gift_recipient_email || "",
          giftMessage: ticketData.gift_message || "",
          giftedBy: ticketData.gifted_by || "",
          rawPaychanguData: ticketData,
          lastSyncedAt: new Date(),
        };

        if (ticketData.purchase_date) {
          ticketUpdateData.purchaseDate = new Date(ticketData.purchase_date);
        } else if (ticketData.created_at) {
          ticketUpdateData.purchaseDate = new Date(ticketData.created_at);
        }

        const ticket = await Ticket.findOneAndUpdate(
          { paychanguTicketId: ticketUpdateData.paychanguTicketId },
          ticketUpdateData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        syncResults.push({
          ticketId: ticketUpdateData.paychanguTicketId,
          status: "success",
          action: "upserted",
          data: ticket,
        });
      } catch (ticketError) {
        syncResults.push({
          ticketId: ticketData.id || "unknown",
          status: "error",
          action: "sync_failed",
          error: ticketError.message,
        });
      }
    }

    return {
      success: true,
      totalTickets: ticketsData.length,
      successfulSyncs: syncResults.filter((r) => r.status === "success").length,
      failedSyncs: syncResults.filter((r) => r.status === "error").length,
      results: syncResults,
    };
  } catch (error) {
    throw new Error(`Failed to sync tickets to database: ${error.message}`);
  }
};

const syncSingleTicketToDatabase = async (eventId, ticketData) => {
  try {
    const ticketUpdateData = {
      paychanguEventId: eventId.toString(),
      paychanguTicketId:
        ticketData.id?.toString() || ticketData.ticket_id?.toString(),
      ticketType: ticketData.type || ticketData.ticket_type || "General",
      quantity: ticketData.quantity || 1,
      price: parseFloat(ticketData.price) || 0,
      currency: ticketData.currency || "MWK",
      customerName: ticketData.customer_name || ticketData.name || "Unknown",
      customerEmail: ticketData.customer_email || ticketData.email || "",
      customerPhone: ticketData.customer_phone || ticketData.phone || "",
      paymentStatus: ticketData.payment_status || "pending",
      paymentReference:
        ticketData.payment_reference || ticketData.reference || "",
      isRedeemed: ticketData.is_redeemed || false,
      redeemedAt: ticketData.redeemed_at
        ? new Date(ticketData.redeemed_at)
        : undefined,
      redeemedBy: ticketData.redeemed_by || "",
      qrCodeUuid: ticketData.qr_code_uuid || ticketData.uuid || "",
      qrCodeData: ticketData.qr_code_data || ticketData.qr_code || "",
      isGift: ticketData.is_gift || false,
      giftRecipientName: ticketData.gift_recipient_name || "",
      giftRecipientEmail: ticketData.gift_recipient_email || "",
      giftMessage: ticketData.gift_message || "",
      giftedBy: ticketData.gifted_by || "",
      rawPaychanguData: ticketData,
      lastSyncedAt: new Date(),
    };

    if (ticketData.purchase_date) {
      ticketUpdateData.purchaseDate = new Date(ticketData.purchase_date);
    } else if (ticketData.created_at) {
      ticketUpdateData.purchaseDate = new Date(ticketData.created_at);
    }

    const ticket = await Ticket.findOneAndUpdate(
      { paychanguTicketId: ticketUpdateData.paychanguTicketId },
      ticketUpdateData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return ticket;
  } catch (error) {
    throw new Error(
      `Failed to sync single ticket to database: ${error.message}`
    );
  }
};

const updateTicketRedeemStatus = async (
  eventId,
  ticketId,
  isRedeemed,
  staffMember = ""
) => {
  try {
    const ticket = await Ticket.findOne({
      paychanguEventId: eventId.toString(),
      paychanguTicketId: ticketId.toString(),
    });

    if (!ticket) {
      try {
        await getTicketDetailsService(eventId, ticketId);

        return await Ticket.findOne({
          paychanguEventId: eventId.toString(),
          paychanguTicketId: ticketId.toString(),
        });
      } catch {
        throw new Error(
          "Ticket not found in local database and could not be synced"
        );
      }
    }

    if (isRedeemed) {
      await ticket.markAsRedeemed(staffMember);
    } else {
      await ticket.markAsUnredeemed();
    }

    return ticket;
  } catch (error) {
    throw new Error(`Failed to update ticket redeem status: ${error.message}`);
  }
};

export const getLocalTicketsService = async (eventId, filters = {}) => {
  try {
    let query = { paychanguEventId: eventId.toString() };

    if (filters.isRedeemed !== undefined) {
      query.isRedeemed = filters.isRedeemed;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    if (filters.customerEmail) {
      query.customerEmail = new RegExp(filters.customerEmail, "i");
    }

    if (filters.search) {
      query.$or = [
        { customerName: new RegExp(filters.search, "i") },
        { customerEmail: new RegExp(filters.search, "i") },
        { paymentReference: new RegExp(filters.search, "i") },
      ];
    }

    const tickets = await Ticket.find(query).sort({ purchaseDate: -1 });
    return tickets;
  } catch (error) {
    throw new Error(`Failed to get local tickets: ${error.message}`);
  }
};

export const getTicketStatisticsService = async (eventId) => {
  try {
    const pipeline = [
      { $match: { paychanguEventId: eventId.toString() } },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$quantity" },
          totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
          paidTickets: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$quantity", 0],
            },
          },
          redeemedTickets: {
            $sum: {
              $cond: [{ $eq: ["$isRedeemed", true] }, "$quantity", 0],
            },
          },
          giftTickets: {
            $sum: {
              $cond: [{ $eq: ["$isGift", true] }, "$quantity", 0],
            },
          },
        },
      },
    ];

    const result = await Ticket.aggregate(pipeline);
    return (
      result[0] || {
        totalTickets: 0,
        totalRevenue: 0,
        paidTickets: 0,
        redeemedTickets: 0,
        giftTickets: 0,
      }
    );
  } catch (error) {
    throw new Error(`Failed to get ticket statistics: ${error.message}`);
  }
};
