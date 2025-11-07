// Demo data generator for hackathon presentation
// Updated: Fixed zero values issue by ensuring default queries

export const generateDemoOptimizationResult = (queries) => {
  // Parse queries to make demo more realistic
  // Ensure we always have at least some demo queries
  const demoQueries = Array.isArray(queries) && queries.length > 0
    ? queries
    : [
        "SELECT * FROM users WHERE email = 'user@example.com' ORDER BY created_at DESC;",
        "SELECT COUNT(*) FROM orders WHERE user_id = 123 AND status = 'completed';",
        "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY order_count DESC;"
      ];

  const queryCount = demoQueries.length;

  const strategies = {
    strategyA: {
      name: 'Basic Single-Column Strategy',
      description: 'Simple single-column B-tree indexes on most queried columns',
      indexes: [
        {
          name: 'idx_users_email',
          sql: 'CREATE INDEX idx_users_email ON users (email);',
          type: 'btree',
          columns: ['email'],
          table: 'users',
          rationale: 'Single-column index for WHERE clause filtering on email'
        },
        {
          name: 'idx_orders_status',
          sql: 'CREATE INDEX idx_orders_status ON orders (status);',
          type: 'btree',
          columns: ['status'],
          table: 'orders',
          rationale: 'Single-column index for WHERE clause filtering on status'
        },
        {
          name: 'idx_orders_created_at',
          sql: 'CREATE INDEX idx_orders_created_at ON orders (created_at);',
          type: 'btree',
          columns: ['created_at'],
          table: 'orders',
          rationale: 'Single-column index for ORDER BY sorting on created_at'
        }
      ],
      estimatedSize: 85,
      complexity: 'low'
    },
    strategyB: {
      name: 'Advanced Composite Strategy',
      description: 'Optimized composite and partial indexes for complex query patterns',
      indexes: [
        {
          name: 'idx_orders_status_created_at',
          sql: 'CREATE INDEX idx_orders_status_created_at ON orders (status, created_at DESC);',
          type: 'btree',
          columns: ['status', 'created_at'],
          table: 'orders',
          rationale: 'Composite index covering WHERE filtering and ORDER BY sorting in single scan'
        },
        {
          name: 'idx_products_category_price',
          sql: 'CREATE INDEX idx_products_category_price ON products (category, price) WHERE stock_quantity > 0;',
          type: 'btree_partial',
          columns: ['category', 'price'],
          table: 'products',
          rationale: 'Partial composite index for multi-column filters, excluding out-of-stock items'
        },
        {
          name: 'idx_orders_user_created',
          sql: 'CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);',
          type: 'btree',
          columns: ['user_id', 'created_at'],
          table: 'orders',
          rationale: 'Composite index optimized for JOIN + ORDER BY queries'
        }
      ],
      estimatedSize: 142,
      complexity: 'high'
    }
  };

  // Simulate performance results
  const performanceA = demoQueries.map((query, i) => ({
    query,
    executionTime: 45 + Math.random() * 20, // 45-65ms
    planningTime: 2 + Math.random() * 3,    // 2-5ms
    plan: {
      'Node Type': 'Index Scan',
      'Total Cost': 100 + Math.random() * 50,
      'Actual Rows': 1000 + Math.random() * 500,
      'Actual Loops': 1
    },
    metrics: {
      totalCost: 100 + Math.random() * 50,
      actualRows: 1000 + Math.random() * 500,
      indexScans: 1,
      seqScans: 0,
      bufferHits: 50 + Math.random() * 20,
      bufferReads: 5 + Math.random() * 10
    },
    runs: 3
  }));

  const performanceB = demoQueries.map((query, i) => ({
    query,
    executionTime: 25 + Math.random() * 15, // 25-40ms (better)
    planningTime: 1.5 + Math.random() * 2,  // 1.5-3.5ms
    plan: {
      'Node Type': 'Index Only Scan',
      'Total Cost': 60 + Math.random() * 30,
      'Actual Rows': 1000 + Math.random() * 500,
      'Actual Loops': 1
    },
    metrics: {
      totalCost: 60 + Math.random() * 30,
      actualRows: 1000 + Math.random() * 500,
      indexScans: 1,
      seqScans: 0,
      bufferHits: 80 + Math.random() * 15,
      bufferReads: 2 + Math.random() * 5
    },
    runs: 3
  }));

  const avgTimeA = performanceA.reduce((sum, r) => sum + r.executionTime, 0) / performanceA.length;
  const avgTimeB = performanceB.reduce((sum, r) => sum + r.executionTime, 0) / performanceB.length;
  const improvement = ((avgTimeA - avgTimeB) / avgTimeA) * 100;

  const comparison = {
    strategyA: {
      name: strategies.strategyA.name,
      avgExecutionTime: avgTimeA,
      queries: performanceA.length,
      indexes: strategies.strategyA.indexes.length,
      estimatedSize: strategies.strategyA.estimatedSize
    },
    strategyB: {
      name: strategies.strategyB.name,
      avgExecutionTime: avgTimeB,
      queries: performanceB.length,
      indexes: strategies.strategyB.indexes.length,
      estimatedSize: strategies.strategyB.estimatedSize
    },
    improvement: {
      percentage: improvement,
      faster: improvement > 0 ? 'strategyB' : 'strategyA',
      timeSaved: Math.abs(avgTimeA - avgTimeB)
    }
  };

  const recommendation = {
    action: improvement > 5 ? 'apply_strategy' : 'no_change',
    strategy: improvement > 0 ? 'strategyB' : 'strategyA',
    reason: improvement > 5 
      ? `${strategies.strategyB.name} shows ${improvement.toFixed(1)}% improvement`
      : 'Performance difference is negligible (<5%)',
    confidence: Math.abs(improvement) > 20 ? 'high' : improvement > 10 ? 'medium' : 'low',
    estimatedImpact: `Save ~${Math.abs(avgTimeA - avgTimeB).toFixed(2)}ms per query`,
    hybridSearchInsights: {
      similarPatterns: [
        { pattern: 'WHERE + ORDER BY optimization', confidence: 0.92, source: 'pg_textsearch' },
        { pattern: 'Composite index benefits', confidence: 0.87, source: 'pgvector' },
        { pattern: 'Partial index selectivity', confidence: 0.79, source: 'hybrid_fusion' }
      ],
      recommendations: [
        'Consider adding covering indexes for frequent SELECT columns',
        'Partial indexes show 23% better selectivity for filtered queries',
        'Composite indexes reduce random I/O by 45% for multi-column filters'
      ]
    }
  };

  return {
    strategies,
    forks: { 
      forkA: 'demo-strategy-a-fork', 
      forkB: 'demo-strategy-b-fork' 
    },
    performance: { 
      strategyA: performanceA, 
      strategyB: performanceB 
    },
    comparison,
    recommendation
  };
};

export const simulateOptimizationProgress = (onUpdate) => {
  const steps = [
    { status: 'generating_strategies', delay: 1000 },
    { status: 'creating_forks', delay: 2000 },
    { status: 'applying_strategies', delay: 1500 },
    { status: 'running_tests', delay: 3000 },
    { status: 'analyzing_results', delay: 1000 },
    { status: 'completed', delay: 500 }
  ];

  let currentStep = 0;
  
  const processStep = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      onUpdate({ status: step.status });
      
      setTimeout(() => {
        currentStep++;
        processStep();
      }, step.delay);
    }
  };

  processStep();
};