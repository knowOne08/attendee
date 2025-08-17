#!/bin/bash

# Deployment script for Attendee project on DigitalOcean
# Run this script to deploy your changes to production

echo "🚀 Starting Attendee deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the root of the attendee project"
    exit 1
fi

# Build frontend
print_status "Building frontend..."
cd frontend
npm install
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Copy Nginx configuration
print_status "Setting up Nginx configuration..."
sudo cp nginx-site-config /etc/nginx/sites-available/attendee

# Enable the site
sudo ln -sf /etc/nginx/sites-available/attendee /etc/nginx/sites-enabled/attendee

# Remove default site if it exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    print_warning "Removing default Nginx site"
    sudo rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed!"
    exit 1
fi

# Create web directory if it doesn't exist
sudo mkdir -p /var/www/attendee/frontend

# Copy frontend build
print_status "Deploying frontend..."
sudo cp -r frontend/dist/* /var/www/attendee/frontend/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/attendee
sudo chmod -R 755 /var/www/attendee

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install

# Restart backend with PM2
print_status "Restarting backend..."
pm2 restart all 2>/dev/null || pm2 start server.js --name "attendee-backend"

cd ..

# Restart Nginx
print_status "Restarting Nginx..."
sudo systemctl restart nginx

# Check if services are running
print_status "Checking services..."

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running!"
fi

# Check PM2
if pm2 list | grep -q "attendee-backend"; then
    print_status "Backend is running"
else
    print_error "Backend is not running!"
fi

print_status "Deployment complete! 🎉"
print_status "Your app should be available at: http://your-server-ip"
print_warning "Don't forget to update your domain/IP in the Nginx config if needed"

echo ""
echo "📋 To check logs:"
echo "   Backend logs: pm2 logs attendee-backend"
echo "   Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "🔧 To troubleshoot:"
echo "   Check Nginx status: sudo systemctl status nginx"
echo "   Check PM2 status: pm2 status"
echo "   Test Nginx config: sudo nginx -t"
