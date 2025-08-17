# Changelog

All notable changes to the Attendee WhatsApp Bot will be documented in this file.

## [1.0.1] - 2025-08-15

### Fixed
- ✅ Removed deprecated `printQRInTerminal` option from Baileys configuration
- ✅ Fixed logger error by removing problematic logger configuration
- ✅ QR code generation now handled manually in `connection.update` event
- ✅ Bot now starts without deprecation warnings or errors

### Technical Details
- The `printQRInTerminal: true` option was deprecated in newer versions of Baileys
- The `logger: { level: 'silent' }` configuration was causing TypeError
- QR codes are now displayed using the `qrcode-terminal` library in the connection update handler

### Testing
- ✅ Bot starts successfully without errors
- ✅ QR code displays correctly in terminal
- ✅ Connection handling works as expected
- ✅ All existing functionality preserved

## [1.0.0] - 2025-08-15

### Added
- 🚀 Initial release of Attendee WhatsApp Bot
- 📱 WhatsApp integration using Baileys library
- 📋 `/today` command to fetch attendance records
- 🔄 Auto-reconnection on disconnect
- 🤖 User-friendly error handling
- 📱 QR code pairing for easy setup
- 📊 Formatted attendance responses
- ℹ️ Help system for unknown commands

### Features
- Integration with Attendee backend API
- Real-time attendance data fetching
- Clean, formatted message responses
- Comprehensive error handling
- Session management with auto-save
- Development tools and documentation

### Dependencies
- @whiskeysockets/baileys ^6.5.0
- axios ^1.6.0
- qrcode-terminal ^0.12.0
