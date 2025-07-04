import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDirectory = path.join(__dirname, "../../logs");

const transport: DailyRotateFile = new DailyRotateFile({
  filename: "app-%DATE%.log",
  dirname: logDirectory,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    transport,
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;
