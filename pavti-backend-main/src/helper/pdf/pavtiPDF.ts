// import * as path from "path";
// import * as fs from "fs";
// import PDFDocument from "pdfkit";
// import { generateQRCode } from "../generateQRCode";
// import toWords from "../toWords";

// const imgPath = {
//   "SHRI HARI SATSANG SEVA TRUST": "kundal_seva_trust.png",
//   "SHRI SWAMINARAYAN MANDIR KUNDALDHAM": "kundal_trust.png",
//   "Shri Swaminarayan Mandir Karelibaug Vadodara": "vadodara.png",
  
// };

// export const pavtiPDF = async ({ fileName, pavtiData }) => {
//   const numWithoutComma = pavtiData["Amount"].replace(/,/g, "");
//   const parsedNum = parseFloat(numWithoutComma);
//   const words = toWords.convert(parsedNum, {
//     currency: true,
//   });
//   const stream = fs.createWriteStream(`${fileName}.pdf`);

//   const doc = new PDFDocument({
//     size: [502, 307],
//     margin: 0,
//     info: {
//       Title: "Expense Report",
//       Author: "<NAME>",
//       Subject: "Report of pavtiData",
//       Keywords: "expense report",
//       Creator: "<NAME>",
//     },
//     bufferPages: true,
//   });
//   doc.pipe(stream);

//   doc.fillColor("black");
//   doc.font("Helvetica-Bold");
//   // doc.font("./shruti.ttf");

//   function drawCell(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     text: string,
//     textAlign?: "left" | "center" | "right" | "justify"
//   ) {
//     doc.rect(x, y, width, height).stroke();
//     doc.text(text, x + 5, y + 5, {
//       width: width - 10,
//       align: textAlign || "left",
//     });
//   }

//   const imagePath = path.join(
//     __dirname,
//     "assets",
//     imgPath[pavtiData["CompanyName"].split("-")[0]]
//   );
//   doc.image(imagePath, 0, 0, { width: 502, height: 80 });

//   drawCell(1, 83, 500, 20, `Receipt No.`, "left");

//   doc.font("Helvetica");
//   doc.text(`${pavtiData["VCH No"]}`, 84, 88, {
//     width: 100,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`ID: `, 211, 88, {
//     width: 50,
//     align: "right",
//   });

//   doc.font("Helvetica");
//   doc.text(`${pavtiData["SMK id"]} `, 261, 88, {
//     width: 70,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Date:`, 386, 88, {
//     width: 45,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`${pavtiData["Date"]}`, 426, 88, {
//     width: 70,
//     align: "left",
//   });
//   doc.font("Helvetica-Bold");

//   drawCell(1, 103, 430, 20, `Particulars`, "center");

//   drawCell(431, 103, 70, 20, `Amount`, "center");

//   drawCell(1, 123, 430, 115, ``, "left");

//   doc.font("Helvetica-Bold");
//   doc.text(`Name`, 6, 128, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Donor Name"]}`, 96, 128, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Present City`, 6, 143, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Present City"]}`, 96, 143, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Mob No.`, 6, 158, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Mobile Number"]}`, 96, 158, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Rec. Mode`, 6, 173, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Rcpt Mode"]}`, 96, 173, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`A/c Name`, 6, 188, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Ledger Name"]}`, 96, 188, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Head: `, 330, 188, {
//     width: 45,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`${pavtiData["SubHead"]} `, 365, 188, {
//     width: 250,
//     align: "left",
//   });

//   doc.font("Helvetica-Bold");
//   doc.text(`Nimit`, 6, 203, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(`: ${pavtiData["Nimit"]}`, 96, 203, {
//     width: 300,
//     align: "left",
//   });

//   // doc.font("Helvetica-Bold");
//   // doc.text(`Hastak: `, 225, 203, {
//   //   width: 45,
//   //   align: "left",
//   // });

//   // doc.font("Helvetica");
//   // doc.text(`${pavtiData["Hastak Name"] || "-"} `, 270, 203, {
//   //   width: 70,
//   //   align: "left",
//   // });

//   // doc.font("Helvetica-Bold");
//   // doc.text(`Prasad: `, 330, 203, {
//   //   width: 45,
//   //   align: "left",
//   // });

//   // doc.font("Helvetica");
//   // doc.text(`${pavtiData["Prasad Status"] || "-"} `, 380, 203, {
//   //   width: 30,
//   //   align: "left",
//   // });

//   // doc.font("Helvetica-Bold");
//   // doc.text(`Tiffin: `, 405, 203, {
//   //   width: 45,
//   //   align: "left",
//   // });

//   // doc.font("Helvetica");
//   // doc.text(`${pavtiData["Tiffin Status"] || "-"} `, 440, 203, {
//   //   width: 250,
//   //   align: "left",
//   // });

//   doc.font("Helvetica-Bold");
//   doc.text(`Rasoi By`, 6, 218, {
//     width: 88,
//     align: "left",
//   });

//   doc.font("./shruti.ttf");
//   doc.text(`:${pavtiData["Rasoi By"]} `, 96, 215, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.text(
//     ` ( ${pavtiData["Remarks"]} ) `,
//     96 + pavtiData["Rasoi By"].length * 6.2,
//     218,
//     {
//       width: 300,
//       align: "left",
//     }
//   );

//   doc.font("Helvetica");

//   drawCell(431, 123, 70, 115, `${pavtiData["Amount"]}`, "right");

//   doc.font("Helvetica-Bold");
//   drawCell(1, 238, 430, 20, `Rs.(In Words) :`, "left");
//   doc.font("Helvetica");
//   doc.text(`${words}`, 96, 243, {
//     align: "left",
//   });
//   drawCell(431, 238, 70, 20, `${pavtiData["Amount"]}`, "right");

//   drawCell(
//     49,
//     258,
//     452,
//     48,
//     `Note : Rasoi Dt: ${pavtiData["Rasoi Dt"]}`,
//     "left"
//   );
//   // drawCell(49, 258, 452, 48, `Note :- ${pavtiData["Narration"]}`, "left");

//   doc.font("Helvetica-Bold");
//   doc.text(`${pavtiData["Entered by"]}`, 475, 283, {
//     width: 300,
//     align: "left",
//   });

//   doc.font("Helvetica");
//   doc.fontSize(8);
//   doc.text(`${pavtiData["Time"]}`, 49, 297, {
//     width: 450,
//     align: "right",
//   });

//   drawCell(1, 258, 48, 48, ` `, "left");

//   const qrData = `Date: ${pavtiData["Date"]} Rec.No.: ${pavtiData["VCH No"]} SMK: ${pavtiData["SMK id"]} Donor Name: ${pavtiData["Donor Name"]} Mob No.: ${pavtiData["Mobile Number"]} Amount: ${pavtiData["Amount"]} Prasad Status: ${pavtiData["Prasad Status"]}`;

//   await generateQRCode(qrData)
//     .then((qrCodeBuffer) => {
//       doc.image(qrCodeBuffer, 1.5, 258.5, { width: 47 });
//       doc.end();
//     })
//     .catch((error) => {
//       console.error(error);
//     });

//   // Notify once the PDF is generated
//   await new Promise((resolve) => {
//     stream.on("finish", () => {
//       console.log("PDF created successfully");
//       resolve(true);
//     });
//   });
// };


// New Updated Code *********//

import * as path from "path";
import * as fs from "fs";
import PDFDocument from "pdfkit";
import { generateQRCode } from "../generateQRCode";
import toWords from "../toWords";

const imgPath = {
  "SHRI HARI SATSANG SEVA TRUST": "kundal_seva_trust.png",
  "SHRI SWAMINARAYAN MANDIR KUNDALDHAM": "kundal_trust.png",
  "Shri Swaminarayan Mandir Karelibaug Vadodara": "vadodara.png",
} as const;

type PavtiData = {
  [key: string]: string;
};

export const pavtiPDF = async ({
  fileName,
  pavtiData,
}: {
  fileName: string;
  pavtiData: PavtiData;
}) => {
  const numWithoutComma = pavtiData["Amount"].replace(/,/g, "");
  const parsedNum = parseFloat(numWithoutComma);
  const words = toWords.convert(parsedNum, { currency: true });

  const stream = fs.createWriteStream(`${fileName}.pdf`);
  const doc = new PDFDocument({
    size: [502, 307],
    margin: 0,
    info: {
      Title: "Expense Report",
      Author: "<NAME>",
      Subject: "Report of pavtiData",
      Keywords: "expense report",
      Creator: "<NAME>",
    },
    bufferPages: true,
  });

  doc.pipe(stream);
  doc.fillColor("black");
  doc.font("Helvetica-Bold");

  const drawCell = (
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    textAlign: "left" | "center" | "right" | "justify" = "left"
  ) => {
    doc.rect(x, y, width, height).stroke();
    doc.text(text, x + 5, y + 5, {
      width: width - 10,
      align: textAlign,
    });
  };

  const companyKey = pavtiData["CompanyName"].split("-")[0] as keyof typeof imgPath;
  const imagePath = path.join(__dirname, "assets", imgPath[companyKey]);
  doc.image(imagePath, 0, 0, { width: 502, height: 80 });

  drawCell(1, 83, 500, 20, `Receipt No.`, "left");

  doc.font("Helvetica");
  doc.text(`${pavtiData["VCH No"]}`, 84, 88, { width: 100, align: "left" });
  doc.font("Helvetica-Bold").text(`ID: `, 211, 88, { width: 50, align: "right" });
  doc.font("Helvetica").text(`${pavtiData["SMK id"]}`, 261, 88, { width: 70, align: "left" });
  doc.font("Helvetica-Bold").text(`Date:`, 386, 88, { width: 45, align: "left" });
  doc.font("Helvetica").text(`${pavtiData["Date"]}`, 426, 88, { width: 70, align: "left" });

  doc.font("Helvetica-Bold");
  drawCell(1, 103, 430, 20, `Particulars`, "center");
  drawCell(431, 103, 70, 20, `Amount`, "center");
  drawCell(1, 123, 430, 115, ``, "left");

  doc.font("Helvetica-Bold").text(`Name`, 6, 128, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Donor Name"]}`, 96, 128, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`Present City`, 6, 143, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Present City"]}`, 96, 143, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`Mob No.`, 6, 158, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Mobile Number"]}`, 96, 158, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`Rec. Mode`, 6, 173, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Rcpt Mode"]}`, 96, 173, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`A/c Name`, 6, 188, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Ledger Name"]}`, 96, 188, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`Head: `, 330, 188, { width: 45, align: "left" });
  doc.font("Helvetica").text(`${pavtiData["SubHead"]}`, 365, 188, { width: 250, align: "left" });

  doc.font("Helvetica-Bold").text(`Nimit`, 6, 203, { width: 88, align: "left" });
  doc.font("Helvetica").text(`: ${pavtiData["Nimit"]}`, 96, 203, { width: 300, align: "left" });

  doc.font("Helvetica-Bold").text(`Rasoi By`, 6, 218, { width: 88, align: "left" });
  doc.font("./shruti.ttf");
  doc.text(`:${pavtiData["Rasoi By"]}`, 96, 215, { width: 300, align: "left" });

  doc.font("Helvetica").text(
    ` ( ${pavtiData["Remarks"]} ) `,
    96 + pavtiData["Rasoi By"].length * 6.2,
    218,
    { width: 300, align: "left" }
  );

  doc.font("Helvetica");
  drawCell(431, 123, 70, 115, `${pavtiData["Amount"]}`, "right");

  doc.font("Helvetica-Bold");
  drawCell(1, 238, 430, 20, `Rs.(In Words) :`, "left");
  doc.font("Helvetica").text(`${words}`, 96, 243, { align: "left" });
  drawCell(431, 238, 70, 20, `${pavtiData["Amount"]}`, "right");

  drawCell(49, 258, 452, 48, `Note : Rasoi Dt: ${pavtiData["Rasoi Dt"]}`, "left");
  doc.font("Helvetica-Bold").text(`${pavtiData["Entered by"]}`, 475, 283, { width: 300, align: "left" });
  doc.font("Helvetica").fontSize(8).text(`${pavtiData["Time"]}`, 49, 297, { width: 450, align: "right" });
  drawCell(1, 258, 48, 48, ` `, "left");

  const qrData = `Date: ${pavtiData["Date"]} Rec.No.: ${pavtiData["VCH No"]} SMK: ${pavtiData["SMK id"]} Donor Name: ${pavtiData["Donor Name"]} Mob No.: ${pavtiData["Mobile Number"]} Amount: ${pavtiData["Amount"]} Prasad Status: ${pavtiData["Prasad Status"]}`;

  try {
    const qrCodeBuffer = await generateQRCode(qrData);
    doc.image(qrCodeBuffer, 1.5, 258.5, { width: 47 });
    doc.end();
  } catch (err) {
    console.error("QR Code generation failed:", err);
    doc.end();
  }

  await new Promise((resolve) => {
    stream.on("finish", () => {
      console.log("PDF created successfully");
      resolve(true);
    });
  });
};
