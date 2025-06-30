import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    return await QRCode.toBuffer(text);
  } catch (error) {
    throw new Error(`Error generating QR code: ${error.message}`);
  }
};
