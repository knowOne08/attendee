#!/bin/bash

echo "🧪 Testing LaunchLog WhatsApp Bot Setup..."
echo ""

# Check if we're in the right directory
if [ ! -f "bot.js" ]; then
    echo "❌ Error: bot.js not found. Please run this script from the whatsapp-bot directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Check if required dependencies are installed
echo "📦 Checking dependencies..."
if npm list @whiskeysockets/baileys > /dev/null 2>&1; then
    echo "✅ @whiskeysockets/baileys installed"
else
    echo "❌ @whiskeysockets/baileys not found"
    exit 1
fi

if npm list axios > /dev/null 2>&1; then
    echo "✅ axios installed"
else
    echo "❌ axios not found"
    exit 1
fi

if npm list qrcode-terminal > /dev/null 2>&1; then
    echo "✅ qrcode-terminal installed"
else
    echo "❌ qrcode-terminal not found"
    exit 1
fi

echo ""
echo "🎉 All dependencies are installed correctly!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your backend server is running (npm start in ../backend/)"
echo "2. Run the bot: node bot.js"
echo "3. Scan the QR code with WhatsApp"
echo "4. Send '/today' to test the attendance feature"
echo ""
echo "🔗 Backend should be available at: http://localhost:3000"
echo "📱 Test backend API: curl http://localhost:3000/attendance/today"
