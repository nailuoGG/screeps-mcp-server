# Screeps MCP Server Tools

This section provides detailed documentation for each tool available in the Screeps MCP Server. Tools are the primary way users interact with the Screeps game API through this server.

## Tool Categories

The tools are organized into the following categories based on their functionality:

1.  **[Basic Operations](./basic-operations.md)**
    *   Tools for retrieving fundamental game information such as player details, owned rooms, and basic room overviews.
    *   Examples: `getPlayerInfo`, `getOwnedRooms`, `getRoomOverview`.

2.  **[Visualization & Mapping](./visualization.md)**
    *   Tools for generating or retrieving visual data related to rooms, creep paths, and map layouts.
    *   Examples: `getRoomVisual`, `getMapSegmentVisual`, `getCreepPathVisual`.

3.  **[Performance Analysis](./analysis.md)**
    *   Tools for analyzing game performance metrics, including CPU usage, resource efficiency, and colony health.
    *   Examples: `getCPUStats`, `getRoomEnergyAnalysis`, `getColonyPerformanceReport`.

4.  **[Market Operations](./market.md)**
    *   Tools for interacting with the Screeps market, such as fetching orders, placing trades, and analyzing market trends.
    *   Examples: `getMarketOrders`, `createMarketOrder`, `getMarketHistory`, `analyzeMarketTrends`.

5.  **[Memory Management](./memory.md)**
    *   Tools for reading from and writing to the player's game memory segments.
    *   Examples: `readMemorySegment`, `writeMemorySegment`, `listMemorySegments`.

6.  **[Code Management](./code.md)**
    *   Tools for managing Screeps code, such as fetching current code, switching branches, and deploying updates.
    *   Examples: `getActiveCodeBranch`, `switchCodeBranch`, `uploadCodeFiles`.

7.  **[Combat & Defense Analysis](./combat.md)**
    *   Tools for analyzing combat situations, evaluating defensive structures, and reviewing battle logs.
    *   Examples: `getRoomDefenseStatus`, `analyzeCombatEffectiveness`, `getRecentCombatEvents`.

8.  **[Automation & Alerts](./automation.md)**
    *   Tools for setting up automated actions or alerts based on in-game events.
    *   Examples: `createGameAlert`, `listActiveAlerts`, `executeScheduledTask`.

9.  **[Advanced Planning & Simulation](./advanced.md)**
    *   Tools for more complex tasks like simulating colony expansion, pathfinding, or testing build orders.
    *   Examples: `simulateRoomExpansion`, `findOptimalPath`, `testBuildOrderEfficiency`.

## General Tool Usage

Each tool will have a defined input schema (parameters) and an output schema. Errors will be reported consistently, providing context and suggestions where possible.

Refer to the individual markdown files in this directory for detailed specifications of each tool, including:
*   Purpose and description
*   Input parameters (name, type, required/optional, description)
*   Output format
*   Potential errors
*   Usage examples

---

Next, I will create the `docs/resources/README.md` file as an index for the resources.
