import express, { Router, Request, Response, NextFunction } from "express";
import { ErrorService, ErrorType } from "../utils/errorHandler";
import fs from "fs";
import path from "path";

const router: Router = express.Router();

const validServices: ErrorService[] = ["telegram", "sms-service", "express"];
const validTypes: ErrorType[] = ["error", "warn", "completed"];

router.get("/error-list", async (req: Request, res: Response, next: NextFunction) => {
  const service = req.query.service as ErrorService;
  const type = req.query.type as ErrorType;

  if (!service || !type) {
    res.status(400).send("Service and type are required");
    return;
  }

  if (!validServices.includes(service)) {
    res.status(400).send("Invalid service");
    return;
  }

  if (!validTypes.includes(type)) {
    res.status(400).send("Invalid type");
    return;
  }

  const errorLogPath = path.join(__dirname, `../../logs/${type}${service.charAt(0).toUpperCase() + service.slice(1)}.txt`);

  fs.readFile(errorLogPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).send("Error reading the file");
      return;
    }

    const errorBlocks = data.split("\n\n").filter((block) => block.trim() !== "");
    const errorObjects = errorBlocks.map((block) => {
      const lines = block.split("\n").filter((line) => line.trim() !== "");
      const timeLine = lines[0].split("| Time: ")[1].trim();
      const errorLine = lines[1].split("| Error: ")[1].trim();
      const stackLines = lines.slice(2).join("\n").split("| Stack: ")[1].trim();

      return {
        time: timeLine,
        error: errorLine,
        stack: stackLines,
      };
    });

    res.status(200).send(errorObjects);
  });
});

export default router;
