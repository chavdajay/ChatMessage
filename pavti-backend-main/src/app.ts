import apiRoutes from "./routes/api.routes";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { middleware as contextMiddleware } from "express-http-context";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// Main App class
export default class App {
  public static instance: express.Application;
  private static port: number;

  public static start(port: number) {
    this.instance = express();
    this.port = port;

    this.initializeMiddleware();
    this.initializeControllers();
  }

  private static initializeMiddleware() {
    this.instance.use(
      cors({
        origin: true,
        credentials: true,
        exposedHeaders: "x-auth-token",
      })
    );

    this.instance.use(cookieParser(process.env.COOKIE_SECRET));
    this.instance.use(contextMiddleware);
    this.instance.use(express.json({ limit: "50mb" }));
    this.instance.use(express.static(process.cwd() + "/public"));
  }

  private static initializeControllers() {
    this.instance.use("/api", apiRoutes);
    this.instance.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
    );
  }
}
