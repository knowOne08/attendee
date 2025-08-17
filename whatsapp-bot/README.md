# Attendee WhatsApp Bot

A WhatsApp bot for the Attendee MVP attendance system using the Baileys library.

## Features

- 📱 WhatsApp integration using Baileys library
- 📋 Get today's attendance with `/today` command
- 🔄 Auto-reconnection on disconnect
- 🤖 User-friendly error handling
- 📱 QR code pairing for easy setup

## Requirements

- Node.js (v16 or higher)
- Running Attendee backend server
- WhatsApp account for bot pairing

## Installation

1. **Install dependencies:**
   ```bash
   npm install @whiskeysockets/baileys axios qrcode-terminal
   ```

2. **Optional development dependencies:**
   ```bash
   npm install -D nodemon
   ```

## Usage

1. **Start the bot:**
   ```bash
   node bot.js
   ```

2. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

3. **Scan QR Code:**
   - When the bot starts, it will display a QR code in the terminal
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code displayed in the terminal

4. **Send commands:**
   - Send `/today` to get today's attendance records
   - The bot will respond with a formatted list of attendance entries

## Configuration

You can configure the backend URL by setting the `BACKEND_URL` environment variable:

```bash
BACKEND_URL=http://localhost:3000 node bot.js
```

Default backend URL is `http://localhost:3000`.

## Commands

- `/today` - Fetch and display today's attendance records
- Any other `/command` - Shows help message

## Example Output

When you send `/today`, the bot responds with:

```
📋 Attendance Today

1. Alice Brown – 09:15 AM
2. Bob Johnson – 09:22 AM
3. John Doe – 09:45 AM
4. Jane Smith – 10:12 AM

✅ Total entries: 4
```

## Error Handling

The bot handles various error scenarios:

- **Backend offline**: Notifies user that the backend server might be offline
- **Database issues**: Informs about database connection problems
- **Network errors**: Provides generic error message with retry suggestion
- **No data**: Shows message when no attendance records exist for today

## File Structure

```
whatsapp-bot/
├── bot.js              # Main bot script
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── auth_info_baileys/ # Auto-generated session data (do not commit)
```

## Security Notes

- The `auth_info_baileys/` directory contains session data and should not be committed to version control
- Add it to your `.gitignore` file
- Keep your bot secure and don't share session files

## Troubleshooting

1. **QR Code not appearing:**
   - Make sure you have a stable internet connection
   - Restart the bot if needed

2. **Connection issues:**
   - Check if the backend server is running
   - Verify the `BACKEND_URL` configuration

3. **Bot not responding:**
   - Check console logs for error messages
   - Ensure WhatsApp Web session is active

4. **Deprecation warnings or logger errors:**
   - These have been fixed in the latest version
   - The bot now handles QR codes manually without deprecated options
   - No additional logger configuration needed

## Development

To modify the bot behavior:

1. Edit `bot.js` to add new commands or change responses
2. Use `npm run dev` for development with auto-restart
3. Test thoroughly before deploying

## Support

For technical issues or feature requests, contact the Attendee development team.
