import { ScreepsAPI } from 'screeps-api';
import config from '../config/index.js';
import logger from '../utils/logger.js';

let api: ScreepsAPI | null = null;

export async function initializeScreepsAPI(): Promise<ScreepsAPI> { // Added export
    if (api) {
        return api;
    }

    const apiOptions: any = { // ScreepsAPI constructor options are not well-typed in the library for all cases
        protocol: config.screepsServerType === 'private' && config.screepsPrivateSecure ? 'https' : 'http',
        hostname: config.screepsServerType === 'private' ? config.screepsPrivateHost : 'screeps.com',
        port: config.screepsServerType === 'private' ? config.screepsPrivatePort : (config.screepsServerType === 'official' ? 443 : 80),
        path: '/', // Default path, might need adjustment for private servers if they use a subpath
    };

    if (config.screepsServerType === 'official') {
        apiOptions.protocol = 'https';
        apiOptions.port = 443;
    } else if (config.screepsServerType === 'steam') {
        // Steam client typically runs on localhost, non-standard port, often HTTP
        // This part might need more specific configuration based on node-screeps-api's steam handling
        logger.warn('Steam server type selected. Ensure Steam client is running and accessible. Defaulting to localhost:21025 if not overridden by env vars.');
        apiOptions.hostname = config.screepsPrivateHost || 'localhost'; // Allow override via private host/port for steam if needed
        apiOptions.port = config.screepsPrivatePort || 21025;
        apiOptions.protocol = config.screepsPrivateSecure ? 'https' : 'http'; // Default to http for steam unless secure is specified
    }


    if (config.screepsApiToken) {
        apiOptions.token = config.screepsApiToken;
        logger.info(`Initializing ScreepsAPI with token for server type: ${config.screepsServerType}`);
    } else if (config.screepsUsername && config.screepsPassword) {
        apiOptions.email = config.screepsUsername; // 'email' is the property name in screeps-api options
        apiOptions.password = config.screepsPassword;
        logger.info(`Initializing ScreepsAPI with username/password for server type: ${config.screepsServerType}`);
    } else {
        logger.error('Screeps API credentials (token or username/password) not provided in configuration.');
        throw new Error('Screeps API credentials not configured.');
    }

    try {
        api = new ScreepsAPI(apiOptions);
        // Perform a simple call to verify connection/authentication if possible, e.g., api.me()
        // However, some calls might require the user to be fully authenticated via a login step if using user/pass
        // For token-based, it should work directly.
        // For now, we assume construction implies readiness or it will fail on first actual use.
        // await api.me(); // Example check - might need to be conditional or handled carefully
        logger.info('ScreepsAPI initialized successfully.');
    } catch (error) {
        logger.error('Failed to initialize ScreepsAPI:', error);
        api = null; // Ensure api is null if initialization fails
        throw error; // Re-throw to prevent server from starting with a bad API client
    }

    return api;
}

export async function getScreepsAPI(): Promise<ScreepsAPI> {
    if (!api) {
        return initializeScreepsAPI();
    }
    return api;
}

// Optional: Add a function to reset/reinitialize the API if needed
export async function resetScreepsAPI(): Promise<void> {
    if (api && typeof api.socket?.disconnect === 'function') {
        api.socket.disconnect();
    }
    api = null;
    logger.info('ScreepsAPI instance reset.');
}

// Example of wrapping a common API call
export async function fetchMyInfo(): Promise<any> {
    const currentApi = await getScreepsAPI();
    try {
        const myInfo = await currentApi.me();
        return myInfo;
    } catch (error) {
        logger.error('Error fetching "me" info from Screeps API:', error);
        // Here you might want to implement more sophisticated error handling,
        // e.g., checking for auth errors, rate limits, etc.
        throw error; // Re-throw for now, or transform into a custom error
    }
}
