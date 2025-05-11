# Screeps MCP Server Authentication

This document details the authentication mechanisms for connecting the Screeps MCP Server to the Screeps game API. The `node-screeps-api` library supports multiple authentication methods.

## Supported Authentication Methods

The Screeps MCP Server will primarily support authentication via:

1.  **API Token**: This is the recommended method for most use cases, especially for automated scripts and servers. Users can generate API tokens from their Screeps account settings.
2.  **Username and Password**: While supported by the library, this method is generally less secure for automated systems. It might be provided as an option but with strong recommendations to use tokens instead.

## Configuration

Authentication credentials will be configured through environment variables or a dedicated configuration file for the MCP server. This keeps sensitive information out of the codebase.

### Environment Variables

The server will look for the following environment variables:

*   `SCREEPS_API_TOKEN`: Your Screeps API token.
*   `SCREEPS_USERNAME`: Your Screeps username (if using password authentication).
*   `SCREEPS_PASSWORD`: Your Screeps password (if using password authentication).
*   `SCREEPS_SERVER_TYPE`: Specifies the server type. Options:
    *   `official` (default): For the main Screeps official server.
    *   `private`: For connecting to a private Screeps server. Requires `SCREEPS_PRIVATE_HOST` and `SCREEPS_PRIVATE_PORT`.
    *   `steam`: For connecting via Steam client. May require additional setup or local Steam client running.
*   `SCREEPS_PRIVATE_HOST`: Hostname or IP address of the private server (e.g., `localhost`, `192.168.1.100`).
*   `SCREEPS_PRIVATE_PORT`: Port number for the private server (e.g., `21025`).
*   `SCREEPS_PRIVATE_SECURE`: Set to `true` if the private server uses HTTPS, `false` otherwise.

### MCP Server Settings (`settings.json`)

Alternatively, these can be configured in the MCP server's `settings.json` file within the `env` block for the server definition:

```json
{
  "mcpServers": {
    "screeps-server": {
      "command": "node",
      "args": ["path/to/screeps-mcp-server/index.js"], // Adjust path as needed
      "env": {
        "SCREEPS_API_TOKEN": "YOUR_API_TOKEN_HERE",
        "SCREEPS_SERVER_TYPE": "official" // or "private", "steam"
        // "SCREEPS_USERNAME": "YOUR_USERNAME",
        // "SCREEPS_PASSWORD": "YOUR_PASSWORD",
        // "SCREEPS_PRIVATE_HOST": "your.private.server.com",
        // "SCREEPS_PRIVATE_PORT": "21025",
        // "SCREEPS_PRIVATE_SECURE": "true"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Security Note**: It is crucial to protect your API token or credentials. Avoid committing them directly into version control. Use environment variables or secure configuration management practices.

## Initialization

During server startup, the `node-screeps-api` wrapper will attempt to initialize the API client using the provided credentials.

1.  If `SCREEPS_API_TOKEN` is provided, it will be used as the primary authentication method.
2.  If `SCREEPS_API_TOKEN` is not provided, but `SCREEPS_USERNAME` and `SCREEPS_PASSWORD` are, these will be used.
3.  The `SCREEPS_SERVER_TYPE` will determine which server endpoint the API connects to.
    *   `official`: Connects to `https://screeps.com/api/`.
    *   `private`: Connects to `http(s)://<SCREEPS_PRIVATE_HOST>:<SCREEPS_PRIVATE_PORT>/api/`.
    *   `steam`: May involve local IPC or specific endpoints; refer to `node-screeps-api` documentation for specifics if this mode is heavily used.

## Error Handling

*   If authentication fails (e.g., invalid token, incorrect password), the server will log the error and may prevent startup or disable tools that require authentication.
*   Tools requiring authentication will check the API client's status before execution and return an appropriate error if not authenticated.

---

Next, I will create the `docs/tools/README.md` file as an index for the tools.
