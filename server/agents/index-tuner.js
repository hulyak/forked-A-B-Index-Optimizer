export class IndexTunerAgent {
  constructor() {
    this.name = 'IndexTunerAgent';
  }

  async generateIndexStrategies(queries, tableName) {
    // Analyze queries to determine optimal index strategies
    const analysis = this.analyzeQueries(queries, tableName);
    
    return {
      strategyA: this.generateBasicStrategy(analysis),
      strategyB: this.generateAdvancedStrategy(analysis),
      analysis
    };
  }

  analyzeQueries(queries, tableName) {
    const patterns = {
      whereColumns: new Set(),
      orderByColumns: new Set(),
      joinColumns: new Set(),
      selectColumns: new Set(),
      aggregations: []
    };

    queries.forEach(query => {
      const normalized = query.toLowerCase().replace(/\s+/g, ' ').trim();
      
      // Extract WHERE clause columns
      const whereMatch = normalized.match(/where\s+(.+?)(?:\s+order\s+by|\s+group\s+by|\s+limit|$)/);
      if (whereMatch) {
        const whereClause = whereMatch[1];
        const columns = this.extractColumnsFromWhere(whereClause);
        columns.forEach(col => patterns.whereColumns.add(col));
      }

      // Extract ORDER BY columns
      const orderMatch = normalized.match(/order\s+by\s+(.+?)(?:\s+limit|$)/);
      if (orderMatch) {
        const orderColumns = this.extractColumnsFromOrderBy(orderMatch[1]);
        orderColumns.forEach(col => patterns.orderByColumns.add(col));
      }

      // Extract JOIN columns
      const joinMatches = normalized.match(/join\s+\w+\s+on\s+(.+?)(?:\s+where|\s+order|\s+group|$)/g);
      if (joinMatches) {
        joinMatches.forEach(joinClause => {
          const columns = this.extractColumnsFromJoin(joinClause);
          columns.forEach(col => patterns.joinColumns.add(col));
        });
      }
    });

    return {
      tableName,
      patterns,
      queryCount: queries.length,
      complexity: this.assessComplexity(patterns)
    };
  }

  generateBasicStrategy(analysis) {
    const { patterns, tableName } = analysis;
    const indexes = [];

    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = this.sanitizeIdentifier(tableName);

    // Strategy A: Single-column indexes on most frequent WHERE columns
    Array.from(patterns.whereColumns).slice(0, 2).forEach(column => {
      const sanitizedColumn = this.sanitizeIdentifier(column);
      indexes.push({
        name: `idx_${sanitizedTableName}_${sanitizedColumn}`,
        sql: `CREATE INDEX idx_${sanitizedTableName}_${sanitizedColumn} ON ${sanitizedTableName} (${sanitizedColumn});`,
        type: 'btree',
        columns: [column],
        rationale: `Single-column index for WHERE clause filtering on ${column}`
      });
    });

    return {
      name: 'Basic Single-Column Strategy',
      description: 'Simple single-column B-tree indexes on most queried columns',
      indexes,
      estimatedSize: indexes.length * 50, // MB estimate
      complexity: 'low'
    };
  }

  generateAdvancedStrategy(analysis) {
    const { patterns, tableName } = analysis;
    const indexes = [];

    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = this.sanitizeIdentifier(tableName);

    // Strategy B: Composite indexes optimized for query patterns
    const whereColumns = Array.from(patterns.whereColumns);
    const orderColumns = Array.from(patterns.orderByColumns);

    if (whereColumns.length > 0 && orderColumns.length > 0) {
      // Composite index: WHERE columns + ORDER BY columns
      const compositeColumns = [...whereColumns.slice(0, 2), ...orderColumns.slice(0, 1)];
      const sanitizedCompositeColumns = compositeColumns.map(col => this.sanitizeIdentifier(col));
      indexes.push({
        name: `idx_${sanitizedTableName}_composite`,
        sql: `CREATE INDEX idx_${sanitizedTableName}_composite ON ${sanitizedTableName} (${sanitizedCompositeColumns.join(', ')});`,
        type: 'btree',
        columns: compositeColumns,
        rationale: 'Composite index covering WHERE filtering and ORDER BY sorting'
      });
    }

    // Partial index for common WHERE conditions
    if (whereColumns.length > 0) {
      const mainColumn = whereColumns[0];
      const sanitizedColumn = this.sanitizeIdentifier(mainColumn);
      indexes.push({
        name: `idx_${sanitizedTableName}_${sanitizedColumn}_partial`,
        sql: `CREATE INDEX idx_${sanitizedTableName}_${sanitizedColumn}_partial ON ${sanitizedTableName} (${sanitizedColumn}) WHERE ${sanitizedColumn} IS NOT NULL;`,
        type: 'btree_partial',
        columns: [mainColumn],
        rationale: `Partial index on ${mainColumn} excluding NULL values for better selectivity`
      });
    }

    return {
      name: 'Advanced Composite Strategy',
      description: 'Optimized composite and partial indexes for complex query patterns',
      indexes,
      estimatedSize: indexes.length * 75, // MB estimate
      complexity: 'high'
    };
  }

  extractColumnsFromWhere(whereClause) {
    // Simple extraction - in production, use a proper SQL parser
    const columns = [];
    const patterns = [
      /(\w+)\s*[=<>!]/g,
      /(\w+)\s+in\s*\(/gi,
      /(\w+)\s+like/gi,
      /(\w+)\s+between/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(whereClause)) !== null) {
        columns.push(match[1]);
      }
    });

    return [...new Set(columns)]; // Remove duplicates
  }

  extractColumnsFromOrderBy(orderClause) {
    return orderClause
      .split(',')
      .map(col => col.trim().split(/\s+/)[0])
      .filter(col => col && !['asc', 'desc'].includes(col.toLowerCase()));
  }

  extractColumnsFromJoin(joinClause) {
    const match = joinClause.match(/on\s+(.+)/);
    if (!match) return [];

    const condition = match[1];
    const columns = [];
    const eqMatches = condition.match(/(\w+)\s*=\s*(\w+)/g);
    
    if (eqMatches) {
      eqMatches.forEach(eq => {
        const parts = eq.split('=').map(p => p.trim());
        columns.push(...parts);
      });
    }

    return columns;
  }

  assessComplexity(patterns) {
    let score = 0;
    score += patterns.whereColumns.size * 2;
    score += patterns.orderByColumns.size * 1.5;
    score += patterns.joinColumns.size * 3;

    if (score < 5) return 'low';
    if (score < 15) return 'medium';
    return 'high';
  }

  /**
   * Sanitize SQL identifiers to prevent SQL injection
   * Allows only alphanumeric characters and underscores
   * Prevents reserved keywords
   */
  sanitizeIdentifier(identifier) {
    if (!identifier || typeof identifier !== 'string') {
      throw new Error('Invalid identifier');
    }

    // Remove any characters that are not alphanumeric or underscore
    const sanitized = identifier.replace(/[^a-zA-Z0-9_]/g, '');

    // Ensure it doesn't start with a number
    if (/^[0-9]/.test(sanitized)) {
      throw new Error('Identifier cannot start with a number');
    }

    // Check against common SQL reserved keywords
    const reservedKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TABLE', 'DATABASE'];
    if (reservedKeywords.includes(sanitized.toUpperCase())) {
      throw new Error('Cannot use SQL reserved keyword as identifier');
    }

    if (sanitized.length === 0) {
      throw new Error('Identifier cannot be empty after sanitization');
    }

    return sanitized;
  }
}