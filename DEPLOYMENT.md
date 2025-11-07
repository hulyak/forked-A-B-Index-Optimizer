# Production Deployment Guide

## 🚀 Quick Production Deployment

### Option 1: Docker (Recommended)

```bash
# 1. Clone and build
git clone https://github.com/your-username/forked-ab-index-optimizer
cd forked-ab-index-optimizer

# 2. Set environment variables
cp .env.production .env
# Edit .env with your Tiger Data credentials

# 3. Build and run
docker-compose up -d

# 4. Check health
curl http://localhost:3000/health
```

### Option 2: Direct Node.js

```bash
# 1. Install dependencies
npm run install-all

# 2. Build client
npm run build

# 3. Set production environment
export NODE_ENV=production
export TIGER_DATABASE_URL="your-connection-string"

# 4. Start application
./scripts/start-production.sh
```

### Option 3: Cloud Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway deploy
```

#### Render
```bash
# Connect your GitHub repo to Render
# Set build command: npm run build
# Set start command: npm start
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Tiger Data (Required)
TIGER_SERVICE_NAME=your-service-name
TIGER_DATABASE_URL=postgresql://user@host:port/db

# Security (Production)
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
API_KEY=your-secure-random-key

# Optional Performance Tuning
MAX_CONCURRENT_OPTIMIZATIONS=5
OPTIMIZATION_TIMEOUT=300000
```

### Security Checklist

- [ ] Set strong `API_KEY`
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure log rotation

## 📊 Monitoring & Health Checks

### Health Endpoint
```bash
curl http://your-domain.com/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-04T22:30:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Monitoring Setup

#### Uptime Monitoring
```bash
# Add to your monitoring service
GET /health every 30 seconds
Expected: 200 OK
```

#### Application Metrics
```javascript
// Custom metrics endpoint
GET /api/metrics

{
  "activeOptimizations": 2,
  "totalOptimizations": 1547,
  "averageOptimizationTime": 8.5,
  "errorRate": 0.02
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          # Your deployment script here
          ./scripts/deploy.sh
```

## 🐳 Kubernetes Deployment

### Deployment Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: index-optimizer
  labels:
    app: index-optimizer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: index-optimizer
  template:
    metadata:
      labels:
        app: index-optimizer
    spec:
      containers:
      - name: app
        image: your-registry/index-optimizer:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: TIGER_DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: tiger-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: index-optimizer-service
spec:
  selector:
    app: index-optimizer
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔐 Security Configuration

### SSL/TLS Setup (Nginx)

```nginx
# /etc/nginx/sites-available/index-optimizer
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Firewall Rules

```bash
# Allow only necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw deny 3000/tcp  # Block direct access to app
ufw enable
```

## 📈 Performance Optimization

### Production Optimizations

1. **Enable Gzip Compression**
```javascript
// In server/index.js
import compression from 'compression';
app.use(compression());
```

2. **Add Caching Headers**
```javascript
app.use('/static', express.static('client/dist', {
  maxAge: '1y',
  etag: false
}));
```

3. **Database Connection Pooling**
```javascript
// Configure connection pool
const pool = new Pool({
  connectionString: process.env.TIGER_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
docker-compose logs app

# Common fixes
npm run clean
npm run install-all
npm run build
```

#### 2. Tiger Connection Failed
```bash
# Test Tiger CLI
tiger auth status
tiger db connect --command "SELECT 1"

# Check environment variables
echo $TIGER_DATABASE_URL
```

#### 3. High Memory Usage
```bash
# Monitor memory
docker stats

# Optimize Node.js
export NODE_OPTIONS="--max-old-space-size=512"
```

#### 4. Slow Performance
```bash
# Check database connections
netstat -an | grep 5432

# Monitor CPU usage
top -p $(pgrep node)
```

### Log Analysis

```bash
# Application logs
tail -f logs/app.log

# Error logs
grep "ERROR" logs/app.log | tail -20

# Performance logs
grep "SLOW_QUERY" logs/app.log
```

## 📞 Support

- **Documentation**: [docs.yourdomain.com](https://docs.yourdomain.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/issues)
- **Email**: support@yourdomain.com
- **Status Page**: [status.yourdomain.com](https://status.yourdomain.com)

## 🔄 Backup & Recovery

### Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tiger db backup --output "backup_${DATE}.sql"
aws s3 cp "backup_${DATE}.sql" s3://your-backup-bucket/
```

### Application Backups
```bash
# Backup configuration and logs
tar -czf app_backup_$(date +%Y%m%d).tar.gz \
  .env logs/ data/ scripts/
```

## 📊 Scaling

### Horizontal Scaling
```yaml
# Increase replicas in k8s
kubectl scale deployment index-optimizer --replicas=5
```

### Vertical Scaling
```yaml
# Increase resources
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

Ready for production! 🎉