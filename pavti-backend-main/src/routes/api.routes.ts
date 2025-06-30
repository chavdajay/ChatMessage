import { Router } from "express";
import billRoutes from "./api/bill.routes";
import messageRoutes from "./api/message.routes";
import pdfRoutes from "./api/pdf.routes";
import userRoutes from "./api/user.routes";
import webhookRoutes from "./api/webhook.routes";

const router = Router();

router.use("/", billRoutes);
router.use("/", messageRoutes);
router.use("/", pdfRoutes);
router.use("/", userRoutes);
router.use("/", webhookRoutes);

export default router;
