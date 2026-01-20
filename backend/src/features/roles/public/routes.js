import express from "express";
import eventsRoutes from "../../events/events.routes.js";
import categoryRoutes from "../../category/category.routes.js";
import qrcodeRoutes from "../../tickets/qrcode.routes.js";
import searchRoutes from "../../search/search.routes.js";
import contentRoutes from "../../content/content.routes.js";

const router = express.Router();

router.use("/events", eventsRoutes);
router.use("/categories", categoryRoutes);
router.use("/qrcode", qrcodeRoutes);
router.use("/search", searchRoutes);
router.use("/content", contentRoutes);

export default router;