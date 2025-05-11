import logger from './logger.js';

/**
 * Custom error class for application-specific errors.
 * Allows for distinguishing between known operational errors and unexpected errors.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true, stack = '') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational; // Operational errors are known, vs. programming errors

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Handles errors, logs them, and potentially exits the process for unrecoverable errors.
 * This is a global handler, more specific handlers might be used closer to error sources.
 * @param error The error object.
 * @param from Optional string indicating where the error was caught.
 */
export function handleError(error: Error | AppError | any, from?: string): void {
    const source = from ? ` from ${from}` : '';

    if (error instanceof AppError && error.isOperational) {
        // Known, operational error (e.g., invalid input, API error from Screeps)
        logger.warn({ err: error, source }, `Operational error${source}: ${error.message}`);
    } else {
        // Unexpected error (e.g., programming bug, unhandled system error)
        logger.error({ err: error, source }, `Unexpected error${source}: ${error.message || error}`);
        // For critical unexpected errors, you might consider exiting the process
        // if the server is in an unrecoverable state.
        // For an MCP server, it might be better to report the error to the client
        // and try to continue if possible, rather than exiting abruptly.
        // process.exit(1); // Example: exit for critical non-operational errors
    }

    // Further actions could include sending alerts, etc.
}

// Example: A more specific error for API issues
export class ScreepsAPIError extends AppError {
    constructor(message: string, statusCode = 502, originalError?: any) {
        // 502 Bad Gateway is often used when an upstream server returns an invalid response
        super(message, statusCode, true, originalError?.stack);
        this.name = 'ScreepsAPIError';
        if (originalError) {
            // You might want to attach the original error for more context
            // (this as any).originalError = originalError;
        }
    }
}

// You can add more specific error types as needed:
// export class AuthenticationError extends AppError { ... }
// export class ValidationError extends AppError { ... }

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    logger.error({ err: reason, promiseDetails: promise }, 'Unhandled Rejection at Promise');
    // Depending on the application, you might want to exit on unhandled rejections
    // handleError(reason || new Error('Unhandled promise rejection'), 'GlobalUnhandledRejection');
    // process.exit(1);
});

// Global uncaught exception handler
process.on('uncaughtException', (error: Error) => {
    logger.error({ err: error }, 'Uncaught Exception');
    // It's generally recommended to exit on uncaught exceptions as the application
    // state might be corrupted.
    // handleError(error, 'GlobalUncaughtException');
    // process.exit(1); // Exit after logging
});

export default handleError; // Exporting the main handler function as default
