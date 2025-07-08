const { createLogger, format, transports } = require('winston');
const path = require('path');

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

const logger = createLogger({
  level: 'info', // can be 'debug', 'info', 'warn', 'error'
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../../logs', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs', 'combined.log'),
    }),
  ],
});

// If not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    })
  );
}

module.exports = logger;