import { createLogger, format, transports } from "winston";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  if (typeof message === "object") {
    message = JSON.stringify(message, null, 2);
  }

  return `${timestamp} [${label}] ${level}: ${message}`;
});

const dateTimeString = new Date()
  .toISOString()
  .split(".")[0]
  .replace(/:/g, ".");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.label({ label: "bot" }),
    format.timestamp(),
    myFormat
  ),
  defaultMeta: { service: "bot" },
  transports: [
    new transports.File({
      filename: `${dateTimeString}.log`,
      dirname: "logs",
    }),
    new transports.Console({
      format: format.combine(format.colorize(), myFormat),
    }),
  ],
});

export default logger;
