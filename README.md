# Screeps MCP Server

A Model Context Protocol (MCP) server for interacting with the Screeps game API.

This project provides an MCP-compliant server that exposes Screeps game data and operations as MCP tools and resources. It enables LLMs or other MCP clients to access, query, and operate on Screeps game accounts and data in a structured, protocol-driven way.

## Project Purpose

- **Bridge Screeps and AI/LLM tools:** Allow large language models and other MCP clients to interact with the Screeps game via a standard protocol.
- **Expose Screeps API as MCP tools/resources:** Make player info, game data, and other Screeps API features accessible through MCP.
- **Support multiple Screeps server types:** Official, private, and Steam servers are supported via configuration.

## Features

- **MCP-compliant server:** Implements the Model Context Protocol for easy integration with LLMs and other clients.
- **Screeps API integration:** Securely connects to Screeps servers using token or username/password.
- **MCP tools:** Example: `getPlayerInfo` retrieves authenticated player info (username, GCL).
- **Extensible:** Easily add new MCP tools/resources for more Screeps API endpoints.
- **Configurable:** Supports official, private, and Steam Screeps servers via environment variables.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Build the server
```bash
npm run build
```

### 3. Configure environment variables
Set the following variables as needed:
- `SCREEPS_API_TOKEN` (recommended) or `SCREEPS_USERNAME` and `SCREEPS_PASSWORD`
- `SCREEPS_SERVER_TYPE` (`official`, `private`, or `steam`)
- `SCREEPS_PRIVATE_HOST`, `SCREEPS_PRIVATE_PORT`, `SCREEPS_PRIVATE_SECURE` (for private/steam servers)

Example:
```bash
export SCREEPS_API_TOKEN=your_token
export SCREEPS_SERVER_TYPE=official
```

### 4. Run the server
```bash
npm start
```

The server will start and listen for MCP protocol requests over stdio.

## Configuration

All configuration is via environment variables. See `src/config/index.ts` for details.

- `LOG_LEVEL` (default: `info`)
- `SCREEPS_API_TOKEN` or `SCREEPS_USERNAME`/`SCREEPS_PASSWORD`
- `SCREEPS_SERVER_TYPE`: `official`, `private`, or `steam`
- `SCREEPS_PRIVATE_HOST`, `SCREEPS_PRIVATE_PORT`, `SCREEPS_PRIVATE_SECURE`: for private/steam servers

## MCP Tools & Resources

### Example Tool: `getPlayerInfo`
Retrieves the authenticated Screeps player's username and GCL (Global Control Level).

**Request:**
- Tool name: `getPlayerInfo`
- No parameters required

**Response:**
```json
{
  "username": "your_username",
  "gcl": 123456
}
```

More tools and resources can be added by extending the codebase (see `src/tools/`).

## Integration

### Claude Desktop
To use this server with Claude Desktop, add the following to your Claude config:

On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "screeps": {
      "command": "/path/to/screeps-mcp-server/build/index.js"
    }
  }
}
```

### Debugging

For debugging MCP protocol traffic, use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

This will provide a browser-based UI for inspecting MCP requests and responses.

## Development

- Use `npm run watch` for auto-rebuild during development.
- Code is organized for clarity and maintainability. See `src/` for main logic.
- Contributions are welcome!

## License

MIT
