import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { middleware as contextMiddleware } from "express-http-context";
import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { ToWords } from "to-words";
import moment from "moment";
import { Builder, By, Capabilities } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import extractImagesFromPdf from "./helper/extractImagesFromPdf";
import { generateQRCode } from "./helper/generateQRCode";
import { statementData } from "./data/statementData";
import delay from "./helper/delay";
import toWords from "./helper/toWords";
import { statementPDF } from "./helper/pdf/statementPDF";
import { pavtiData } from "./data/pavtiData";
import { pavtiPDF } from "./helper/pdf/pavtiPDF";

export default class App {
  public static instance: express.Application;
  private static port: number;
  public static start(port) {
    this.instance = express();
    this.port = port;

    // Add middleware.
    this.initializeMiddleware();

    // Add controllers
    this.initializeControllers();
  }

  private static initializeMiddleware() {
    // logger

    // CORS
    this.instance.use(
      cors({
        origin: true,
        credentials: true,
        exposedHeaders: "x-auth-token",
      })
    );

    // Cookie parser.
    this.instance.use(cookieParser(process.env.COOKIE_SECRET));

    // enable http context
    this.instance.use(contextMiddleware);

    // Body Parser
    this.instance.use(express.json({ limit: "50mb" })); // support json encoded bodies
    this.instance.use(express.static(process.cwd() + "/public"));
  }

  private static initializeControllers() {
    this.instance.use("/api/statement", async (req, res) => {
      try {
        const payload = req.body;

        fs.writeFileSync("statement.json", JSON.stringify(payload, null, 2));

        let fileName = uuid();

        await statementPDF({
          fileName,
          statementData,
        });

        // Example usage
        const inputPdfFile = `${fileName}.pdf`;
        const outputPrefix = fileName;

        await extractImagesFromPdf(inputPdfFile, outputPrefix, {
          pngFile: true,
        })
          .then((outputPath) => {
            console.log("Images extracted successfully:", outputPath);
          })
          .catch((error) => {
            console.error("Error extracting images:", error);
          });
        res.send("ok");
      } catch (error) {
        console.log({ error });
        res.send(error);
      }
    });

    this.instance.use("/api/bill", async (req, res) => {
      try {
        const payload = req.body;

        fs.writeFileSync("bill.json", JSON.stringify(payload, null, 2));

        let fileName = uuid();

        const inputPdfFile = `${fileName}.pdf`;
        const outputPrefix = fileName;

        await pavtiPDF({
          fileName,
          pavtiData,
        });

        await extractImagesFromPdf(inputPdfFile, outputPrefix, {
          pngFile: true,
        })
          .then(async (outputPath) => {
            // Set Chrome driver options
            let options = new chrome.Options();
            options.addArguments("--remote-debugging-port=9014");
            options.addArguments(
              "--user-data-dir=E:\\code\\chrome\\Chrome_Test_Profile"
            );

            // Instantiate ChromeDriver with configured options
            let driver = await new Builder()
              .forBrowser("chrome")
              .setChromeOptions(options)
              .build();

            // Set implicit wait for WebDriver
            await driver.manage().setTimeouts({ implicit: 6000 });

            try {
              // Navigate to WhatsApp web
              await driver.get(
                `https://web.whatsapp.com/send/?phone=${pavtiData["mob_no"]}&type=phone_number&app_absent=0`
              );

              await delay(15000);

              let addAttachmentButton = await driver.findElement({
                className: "bo8jc6qi p4t1lx4y brjalhku",
              });
              await addAttachmentButton.click();

              let fileInputElement = await driver.findElement(
                By.xpath(
                  "//input[@type='file' and @accept='image/*,video/mp4,video/3gpp,video/quicktime']"
                )
              );

              await fileInputElement.sendKeys(
                process.cwd() + `/${outputPrefix}-1.png`
              );
              await delay(5000);

              let sendJPEGButton = await driver.findElement({
                className:
                  "p357zi0d gndfcl4n ac2vgrno mh8l8k0y k45dudtp i5tg98hk",
              });
              await sendJPEGButton.click();

              console.log("Message sent successfully!");
            } catch (error) {
              console.error("Error occurred:", error);
            } finally {
              // Close the WebDriver session
              await delay(5000);

              await driver.quit();
            }
          })
          .catch((error) => {
            console.error("Error extracting images:", error);
          });
        res.send("ok");
      } catch (error) {
        console.log({ error });
        res.send(error);
      }
    });

    this.instance.use("/api/msg", async (req, res) => {
      const payloa1 = req.body;

      fs.writeFileSync("msg.json", JSON.stringify(payloa1, null, 2));
      const payload = {
        DATA: {
          MSGRPT: [
            {
              "Sl No": 1,
              Rasoidt: "31-Mar-24",
              Name: "Krunalbhai Kirtibhai Patel",
              Nimit: "Birthday",
              Status: "Yes",
              "Mobile No": "918460070594",
              Message:
                "કુંડળથી પૂ.ગુરૂજી તથા સર્વેસંતોના ભાવથી 🙏🏻 જયસ્વામિનારાયણ 🙏🏻\r\nઆજે તમારી જન્મદિવસ નિમિતે શ્રી સ્વામિનારાયણ મંદિર કુંડળધામમાં રસોઈ હતી. મહારાજ અને સર્વે સંતો વગેરેને ખૂબ જમાડયા. મહારાજને પ્રાર્થના કરીએ છીએ કે શ્રીહરિ તમારૂ ખૂબ સારૂ કરે",
            },
            {
              "Sl No": 2,
              Rasoidt: "31-Mar-24",
              Name: "Shilpaben Arvindbhai Kevadiya",
              Nimit: "Medical",
              Status: "Yes",
              "Mobile No": "918460070594",
              Message:
                "કુંડળથી પૂ.ગુરૂજી તથા સર્વેસંતોના ભાવથી 🙏🏻 જયસ્વામિનારાયણ 🙏🏻\r\nઆજે તમારી મેદિકલ  નિમિતે શ્રી સ્વામિનારાયણ મંદિર કુંડળધામમાં રસોઈ હતી. મહારાજ અને સર્વે સંતો વગેરેને ખૂબ જમાડયા. મહારાજને પ્રાર્થના કરીએ છીએ કે શ્રીહરિ તમારૂ ખૂબ સારૂ કરે",
            },
            {
              "Sl No": 3,
              Rasoidt: "31-Mar-24",
              Name: "Abhaybhai Rameshbhai Rojasara",
              Nimit: "Anniversary",
              Status: "Yes",
              "Mobile No": "918460070594",
              Message:
                "કુંડળથી પૂ.ગુરૂજી તથા સર્વેસંતોના ભાવથી 🙏🏻 જયસ્વામિનારાયણ 🙏🏻\r\nઆજે તમારી એનિવેર્સર્ય નિમિતે શ્રી સ્વામિનારાયણ મંદિર કુંડળધામમાં રસોઈ હતી. મહારાજ અને સર્વે સંતો વગેરેને ખૂબ જમાડયા. મહારાજને પ્રાર્થના કરીએ છીએ કે શ્રીહરિ તમારૂ ખૂબ સારૂ કરે",
            },
          ],
        },
      };
      // Set Chrome driver options
      for await (const key of payload["DATA"]["MSGRPT"]) {
        let options = new chrome.Options();
        options.addArguments("--remote-debugging-port=9014");
        options.addArguments(
          "--user-data-dir=E:\\code\\chrome\\Chrome_Test_Profile"
        );

        // Instantiate ChromeDriver with configured options
        let driver = await new Builder()
          .forBrowser("chrome")
          .setChromeOptions(options)
          .build();

        // Set implicit wait for WebDriver
        await driver.manage().setTimeouts({ implicit: 6000 });

        try {
          // Navigate to WhatsApp web
          console.log(key["Mobile No"]);
          await driver.get(
            `https://web.whatsapp.com/send/?phone=${key["Mobile No"]}&text=${key["Message"]}&type=phone_number&app_absent=0`
          );

          await delay(15000);

          let sendButton = await driver.findElement({
            className: "tvf2evcx oq44ahr5 lb5m6g5c svlsagor p2rjqpw5 epia9gcq",
          });
          await sendButton.click();

          let addAttachmentButton = await driver.findElement({
            className: "bo8jc6qi p4t1lx4y brjalhku",
          });
          await addAttachmentButton.click();

          console.log("Message sent successfully!");
        } catch (error) {
          console.error("Error occurred:", error);
        } finally {
          // Close the WebDriver session
          await delay(5000);

          await driver.quit();
        }
      }

      // fs.writeFileSync("msg_payload.json", JSON.stringify(payload, null, 2));
      res.status(200).json({ message: "success" });
    });
  }
}
