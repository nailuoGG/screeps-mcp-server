# Screeps MCP Server Resources

This section provides detailed documentation for each resource available in the Screeps MCP Server. Resources represent data entities that can be accessed to get various types of information from the Screeps game.

## Resource Categories

The resources are organized into the following categories based on the type of data they provide:

1.  **[Player Resources](./player.md)**
    *   Resources related to the authenticated player's account and general information.
    *   Examples: `/player/info`, `/player/messages`, `/player/notifications`.

2.  **[Game State Resources](./game.md)**
    *   Resources providing information about the overall game state, such as server time, shard status, and leaderboards.
    *   Examples: `/game/time`, `/game/shards`, `/game/world-status`, `/game/leaderboard`.

3.  **[Room Resources](./room.md)**
    *   Resources that provide detailed information about specific game rooms, including terrain, objects, and status.
    *   Examples: `/game/room/overview/{roomName}`, `/game/room/terrain/{roomName}`, `/game/room/objects/{roomName}`, `/game/room-visual/{roomName}`.

4.  **[Market Resources](./market.md)**
    *   Resources for accessing market data, such as order books, transaction history, and resource price statistics.
    *   Examples: `/game/market/orders/{resourceType}`, `/game/market/history/{resourceType}`, `/game/market/stats`.

5.  **[Simulation & Analysis Resources](./simulation.md)** (Potentially)
    *   Resources that might store or provide access to results of simulations or complex analyses run by tools.
    *   Examples: `/simulation/results/{simulationId}`, `/analysis/reports/{reportId}`.
    *   *Note: The exact nature of these resources will depend on the implementation of simulation and analysis tools.*

## General Resource Usage

Resources are accessed via URIs. Each resource will have a defined data structure for its response.

Refer to the individual markdown files in this directory for detailed specifications of each resource, including:
*   URI structure and parameters
*   Data schema of the response
*   Refresh semantics (how often the data is updated or can be fetched)
*   Potential errors
*   Usage examples

---

Next, I will create the `docs/examples/README.md` file as an index for usage examples.
