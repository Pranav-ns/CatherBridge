const winston = require("winston");
const LokiTransport = require("winston-loki");

const { combine, timestamp, printf, errors, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }
  return log;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  defaultMeta: { app: "caterbridge-backend" },
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), consoleFormat),
    }),
  ],
});

if (process.env.LOKI_HOST) {
  logger.add(
    new LokiTransport({
      host: process.env.LOKI_HOST,
      basicAuth: process.env.LOKI_USER && process.env.LOKI_API_TOKEN
        ? `${process.env.LOKI_USER}:${process.env.LOKI_API_TOKEN}`
        : undefined,
      labels: { app: "caterbridge-backend" },
      json: true,
      format: json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error("Loki connection error:", err),
    })
  );
}

module.exports = logger;
