import fs from "fs";
import path from "path";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

// Use process.cwd() for workspace root in ES modules
const LOG_FILE_PATH = path.resolve(process.cwd(), "logs/app.log");

function formatLog(level: LogLevel, message: any) {
  const timestamp = new Date().toISOString();
  let msgStr: string;
  if (typeof message === "string") {
    msgStr = message;
  } else if (message instanceof Error) {
    msgStr = message.stack || message.message;
  } else {
    try {
      msgStr = JSON.stringify(message);
    } catch {
      msgStr = String(message);
    }
  }
  return `[${timestamp}] [${level}] ${msgStr}`;
}

export async function log(message: any, level: LogLevel = LogLevel.INFO) {
  const logEntry = formatLog(level, message) + "\n";
  await fs.promises.appendFile(LOG_FILE_PATH, logEntry, { encoding: "utf8" });
}
