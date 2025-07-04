import { Router } from "express";
import billRoutes from "./api/bill.routes";
import messageRoutes from "./api/message.routes";
import pdfRoutes from "./api/pdf.routes";
import userRoutes from "./api/user.routes";
import webhookRoutes from "./api/webhook.routes";
import chatList from "./api/chat.route";
import authRoutes from "./api/auth.routes";
import reportRoutes from "./api/report.routes"

const router = Router();

router.use("/", billRoutes);
router.use("/", messageRoutes);
router.use("/", pdfRoutes);
router.use("/", userRoutes);
router.use("/", webhookRoutes);
router.use("/", chatList);
router.use("/", authRoutes);
router.use("/", reportRoutes)

export default router;
