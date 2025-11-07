import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Stricter rate limit for optimization endpoint
const optimizeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 optimization requests per 15 minutes
  message: {
    error: 'Too many optimization requests, please try again later',
    code: 'OPTIMIZATION_RATE_LIMIT_EXCEEDED'
  }
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Initialize jobs storage with cleanup
global.jobs = global.jobs || new Map();
const JOB_TTL = 3600000; // 1 hour TTL

// Cleanup old jobs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [jobId, job] of global.jobs.entries()) {
    const jobTime = new Date(job.startTime).getTime();
    if (now - jobTime > JOB_TTL) {
      global.jobs.delete(jobId);
      console.log(`Cleaned up expired job: ${jobId}`);
    }
  }
}, 600000);

// Input validation helper
const validateQuery = (query) => {
  if (typeof query !== 'string') return false;
  if (query.length > 5000) return false; // Max query length
  // Basic SQL validation (allow SELECT, EXPLAIN, but block dangerous keywords)
  const dangerousKeywords = /\b(DROP|DELETE|TRUNCATE|ALTER|GRANT|REVOKE)\b/i;
  return !dangerousKeywords.test(query);
};

// API Routes with error handling
app.post('/api/optimize', optimizeLimiter, async (req, res) => {
  try {
    const { queries, tableName, options } = req.body;

    // Validation
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        error: 'Queries array is required',
        code: 'INVALID_QUERIES'
      });
    }

    if (queries.length > 50) {
      return res.status(400).json({
        error: 'Too many queries (max 50)',
        code: 'TOO_MANY_QUERIES'
      });
    }

    // Validate each query
    for (const query of queries) {
      if (!validateQuery(query)) {
        return res.status(400).json({
          error: 'Invalid or unsafe query detected',
          code: 'INVALID_QUERY'
        });
      }
    }

    // Validate table name
    if (tableName && !/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return res.status(400).json({
        error: 'Invalid table name',
        code: 'INVALID_TABLE_NAME'
      });
    }

    // Simulate optimization for demo
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    global.jobs.set(jobId, {
      id: jobId,
      status: 'running',
      startTime: new Date().toISOString(),
      queries: queries.length,
      tableName: tableName || 'unknown'
    });

    // Simulate completion after delay
    setTimeout(() => {
      const job = global.jobs.get(jobId);
      if (job) {
        // Generate full demo results structure
        const avgTimeA = 45 + Math.random() * 20;
        const avgTimeB = 25 + Math.random() * 15;
        const improvement = ((avgTimeA - avgTimeB) / avgTimeA) * 100;

        job.status = 'completed';
        job.endTime = new Date().toISOString();
        job.results = {
          strategies: {
            strategyA: {
              name: 'Basic Single-Column Strategy',
              description: 'Simple single-column B-tree indexes',
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
                  rationale: 'Single-column index for ORDER BY sorting'
                }
              ],
              estimatedSize: 85,
              complexity: 'low'
            },
            strategyB: {
              name: 'Advanced Composite Strategy',
              description: 'Optimized composite and partial indexes',
              indexes: [
                {
                  name: 'idx_orders_status_created_at',
                  sql: 'CREATE INDEX idx_orders_status_created_at ON orders (status, created_at DESC);',
                  type: 'btree',
                  columns: ['status', 'created_at'],
                  table: 'orders',
                  rationale: 'Composite index covering WHERE and ORDER BY'
                },
                {
                  name: 'idx_products_category_price',
                  sql: 'CREATE INDEX idx_products_category_price ON products (category, price) WHERE stock_quantity > 0;',
                  type: 'btree_partial',
                  columns: ['category', 'price'],
                  table: 'products',
                  rationale: 'Partial composite index for multi-column filters'
                },
                {
                  name: 'idx_orders_user_created',
                  sql: 'CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);',
                  type: 'btree',
                  columns: ['user_id', 'created_at'],
                  table: 'orders',
                  rationale: 'Composite index for JOIN + ORDER BY queries'
                }
              ],
              estimatedSize: 142,
              complexity: 'high'
            }
          },
          forks: {
            forkA: 'demo-strategy-a-fork',
            forkB: 'demo-strategy-b-fork'
          },
          performance: {
            strategyA: queries.map(q => ({
              query: q,
              executionTime: avgTimeA + Math.random() * 10,
              planningTime: 2 + Math.random() * 3
            })),
            strategyB: queries.map(q => ({
              query: q,
              executionTime: avgTimeB + Math.random() * 10,
              planningTime: 1.5 + Math.random() * 2
            }))
          },
          comparison: {
            strategyA: {
              name: 'Basic Single-Column Strategy',
              avgExecutionTime: avgTimeA,
              queries: queries.length,
              indexes: 3,
              estimatedSize: 85
            },
            strategyB: {
              name: 'Advanced Composite Strategy',
              avgExecutionTime: avgTimeB,
              queries: queries.length,
              indexes: 3,
              estimatedSize: 142
            },
            improvement: {
              percentage: improvement,
              faster: improvement > 0 ? 'strategyB' : 'strategyA',
              timeSaved: Math.abs(avgTimeA - avgTimeB)
            }
          },
          recommendation: {
            action: improvement > 5 ? 'apply_strategy' : 'no_change',
            strategy: improvement > 0 ? 'strategyB' : 'strategyA',
            reason: improvement > 5
              ? `Advanced Composite Strategy shows ${improvement.toFixed(1)}% improvement`
              : 'Performance difference is negligible',
            confidence: Math.abs(improvement) > 20 ? 'high' : improvement > 10 ? 'medium' : 'low',
            estimatedImpact: `Save ~${Math.abs(avgTimeA - avgTimeB).toFixed(2)}ms per query`
          }
        };
      }
    }, 5000);

    res.json({ jobId, status: 'started' });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      error: 'Optimization failed',
      code: 'OPTIMIZATION_ERROR',
      details: NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get optimization status
app.get('/api/optimize/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate jobId format
    if (!/^job_\d+_[a-z0-9]+$/.test(jobId)) {
      return res.status(400).json({
        error: 'Invalid job ID format',
        code: 'INVALID_JOB_ID'
      });
    }

    const job = global.jobs.get(jobId);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        code: 'JOB_NOT_FOUND'
      });
    }

    res.json(job);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Failed to get job status',
      code: 'STATUS_ERROR'
    });
  }
});

// Catch-all handler for production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// Error handling middleware (MUST be after all routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 A/B Index Optimizer ready (${NODE_ENV})`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

export default app;