import * as path from "path";
import { promises as fs } from "fs";
import {
  IUserRes,
  RegisterUserSchema,
} from "../servises/RegisterUserDB/registerUserSchema.servise";
import { updateUser } from "../servises/RegisterUserDB/updateUser.servise";

export type ErrorService = "telegram" | "sms-service" | "express" | string;
export type ErrorType = "error" | "warn" | "completed" | string;

interface ErrorWithStatus extends Error {
  status?: number;
}

export async function logErrorToFile(
  err: ErrorWithStatus | any,
  service: ErrorService,
  type: ErrorType,
  email?: string // email is now optional
): Promise<void> {
  try {
    const logsDir = path.join(__dirname, "../../../logs");
    const errorLogPath = path.join(
      logsDir,
      `${type}${service.charAt(0).toUpperCase() + service.slice(1)}.txt`
    );
    const errorMessage = Buffer.from(
      ` \n | Time: ${new Date()}\n | Error: ${err.message}\n | Stack: ${
        err.stack || ""
      }\n\n`
    );

    // If the type is "error", write to log file
    if (type === "error") {
      if (process.env.DEBUG === "true") {
        console.log(
          "\x1B[31m",
          `[${type.toUpperCase()}]: ${errorMessage.toString()}`
        );
      }
      await fs.mkdir(logsDir, { recursive: true });
      await fs.appendFile(errorLogPath, errorMessage, "utf-8");
    }
    // Else if email exists, write to database
    else if (email) {
      const errorEntry = {
        service: service,
        status: type,
        message: err.message,
      };

      await RegisterUserSchema.updateOne(
        { mail: email },
        { $push: { errorList: errorEntry } }
      );
    }
  } catch (error) {
    console.error(
      "\x1B[31m",
      `[ERROR] Error writing to log file or updating database: ${error}`
    );
  }
}
