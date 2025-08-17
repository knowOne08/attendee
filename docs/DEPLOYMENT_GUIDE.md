# Deployment Guide

This guide covers various deployment strategies for the Attendee Attendance Terminal system, from development to production environments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Development Environment](#development-environment)
3. [Local Production Setup](#local-production-setup)
4. [Cloud Deployment](#cloud-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Hardware Deployment](#hardware-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Backup & Recovery](#backup--recovery)

## Deployment Overview

### Deployment Types

| Type | Use Case | Complexity | Cost | Scalability |
|------|----------|------------|------|-------------|
| **Development** | Local testing | Low | Free | N/A |
| **Local Production** | Small organizations | Medium | Low | Limited |
| **Cloud VPS** | Medium organizations | Medium | Medium | Good |
| **Cloud Platform** | Large organizations | High | High | Excellent |
| **Docker** | Any size | Medium | Variable | Excellent |

### Prerequisites

#### Common Requirements
- **MongoDB** 4.4+ database
- **Node.js** 16+ runtime
- **Web server** (nginx recommended)
- **SSL certificate** for HTTPS
- **Domain name** (optional but recommended)

#### Hardware Requirements

| Component | Minimum | Recommended | High-Load |
|-----------|---------|-------------|-----------|
| **CPU** | 1 core | 2 cores | 4+ cores |
| **RAM** | 512MB | 2GB | 4GB+ |
| **Storage** | 1GB | 10GB | 50GB+ |
| **Network** | 1 Mbps | 10 Mbps | 100 Mbps+ |

## Development Environment

### Local Setup
```bash
# Prerequisites
node --version  # 16.0+
npm --version   # 8.0+
mongod --version # 4.4+

# Clone and setup
git clone https://github.com/launchlog/attendance-terminal.git
cd attendance-terminal

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with development settings
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev
```

### Development Environment Variables

**Backend (.env)**:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/attendee_dev

# Authentication
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Debug
DEBUG=true
LOG_LEVEL=debug
```

**Frontend (.env.local)**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Attendee Attendance (Dev)
VITE_NODE_ENV=development
```

### Development Workflow
```bash
# Start all services
npm run dev:all  # Custom script in package.json

# Individual services
npm run backend:dev   # Backend with nodemon
npm run frontend:dev  # Frontend with hot reload
npm run db:start     # Start local MongoDB

# Testing
npm run test         # Run all tests
npm run test:backend # Backend tests only
npm run test:frontend # Frontend tests only
```

## Local Production Setup

### Single Server Deployment

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install nginx
sudo apt install nginx -y

# Install PM2 for process management
npm install -g pm2
```

#### 2. Application Setup
```bash
# Create application directory
sudo mkdir -p /opt/launchlog
sudo chown $USER:$USER /opt/launchlog
cd /opt/launchlog

# Clone repository
git clone https://github.com/launchlog/attendance-terminal.git .

# Install dependencies
cd backend && npm ci --only=production
cd ../frontend && npm ci && npm run build
```

#### 3. Configuration

**Production Backend (.env)**:
```env
NODE_ENV=production
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/attendee

# Strong JWT secret (generate with: openssl rand -hex 64)
JWT_SECRET=your-strong-256-bit-secret-key-here
JWT_EXPIRES_IN=7d

# Production URLs
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://yourdomain.com/api

# SSL
FORCE_HTTPS=true

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/launchlog/app.log
```

**Frontend Environment**:
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_SOCKET_URL=https://yourdomain.com
VITE_APP_NAME=Attendee Attendance
VITE_NODE_ENV=production
```

#### 4. Process Management with PM2
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'launchlog-backend',
    script: './backend/server.js',
    cwd: '/opt/launchlog',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/launchlog/err.log',
    out_file: '/var/log/launchlog/out.log',
    log_file: '/var/log/launchlog/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Nginx Configuration
```bash
# Create nginx configuration
sudo tee /etc/nginx/sites-available/launchlog << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Frontend (React app)
    location / {
        root /opt/launchlog/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/launchlog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup
```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Instance type: t3.medium (2 vCPU, 4GB RAM)
# Security groups: HTTP (80), HTTPS (443), SSH (22)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow local production setup steps
```

#### 2. RDS MongoDB Alternative
```bash
# Use MongoDB Atlas for managed database
# Connection string example:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendee
```

#### 3. CloudFront CDN
```yaml
# CloudFront distribution configuration
Origins:
  - DomainName: your-ec2-domain.com
    OriginPath: ""
    CustomOriginConfig:
      HTTPPort: 80
      HTTPSPort: 443
      OriginProtocolPolicy: https-only

Behaviors:
  - PathPattern: "/api/*"
    TargetOriginId: backend
    ViewerProtocolPolicy: redirect-to-https
  - PathPattern: "/*"
    TargetOriginId: frontend
    ViewerProtocolPolicy: redirect-to-https
```

### Digital Ocean Deployment

#### 1. Droplet Setup
```bash
# Create droplet (Ubuntu 20.04)
# Size: 2GB RAM, 1 vCPU, 50GB SSD

# SSH to droplet
ssh root@your-droplet-ip

# Create non-root user
adduser launchlog
usermod -aG sudo launchlog
su - launchlog
```

#### 2. App Platform Deployment
```yaml
# .do/app.yaml
name: launchlog-attendance
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/attendance-terminal
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${MONGODB_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/attendance-terminal
    branch: main
  run_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: attendee-db
  engine: MONGODB
  version: "5"
```

### Heroku Deployment

#### 1. Backend Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku app
cd backend
heroku create launchlog-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -hex 64)
heroku config:set MONGODB_URI="your-mongodb-atlas-url"

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=1
```

#### 2. Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Environment variables in Vercel dashboard:
# VITE_API_BASE_URL=https://launchlog-backend.herokuapp.com/api
```

## Docker Deployment

### 1. Docker Compose Setup

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: launchlog-db
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - launchlog-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: launchlog-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:${DB_PASSWORD}@mongodb:27017/attendee?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - launchlog-network
    volumes:
      - ./logs:/app/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${API_BASE_URL}
        VITE_SOCKET_URL: ${SOCKET_URL}
    container_name: launchlog-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - launchlog-network

  nginx:
    image: nginx:alpine
    container_name: launchlog-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - launchlog-network

volumes:
  mongodb_data:

networks:
  launchlog-network:
    driver: bridge
```

### 2. Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 3. Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Environment File
**.env**:
```env
# Database
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-256-bit-secret-key

# URLs
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://yourdomain.com/api
SOCKET_URL=https://yourdomain.com
```

### 5. Deployment Commands
```bash
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d --no-deps backend frontend
```

## Hardware Deployment

### 1. Firmware Deployment Strategy

#### Mass Firmware Deployment
```bash
# Create firmware configuration template
cat > firmware_config_template.h << 'EOF'
#define DEVICE_ID "TERMINAL_{{DEVICE_NUMBER}}"
#define WIFI_SSID "{{WIFI_SSID}}"
#define WIFI_PASSWORD "{{WIFI_PASSWORD}}"
#define SERVER_URL "{{SERVER_URL}}"
#define API_ENDPOINT "/api/attendance"
EOF

# Script to generate device-specific firmware
#!/bin/bash
for i in {1..10}; do
  sed "s/{{DEVICE_NUMBER}}/$i/g; s/{{WIFI_SSID}}/YourWiFi/g; s/{{WIFI_PASSWORD}}/YourPassword/g; s|{{SERVER_URL}}|https://yourdomain.com|g" \
    firmware_config_template.h > config_device_$i.h
  
  # Compile and upload for each device
  pio run --target upload --upload-port /dev/ttyUSB$i
done
```

#### OTA Update Server
```javascript
// Simple OTA update server
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'firmware/' });

// Firmware upload endpoint
app.post('/firmware/upload', upload.single('firmware'), (req, res) => {
  const version = req.body.version;
  const deviceType = req.body.deviceType;
  
  // Store firmware with version info
  const firmwarePath = `firmware/${deviceType}_v${version}.bin`;
  fs.renameSync(req.file.path, firmwarePath);
  
  res.json({ success: true, path: firmwarePath });
});

// Firmware download endpoint for devices
app.get('/firmware/:deviceType/latest', (req, res) => {
  const deviceType = req.params.deviceType;
  const firmwarePath = `firmware/${deviceType}_latest.bin`;
  
  if (fs.existsSync(firmwarePath)) {
    res.download(firmwarePath);
  } else {
    res.status(404).json({ error: 'Firmware not found' });
  }
});

app.listen(8080, () => {
  console.log('OTA server running on port 8080');
});
```

### 2. Device Management

#### Device Registration API
```javascript
// Automatic device registration
app.post('/api/devices/register', async (req, res) => {
  const { deviceId, macAddress, firmwareVersion, location } = req.body;
  
  try {
    const device = new Device({
      deviceId,
      macAddress,
      firmwareVersion,
      location,
      registeredAt: new Date(),
      status: 'active'
    });
    
    await device.save();
    
    res.json({
      success: true,
      device: device,
      serverConfig: {
        apiEndpoint: '/api/attendance',
        heartbeatInterval: 60000,
        syncInterval: 300000
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Configuration Management
```javascript
// Device configuration endpoint
app.get('/api/devices/:deviceId/config', async (req, res) => {
  const device = await Device.findOne({ deviceId: req.params.deviceId });
  
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  res.json({
    deviceId: device.deviceId,
    serverUrl: process.env.SERVER_URL,
    apiEndpoint: '/api/attendance',
    heartbeatInterval: 60000,
    syncInterval: 300000,
    firmwareVersion: device.requiredFirmwareVersion || 'latest',
    features: {
      offlineMode: true,
      autoSync: true,
      debugMode: false
    }
  });
});
```

## Monitoring & Maintenance

### 1. Health Monitoring

#### Backend Health Checks
```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'disconnected',
    version: process.env.npm_package_version
  };
  
  try {
    await mongoose.connection.db.admin().ping();
    health.database = 'connected';
  } catch (error) {
    health.status = 'error';
    health.database = 'disconnected';
  }
  
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

#### System Monitoring Script
```bash
#!/bin/bash
# monitor.sh - System monitoring script

LOG_FILE="/var/log/launchlog/monitor.log"
ALERT_EMAIL="admin@yourdomain.com"

# Function to log with timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> $LOG_FILE
}

# Check backend service
check_backend() {
  if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
    log "Backend: OK"
  else
    log "Backend: FAILED"
    echo "Backend service is down" | mail -s "Attendee Alert" $ALERT_EMAIL
  fi
}

# Check database
check_database() {
  if mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    log "Database: OK"
  else
    log "Database: FAILED"
    echo "Database is unreachable" | mail -s "Attendee Alert" $ALERT_EMAIL
  fi
}

# Check disk space
check_disk() {
  USAGE=$(df /opt/launchlog | awk 'NR==2 {print $5}' | sed 's/%//')
  if [ $USAGE -gt 80 ]; then
    log "Disk: WARNING - $USAGE% used"
    echo "Disk usage is at $USAGE%" | mail -s "Attendee Alert" $ALERT_EMAIL
  else
    log "Disk: OK - $USAGE% used"
  fi
}

# Main monitoring loop
check_backend
check_database
check_disk

# Run via cron every 5 minutes:
# */5 * * * * /opt/launchlog/monitor.sh
```

### 2. Log Management

#### Log Rotation Configuration
```bash
# /etc/logrotate.d/launchlog
/var/log/launchlog/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    postrotate
        pm2 restart launchlog-backend
    endscript
}
```

#### Centralized Logging
```javascript
// Enhanced logging configuration
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'launchlog-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Add Elasticsearch transport for production
if (process.env.ELASTICSEARCH_URL) {
  logger.add(new ElasticsearchTransport({
    level: 'info',
    clientOpts: { node: process.env.ELASTICSEARCH_URL },
    index: 'launchlog-logs'
  }));
}
```

## Backup & Recovery

### 1. Database Backup

#### Automated Backup Script
```bash
#!/bin/bash
# backup.sh - Database backup script

BACKUP_DIR="/opt/backups/launchlog"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="attendee_backup_$DATE"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
mongodump --db attendee --out $BACKUP_DIR/$BACKUP_FILE

# Compress backup
tar -czf $BACKUP_DIR/$BACKUP_FILE.tar.gz -C $BACKUP_DIR $BACKUP_FILE
rm -rf $BACKUP_DIR/$BACKUP_FILE

# Upload to cloud storage (optional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
  aws s3 cp $BACKUP_DIR/$BACKUP_FILE.tar.gz s3://$AWS_S3_BUCKET/backups/
fi

# Clean old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_FILE.tar.gz"

# Schedule via cron (daily at 2 AM):
# 0 2 * * * /opt/launchlog/backup.sh
```

### 2. Disaster Recovery

#### Recovery Procedures
```bash
# Complete system recovery

# 1. Restore database
mongorestore --db attendee /path/to/backup/attendee

# 2. Restore application files
cd /opt/launchlog
git pull origin main
npm ci --only=production

# 3. Restart services
pm2 restart all
sudo systemctl restart nginx

# 4. Verify system health
curl -f http://localhost:5000/api/health
```

#### Recovery Testing
```bash
#!/bin/bash
# test-recovery.sh - Recovery testing script

# Create test environment
docker-compose -f docker-compose.test.yml up -d

# Restore latest backup
LATEST_BACKUP=$(ls -t /opt/backups/launchlog/*.tar.gz | head -1)
tar -xzf $LATEST_BACKUP -C /tmp/

# Test restore
docker exec launchlog-test-db mongorestore --drop /tmp/attendee

# Run integration tests
npm run test:integration

# Cleanup
docker-compose -f docker-compose.test.yml down
rm -rf /tmp/attendee

echo "Recovery test completed"
```

This deployment guide provides comprehensive instructions for deploying the Attendee Attendance Terminal system in various environments. Choose the deployment strategy that best fits your organization's needs and technical requirements.
