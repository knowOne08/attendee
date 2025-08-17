# 🤖 Attendee WhatsApp Bot - Complete Setup Guide

## Quick Start

### 1. Installation
```bash
cd whatsapp-bot
npm install @whiskeysockets/baileys axios qrcode-terminal
```

### 2. Run the Bot
```bash
node bot.js
```

### 3. Connect WhatsApp
- Scan the QR code displayed in terminal with WhatsApp
- Send `/today` to test

---

## 📋 What This Bot Does

When a user sends `/today` to the bot, it:

1. Fetches data from `GET /attendance/today` backend API
2. Formats the response as:
   ```
   📋 Attendance Today

   1. Alice – 09:15 AM
   2. Bob – 09:22 AM
   3. John Doe – 09:45 AM

   ✅ Total entries: 3
   ```

## 🏗️ Architecture

```
User (WhatsApp) → Bot (Baileys) → Backend API (Express) → Database (MongoDB)
```

- **Frontend**: WhatsApp (via Baileys library)
- **Bot**: Node.js with `@whiskeysockets/baileys`
- **Backend**: Express server at `http://localhost:3000`
- **API**: `/attendance/today` endpoint

## 📁 File Structure

```
whatsapp-bot/
├── bot.js              # Main bot script
├── package.json        # Dependencies
├── README.md          # Documentation
├── test-setup.sh      # Setup verification script
├── .gitignore         # Git ignore rules
└── auth_info_baileys/ # Session data (auto-generated)
```

## 🚀 Complete Setup Instructions

### Prerequisites
- Node.js v16+ installed
- WhatsApp account
- Backend server running (see backend setup below)

### Step 1: Install Dependencies
```bash
cd /Users/yashdarji/Workspace/Attendee/whatsapp-bot
npm install @whiskeysockets/baileys axios qrcode-terminal
```

### Step 2: Start Backend Server (Required)
```bash
# In another terminal
cd /Users/yashdarji/Workspace/Attendee/backend
npm install
npm start
```

### Step 3: Run the Bot
```bash
cd /Users/yashdarji/Workspace/Attendee/whatsapp-bot
node bot.js
```

### Step 4: Pair with WhatsApp
1. The bot will display a QR code in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings > Linked Devices > Link a Device**
4. Scan the QR code
5. Bot should show "✅ WhatsApp Bot connected successfully!"

### Step 5: Test the Bot
Send `/today` to the bot number and you should receive today's attendance.

## 🧪 Testing

### Test Setup
```bash
./test-setup.sh
```

### Test Backend API Manually
```bash
curl http://localhost:3000/attendance/today
```

### Test Bot Commands
- Send `/today` - Get attendance
- Send `/help` - Get help message

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set custom backend URL
BACKEND_URL=http://localhost:3000 node bot.js
```

### Default Configuration
- Backend URL: `http://localhost:3000`
- Session directory: `./auth_info_baileys`

## 📱 Bot Commands

| Command | Description | Example Response |
|---------|-------------|------------------|
| `/today` | Get today's attendance | Formatted list with names and times |
| `/help` or any other `/command` | Show help message | Available commands and usage |

## 🛠️ Development

### Development Mode (Auto-restart)
```bash
npm run dev
```

### Adding New Commands
Edit `bot.js` and add new command handlers in the `handleMessage` method:

```javascript
else if (messageText?.toLowerCase().trim() === '/newcommand') {
  await this.handleNewCommand(chatId);
}
```

## 🔒 Security & Best Practices

### Session Management
- Sessions are stored in `auth_info_baileys/`
- This directory is auto-generated and contains sensitive data
- Already added to `.gitignore` - **never commit this directory**

### Error Handling
The bot handles:
- Backend server offline
- Network connectivity issues
- Database errors
- Invalid commands
- Missing data scenarios

## 🐛 Troubleshooting

### Bot Won't Start
```bash
# Check dependencies
npm list @whiskeysockets/baileys axios qrcode-terminal

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

### QR Code Issues
- Ensure stable internet connection
- Try restarting the bot
- Make sure WhatsApp Web isn't already active elsewhere

### Backend Connection Issues
```bash
# Test backend is running
curl http://localhost:3000/attendance/today

# Check backend logs for errors
cd ../backend && npm start
```

### Bot Not Responding
- Check console logs for errors
- Verify WhatsApp session is active
- Restart the bot if needed

## 📊 Sample Data

To test with sample data:
```bash
cd ../backend
node seed-data.js
```

This creates sample users and attendance records for testing.

## 🚦 Status Indicators

### Bot Status Messages
- 🚀 Starting up
- 📱 QR code ready
- ✅ Connected successfully
- 📨 Message received
- 📋 Fetching attendance
- ❌ Error occurred

### Expected Flow
1. `🚀 Starting Attendee WhatsApp Bot...`
2. `📱 QR Code for WhatsApp pairing:` (displays QR)
3. `✅ WhatsApp Bot connected successfully!`
4. `📨 Received message: "/today" from [number]`
5. `📋 Fetching today's attendance...`
6. `✅ Sent today's attendance to [number]`

## 🎯 Next Steps

1. **Test the complete flow**:
   - Start backend server
   - Run bot and scan QR
   - Send `/today` command
   - Verify response format

2. **Add more features** (optional):
   - `/yesterday` command
   - `/week` command
   - User-specific attendance
   - Admin commands

3. **Deploy to production**:
   - Use PM2 for process management
   - Set up proper environment variables
   - Configure logging
   - Set up monitoring

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Run `./test-setup.sh`
3. Check console logs
4. Verify backend is running
5. Test API endpoints manually

---

**Happy coding! 🚀**
