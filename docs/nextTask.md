# Screeps MCP 服务器开发继续指南

以下是继续开发 Screeps MCP 服务器的指令，请在新会话中使用这些步骤：

## 已完成工作

1.  **项目基础架构已搭建**
    *   基本目录结构: `src/`, `docs/`等
    *   TypeScript, ESLint, Prettier, Jest配置
    *   核心模块: 日志系统, 错误处理, 配置管理, API封装

2.  **核心文件已创建**
    *   `src/utils/logger.ts` - 使用Pino的日志系统
    *   `src/utils/errorHandler.ts` - 错误处理基础设施
    *   `src/config/index.ts` - 配置管理
    *   `src/api/screepsAPI.ts` - screeps-api库的封装
    *   `src/index.ts` - 主入口点和MCP服务器初始化

3.  **详细文档已编写**
    *   架构设计 (`docs/architecture.md`)
    *   认证方法 (`docs/authentication.md`)
    *   开发指南 (`docs/development.md`)

## 上次中断点

我们正在尝试通过 `npm run start:dev` 启动开发服务器，以验证基础设置。在之前的会话中，我们修复了 `package.json` 中的 `start:dev` 脚本，以正确使用 `ts-node` 的 ESM 加载器。

## 下一步开发指令

### 步骤1: 验证基础结构 (继续)

首先验证基础结构是否正常工作:

1.  **确保 `start:dev` 脚本已更新**:
    检查 `package.json` 中的 `scripts.start:dev` 是否为:
    `"start:dev": "nodemon --watch src --ext ts,json --exec \"node --loader ts-node/esm src/index.ts\""`

2.  **运行开发模式**:
    ```bash
    npm run start:dev
    ```
    观察终端输出。检查服务器是否能成功启动。由于我们尚未设置Screeps API凭证 (通过环境变量)，API初始化部分可能会打印警告或错误，但服务器本身应该能启动并连接到MCP传输。

3.  **如果服务器成功启动，使用MCP Inspector测试**:
    在另一个终端中运行:
    ```bash
    npm run inspector
    ```
    尝试列出工具 (Tools) 和资源 (Resources)。目前应该返回空列表，因为我们还没有定义任何具体的Screeps工具/资源。

4.  **构建项目 (如果尚未成功)**:
    ```bash
    npm run build
    ```
    确保没有编译错误。

### 步骤2: 实现基本操作工具 (Phase 2 开始)

如果步骤1中的服务器启动和基本检查通过，则开始实现第一个功能。

1.  **创建玩家信息工具**
    *   在 `src/tools/` 目录下创建 `playerTools.ts` 文件。
    *   实现一个名为 `getPlayerInfo` 的工具，该工具调用 `screeps-api` 的 `me()` 方法来获取当前认证用户的基本信息。
    *   定义此工具的输入 (可能为空) 和输出模式。

2.  **注册新工具**
    *   修改 `src/index.ts`，导入 `getPlayerInfo` 工具的定义。
    *   在 `server.setRequestHandler(ListToolsRequestSchema, ...)` 中注册此工具。
    *   为 `CallToolRequestSchema` 添加处理逻辑，以调用 `getPlayerInfo` 工具。

3.  **测试 `getPlayerInfo` 工具**
    *   设置必要的环境变量 (如 `SCREEPS_API_TOKEN` 和 `SCREEPS_SERVER_TYPE`)。
    *   重启开发服务器 (`npm run start:dev`)。
    *   使用 `npm run inspector` 来调用 `getPlayerInfo` 工具并验证其输出。

### 步骤3: 实现房间操作工具

在 `getPlayerInfo` 工具成功实现和测试后，继续实现房间相关的工具：

1.  **创建 `getOwnedRooms` 工具**
    *   在 `src/tools/roomTools.ts` (如果不存在则创建) 中实现。
    *   此工具调用 `screeps-api` 的相应方法 (例如，通过 `api.raw.user.rooms()` 或类似方法) 来列出玩家拥有的房间。
    *   定义输入输出模式。
    *   在 `src/index.ts` 中注册此工具。

2.  **创建 `getRoomDetails` 工具**
    *   在 `src/tools/roomTools.ts` 中实现。
    *   此工具接受房间名称作为输入，并返回该房间的详细信息 (例如，通过 `api.roomStatus()` 或 `api.roomTerrain()`, `api.roomObjects()` 等组合)。
    *   定义输入输出模式。
    *   在 `src/index.ts` 中注册此工具。

3.  **测试房间工具**
    *   使用 `npm run inspector` 测试这些新工具。

### 一般开发流程

对于每个新功能/工具/资源:
1.  在 `src/tools/` 或 `src/resources/` 中创建或修改相应的文件。
2.  实现与 `screeps-api` 的交互逻辑 (通过 `src/api/screepsAPI.ts` 中的封装器)。
3.  在 `src/index.ts` 中注册。
4.  编写单元测试 (在 `test/` 目录下)。
5.  使用 `npm run inspector` 进行手动测试。
6.  确保代码符合 ESLint 和 Prettier 规范 (`npm run lint`, `npm run format`)。

这些指令应该足够帮助下一个会话继续开发Screeps MCP服务器。
