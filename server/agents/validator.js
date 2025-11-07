export class ValidatorAgent {
  constructor(tigerService) {
    this.tigerService = tigerService;
    this.name = 'ValidatorAgent';
  }

  async applyIndexStrategy(connectionString, strategy) {
    const results = [];
    
    for (const index of strategy.indexes) {
      try {
        await this.tigerService.executeQuery(connectionString, index.sql);
        results.push({
          index: index.name,
          status: 'created',
          sql: index.sql
        });
      } catch (error) {
        results.push({
          index: index.name,
          status: 'failed',
          error: error.message,
          sql: index.sql
        });
      }
    }

    return results;
  }

  async runPerformanceTests(connectionString, queries) {
    const results = [];

    for (const query of queries) {
      try {
        // Run the query multiple times to get consistent timing
        const runs = [];
        for (let i = 0; i < 3; i++) {
          const result = await this.tigerService.explainAnalyze(connectionString, query);
          runs.push(result);
        }

        // Calculate average performance metrics
        const avgExecutionTime = runs.reduce((sum, run) => sum + run.executionTime, 0) / runs.length;
        const avgPlanningTime = runs.reduce((sum, run) => sum + run.planningTime, 0) / runs.length;

        // Get the most recent plan for analysis
        const latestRun = runs[runs.length - 1];

        results.push({
          query,
          executionTime: avgExecutionTime,
          planningTime: avgPlanningTime,
          plan: latestRun.plan,
          metrics: this.extractPlanMetrics(latestRun.plan),
          runs: runs.length
        });
      } catch (error) {
        results.push({
          query,
          error: error.message,
          executionTime: null,
          planningTime: null
        });
      }
    }

    return results;
  }

  extractPlanMetrics(plan) {
    const metrics = {
      totalCost: plan['Total Cost'] || 0,
      actualRows: plan['Actual Rows'] || 0,
      actualLoops: plan['Actual Loops'] || 1,
      indexScans: 0,
      seqScans: 0,
      bufferHits: 0,
      bufferReads: 0
    };

    // Recursively analyze the plan tree
    this.analyzePlanNode(plan, metrics);

    return metrics;
  }

  analyzePlanNode(node, metrics) {
    // Count different scan types
    if (node['Node Type']) {
      switch (node['Node Type']) {
        case 'Index Scan':
        case 'Index Only Scan':
        case 'Bitmap Index Scan':
          metrics.indexScans++;
          break;
        case 'Seq Scan':
          metrics.seqScans++;
          break;
      }
    }

    // Extract buffer statistics if available
    if (node['Shared Hit Blocks']) {
      metrics.bufferHits += node['Shared Hit Blocks'];
    }
    if (node['Shared Read Blocks']) {
      metrics.bufferReads += node['Shared Read Blocks'];
    }

    // Recursively process child plans
    if (node.Plans && Array.isArray(node.Plans)) {
      node.Plans.forEach(childPlan => {
        this.analyzePlanNode(childPlan, metrics);
      });
    }
  }

  async cleanupIndexes(connectionString, strategy) {
    const results = [];

    for (const index of strategy.indexes) {
      try {
        // Sanitize index name to prevent SQL injection
        const sanitizedIndexName = this.sanitizeIdentifier(index.name);
        const dropSql = `DROP INDEX IF EXISTS ${sanitizedIndexName};`;
        await this.tigerService.executeQuery(connectionString, dropSql);
        results.push({
          index: index.name,
          status: 'dropped'
        });
      } catch (error) {
        results.push({
          index: index.name,
          status: 'drop_failed',
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Sanitize SQL identifiers to prevent SQL injection
   */
  sanitizeIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') {
      throw new Error('Invalid identifier');
    }

    const sanitized = identifier.replace(/[^a-zA-Z0-9_]/g, '');

    if (/^[0-9]/.test(sanitized)) {
      throw new Error('Identifier cannot start with a number');
    }

    if (sanitized.length === 0) {
      throw new Error('Identifier cannot be empty after sanitization');
    }

    return sanitized;
  }

  generatePerformanceReport(results) {
    const summary = {
      totalQueries: results.length,
      successfulQueries: results.filter(r => !r.error).length,
      avgExecutionTime: 0,
      avgPlanningTime: 0,
      indexUsage: {
        indexScans: 0,
        seqScans: 0
      },
      recommendations: []
    };

    const validResults = results.filter(r => !r.error);
    
    if (validResults.length > 0) {
      summary.avgExecutionTime = validResults.reduce((sum, r) => sum + r.executionTime, 0) / validResults.length;
      summary.avgPlanningTime = validResults.reduce((sum, r) => sum + r.planningTime, 0) / validResults.length;
      
      validResults.forEach(result => {
        if (result.metrics) {
          summary.indexUsage.indexScans += result.metrics.indexScans;
          summary.indexUsage.seqScans += result.metrics.seqScans;
        }
      });
    }

    // Generate recommendations based on analysis
    if (summary.indexUsage.seqScans > summary.indexUsage.indexScans) {
      summary.recommendations.push('Consider adding more indexes - high sequential scan ratio detected');
    }

    if (summary.avgExecutionTime > 100) {
      summary.recommendations.push('Query performance could be improved - average execution time is high');
    }

    return summary;
  }
}