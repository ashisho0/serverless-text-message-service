const winston = require("winston");
const CloudWatchTransport = require("winston-cloudwatch");
const { AWS, CLOUD_WATCH } = require("../env/config");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport(CLOUD_WATCH, AWS),
  ],
});

module.exports = logger;
