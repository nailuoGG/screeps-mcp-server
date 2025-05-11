#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  // CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  // ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  // GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import pkg from '../package.json' with { type: 'json' };
import config from './config/index.js';
import logger from './utils/logger.js';
import './utils/errorHandler.js'; // Import to register global error handlers
import { initializeScreepsAPI, getScreepsAPI, fetchMyInfo } from './api/screepsAPI.js'; // Import initializeScreepsAPI

const server = new Server(
  {
    name: 'screeps-mcp-server', // Updated name
    version: pkg.version || '0.1.0', // Use version from package.json
    description: 'MCP Server for interacting with the Screeps game API.',
  },
  {
    capabilities: {
      resources: {}, // To be populated
      tools: {},     // To be populated
      prompts: {},   // To be populated
    },
  }
);

// Basic request handlers (will be expanded later)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  logger.info('Handling ListResourcesRequest');
  // Example: could list player info as a resource
  return { resources: [] }; // Placeholder
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('Handling ListToolsRequest');
  // Example: could list a tool to get room details
  return { tools: [] }; // Placeholder
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  logger.info('Handling ListPromptsRequest');
  return { prompts: [] }; // Placeholder
});


async function main() {
  logger.info(`Screeps MCP Server starting with log level: ${config.logLevel}`);
  logger.info(`Targeting Screeps server type: ${config.screepsServerType}`);

  try {
    // Initialize Screeps API connection
    await initializeScreepsAPI();
    logger.info('Screeps API connection initialized.');

    // Example: Test API connection by fetching 'me'
    // This should be done carefully, perhaps only if verbose logging is on,
    // or as part of a dedicated health check tool.
    // const me = await fetchMyInfo();
    // logger.debug({ me }, 'Successfully fetched "me" info.');

  } catch (error) {
    logger.error('Failed to initialize Screeps API during server startup. Server will run but API calls may fail.', error);
    // Depending on severity, might choose to exit: process.exit(1);
  }

  const transport = new StdioServerTransport();
  try {
    await server.connect(transport);
    logger.info('Screeps MCP Server connected to transport and ready.');
  } catch (transportError) {
    logger.error('Failed to connect server to transport:', transportError);
    process.exit(1);
  }
}

main().catch((error) => {
  // This catch is for errors during the main() execution itself,
  // not for errors within the running server (handled by global handlers or try/catches in handlers).
  logger.fatal({ err: error }, 'Fatal error during server startup or connection');
  process.exit(1);
});
