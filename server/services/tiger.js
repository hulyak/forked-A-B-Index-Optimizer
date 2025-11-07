import { exec } from 'child_process';
import { promisify } from 'util';
import pg from 'pg';

const execAsync = promisify(exec);
const { Client, Pool } = pg;

export class TigerService {
  constructor() {
    this.serviceName = process.env.TIGER_SERVICE_NAME || 'my-agentic-db';
    this.baseConnectionString = process.env.TIGER_DATABASE_URL;
    // Create connection pool for better performance
    this.pool = this.baseConnectionString ? new Pool({
      connectionString: this.baseConnectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection available
    }) : null;
  }

  // Clean up pool on shutdown
  async shutdown() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  // Create a zero-copy fork for testing
  async createFork(forkName) {
    try {
      // For demo purposes, we'll simulate fork creation using the main database
      // In production, this would create actual Tiger Data forks
      console.log(`Creating simulated fork: ${forkName}`);
      
      const connectionString = this.baseConnectionString;
      
      return {
        forkName,
        connectionString,
        created: new Date().toISOString(),
        isSimulated: true
      };
    } catch (error) {
      throw new Error(`Failed to create fork ${forkName}: ${error.message}`);
    }
  }

  // Delete a fork when done
  async deleteFork(forkName) {
    try {
      const tigerPath = process.env.TIGER_CLI_PATH || '/Users/hulyakarakaya/.local/bin/tiger';
      // For now, we'll just return success since fork deletion might need the service ID
      // In a real implementation, you'd store the fork service ID and delete it
      console.log(`Would delete fork: ${forkName}`);
      return { deleted: true, forkName };
    } catch (error) {
      console.warn(`Failed to delete fork ${forkName}:`, error.message);
      return { deleted: false, forkName, error: error.message };
    }
  }

  // List all forks
  async listForks() {
    try {
      const tigerPath = process.env.TIGER_CLI_PATH || '/Users/hulyakarakaya/.local/bin/tiger';
      const command = `${tigerPath} service list`;
      const { stdout } = await execAsync(command);
      
      // Parse the output to extract service names (forks will show as separate services)
      return this.parseForksList(stdout);
    } catch (error) {
      throw new Error(`Failed to list forks: ${error.message}`);
    }
  }

  // Get connection string for a specific fork
  getForkConnectionString(forkServiceId) {
    // For Tiger Data, each fork is a separate service with its own connection string
    // This would need to be retrieved from the Tiger CLI output or API
    // For demo purposes, we'll use the main connection string
    return this.baseConnectionString;
  }

  // Extract service ID from Tiger CLI output
  extractServiceIdFromOutput(output) {
    // Parse the Tiger CLI output to extract the new service ID
    // This is a simplified version - in reality you'd parse the actual output format
    const match = output.match(/Service ID.*?([a-z0-9]+)/i);
    return match ? match[1] : null;
  }

  // Execute query with explain analyze
  async explainAnalyze(connectionString, query) {
    // Use pool if available, otherwise fall back to single client
    if (this.pool && connectionString === this.baseConnectionString) {
      // Run EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
      const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
      const result = await this.pool.query(explainQuery);

      return {
        query,
        plan: result.rows[0]['QUERY PLAN'][0],
        executionTime: result.rows[0]['QUERY PLAN'][0]['Execution Time'],
        planningTime: result.rows[0]['QUERY PLAN'][0]['Planning Time']
      };
    } else {
      // For fork-specific connections, create a temporary client
      const client = new Client({ connectionString });

      try {
        await client.connect();

        // Run EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
        const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
        const result = await client.query(explainQuery);

        return {
          query,
          plan: result.rows[0]['QUERY PLAN'][0],
          executionTime: result.rows[0]['QUERY PLAN'][0]['Execution Time'],
          planningTime: result.rows[0]['QUERY PLAN'][0]['Planning Time']
        };
      } finally {
        await client.end();
      }
    }
  }

  // Execute a regular query
  async executeQuery(connectionString, query) {
    // Use pool if available, otherwise fall back to single client
    if (this.pool && connectionString === this.baseConnectionString) {
      const start = Date.now();
      const result = await this.pool.query(query);
      const duration = Date.now() - start;

      return {
        query,
        rowCount: result.rowCount,
        duration,
        rows: result.rows
      };
    } else {
      // For fork-specific connections, create a temporary client
      const client = new Client({ connectionString });

      try {
        await client.connect();
        const start = Date.now();
        const result = await client.query(query);
        const duration = Date.now() - start;

        return {
          query,
          rowCount: result.rowCount,
          duration,
          rows: result.rows
        };
      } finally {
        await client.end();
      }
    }
  }

  // Helper to parse forks list output
  parseForksList(output) {
    // Adapt this based on actual Tiger CLI output format
    const lines = output.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(/\s+/);
      return {
        name: parts[0],
        status: parts[1] || 'active',
        created: parts[2] || new Date().toISOString()
      };
    });
  }
}