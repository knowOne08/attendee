#!/bin/bash

# Quick fix script for network issues
echo "🔧 Fixing network configuration..."

echo "Select your setup:"
echo "1) Expo Go on Physical Device (current)"
echo "2) iOS Simulator" 
echo "3) Android Emulator"
echo "4) Custom IP"

read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo "✅ Current config is correct for physical device"
    ;;
  2)
    echo "🔄 Updating for iOS Simulator..."
    sed -i '' 's|apiUrl: '\''http://.*:3000'\''|apiUrl: '\''http://localhost:3000'\''|' src/utils/config.js
    echo "✅ Updated to localhost for iOS Simulator"
    ;;
  3)
    echo "🔄 Updating for Android Emulator..."
    sed -i '' 's|apiUrl: '\''http://.*:3000'\''|apiUrl: '\''http://10.0.2.2:3000'\''|' src/utils/config.js
    echo "✅ Updated to 10.0.2.2 for Android Emulator"
    ;;
  4)
    read -p "Enter your computer's IP address: " custom_ip
    sed -i '' "s|apiUrl: 'http://.*:3000'|apiUrl: 'http://$custom_ip:3000'|" src/utils/config.js
    echo "✅ Updated to $custom_ip"
    ;;
esac

echo "🔄 Restarting Metro bundler..."
pkill -f "expo start" 2>/dev/null
echo "✅ Please run 'expo start' to restart with new configuration"
