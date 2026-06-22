import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";
import fs from "node:fs";
import path from "node:path";

const app: Express = express();

// Trust the first reverse proxy (required for secure cookies on Render/Heroku)
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

app.use("/api", router);

const frontendBuildPath = path.resolve(import.meta.dirname, "../../health-advisor/dist/public");

if (fs.existsSync(frontendBuildPath)) {
  app.get("/sw.js", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.sendFile(path.join(frontendBuildPath, "sw.js"));
  });
  app.use(express.static(frontendBuildPath));
  app.get("*any", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  app.get("*any", (req, res) => {
    res.status(404).send("Frontend build not found. Did you run the build script?");
  });
}

export default app;
