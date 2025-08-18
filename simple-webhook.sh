#!/bin/bash

# Simple webhook deployment script
# This runs continuously and pulls changes when webhook is triggered

WEBHOOK_PORT=9000
PROJECT_DIR="/root/attendee"

echo "🎣 Starting simple webhook listener on port $WEBHOOK_PORT..."

# Function to deploy
deploy() {
    echo "🚀 Starting deployment at $(date)"
    
    cd $PROJECT_DIR || exit 1
    
    # Pull latest changes
    echo "📥 Pulling latest changes..."
    git pull origin main
    
    # Run deployment
    echo "🔄 Running deployment script..."
    bash deploy-auto.sh
    
    echo "✅ Deployment completed at $(date)"
}

# Simple HTTP listener
while true; do
    echo "⏳ Waiting for webhook on port $WEBHOOK_PORT..."
    
    # Listen for HTTP request and respond
    {
        echo -e "HTTP/1.1 200 OK\r"
        echo -e "Content-Type: text/plain\r"
        echo -e "Content-Length: 19\r"
        echo -e "\r"
        echo -e "Deployment started!"
    } | nc -l -p $WEBHOOK_PORT -q 1
    
    echo "📨 Webhook received at $(date)"
    
    # Run deployment in background
    deploy &
    
    # Wait a bit before listening again
    sleep 5
done
