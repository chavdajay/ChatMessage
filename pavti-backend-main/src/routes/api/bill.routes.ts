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

    const messageId = await whatsappService.sendMedia(chatId, imagePath);
    await saveMessage(
      new Message({
        messageId,
        message: "Bill PDF",
        mobileNumber: parseInt(contactNo),
        senderName: data["Donor Name"],
        isReceived: false,
        isSend: true,
        isDelivered: false,
        isSeen: false,
        hasAttachment: true,
        sendedAt: new Date(),
        userId: user._id.toString(),
      })
    );

    PDFService.cleanupFiles(imagePath, pdfPath);
    res.status(200).json({ message: "Bill sent successfully" });
  } catch (error) {
    console.error("Bill error:", error);
    res.status(500).json({ error: "Failed to send bill" });
  }
});

export default router;
