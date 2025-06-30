// import QRCode from "qrcode";

// export const generateQRCode = async (text) => {
//   try {
//     return await QRCode.toBuffer(text);
//   } catch (error) {
//     throw new Error(`Error generating QR code: ${error.message}`);
//   }
// };


// ** Updated New Code **//


import QRCode from "qrcode";

export const generateQRCode = async (text: string): Promise<Buffer> => {
  try {
    return await QRCode.toBuffer(text);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating QR code: ${error.message}`);
    }
    throw new Error("Unknown error generating QR code");
  }
};
