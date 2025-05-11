#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // Changed import
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // Import Zod

import pkg from '../package.json' with { type: 'json' };
import config from './config/index.js';
import logger from './utils/logger.js';
import './utils/errorHandler.js'; // Import to register global error handlers
import { initializeScreepsAPI, getScreepsAPI } from './api/screepsAPI.js'; // Removed fetchMyInfo as it's not used here directly

// Create an MCP server instance
const server = new McpServer({
  name: 'screeps-mcp-server',
  version: pkg.version || '0.1.0',
  description: 'MCP Server for interacting with the Screeps game API.',
});

// Define getPlayerInfo tool
server.tool(
  "getPlayerInfo",
  "Retrieves basic information (username and GCL) about the authenticated Screeps player.", // Tool description
  async () => { // Handler - no input argument if no schema is defined beyond a description
    logger.info('[Tool:getPlayerInfo] Executing.');
    // Note: If _input was needed from a Zod schema, the signature would be different.
    // For a no-arg tool defined with only a description, the handler takes no arguments or only 'extra'.
    try {
      const api = await getScreepsAPI();
      if (!api || typeof api.me !== 'function') {
        logger.error('[Tool:getPlayerInfo] Screeps API not properly initialized or me() method not available.');
        return {
          content: [{ type: "text", text: "Error: Screeps API not initialized or me() unavailable" }],
          isError: true, // Indicate an error response
        };
      }

      const response = await api.me(); // Expected to return { _id, username, badge, gcl } or throw error

      if (!response || typeof response.username !== 'string' || typeof response.gcl !== 'number') {
        logger.error({ response }, '[Tool:getPlayerInfo] Failed to get player info or unexpected response format from api.me().');
        return {
          content: [{ type: "text", text: "Error: Failed to retrieve valid player info from Screeps API" }],
          isError: true,
        };
      }

      const { username, gcl } = response;
      const playerData = { username, gcl };

      logger.info({ username: playerData.username }, '[Tool:getPlayerInfo] Successfully retrieved player info.');
      // Output schema for success: { username: string, gcl: number }
      // The SDK expects content to be an array of content parts.
      // For structured data, it's common to return it as a JSON string or a specific content type.
      // Let's return it as a JSON string in a text content part.
      return {
        content: [{ type: "text", text: JSON.stringify(playerData) }]
      };

    } catch (error: any) {
      logger.error({ err: error.message, stack: error.stack }, '[Tool:getPlayerInfo] Error retrieving player info.');
      return {
        content: [{ type: "text", text: `Error retrieving player info: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// TODO: Add other tools and resources here using server.tool(...) and server.resource(...)

async function main() {
  logger.info(`Screeps MCP Server starting with log level: ${config.logLevel}`);
  logger.info(`Targeting Screeps server type: ${config.screepsServerType}`);

  try {
    await initializeScreepsAPI();
    logger.info('Screeps API connection initialized.');
  } catch (error) {
    logger.error('Failed to initialize Screeps API during server startup. Server will run but API calls may fail.', error);
  }

  const transport = new StdioServerTransport();
  try {
    await server.connect(transport); // Connect the McpServer instance
    logger.info('Screeps MCP Server connected to transport and ready.');
  } catch (transportError) {
    logger.error('Failed to connect server to transport:', transportError);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.fatal({ err: error }, 'Fatal error during server startup or connection');
  process.exit(1);
});
