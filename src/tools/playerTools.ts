import { CallToolRequestSchema, ToolInputSchema, ToolOutputSchema, defineTool } from '@modelcontextprotocol/sdk';
import { Static, Type } from '@sinclair/typebox';
import { getScreepsAPI } from '../api/screepsAPI.js';
import logger from '../utils/logger.js';
// Placeholder for mcpError and mcpErrorSchema until SDK or proper solution is found

// Define a basic error schema (placeholder)
const mcpErrorSchema = Type.Object({
    error: Type.String(),
    code: Type.Optional(Type.String()),
    details: Type.Optional(Type.Unknown()),
}, { description: 'Standard MCP error object' });

// Define a basic error helper (placeholder)
function mcpError(message: string, code?: string, details?: unknown) {
    return { error: message, code, details };
}

// Input schema for getPlayerInfo (no parameters needed)
const GetPlayerInfoInputSchema = Type.Object({}, { description: 'Input for getPlayerInfo tool. No parameters required.' });
export type GetPlayerInfoInput = Static<typeof GetPlayerInfoInputSchema>;

// Output schema for getPlayerInfo
const GetPlayerInfoOutputSchema = Type.Object(
    {
        username: Type.String({ description: 'The player\'s username.' }),
        gcl: Type.Number({ description: 'Global Control Level.' }),
        // power and cpu are not directly available from api.me() based on TS errors.
        // Consider adding them if another API endpoint provides them and it's deemed necessary.
        // For now, keeping it to what api.me() reliably provides.
    },
    { description: 'Basic information about the authenticated player (username and GCL).' }
);
export type GetPlayerInfoOutput = Static<typeof GetPlayerInfoOutputSchema>;

export const getPlayerInfoTool = defineTool({
    name: 'getPlayerInfo',
    description: 'Retrieves basic information (username and GCL) about the authenticated Screeps player.',
    input: GetPlayerInfoInputSchema as ToolInputSchema,
    output: Type.Union([GetPlayerInfoOutputSchema, mcpErrorSchema]) as ToolOutputSchema,
    handler: async (_input: GetPlayerInfoInput): Promise<GetPlayerInfoOutput | Static<typeof mcpErrorSchema>> => {
        logger.info('[Tool:getPlayerInfo] Executing.');
        try {
            const api = await getScreepsAPI();
            if (!api || typeof api.me !== 'function') {
                logger.error('[Tool:getPlayerInfo] Screeps API not properly initialized or me() method not available.');
                return mcpError('Screeps API not initialized or me() unavailable', 'API_INIT_ERROR');
            }
            // Use the top-level api.me() method
            const response = await api.me(); // Expected to return { _id, username, badge, gcl } or throw error

            // api.me() usually throws on error or returns null/undefined if user not found.
            // Check for presence of username as a primary indicator of a successful response.
            if (!response || typeof response.username !== 'string' || typeof response.gcl !== 'number') {
                logger.error({ response }, '[Tool:getPlayerInfo] Failed to get player info or unexpected response format from api.me().');
                return mcpError('Failed to retrieve valid player info', 'API_ERROR');
            }

            // Extract available fields
            const { username, gcl } = response;

            const playerData: GetPlayerInfoOutput = {
                username,
                gcl,
            };
            logger.info({ username: playerData.username }, '[Tool:getPlayerInfo] Successfully retrieved player info.');
            return playerData;
        } catch (error: any) {
            logger.error({ err: error.message, stack: error.stack }, '[Tool:getPlayerInfo] Error retrieving player info.');
            return mcpError(`Error retrieving player info: ${error.message}`, 'TOOL_EXECUTION_ERROR');
        }
    },
});
