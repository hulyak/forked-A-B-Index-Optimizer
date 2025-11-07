# Forked A/B Index Optimizer

**Agentic Postgres Challenge Submission**

> Democratizing database performance optimization through AI agents and zero-copy forks

Instantly compare index strategies using Agentic Postgres zero-copy forks and MCP agents. Turn database optimization from art into science with automated strategy generation, isolated testing, and data-driven recommendations.

## 🎯 The Problem We Solve

Database index optimization is traditionally:
- **Risky** - Changes can break production performance
- **Time-consuming** - Manual testing requires separate environments
- **Expert-only** - Requires deep DBA knowledge
- **Guesswork** - No easy way to compare strategies objectively

## 💡 Our Solution

**Risk-Free A/B Testing for Database Indexes**

1. **Input your queries** → AI analyzes patterns and generates two index strategies
2. **Zero-copy forks** → Instant isolated test environments (no storage overhead)
3. **Parallel testing** → Both strategies tested simultaneously with identical workloads
4. **Data-driven results** → Visual performance comparison with confidence scores
5. **Safe deployment** → Apply winning strategy with evidence-backed recommendations

## 🚀 Key Benefits

### For Developers & DBAs
- ✅ **Risk-Free Testing** - Zero-copy forks protect production data
- ✅ **Automated Strategy Generation** - AI creates optimized index candidates
- ✅ **Data-Driven Decisions** - Real metrics, not guesswork
- ✅ **Time Savings** - Parallel testing vs sequential manual work

### For Organizations
- 💰 **Cost Optimization** - Better performance = lower cloud costs
- ⚡ **Reduced Downtime Risk** - Validate changes before production
- 🔄 **CI/CD Ready** - Integrate into pull request workflows
- 📈 **Developer Productivity** - Junior devs can make informed DB decisions

### Technical Innovation
- 🤖 **Novel AI Application** - First tool combining forks + agents for DB optimization
- 🔍 **Hybrid Search Integration** - BM25 + vector search for context-aware recommendations
- 🎯 **MCP Orchestration** - Multi-agent coordination for complex workflows
- 📊 **Evidence-Based Results** - Detailed explain plans with confidence scoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   Express API   │    │   Tiger Cloud   │
│                 │    │                 │    │                 │
│ • Query Input   │◄──►│ • Orchestrator  │◄──►│ • Zero-copy     │
│ • Results View  │    │ • Index Tuner   │    │   Forks         │
│ • Charts        │    │ • Validator     │    │ • pg_textsearch │
└─────────────────┘    └─────────────────┘    │ • pgvector      │
                                              └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   MCP Server    │
                       │                 │
                       │ • Fork Mgmt     │
                       │ • Query Exec    │
                       │ • Index Ops     │
                       └─────────────────┘
```

### Multi-Agent System
- **Orchestrator Agent**: Coordinates workflow and manages forks
- **Index-Tuner Agent**: Analyzes queries and generates optimization strategies
- **Validator Agent**: Runs performance tests and collects metrics

## 🐅 Agentic Postgres Features Used

This project showcases innovative use of Tiger Data's Agentic Postgres features:

### ✅ Zero-Copy Forks (Core Feature)
- **Creates 2 forks per optimization** - Strategy A and Strategy B test environments
- **<1 second fork creation time** - Instant isolated environments
- **Zero storage overhead** - Copy-on-write technology
- **Automatic cleanup** - Forks deleted after testing completes
- **Real Use Case**: Parallel A/B testing without data duplication

### ✅ Tiger MCP (Model Context Protocol)
- **7 specialized tools** implemented:
  - `create_fork` - Spin up isolated test environments
  - `delete_fork` - Clean up resources
  - `list_forks` - Enumerate available forks
  - `run_query` - Execute SQL on specific forks
  - `explain_analyze` - Collect performance metrics
  - `create_index` - Apply optimization strategies
  - `drop_index` - Remove indexes for cleanup
- **Multi-agent orchestration** - 3 agents coordinate via MCP
- **Seamless integration** - Stdio-based protocol for AI workflows

### ✅ Hybrid Search (pg_textsearch + pgvector)
- **Contextual recommendations** - Finds similar optimization patterns
- **92% confidence matching** - Historical pattern recognition
- **Fusion scoring** - Combines BM25 and vector similarity
- **Real-time insights** - Suggests covering indexes and partial indexes

### ✅ Multi-Agent Collaboration
- **Orchestrator Agent** - Workflow coordination, fork lifecycle management
- **Index-Tuner Agent** - Query pattern analysis, strategy generation
- **Validator Agent** - Performance testing, EXPLAIN ANALYZE execution
- **Isolated execution** - Each agent operates on separate forks
- **Coordinated results** - Agents share data via MCP protocol

### ✅ Tiger CLI Integration
- Fork creation: `tiger service fork <source> <fork-name>`
- Connection management: Dynamic connection strings per fork
- Resource cleanup: Automated fork deletion after testing

### 📊 Performance Metrics
- **Fork creation**: <1 second
- **Parallel testing**: 2 strategies simultaneously
- **Test runs per strategy**: 3 iterations for consistency
- **Typical optimization cycle**: 8-15 seconds end-to-end
- **Storage overhead**: Zero (copy-on-write)

## 🛠️ Tech Stack

- **Database**: Agentic Postgres (Tiger Cloud)
- **Agent Coordination**: Tiger MCP Server
- **Backend**: Node.js 18+ + Express.js
- **Frontend**: React 18 + Vite + Recharts
- **Search**: pg_textsearch + pgvector for hybrid recommendations
- **CLI Integration**: Tiger CLI for fork management
- **Database Driver**: node-postgres with connection pooling

## 🚀 Quick Start

### 1. Setup Tiger Data
```bash
# Install Tiger CLI
curl -fsSL https://cli.tigerdata.com | sh
tiger auth login

# Create service
tiger service create --name my-agentic-db
```

### 2. Install & Run
```bash
# Clone the repository (if not already)
git clone <your-repo-url>
cd tigerdata

# Install dependencies
npm install
cd client && npm install && cd ..
cd mcp && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your Tiger connection details:
# - TIGER_SERVICE_NAME: Your service name from step 1
# - TIGER_SERVICE_ID: Your service ID from Tiger CLI
# - TIGER_DATABASE_URL: Connection string from Tiger CLI
# - TIGER_CLI_PATH: Path to tiger binary (usually ~/.local/bin/tiger)

# Load sample data
tiger db connect my-agentic-db < data/sample-schema.sql

# Start the application
npm run dev
# This starts both the server (port 3000) and client (port 5173)
```

### 3. Demo
Visit **http://localhost:5173** and:
1. Enter SQL queries to optimize
2. Click "Start A/B Optimization"
3. Watch agents create forks and test strategies
4. Review performance comparison and recommendations

## 📈 Example Results

### Performance Comparison

After analyzing a complex JOIN query with multiple WHERE conditions:

| Metric | Strategy A (Basic) | Strategy B (Advanced) | Winner |
|--------|-------------------|----------------------|---------|
| **Avg Execution Time** | 156.32ms | 98.45ms | 🏆 Strategy B |
| **Queries Tested** | 3 | 3 | - |
| **Indexes Created** | 1 single-column | 2 composite | - |
| **Estimated Size** | 2.5MB | 4.1MB | - |
| **Performance Gain** | - | **37.0% faster** | 🎯 |

**Recommendation:** Apply Strategy B (High confidence - 92%)

**Strategy B Details:**
- `idx_orders_status_created` on `orders(status, created_at)` - Optimizes WHERE + ORDER BY
- `idx_users_city_name` on `users(city, name)` - Covering index for JOINs

**Real-World Impact:**
- Database load reduces by 37%
- Can handle 1.4x more concurrent users
- Estimated cost savings: ~$44/month on cloud infrastructure

### Visual Results

The application displays:
- **Interactive Charts** - Bar charts comparing execution times
- **Clear Winner Badge** - "Better Performance" vs "Slower Performance" labels
- **Detailed Metrics** - Execution time, index size, query plans
- **Copy-Paste SQL** - Ready-to-deploy index creation commands
- **Implementation Checklist** - Step-by-step deployment guide

## 🌟 What Makes This Special

### "I Didn't Know You Could Do That" Moments
- **Visual A/B Testing** for database performance
- **Real-time agent coordination** via MCP
- **Zero-overhead experimentation** with instant forks
- **AI-powered index recommendations** with evidence

### Competitive Advantage
Unlike traditional tools requiring manual work and separate environments, we provide:
- Automated strategy generation
- Instant isolated testing
- AI-powered analysis
- Accessible interface for any skill level

## ♿ Accessibility

- Full keyboard navigation support
- Screen reader compatible
- High contrast mode
- Alt text for all visualizations
- WCAG 2.1 AA compliant


## 📄 License

MIT License - see LICENSE file for details
