const winston = require('winston');

const { createLogger, format, transports } = winston;
const {
  combine, colorize, simple,
} = format;
const log = process.env.useConsole
  ? createLogger({
    transports: [
      new transports.Console({
        format: combine(
          colorize(),
          simple(),
        ),
      }),
    ],
  })
  : console;
module.exports = { log };
