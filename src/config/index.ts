import logger from '../utils/logger.js';

// Helper function to get environment variables with defaults and type casting
function getEnvVar(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
}

function getEnvVarOrFail(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
        logger.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value;
}

function getEnvVarAsBoolean(key: string, defaultValue = false): boolean {
    const value = getEnvVar(key);
    if (value === undefined) return defaultValue;
    return ['true', '1'].includes(value.toLowerCase());
}

// Define the structure of your configuration
interface AppConfig {
    logLevel: string;
    screepsApiToken?: string;
    screepsUsername?: string;
    screepsPassword?: string;
    screepsServerType: 'official' | 'private' | 'steam';
    screepsPrivateHost?: string;
    screepsPrivatePort?: number;
    screepsPrivateSecure: boolean;
}

// Load configuration from environment variables
const config: AppConfig = {
    logLevel: getEnvVar('LOG_LEVEL', 'info')!,
    screepsApiToken: getEnvVar('SCREEPS_API_TOKEN'),
    screepsUsername: getEnvVar('SCREEPS_USERNAME'),
    screepsPassword: getEnvVar('SCREEPS_PASSWORD'),
    screepsServerType: getEnvVar('SCREEPS_SERVER_TYPE', 'official') as AppConfig['screepsServerType'],
    screepsPrivateHost: getEnvVar('SCREEPS_PRIVATE_HOST'),
    screepsPrivatePort: Number(getEnvVar('SCREEPS_PRIVATE_PORT')) || undefined,
    screepsPrivateSecure: getEnvVarAsBoolean('SCREEPS_PRIVATE_SECURE', false),
};

// Validate server type
const validServerTypes: AppConfig['screepsServerType'][] = ['official', 'private', 'steam'];
if (!validServerTypes.includes(config.screepsServerType)) {
    logger.error(`Invalid SCREEPS_SERVER_TYPE: ${config.screepsServerType}. Must be one of: ${validServerTypes.join(', ')}`);
    process.exit(1);
}

// Validate private server config if type is private
if (config.screepsServerType === 'private') {
    if (!config.screepsPrivateHost) {
        getEnvVarOrFail('SCREEPS_PRIVATE_HOST'); // Will log error and exit
    }
    if (!config.screepsPrivatePort) {
        logger.error('SCREEPS_PRIVATE_PORT must be set and be a valid number for private server type.');
        // Check if SCREEPS_PRIVATE_PORT was set but was NaN after Number() conversion
        if (process.env.SCREEPS_PRIVATE_PORT && isNaN(Number(process.env.SCREEPS_PRIVATE_PORT))) {
            logger.error(`SCREEPS_PRIVATE_PORT value "${process.env.SCREEPS_PRIVATE_PORT}" is not a valid number.`);
        }
        process.exit(1);
    }
}

// Validate authentication: either token or user/pass must be provided for most operations
// This initial check can be basic; more specific checks can occur when API calls are made.
if (!config.screepsApiToken && !(config.screepsUsername && config.screepsPassword)) {
    logger.warn(
        'SCREEPS_API_TOKEN is not set, and SCREEPS_USERNAME/SCREEPS_PASSWORD are not both set. API authentication may fail.'
    );
}


export default config;
