# Tiger Cloud Setup & Deployment Guide

## 🎯 For Hackathon Judges & Testers

This guide helps you deploy and test the Forked A/B Index Optimizer on Tiger Cloud.

---

## Prerequisites

1. **Tiger Data Account** (Free Trial Available)
   - Sign up at: https://tigerdata.com
   - Email confirmation required
   - Free trial includes sufficient resources for testing

2. **System Requirements**
   - Node.js 18+ installed
   - Git installed
   - Terminal access

---

## 🚀 Step 1: Install Tiger CLI

### macOS / Linux
```bash
curl -fsSL https://cli.tigerdata.com/install.sh | sh
```

### Verify Installation
```bash
tiger --version
```

---

## 🔐 Step 2: Authenticate

```bash
tiger auth login
```

This will:
1. Open your browser for authentication
2. Save credentials to `~/.tiger/credentials`
3. Display your authentication status

Verify authentication:
```bash
tiger auth status
```

---

## 📊 Step 3: Create Tiger Database Service

### Option A: Create New Service
```bash
# Create a new Postgres service
tiger service create \
  --name forked-ab-optimizer-db \
  --region us-east-1 \
  --plan starter

# Wait for service to be ready (2-3 minutes)
tiger service status forked-ab-optimizer-db
```

### Option B: Use Existing Service
```bash
# List your services
tiger service list

# Use any existing Postgres service
tiger service get <your-service-name>
```

---

## 🔗 Step 4: Get Connection Details

```bash
# Get connection string
tiger service get forked-ab-optimizer-db --connection-string

# Example output:
# postgresql://user:password@hostname.tiger.cloud:5432/dbname
```

**Save this connection string** - you'll need it for configuration.

---

## 💾 Step 5: Load Sample Data

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd tigerdata

# Connect and load schema
tiger db connect forked-ab-optimizer-db < data/sample-schema.sql
```

This creates:
- `users` table with 1000+ sample records
- `orders` table with transaction data
- `products` table with inventory
- `order_items` table with line items
- Realistic relationships for testing

Verify data loaded:
```bash
tiger db connect forked-ab-optimizer-db

# In psql prompt:
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM orders;
\q
```

---

## ⚙️ Step 6: Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```bash
# Required
TIGER_SERVICE_NAME=forked-ab-optimizer-db
TIGER_DATABASE_URL=postgresql://user:password@hostname.tiger.cloud:5432/dbname

# Optional
PORT=3000
NODE_ENV=production
MCP_SERVER_PORT=3001
```

**Important**: Replace the connection string with your actual credentials from Step 4.

---

## 📦 Step 7: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install MCP server dependencies
cd mcp && npm install && cd ..
```

---

## 🏗️ Step 8: Build the Application

```bash
# Build the React frontend
npm run build
```

This creates optimized production files in `client/dist/`.

---

## 🚀 Step 9: Start the Application

### Development Mode (Recommended for Testing)
```bash
npm run dev
```

This starts:
- Backend server on port 3000
- Vite dev server on port 5173 (with hot reload)

Access at: **http://localhost:5173**

### Production Mode
```bash
npm start
```

Access at: **http://localhost:3000**

---

## ✅ Step 10: Verify Everything Works

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-06T...",
  "environment": "production"
}
```

### 2. Test Fork Creation
```bash
# Using Tiger CLI
tiger service fork forked-ab-optimizer-db test-fork-1

# Verify fork exists
tiger service list
```

### 3. Test the UI
1. Open http://localhost:5173 (dev) or http://localhost:3000 (prod)
2. You should see the purple hackathon banner
3. Toggle "Demo Mode" OFF to use real Tiger Cloud
4. Paste sample queries (see below)
5. Click "Start A/B Optimization"

---

## 🧪 Sample Test Queries

Use these queries to test the optimizer:

```sql
-- Query 1: Simple WHERE clause
SELECT * FROM users WHERE email = 'test@example.com';

-- Query 2: WHERE + ORDER BY
SELECT * FROM orders WHERE status = 'completed' ORDER BY created_at DESC;

-- Query 3: JOIN with filtering
SELECT u.name, COUNT(o.id)
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01'
GROUP BY u.name;

-- Query 4: Complex with multiple filters
SELECT *
FROM products
WHERE category = 'electronics'
  AND price > 100
  AND inventory > 0
ORDER BY price DESC
LIMIT 20;
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused"
**Solution:**
```bash
# Check if service is running
tiger service status forked-ab-optimizer-db

# Restart if needed
tiger service restart forked-ab-optimizer-db
```

### Issue: "Authentication failed"
**Solution:**
```bash
# Re-authenticate
tiger auth logout
tiger auth login
```

### Issue: "Fork creation failed"
**Solution:**
```bash
# Check fork limits
tiger service list

# Delete old forks
tiger service delete <fork-name>
```

### Issue: "Sample data not loading"
**Solution:**
```bash
# Check connection
tiger db connect forked-ab-optimizer-db

# Re-load data
tiger db connect forked-ab-optimizer-db < data/sample-schema.sql
```

### Issue: "MCP server not responding"
**Solution:**
```bash
# Check MCP dependencies
cd mcp && npm install

# Verify MCP server file
node server.js
```

---

## 📊 Monitoring & Logs

### View Application Logs
```bash
# In development mode, logs appear in terminal

# For production, check logs directory
tail -f logs/app.log
```

### Monitor Tiger Service
```bash
# Service metrics
tiger service metrics forked-ab-optimizer-db

# Active connections
tiger db connect forked-ab-optimizer-db
SELECT * FROM pg_stat_activity;
```

---

## 🔒 Security Notes

### For Production Deployment

1. **Use Environment Variables**
   - Never commit `.env` file
   - Use secure secret management

2. **Enable SSL**
   - Tiger Cloud uses SSL by default
   - Verify `?sslmode=require` in connection string

3. **Set ALLOWED_ORIGINS**
   ```bash
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

4. **Rate Limiting**
   - Already configured: 10 optimizations per 15 minutes
   - Adjust in `server/index.js` if needed

---

## 📦 Docker Deployment (Alternative)

If you prefer Docker:

```bash
# Build image
docker build -t forked-ab-optimizer .

# Run container
docker run -p 3000:3000 \
  -e TIGER_DATABASE_URL=postgresql://... \
  forked-ab-optimizer
```

---

## 🌐 Cloud Deployment Options

### Vercel (Recommended for Frontend + Serverless)
```bash
npm install -g vercel
vercel deploy
```

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Render
1. Create new Web Service
2. Connect repository
3. Build command: `npm run build`
4. Start command: `npm start`

---

## 📞 Support

### Tiger Data Support
- Documentation: https://docs.tigerdata.com
- Discord: [Tiger Data Community]
- Email: support@tigerdata.com

### Project Issues
- GitHub Issues: [Your repository]/issues
- Email: [Your contact email]

---

## ✅ Quick Verification Checklist

Before submitting, verify:

- [ ] Tiger CLI installed and authenticated
- [ ] Database service created and running
- [ ] Sample data loaded successfully
- [ ] Environment variables configured
- [ ] Application starts without errors
- [ ] Health check endpoint responds
- [ ] Can create forks via CLI
- [ ] UI loads and shows hackathon banner
- [ ] Demo mode works (with toggle ON)
- [ ] Live mode works (with toggle OFF)
- [ ] Sample queries execute successfully
- [ ] Results display correctly
- [ ] Forks are cleaned up after optimization

---

## 🎬 Demo Script for Judges

1. **Start Application**: `npm run dev`
2. **Open Browser**: http://localhost:5173
3. **Show Banner**: Highlight "Agentic Postgres Challenge" banner
4. **Toggle Demo Mode OFF**: Show real Tiger Cloud integration
5. **Paste Queries**: Use sample queries above
6. **Click Optimize**: Watch real-time progress
7. **Show Results**: Performance comparison charts
8. **Highlight Features**:
   - Zero-copy fork creation
   - Multi-agent coordination
   - Hybrid search insights
   - Confidence-scored recommendations

---

**Last Updated**: November 2025
**For**: Agentic Postgres Challenge
**By**: Forked A/B Index Optimizer Team
