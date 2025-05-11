import { pino, type LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
};

// Use pino-pretty for local development if it's available
if (!isProduction) {
    loggerOptions.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    };
}

const logger = pino(loggerOptions);

export default logger;
