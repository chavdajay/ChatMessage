import * as fs from "fs";
import extractImagesFromPdf from "../helper/extractImagesFromPdf";

export class PDFService {
  public static async generateAndExtractPDFImage({
    generator,
    data,
    fileName,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generator: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    fileName: string;
  }) {
    const inputPdfFile = `${fileName}.pdf`;
    const outputPrefix = fileName;

    await generator({
      fileName,
      pavtiData: data,
      statementData: data,
    });

    await extractImagesFromPdf(inputPdfFile, outputPrefix, { pngFile: true });

    return {
      imagePath: `${outputPrefix}-1.png`,
      pdfPath: inputPdfFile,
    };
  }

  public static cleanupFiles(imagePath: string, pdfPath: string): void {
    fs.unlinkSync(imagePath);
    fs.unlinkSync(pdfPath);
  }
}
