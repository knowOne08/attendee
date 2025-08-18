#!/bin/bash

# Auto-deployment script for Attendee webapp
# This script pulls latest code and rebuilds/deploys automatically

set -e

# Configuration
PROJECT_DIR="/root/attendee"
FRONTEND_DIR="/var/www/html"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

echo "🚀 Starting auto-deployment for Attendee..."
echo "📅 Deployment started at: $(date)"

# Step 1: Navigate to project directory
print_status "Navigating to project directory..."
cd $PROJECT_DIR || { print_error "Project directory not found at $PROJECT_DIR"; exit 1; }

# Step 2: Pull latest changes
print_status "Pulling latest changes from git..."
git fetch origin
git reset --hard origin/$BRANCH
print_status "Git pull completed"

# Step 3: Install/update backend dependencies
print_status "Updating backend dependencies..."
cd backend
npm install --production --silent
print_status "Backend dependencies updated"

# Step 4: Restart backend with PM2
print_status "Managing backend with PM2..."
if pm2 list | grep -q "backend"; then
    print_status "Restarting existing PM2 process..."
    pm2 restart backend
    print_status "Backend restarted with PM2"
else
    print_status "Starting new PM2 process..."
    pm2 start server.js --name "backend" --env production
    pm2 save
    print_status "Backend started with PM2"
fi

# Step 5: Build and deploy frontend
print_status "Building frontend..."
cd ../frontend

# Install frontend dependencies
npm install --silent
print_status "Frontend dependencies installed"

# Build frontend
npm run build
print_status "Frontend build completed"

# Step 6: Deploy frontend
print_status "Deploying frontend..."
# Backup current frontend (optional)
if [ -d "$FRONTEND_DIR" ]; then
    cp -r $FRONTEND_DIR $FRONTEND_DIR.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# Clear and deploy new frontend
rm -rf $FRONTEND_DIR/*
cp -r dist/* $FRONTEND_DIR/
chown -R www-data:www-data $FRONTEND_DIR
chmod -R 755 $FRONTEND_DIR
print_status "Frontend deployed successfully"

# Step 7: Reload nginx
print_status "Testing and reloading nginx..."
if nginx -t > /dev/null 2>&1; then
    systemctl reload nginx
    print_status "Nginx reloaded successfully"
else
    print_error "Nginx configuration test failed"
    nginx -t
    exit 1
fi

# Step 8: Health checks
print_status "Running health checks..."
sleep 5

# Check backend
print_status "Checking backend health..."
for i in {1..5}; do
    if curl -f -s http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Backend is healthy ✅"
        break
    else
        if [ $i -eq 5 ]; then
            print_error "Backend health check failed after 5 attempts"
        else
            print_warning "Backend not ready, retrying in 2 seconds... ($i/5)"
            sleep 2
        fi
    fi
done

# Check frontend
print_status "Checking frontend accessibility..."
if curl -f -s https://attendee.xrocketry.in > /dev/null 2>&1; then
    print_status "Frontend is accessible ✅"
else
    print_error "Frontend accessibility check failed"
fi

# Check API
print_status "Checking API accessibility..."
if curl -f -s https://api.xrocketry.in/health > /dev/null 2>&1; then
    print_status "API is accessible ✅"
else
    print_error "API accessibility check failed"
fi

# Final success message
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "   • Project: Attendee Webapp"
echo "   • Frontend: https://attendee.xrocketry.in"
echo "   • API: https://api.xrocketry.in"
echo "   • Deployed at: $(date)"
echo "   • Git branch: $BRANCH"
echo "   • Server: $(hostname)"
echo ""
echo "🔗 Quick Links:"
echo "   • Frontend: https://attendee.xrocketry.in"
echo "   • API Health: https://api.xrocketry.in/health"
echo "   • Backend Logs: pm2 logs backend"
echo "   • PM2 Status: pm2 status"
echo "   • Nginx Logs: tail -f /var/log/nginx/error.log"
echo ""
print_status "🚀 Deployment completed successfully!"
