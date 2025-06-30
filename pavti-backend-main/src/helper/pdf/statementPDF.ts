// import * as fs from "fs";
// import PDFDocument from "pdfkit";

// export const statementPDF = async ({ fileName, statementData }) => {
//   const stream = fs.createWriteStream(`${fileName}.pdf`);
//   let maxLength = 0;
//   for (const data of statementData) {
//     const tmpLength = Object.keys(data).length;
//     if (tmpLength > maxLength) {
//       maxLength = tmpLength;
//     }
//   }

//   const width = maxLength * 200 + 100;
//   const height = statementData.length * 30 + 500;
//   const doc = new PDFDocument({
//     size: [width, height],
//     margin: 0,
//     info: {
//       Title: "Expense Report",
//       Author: "<NAME>",
//       Subject: "Report of expenses",
//       Keywords: "expense report",
//       Creator: "<NAME>",
//     },
//     bufferPages: true,
//   });

//   doc.pipe(stream);
//   function drawCell(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     text: string
//   ) {
//     doc.rect(x, y, width, height).stroke();
//     doc.text(text, x + 5, y + 5, { width: width - 10, align: "left" });
//   }

//   // Calculate table position
//   const tableTop = 150;
//   const rowHeight = 30;
//   const columnWidth = 200;

//   const keysSet = new Set();
//   for (const obj of statementData) {
//     const keys = Object.keys(obj);
//     keys.forEach((key) => keysSet.add(key));
//   }
//   const columnHeader = Array.from(keysSet);
//   doc.fillColor("black");
//   doc.font("Helvetica-Bold");
//   columnHeader.map((item, index) => {
//     //@ts-ignore
//     drawCell(
//       50 + index * 200,
//       tableTop,
//       columnWidth,
//       rowHeight,
//       item.toString().toLocaleUpperCase()
//     );
//   });

//   doc.font("Helvetica");
//   statementData.map((expense, index1) => {
//     const yPos = tableTop + (index1 + 1) * rowHeight;
//     columnHeader.map((item, index) => {
//       drawCell(
//         50 + index * 200,
//         yPos,
//         columnWidth,
//         rowHeight,
//         //@ts-ignore
//         expense[item] || "-"
//       );
//     });
//   });

//   // Function to draw a cell with border

//   // Finalize the PDF
//   doc.end();

//   // Notify once the PDF is generated
//   stream.on("finish", () => {
//     console.log("PDF created successfully");
//     return true;
//   });
// };


// *** Updated New Code ** //

import * as fs from "fs";
import PDFDocument from "pdfkit";

// Define types for function input
interface StatementDataItem {
  [key: string]: string | number | null | undefined;
}

interface StatementPDFProps {
  fileName: string;
  statementData: StatementDataItem[];
}

export const statementPDF = async ({
  fileName,
  statementData,
}: StatementPDFProps): Promise<void> => {
  const stream = fs.createWriteStream(`${fileName}.pdf`);
  let maxLength = 0;

  for (const data of statementData) {
    const tmpLength = Object.keys(data).length;
    if (tmpLength > maxLength) {
      maxLength = tmpLength;
    }
  }

  const width = maxLength * 200 + 100;
  const height = statementData.length * 30 + 500;

  const doc = new PDFDocument({
    size: [width, height],
    margin: 0,
    info: {
      Title: "Expense Report",
      Author: "<NAME>",
      Subject: "Report of expenses",
      Keywords: "expense report",
      Creator: "<NAME>",
    },
    bufferPages: true,
  });

  doc.pipe(stream);

  function drawCell(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ) {
    doc.rect(x, y, width, height).stroke();
    doc.text(text, x + 5, y + 5, { width: width - 10, align: "left" });
  }

  const tableTop = 150;
  const rowHeight = 30;
  const columnWidth = 200;

  const keysSet = new Set<string>();
  for (const obj of statementData) {
    const keys = Object.keys(obj);
    keys.forEach((key) => keysSet.add(key));
  }
  const columnHeader = Array.from(keysSet);

  doc.fillColor("black");
  doc.font("Helvetica-Bold");

  columnHeader.forEach((item, index) => {
    drawCell(
      50 + index * 200,
      tableTop,
      columnWidth,
      rowHeight,
      item.toLocaleUpperCase()
    );
  });

  doc.font("Helvetica");

  statementData.forEach((expense, index1) => {
    const yPos = tableTop + (index1 + 1) * rowHeight;
    columnHeader.forEach((item, index) => {
      const cellValue = expense[item] != null ? String(expense[item]) : "-";
      drawCell(50 + index * 200, yPos, columnWidth, rowHeight, cellValue);
    });
  });

  doc.end();

  await new Promise((resolve) => {
    stream.on("finish", () => {
      console.log("PDF created successfully");
      resolve(true);
    });
  });
};
