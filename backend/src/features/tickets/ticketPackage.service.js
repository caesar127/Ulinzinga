import axios from "axios";
import TicketPackage from "./ticketPackage.model.js";

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

export const syncTicketPackagesForEvent = async (eventId, eventSlug) => {
  try {
    // Fetch packages from PayChangu
    const response = await paychanguApi.get(`/events/${eventSlug}/packages`);

    if (response.data && response.data.data) {
      await syncPackagesToDatabase(eventId, response.data.data);
    }

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to sync ticket packages for event: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

const syncPackagesToDatabase = async (eventId, packagesData) => {
  try {
    const syncResults = [];

    for (const packageData of packagesData) {
      try {
        const packageUpdateData = {
          eventId: eventId.toString(),
          packageId: packageData.id?.toString() || packageData.package_id?.toString(),
          name: packageData.name || packageData.title || "Unnamed Package",
          description: packageData.description || null,
          price: parseFloat(packageData.price) || 0,
          currency: packageData.currency || "MWK",
          totalQuantity: parseInt(packageData.quantity) || parseInt(packageData.total_quantity) || 0,
          availableQuantity: parseInt(packageData.available_quantity) || parseInt(packageData.quantity) || 0,
          isActive: packageData.is_active !== false,
          lastSyncedAt: new Date(),
          rawPaychanguData: packageData,
        };

        const ticketPackage = await TicketPackage.findOneAndUpdate(
          { eventId: eventId.toString(), packageId: packageUpdateData.packageId },
          packageUpdateData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        syncResults.push({
          packageId: packageUpdateData.packageId,
          status: "success",
          action: "upserted",
          data: ticketPackage,
        });
      } catch (packageError) {
        syncResults.push({
          packageId: packageData.id || "unknown",
          status: "error",
          action: "sync_failed",
          error: packageError.message,
        });
      }
    }

    return {
      success: true,
      totalPackages: packagesData.length,
      successfulSyncs: syncResults.filter((r) => r.status === "success").length,
      failedSyncs: syncResults.filter((r) => r.status === "error").length,
      results: syncResults,
    };
  } catch (error) {
    throw new Error(`Failed to sync packages to database: ${error.message}`);
  }
};

export const getTicketPackageById = async (eventId, packageId) => {
  try {
    const ticketPackage = await TicketPackage.findOne({
      eventId: eventId.toString(),
      packageId: packageId.toString(),
    });

    if (!ticketPackage) {
      throw new Error("Ticket package not found");
    }

    return ticketPackage;
  } catch (error) {
    throw new Error(`Failed to get ticket package: ${error.message}`);
  }
};

export const getTicketPackagesForEvent = async (eventId) => {
  try {
    const packages = await TicketPackage.find({
      eventId: eventId.toString(),
      isActive: true,
    }).sort({ createdAt: 1 });

    return packages;
  } catch (error) {
    throw new Error(`Failed to get ticket packages for event: ${error.message}`);
  }
};

export const decrementPackageAvailability = async (eventId, packageId, quantity) => {
  try {
    const ticketPackage = await getTicketPackageById(eventId, packageId);
    await ticketPackage.decrementAvailability(quantity);
    return ticketPackage;
  } catch (error) {
    throw new Error(`Failed to decrement package availability: ${error.message}`);
  }
};

export const checkPackageAvailability = async (eventId, packageId, quantity) => {
  try {
    const ticketPackage = await getTicketPackageById(eventId, packageId);

    if (ticketPackage.isSoldOut()) {
      return { available: false, reason: "Package is sold out" };
    }

    if (ticketPackage.availableQuantity < quantity) {
      return {
        available: false,
        reason: `Only ${ticketPackage.availableQuantity} tickets available, requested ${quantity}`
      };
    }

    return { available: true };
  } catch (error) {
    throw new Error(`Failed to check package availability: ${error.message}`);
  }
};