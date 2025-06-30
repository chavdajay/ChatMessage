import { Router } from "express";
import { v4 as uuid } from "uuid";
import { PDFService } from "../../services/pdf.service";
import { statementPDF } from "../../helper/pdf/statementPDF";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: PDF
 *     description: PDF generation
 */

/**
 * @swagger
 * /api/statement:
 *   post:
 *     summary: Generate a statement PDF
 *     description: Generates a statement PDF from the provided data.
 *     tags: [PDF]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *       400:
 *         description: Request body cannot be empty
 *       500:
 *         description: Failed to generate statement PDF
 */
router.post("/statement", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const fileName = uuid();
    const { imagePath, pdfPath } = await PDFService.generateAndExtractPDFImage({
      generator: statementPDF,
      data: req.body,
      fileName,
    });

    PDFService.cleanupFiles(imagePath, pdfPath);
    res.status(200).json({ message: "PDF generated successfully" });
  } catch (error) {
    console.error("Statement PDF error:", error);
    res.status(500).json({ error: "Failed to generate statement PDF" });
  }
});

export default router;
