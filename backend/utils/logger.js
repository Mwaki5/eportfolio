const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// Ensure log directories exist
["app", "audit", "error"].forEach((folder) => {
  const dir = path.join(__dirname, "../logs", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Common daily rotate transport factory
const createDailyTransport = (folder, level) =>
  new transports.DailyRotateFile({
    filename: path.join(__dirname, "../logs", folder, `%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level,
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr;
        try {
          metaStr = JSON.stringify(meta);
        } catch (e) {
          metaStr = "[Cannot stringify metadata]";
        }
        return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`;
      })
    ),
  });

// Loggers
const appLogger = createLogger({
  transports: [createDailyTransport("app", "info")],
});
const auditLogger = createLogger({
  transports: [createDailyTransport("audit", "info")],
});
const errorLogger = createLogger({
  transports: [createDailyTransport("error", "error")],
});

// Extract metadata from request and error
const extractMetadata = (req = {}, err = null) => ({
  ip: req?.ip ?? null,
  route: req?.originalUrl ?? null,
  method: req?.method ?? null,
  userId: req?.userId ?? req?.body?.userId ?? null,
  frontendUrl: req?.headers?.referer ?? null,
  device: req?.headers?.["user-agent"] ?? null,
  error: err?.message ?? null,
  stack: err?.stack ?? null,
});

// Wrapper functions
const logApp = (message, req, err = null) =>
  appLogger.info(message, extractMetadata(req, err));
const logAudit = (message, req, err = null) =>
  auditLogger.info(message, extractMetadata(req, err));
const logError = (message, req, err) =>
  errorLogger.error(message, extractMetadata(req, err));

module.exports = { logApp, logAudit, logError };
