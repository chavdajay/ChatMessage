import { Router } from "express";
import { v4 as uuid } from "uuid";
import { WhatsAppService } from "../../services/whatsapp.service";
import { PDFService } from "../../services/pdf.service";
import { pavtiPDF } from "../../helper/pdf/pavtiPDF";
import { getUserByNumber, saveUser, User } from "../../modules/user";
import { Message, saveMessage } from "../../modules/message";

const router = Router();
const whatsappService = WhatsAppService.getInstance();

/**
 * @swagger
 * tags:
 *   - name: Bill
 *     description: Bill management
 */

/**
 * @swagger
 * /api/bill:
 *   post:
 *     summary: Generate and send a bill (Pavti)
 *     description: Generates a bill PDF from the provided data and sends it to the user via WhatsApp.
 *     tags: [Bill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RcptData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bill sent successfully
 *       400:
 *         description: Request body cannot be empty
 *       500:
 *         description: Failed to send bill
 */
router.post("/bill", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const { RcptData: data } = req.body;
    const fileName = uuid();
    const contactNo = data["ISD"].split("+")[1] + data["Mobile Number"];
    const chatId = `${contactNo}@c.us`;

    await whatsappService.waitForClientReady();

    const { imagePath, pdfPath } = await PDFService.generateAndExtractPDFImage({
      generator: pavtiPDF,
      data,
      fileName,
    });

    let user = await getUserByNumber(contactNo);
    if (!user) {
      user = await saveUser(
        new User({
          fullName: data["Donor Name"],
          email: "",
          contactNo,
          isApprove: "approved",
          isActive: true,
          isTempName: false,
        })
      );
    }

    // 🟡 TRY TO SEND WHATSAPP
    let isError = false;
    let messageId = null;

    try {
      messageId = await whatsappService.sendMedia(chatId, imagePath);
    } catch (sendErr) {
      console.error("Failed to send pavti via WhatsApp:", sendErr);
      isError = true;
    }

    // ✅ Save the message either way
    await saveMessage(
      new Message({
        messageId: messageId || "error-" + Date.now(),
        message: "Bill PDF",
        mobileNumber: parseInt(contactNo),
        senderName: data["Donor Name"],
        isReceived: false,
        isSend: true,
        isDelivered: false,
        isSeen: false,
        hasAttachment: true,
        isPavti: true,
        isError, // 👈 Add your new flag here
        sendedAt: new Date(),
        userId: user._id.toString(),
      })
    );

    PDFService.cleanupFiles(imagePath, pdfPath);

    if (isError) {
      return res
        .status(500)
        .json({ success: false, message: "Pavti saved but failed to send." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Pavti sent successfully." });
  } catch (err) {
    console.error("Bill error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

export default router;
