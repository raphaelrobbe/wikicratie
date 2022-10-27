import * as winston from 'winston';
import { format } from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format:
  format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
  // logger.add(new winston.transports.Console({
  //   format: winston.format.simple()
  // }));
// } else {
  logger.add(new winston.transports.File({
    filename: `${__dirname}/log/CPT.log`,
  }));
// }
