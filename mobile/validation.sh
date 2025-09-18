#!/bin/bash

# Attendee1 Mobile App Validation Script
# This script validates the mobile app setup and provides troubleshooting

echo "🔍 Attendee1 Mobile App Validation"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the mobile app directory"
    exit 1
fi

# Check Node.js and npm
echo "📦 Checking Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi

# Check Expo CLI
echo "📱 Checking Expo CLI..."
if command -v npx expo >/dev/null 2>&1; then
    echo "✅ Expo CLI available via npx"
elif command -v expo >/dev/null 2>&1; then
    EXPO_VERSION=$(expo --version)
    echo "✅ Expo CLI: $EXPO_VERSION"
else
    echo "⚠️  Expo CLI not found globally. Will use npx expo"
fi

# Check package.json dependencies
echo "📋 Checking dependencies..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "⚠️  node_modules not found. Run 'npm install'"
    fi
else
    echo "❌ package.json not found"
    exit 1
fi

# Check critical files
echo "📁 Checking project structure..."
CRITICAL_FILES=(
    "App.js"
    "src/navigation/AppNavigator.js"
    "src/contexts/AuthContext.js"
    "src/contexts/ToastContext.js"
    "src/services/api.js"
    "src/utils/theme.js"
    "src/utils/config.js"
    "src/utils/dateUtils.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

# Check screen files
echo "📱 Checking screens..."
SCREEN_FILES=(
    "src/screens/LoginScreen.js"
    "src/screens/DashboardScreen.js"
    "src/screens/ProfileScreen.js"
    "src/screens/MembersScreen.js"
    "src/screens/AttendanceScreen.js"
    "src/screens/AttendanceHistoryScreen.js"
    "src/screens/ManualAttendanceScreen.js"
    "src/screens/SignupScreen.js"
    "src/screens/UserDetailScreen.js"
)

for file in "${SCREEN_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

# Check backend connection (if possible)
echo "🔗 Checking backend connection..."
if command -v curl >/dev/null 2>&1; then
    # Check common backend URLs
    BACKEND_URLS=(
        "http://localhost:3000"
        "http://127.0.0.1:3000" 
        "http://10.0.2.2:3000"
    )
    
    BACKEND_FOUND=false
    for url in "${BACKEND_URLS[@]}"; do
        if curl -s --connect-timeout 3 "$url/api/auth/login" >/dev/null 2>&1; then
            echo "✅ Backend accessible at: $url"
            BACKEND_FOUND=true
            break
        fi
    done
    
    if [ "$BACKEND_FOUND" = false ]; then
        echo "⚠️  Backend not accessible. Make sure the backend server is running."
        echo "   Try: cd ../backend && npm start"
    fi
else
    echo "⚠️  curl not available, cannot test backend connection"
fi

# Network configuration check
echo "🌐 Network configuration..."
if [ -f "src/utils/config.js" ]; then
    API_URL=$(grep -o "apiUrl.*" src/utils/config.js | head -1)
    echo "📍 Current API URL setting: $API_URL"
    echo ""
    echo "Platform-specific URLs:"
    echo "  iOS Simulator:    http://localhost:3000"
    echo "  Android Emulator: http://10.0.2.2:3000" 
    echo "  Physical Device:  http://YOUR_COMPUTER_IP:3000"
    echo ""
    echo "Update src/utils/config.js to match your testing environment"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Install dependencies (if needed): npm install"
echo "2. Start the development server: npx expo start"
echo "3. Ensure backend is running: cd ../backend && npm start"
echo "4. Choose your platform: Press 'i' for iOS, 'a' for Android"
echo "5. Update API URL in src/utils/config.js for your environment"
echo ""
echo "📖 For detailed troubleshooting: See NETWORK_TROUBLESHOOTING.md"
echo "📋 For complete setup guide: See README.md"
echo ""
echo "✨ Happy coding!"
