# Screeps MCP Server Development Guide

This guide provides instructions and best practices for developers looking to contribute to the Screeps MCP Server.

## Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   TypeScript
*   Git

## Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd screeps-mcp-server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configuration**:
    *   Set up your Screeps API authentication details as described in `docs/authentication.md`. You can use a `.env` file at the project root for local development (ensure `.env` is in `.gitignore`).
    *   Example `.env` file:
        ```
        SCREEPS_API_TOKEN=your_token_here
        SCREEPS_SERVER_TYPE=official
        LOG_LEVEL=debug
        ```

4.  **Build the Project**:
    ```bash
    npm run build
    ```

5.  **Run the Server (Development Mode)**:
    *   The MCP framework typically handles running the server based on `settings.json`. For direct development and testing of the server logic:
    ```bash
    npm run start:dev 
    # This might use a tool like ts-node-dev or nodemon, to be defined in package.json
    ```
    *   Alternatively, you can run the compiled JavaScript:
    ```bash
    npm start 
    # Runs node dist/index.js (or similar, to be defined in package.json)
    ```

## Project Structure (Proposed)

```
screeps-mcp-server/
├── docs/                     # Documentation files
├── src/                      # Source code
│   ├── index.ts              # Main server entry point
│   ├── api/                  # Wrapper for node-screeps-api
│   │   └── screepsAPI.ts
│   ├── services/             # Business logic for tools/resources
│   │   ├── roomService.ts
│   │   └── ...
│   ├── tools/                # Tool definitions and handlers
│   │   ├── getRoomDetails.ts
│   │   └── ...
│   ├── resources/            # Resource definitions and handlers
│   │   └── playerInfo.ts
│   │   └── ...
│   ├── config/               # Configuration management
│   │   └── index.ts
│   ├── types/                # TypeScript type definitions
│   │   └── screepsTypes.ts
│   └── utils/                # Utility functions
├── test/                     # Unit and integration tests
│   ├── services/
│   │   └── roomService.test.ts
│   └── ...
├── .env.example              # Example environment file
├── .eslintrc.js              # ESLint configuration
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md                 # Project README
```

## Coding Guidelines

*   **TypeScript**: Use TypeScript for all new code. Leverage strong typing and interfaces.
*   **Linting & Formatting**: Adhere to the project's ESLint and Prettier configurations. Run `npm run lint` and `npm run format` before committing.
*   **Modularity**: Keep modules focused on a single responsibility.
*   **Error Handling**: Implement robust error handling. Catch errors from the `node-screeps-api` and provide meaningful MCP error responses.
*   **Logging**: Use a consistent logging library (e.g., `pino` or `winston`). Log important events, errors, and API interactions.
*   **Comments**: Write clear and concise comments for complex logic or non-obvious code. Use JSDoc for public APIs.
*   **API Interaction**: All interactions with `node-screeps-api` should go through the dedicated wrapper in `src/api/`.

## Adding New Tools or Resources

1.  **Define Schema**: Define the input and output schemas for the new tool/resource.
2.  **Implement Service Logic**: Add the necessary business logic in the appropriate service module (e.g., `src/services/marketService.ts`).
3.  **Create Handler**:
    *   For tools: Create a new file in `src/tools/` and implement the tool handler using the MCP SDK.
    *   For resources: Create a new file in `src/resources/` and implement the resource handler.
4.  **Register**: Register the new tool/resource with the MCP server instance in `src/index.ts`.
5.  **Documentation**: Add documentation for the new tool/resource in the `docs/tools/` or `docs/resources/` directory.
6.  **Testing**: Write unit and/or integration tests.

## Testing

*   **Unit Tests**: Test individual functions and modules in isolation. Use mocking/stubbing for external dependencies like `node-screeps-api`.
*   **Integration Tests**: Test the interaction between different modules, and potentially with a mock Screeps API or a dedicated test account on a private server.
*   Run tests using:
    ```bash
    npm test
    ```

## Committing and Pull Requests

*   Follow conventional commit message formats (e.g., `feat: add getCreepInfo tool`).
*   Ensure all tests pass and linting/formatting checks are clean before submitting a pull request.
*   Provide a clear description of the changes in the pull request.

---

This completes the initial set of documentation index files and the development guide. The next steps would involve creating the placeholder files for each specific tool and resource category, and then starting the actual server implementation.
