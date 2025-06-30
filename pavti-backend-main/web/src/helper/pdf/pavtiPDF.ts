import * as fs from "fs";
import moment from "moment";
import PDFDocument from "pdfkit";
import { generateQRCode } from "../generateQRCode";
import toWords from "../toWords";

export const pavtiPDF = async ({ fileName, pavtiData }) => {
  const numWithoutComma = pavtiData["Amount"].replace(/,/g, "");
  const parsedNum = parseFloat(numWithoutComma);
  let words = toWords.convert(parsedNum, {
    currency: true,
  });
  const stream = fs.createWriteStream(`${fileName}.pdf`);

  const doc = new PDFDocument({
    size: [532, 350],
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
  // doc.font("./shruti.ttf");

  function drawCell(x, y, width, height, text, textAlign) {
    doc.rect(x, y, width, height).stroke();
    doc.text(text, x + 5, y + 5, {
      width: width - 10,
      align: textAlign || "left",
    });
  }

  doc.image(__dirname + "/kundal.png", 14, 10, { width: 502, height: 80 });

  drawCell(15, 100, 500, 25, `E-Receipt No.`, "left");

  doc.font("Helvetica");
  doc.text(`${pavtiData["VCH No"] || " "}`, 98, 105, {
    width: 85,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`SMK ID: `, 225, 105, {
    width: 50,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["SMK id"] || " "} `, 275, 105, {
    width: 70,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Date:`, 400, 105, {
    width: 45,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["Date"] || " "}`, 430, 105, {
    width: 70,
    align: "left",
  });
  doc.font("Helvetica-Bold");

  drawCell(15, 125, 430, 25, `Particulars`, "center");

  drawCell(445, 125, 70, 25, `Amount`, "center");

  drawCell(15, 150, 430, 115, ``, "left");

  doc.font("Helvetica-Bold");
  doc.text(`Name`, 20, 160, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Donor Name"] || " "}`, 110, 160, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Present City`, 20, 175, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Present City"] || " "}`, 110, 175, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Mob No.`, 20, 190, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Mobile Number"] || " "}`, 110, 190, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Rec. Mode`, 20, 205, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Rcpt Mode"] || " "}`, 110, 205, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`A/c Name`, 20, 220, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Ledger Name"] || " "}`, 110, 220, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Head: `, 295, 220, {
    width: 45,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["SubHead"] || " "} `, 340, 220, {
    width: 250,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Nimit`, 20, 235, {
    width: 105,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`: ${pavtiData["Nimit"] || " "}`, 110, 235, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Hastak: `, 190, 235, {
    width: 45,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["Hastak Name"] || " "} `, 235, 235, {
    width: 70,
    align: "left",
  });

  doc.font("Helvetica-Bold");
  doc.text(`Prasad: `, 295, 235, {
    width: 45,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["Prasad Status"] || " "} `, 345, 235, {
    width: 30,
    align: "left",
  });

  /*doc.font("Helvetica-Bold");
  doc.text(`Tiffin: `, 405, 235, {
    width: 45,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(`${pavtiData["Tiffin Status"]} `, 450, 235, {
    width: 250,
    align: "left",
  });*/
  doc.font("Helvetica-Bold");
  doc.text(`Rasoi By`, 20, 250, {
    width: 105,
    align: "left",
  });

  doc.font("./shruti.ttf");
  doc.text(`: ${pavtiData["Rasoi By"] || " "}`, 110, 247, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica");
  doc.text(
    pavtiData["Rasoi By"] ? `( ${pavtiData["Remarks"] || " "} )` : " ",
    110 +
      (pavtiData["Rasoi By"] && pavtiData["Rasoi By"].length > 0
        ? (pavtiData["Rasoi By"].length + 1) * 6.25
        : 0),
    250,
    {
      width: 300,
      align: "left",
    }
  );

  doc.font("Helvetica");

  drawCell(445, 150, 70, 115, `${pavtiData["Amount"] || " "}`, "right");

  doc.font("Helvetica-Bold");
  drawCell(15, 265, 430, 25, `Rs.(In Words) :`, "left");
  doc.font("Helvetica");
  doc.text(`${words}`, 105, 270, {
    align: "left",
  });
  drawCell(445, 265, 70, 25, `${pavtiData["Amount"] || " "}`, "right");

  drawCell(
    63,
    290,
    452,
    48,
    `Note :- ${pavtiData["Narration"] || " "}`,
    "left"
  );
  doc.font("Helvetica");
  doc.text(`Rasoi Date :- ${pavtiData["RasoiDate"] || " "}`, 68, 310, {
    align: "left",
  });
  doc.font("Helvetica-Bold");
  // doc.text(`${pavtiData["Entered by"]}`, 475, 315, {
  doc.text("System generated", 405, 315, {
    width: 300,
    align: "left",
  });

  doc.font("Helvetica");
  doc.fontSize(8);
  doc.text(`${pavtiData["Time"] || " "}`, 63, 330, {
    width: 450,
    align: "right",
  });

  drawCell(15, 290, 48, 48, ` `, "left");

  const qrData = `Date: ${pavtiData["Date"] || " "} Rec.No.: ${
    pavtiData["VCH No"] || " "
  } SMK: ${pavtiData["SMK id"] || " "} Donor Name: ${
    pavtiData["Donor Name"] || " "
  } Mob No.: ${pavtiData["Mobile Number"] || " "} Amount: ${
    pavtiData["Amount"] || " "
  } Prasad Status: ${pavtiData["Prasad Status"] || " "}`;

  await generateQRCode(qrData)
    .then((qrCodeBuffer) => {
      doc.image(qrCodeBuffer, 15.5, 290.5, { width: 47 });
      doc.end();
    })
    .catch((error) => {
      console.error(error);
    });

  // Notify once the PDF is generated
  await new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log("PDF created successfully");
      resolve(true);
    });
  });
};
