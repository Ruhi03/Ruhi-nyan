import { createLogger, format, transports } from "winston";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
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
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
