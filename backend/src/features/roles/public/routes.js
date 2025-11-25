import express from "express";
import eventsRoutes from "../../events/events.routes.js";
import categoryRoutes from "../../category/category.routes.js";

const router = express.Router();

router.use("/events", eventsRoutes);
router.use("/categories", categoryRoutes);

export default router;