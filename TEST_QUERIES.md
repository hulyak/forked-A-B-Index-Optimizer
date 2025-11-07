# Test Queries for Real Tiger Cloud Testing

## 🧪 Use These Queries to Test Your Application

### Simple Test (30 seconds)

**Query 1: Basic WHERE clause**
```sql
SELECT * FROM users WHERE email = 'alice@example.com' LIMIT 10;
```

**Expected Result:**
- Strategy A: Single-column index on `email`
- Strategy B: Composite index or partial index
- Performance improvement: 15-30%
- Completion time: ~10 seconds

---

### Medium Test (1 minute)

**Query 1: WHERE + ORDER BY**
```sql
SELECT * FROM orders WHERE status = 'completed' ORDER BY created_at DESC LIMIT 100;
```

**Query 2: Simple JOIN**
```sql
SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';
```

**Expected Result:**
- Multiple index strategies generated
- 2 forks created (Strategy A and Strategy B)
- Agent coordination visible in logs
- Performance improvement: 25-45%
- Completion time: ~12-15 seconds

---

### Complex Test (2 minutes)

**Query 1: Multi-column WHERE**
```sql
SELECT * FROM products
WHERE category = 'electronics'
  AND price > 100
  AND stock_quantity > 0
ORDER BY price DESC
LIMIT 20;
```

**Query 2: Complex JOIN with aggregation**
```sql
SELECT u.name, u.city, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01'
  AND o.status = 'completed'
GROUP BY u.id, u.name, u.city
HAVING COUNT(o.id) > 2
ORDER BY total_spent DESC
LIMIT 50;
```

**Query 3: Multiple JOINs**
```sql
SELECT
    p.name as product_name,
    p.category,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.unit_price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
  AND o.created_at > '2024-01-01'
GROUP BY p.id, p.name, p.category
ORDER BY revenue DESC
LIMIT 25;
```

**Expected Result:**
- Complex strategies with composite indexes
- High confidence scores (85-95%)
- Significant performance improvement (40-70%)
- Hybrid search recommendations
- Completion time: ~15-20 seconds

---

## 🎯 What to Look For

### During Optimization

1. **Agent Activity Panel** should show:
   ```
   Orchestrator: Creating fork job_xxx-strategy-a
   Orchestrator: Creating fork job_xxx-strategy-b
   IndexTuner: Analyzing 3 queries...
   IndexTuner: Generated 2 index strategies
   Validator: Applying Strategy A to fork job_xxx-strategy-a
   Validator: Running performance tests (3 iterations)...
   Orchestrator: Comparing results...
   Orchestrator: Cleanup: Deleting fork job_xxx-strategy-a
   ```

2. **Progress Bar** should advance through:
   - Creating forks
   - Generating strategies
   - Applying strategies
   - Running tests
   - Analyzing results
   - Completed ✓

3. **Metrics Dashboard** should update in real-time:
   - Fork count: 2
   - Test runs: 6 (3 per strategy)
   - Queries analyzed: [number of queries]

### After Completion

1. **Performance Charts** should display:
   - Side-by-side bar comparison
   - Strategy A execution time
   - Strategy B execution time
   - Percentage improvement highlighted

2. **Recommendation Card** should show:
   - Confidence score (e.g., 92%)
   - Winning strategy (A or B)
   - Reason for recommendation
   - Estimated impact
   - SQL for recommended indexes

3. **Hybrid Search Insights** should include:
   - Similar patterns found (with confidence scores)
   - Sources: pg_textsearch, pgvector, hybrid_fusion
   - Actionable recommendations

---

## 🐛 Troubleshooting

### Issue: "Fork creation failed"

**Check:**
```bash
# Verify you can create forks manually
tiger service fork my-agentic-db manual-test-fork

# If this fails, check your service status
tiger service status my-agentic-db

# Delete the test fork
tiger service delete manual-test-fork
```

### Issue: "Connection timeout"

**Check:**
```bash
# Test direct connection
tiger db connect my-agentic-db

# If this works, check your .env file
cat .env | grep TIGER_DATABASE_URL
```

### Issue: "No data found"

**Load sample data:**
```bash
tiger db connect my-agentic-db < data/sample-schema.sql
```

### Issue: "Application shows demo mode only"

**Fix:**
1. Make sure `.env` has correct `TIGER_DATABASE_URL`
2. Restart the application: `npm run dev`
3. Toggle "Demo Mode" OFF in the UI

---

## ✅ Verification Checklist

Before declaring success, verify:

- [ ] Application starts without errors
- [ ] Health check responds: `curl http://localhost:3000/health`
- [ ] Can toggle Demo Mode OFF
- [ ] Can paste queries
- [ ] Optimization starts when clicked
- [ ] Agent activity logs appear
- [ ] Progress bar advances
- [ ] Results display after completion
- [ ] Charts render correctly
- [ ] Recommendation card shows
- [ ] Confidence score displays
- [ ] Can run multiple optimizations

---

## 🎬 Video Recording Tips

When recording your demo video, use these queries:

**For 90-second video:**
1. Use the "Medium Test" queries (2 queries)
2. Shows complexity without taking too long
3. Demonstrates all features clearly

**For screenshots:**
1. Use "Complex Test" (3 queries)
2. Generates more interesting results
3. Shows full capability

---

## 📊 Expected Performance

### With Real Tiger Cloud

**Fork Creation**: <1 second per fork
**Strategy Generation**: 2-3 seconds
**Performance Testing**: 3-5 seconds per strategy (3 runs each)
**Total Time**: 10-20 seconds depending on query complexity

### Typical Improvements

- **Simple queries**: 15-35% faster
- **Medium complexity**: 25-50% faster
- **Complex queries**: 40-70% faster

### Confidence Scores

- **High confidence** (>90%): Clear winner, significant difference
- **Medium confidence** (80-89%): Good improvement, recommended
- **Low confidence** (<80%): Minimal difference, no change suggested

---

## 🚀 Next Steps After Testing

Once everything works:

1. **Take screenshots** while running these tests
2. **Record video** using Medium Test queries
3. **Document any issues** you encountered
4. **Note the performance improvements** you achieved
5. **Update TESTING_CREDENTIALS.md** with real results

---

## 💡 Pro Tips

1. **Clear browser cache** between tests for consistent results
2. **Use incognito mode** to avoid cached data
3. **Keep developer tools open** (F12) to see network requests
4. **Watch the Network tab** to see API calls to Tiger Cloud
5. **Check Console tab** for any JavaScript errors

---

**Ready to test? Open your browser to http://localhost:5173 and try these queries!** 🚀
