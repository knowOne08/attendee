#!/bin/bash

# Mobile App Network Connectivity Checker
# Run this script to test if your mobile app can reach the backend

echo "🔍 Mobile App Network Connectivity Test"
echo "========================================"

# Get current IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📍 Your Mac's IP: $LOCAL_IP"

# Test if backend is running
echo ""
echo "1️⃣ Testing if backend is running on port 3000..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3000"
else
    echo "❌ Backend is NOT running on port 3000"
    echo "   → Start your backend server first: cd backend && npm start"
    exit 1
fi

# Test localhost connectivity
echo ""
echo "2️⃣ Testing localhost connectivity..."
if curl -s --max-time 5 http://localhost:3000/health > /dev/null; then
    echo "✅ Backend accessible via localhost"
else
    echo "❌ Backend not accessible via localhost"
fi

# Test local IP connectivity
echo ""
echo "3️⃣ Testing local IP connectivity..."
if curl -s --max-time 5 http://$LOCAL_IP:3000/health > /dev/null; then
    echo "✅ Backend accessible via local IP ($LOCAL_IP)"
    echo "   Mobile app should be able to connect!"
else
    echo "❌ Backend not accessible via local IP ($LOCAL_IP)"
    echo "   → Check firewall settings"
    echo "   → Try: sudo ufw allow 3000 (if using ufw)"
fi

# Test actual API response
echo ""
echo "4️⃣ Testing API response..."
HEALTH_RESPONSE=$(curl -s --max-time 5 http://$LOCAL_IP:3000/health)
if [ $? -eq 0 ]; then
    echo "✅ Health endpoint response: $HEALTH_RESPONSE"
else
    echo "❌ Failed to get health response"
fi

# Test API info endpoint
echo ""
echo "5️⃣ Testing API info endpoint..."
API_INFO=$(curl -s --max-time 5 http://$LOCAL_IP:3000/ | head -c 100)
if [ $? -eq 0 ]; then
    echo "✅ API info response preview: ${API_INFO}..."
else
    echo "❌ Failed to get API info"
fi

echo ""
echo "📱 Mobile App Configuration:"
echo "   → Update mobile/src/utils/config.js"
echo "   → Set development apiUrl to: http://$LOCAL_IP:3000"
echo "   → Make sure isDevelopment = __DEV__"

echo ""
echo "🔥 If still having issues:"
echo "   1. Check if Mac firewall is blocking port 3000"
echo "   2. Make sure both devices are on same WiFi"
echo "   3. Try restarting Expo development server"
echo "   4. Check mobile device's network settings"
echo "   5. Try using different IP addresses (WiFi vs Ethernet)"

# Show all available IP addresses
echo ""
echo "🌐 All available IP addresses on your Mac:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "   " $2}'
