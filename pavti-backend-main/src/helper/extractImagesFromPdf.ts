import { Poppler } from "node-poppler";

export default async function extractImagesFromPdf(
  file: Buffer | string,
  outputPrefix?: string,
  options?: {
    allFiles?: boolean;
    ccittFile?: boolean;
    firstPageToConvert?: number;
    lastPageToConvert?: number;
    jbig2File?: boolean;
    jpeg2000File?: boolean;
    jpegFile?: boolean;
    list?: boolean;
    ownerPassword?: string;
    pngFile?: boolean;
    printVersionInfo?: boolean;
    tiffFile?: boolean;
    userPassword?: string;
  }
): Promise<string> {
  try {
    const poppler = new Poppler();

    const outputPath = await poppler.pdfToCairo(file, outputPrefix, options);

    return outputPath;
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Error extracting images from PDF: ${error.message}`);
  } else {
    throw new Error(`Unknown error occurred while extracting images from PDF.`);
  }
}
}