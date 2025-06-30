import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { middleware as contextMiddleware } from "express-http-context";
import * as fs from "fs";
import { v4 as uuid } from "uuid";
import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import extractImagesFromPdf from "./helper/extractImagesFromPdf";
import delay from "./helper/delay";
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
    this.instance.use("/api/bill", async (req, res) => {
      try {
        const payload = pavtiData;
        // const payload = req.body;

        let fileName = "aa";
        // let fileName = uuid();

        const data = payload.RcptData;

        const inputPdfFile = `${fileName}.pdf`;
        const outputPrefix = fileName;

        await pavtiPDF({
          fileName,
          pavtiData: data,
        });

        await extractImagesFromPdf(inputPdfFile, outputPrefix, {
          pngFile: true,
        });
        // .then(async (outputPath) => {
        //   // Set Chrome driver options
        //   let options = new chrome.Options();
        //   options.addArguments("--remote-debugging-port=9014");
        //   options.addArguments(
        //     "--user-data-dir=E:\\code\\chrome\\Chrome_Test_Profile"
        //   );

        //   // Instantiate ChromeDriver with configured options
        //   let driver = await new Builder()
        //     .forBrowser("chrome")
        //     .setChromeOptions(options)
        //     .build();

        //   // Set implicit wait for WebDriver
        //   await driver.manage().setTimeouts({ implicit: 6000 });

        //   try {
        //     // Navigate to WhatsApp web
        //     await driver.get(
        //       `https://web.whatsapp.com/send/?phone=91${data["Mobile Number"]}&type=phone_number&app_absent=0`
        //     );

        //     await delay(15000);

        //     let addAttachmentButton = await driver.findElement({
        //       className: "bo8jc6qi p4t1lx4y brjalhku",
        //     });
        //     await addAttachmentButton.click();

        //     let fileInputElement = await driver.findElement(
        //       By.xpath(
        //         "//input[@type='file' and @accept='image/*,video/mp4,video/3gpp,video/quicktime']"
        //       )
        //     );

        //     await fileInputElement.sendKeys(
        //       process.cwd() + `/${outputPrefix}-1.png`
        //     );
        //     await delay(5000);

        //     let sendJPEGButton = await driver.findElement({
        //       className:
        //         "p357zi0d gndfcl4n ac2vgrno mh8l8k0y k45dudtp i5tg98hk",
        //     });
        //     await sendJPEGButton.click();

        //     fs.unlinkSync(process.cwd() + `/${outputPrefix}-1.png`);
        //     fs.unlinkSync(inputPdfFile);

        //     console.log("Message sent successfully!");
        //   } catch (error) {
        //     console.error("Error occurred:", error);
        //   } finally {
        //     // Close the WebDriver session
        //     await delay(5000);

        //     await driver.quit();
        //   }
        // })
        // .catch((error) => {
        //   console.error("Error extracting images:", error);
        // });
        res.send("ok");
      } catch (error) {
        console.log({ error });
        res.send(error);
      }
    });
  }
}
