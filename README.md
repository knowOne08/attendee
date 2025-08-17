# Attendee Attendance Terminal

##  Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](docs/PROJECT_OVERVIEW.md) | System architecture and tech stack |
| [Complete Setup](docs/COMPLETE_SETUP.md) | Detailed installation guide |
| [Hardware Setup](docs/HARDWARE_SETUP.md) | Circuit assembly and wiring |
| [Firmware Setup](docs/FIRMWARE_SETUP.md) | ESP8266 programming guide |
| [User Guide](docs/USER_GUIDE.md) | How to use the system |
| [API Reference](docs/API_REFERENCE.md) | REST API documentation |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Production deployment strategies |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |rsion-2.0.0-blue.svg(https://github.com/launchlog/attendance-terminal)


[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![ESP8266](https://img.shields.io/badge/platform-ESP8266-red.svg)](https://github.com/esp8266/Arduino)
[![React](https://img.shields.io/badge/frontend-React-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/backend-Node.js-green.svg)](https://nodejs.org/)

A comprehensive RFID-based attendance tracking system with real-time web interface, offline capabilities, and modern ESP8266 firmware.

##  Quick Start

```bash
# 1. Clone and setup backend
git clone https://github.com/launchlog/attendance-terminal.git
cd attendance-terminal/backend
npm install && npm start

# 2. Setup frontend (new terminal)
cd ../frontend && npm install && npm run dev

# 3. Access web interface
# http://localhost:3000 (admin@launchlog.com / admin123)
```

**Hardware Setup**: See [Hardware Setup Guide](docs/HARDWARE_SETUP.md) for physical assembly  
**Complete Setup**: See [Complete Setup Guide](docs/COMPLETE_SETUP.md) for detailed instructions

# Key Features

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Attendee Attendance System                  │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│   Hardware      │    Firmware     │     Backend     │  Frontend │
│   Terminal      │   (ESP8266)     │   (Node.js)     │  (React)  │
├─────────────────┼─────────────────┼─────────────────┼───────────┤
│ • RFID Reader   │ • WiFi Connect  │ • REST API      │ • Web UI  │
│ • LCD Display   │ • RFID Process  │ • Database      │ • Real-time│
│ • LEDs/Buzzer   │ • HTTP Client   │ • Auth System   │ • Reports │
│ • RTC Module    │ • Data Storage  │ • WebSocket     │ • Admin   │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
```

## Project Structure

```
attendee/
├── backend/               # Node.js API server
│   ├── models/           # Database models
│   ├── routes/           # API endpoints  
│   └── server.js         # Main server
├── frontend/             # React web app
│   ├── src/components/   # React components
│   └── src/contexts/     # State management
├── firmware/             # ESP8266 code
│   └── attendance_terminal/
│       ├── attendance_terminal.ino
│       └── config.h      # Hardware config
├── whatsapp-bot/         # Notifications (optional)
└── docs/                 # Documentation
```

## Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](docs/PROJECT_OVERVIEW.md) | System architecture and tech stack |
| [Complete Setup](docs/COMPLETE_SETUP.md) | Detailed installation guide |
| [Hardware Setup](docs/HARDWARE_SETUP.md) | Circuit assembly and wiring |
| [Firmware Setup](docs/FIRMWARE_SETUP.md) | ESP8266 programming guide |
| [User Guide](docs/USER_GUIDE.md) | How to use the system |
| [API Reference](docs/API_REFERENCE.md) | REST API documentation |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |

## 🛠 Technology Stack

- **Backend**: Node.js, Express, MongoDB, JWT, Socket.IO
- **Frontend**: React 18, Vite, Tailwind CSS, Chart.js
- **Firmware**: Arduino (ESP8266), MFRC522, WiFiManager
- **Hardware**: ESP8266, RFID Reader, LCD, RTC, LEDs

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+ (local or cloud)
- Arduino IDE 1.8.19+ (for firmware)
- ESP8266 development board and RFID hardware

### Quick Installation
```bash
# 1. Backend setup
cd backend && npm install
cp .env.example .env  # Configure your MongoDB URI
npm start

# 2. Frontend setup (new terminal)
cd frontend && npm install && npm run dev

# 3. Access dashboard: http://localhost:3000
# Default login: admin@launchlog.com / admin123
```

### Hardware Setup
1. Assemble circuit according to [Hardware Setup Guide](docs/HARDWARE_SETUP.md)
2. Flash firmware using [Firmware Setup Guide](docs/FIRMWARE_SETUP.md)
3. Configure WiFi through device setup portal

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/launchlog/attendance-terminal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/launchlog/attendance-terminal/discussions)



