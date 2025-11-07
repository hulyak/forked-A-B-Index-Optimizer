#!/usr/bin/env node

/**
 * MCP Server for Tiger Data A/B Index Optimizer
 * Provides tools for fork management and database operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TigerService } from '../server/services/tiger.js';

class TigerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'tiger-optimizer',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tigerService = new TigerService();
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_fork',
            description: 'Create a zero-copy database fork for testing',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name for the new fork',
                },
              },
              required: ['forkName'],
            },
          },
          {
            name: 'delete_fork',
            description: 'Delete a database fork',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name of the fork to delete',
                },
              },
              required: ['forkName'],
            },
          },
          {
            name: 'list_forks',
            description: 'List all available database forks',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'run_query',
            description: 'Execute a SQL query on a specific fork',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name of the fork to query',
                },
                query: {
                  type: 'string',
                  description: 'SQL query to execute',
                },
              },
              required: ['forkName', 'query'],
            },
          },
          {
            name: 'explain_analyze',
            description: 'Run EXPLAIN ANALYZE on a query to get performance metrics',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name of the fork to query',
                },
                query: {
                  type: 'string',
                  description: 'SQL query to analyze',
                },
              },
              required: ['forkName', 'query'],
            },
          },
          {
            name: 'create_index',
            description: 'Create an index on a specific fork',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name of the fork',
                },
                indexName: {
                  type: 'string',
                  description: 'Name of the index to create',
                },
                tableName: {
                  type: 'string',
                  description: 'Table to create index on',
                },
                columns: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Columns to include in the index',
                },
                indexType: {
                  type: 'string',
                  description: 'Type of index (btree, hash, gin, etc.)',
                  default: 'btree',
                },
              },
              required: ['forkName', 'indexName', 'tableName', 'columns'],
            },
          },
          {
            name: 'drop_index',
            description: 'Drop an index from a specific fork',
            inputSchema: {
              type: 'object',
              properties: {
                forkName: {
                  type: 'string',
                  description: 'Name of the fork',
                },
                indexName: {
                  type: 'string',
                  description: 'Name of the index to drop',
                },
              },
              required: ['forkName', 'indexName'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_fork':
            return await this.handleCreateFork(args);
          case 'delete_fork':
            return await this.handleDeleteFork(args);
          case 'list_forks':
            return await this.handleListForks(args);
          case 'run_query':
            return await this.handleRunQuery(args);
          case 'explain_analyze':
            return await this.handleExplainAnalyze(args);
          case 'create_index':
            return await this.handleCreateIndex(args);
          case 'drop_index':
            return await this.handleDropIndex(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async handleCreateFork(args) {
    const { forkName } = args;
    const result = await this.tigerService.createFork(forkName);
    
    return {
      content: [
        {
          type: 'text',
          text: `Fork '${forkName}' created successfully. Connection: ${result.connectionString}`,
        },
      ],
    };
  }

  async handleDeleteFork(args) {
    const { forkName } = args;
    const result = await this.tigerService.deleteFork(forkName);
    
    return {
      content: [
        {
          type: 'text',
          text: result.deleted 
            ? `Fork '${forkName}' deleted successfully`
            : `Failed to delete fork '${forkName}': ${result.error}`,
        },
      ],
    };
  }

  async handleListForks() {
    const forks = await this.tigerService.listForks();

    return {
      content: [
        {
          type: 'text',
          text: `Available forks:\n${forks.map(f => `- ${f.name} (${f.status})`).join('\n')}`,
        },
      ],
    };
  }

  async handleRunQuery(args) {
    const { forkName, query } = args;
    const connectionString = this.tigerService.getForkConnectionString(forkName);
    const result = await this.tigerService.executeQuery(connectionString, query);
    
    return {
      content: [
        {
          type: 'text',
          text: `Query executed on fork '${forkName}':\nRows returned: ${result.rowCount}\nDuration: ${result.duration}ms`,
        },
      ],
    };
  }

  async handleExplainAnalyze(args) {
    const { forkName, query } = args;
    const connectionString = this.tigerService.getForkConnectionString(forkName);
    const result = await this.tigerService.explainAnalyze(connectionString, query);
    
    return {
      content: [
        {
          type: 'text',
          text: `EXPLAIN ANALYZE results for fork '${forkName}':\nExecution Time: ${result.executionTime}ms\nPlanning Time: ${result.planningTime}ms\n\nPlan:\n${JSON.stringify(result.plan, null, 2)}`,
        },
      ],
    };
  }

  async handleCreateIndex(args) {
    const { forkName, indexName, tableName, columns, indexType = 'btree' } = args;
    const connectionString = this.tigerService.getForkConnectionString(forkName);
    
    const sql = `CREATE INDEX ${indexName} ON ${tableName} USING ${indexType} (${columns.join(', ')});`;
    await this.tigerService.executeQuery(connectionString, sql);
    
    return {
      content: [
        {
          type: 'text',
          text: `Index '${indexName}' created on fork '${forkName}' successfully.\nSQL: ${sql}`,
        },
      ],
    };
  }

  async handleDropIndex(args) {
    const { forkName, indexName } = args;
    const connectionString = this.tigerService.getForkConnectionString(forkName);
    
    const sql = `DROP INDEX IF EXISTS ${indexName};`;
    await this.tigerService.executeQuery(connectionString, sql);
    
    return {
      content: [
        {
          type: 'text',
          text: `Index '${indexName}' dropped from fork '${forkName}' successfully.`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Tiger MCP Server running on stdio');
  }
}

// Start the server
const server = new TigerMCPServer();
server.run().catch(console.error);