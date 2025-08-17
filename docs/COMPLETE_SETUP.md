# Complete Setup Guide

This guide provides step-by-step instructions for setting up the complete Attendee Attendance Terminal system from scratch.

## Prerequisites

### Software Requirements
- **Node.js** 16.0+ and npm
- **MongoDB** 4.4+ (local or cloud)
- **Arduino IDE** 1.8.19+ or **PlatformIO**
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Hardware Requirements
- **ESP8266** development board (NodeMCU, Wemos D1 Mini)
- **MFRC522** RFID reader module
- **16x2 I2C LCD** display (with PCF8574 backpack)
- **DS3231** Real-Time Clock module
- **LEDs** (Green and Red)
- **Passive Buzzer**
- **Breadboard** and **jumper wires**
- **5V power supply** for the system
- **RFID cards/tags** for users

## Part 1: Backend Setup

### 1.1 Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Install additional development tools (optional)
npm install -g nodemon
```

### 1.2 Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# Download and install from https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string from "Connect" → "Connect your application"

### 1.3 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

Configure the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/attendee
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/attendee

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 1.4 Database Initialization

```bash
# Create admin user (optional)
node create-admin.js

# Seed sample data (optional)
node seed-data.js
```

### 1.5 Start Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Verify server is running
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-08-17T10:30:00.000Z",
  "uptime": 123.456
}
```

## Part 2: Frontend Setup

### 2.1 Install Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install React dependencies
npm install

# Install additional development tools (optional)
npm install -g @vitejs/plugin-react
```

### 2.2 Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment file
nano .env.local
```

Configure the following variables:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Attendee Attendance Terminal
VITE_APP_VERSION=2.0.0

# Development Configuration
VITE_DEBUG=true
```

### 2.3 Start Frontend Development Server

```bash
# Start Vite development server
npm run dev

# Build for production (optional)
npm run build

# Preview production build (optional)
npm run preview
```

The frontend will be available at: `http://localhost:3000`

### 2.4 Verify Frontend Connection

1. Open browser to `http://localhost:3000`
2. You should see the login page
3. Try logging in with test credentials (if seeded)
4. Check browser console for any API connection errors

## Part 3: Firmware Setup

### 3.1 Arduino IDE Configuration

#### Install Arduino IDE
1. Download from [Arduino.cc](https://www.arduino.cc/en/software)
2. Install for your operating system

#### Add ESP8266 Board Support
1. Open Arduino IDE
2. Go to **File** → **Preferences**
3. Add to "Additional Board Manager URLs":
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
4. Go to **Tools** → **Board** → **Boards Manager**
5. Search for "esp8266" and install "esp8266 by ESP8266 Community"

### 3.2 Install Required Libraries

Open **Tools** → **Manage Libraries** and install:

#### Core Libraries
- **ESP8266WiFi** (included with ESP8266 board package)
- **ESP8266WebServer** (included with ESP8266 board package)
- **ESP8266HTTPClient** (included with ESP8266 board package)

#### External Libraries
```
WiFiManager by tzapu - v2.0.16-rc.2
ArduinoJson by Benoit Blanchon - v6.21.3
MFRC522v2 by GithubCommunity - v2.0.4
LiquidCrystal I2C by Frank de Brabander - v1.1.2
RTClib by Adafruit - v2.1.1
LittleFS_esp8266 by Earle Philhower - v2.6.0
```

#### Installation Commands
```bash
# Alternative: PlatformIO (if preferred)
pio lib install "tzapu/WiFiManager@^2.0.16-rc.2"
pio lib install "bblanchon/ArduinoJson@^6.21.3"
pio lib install "miguelbalboa/MFRC522@^1.4.10"
pio lib install "johnrickman/LiquidCrystal_I2C@^1.1.2"
pio lib install "adafruit/RTClib@^2.1.1"
```

### 3.3 Hardware Assembly

See [HARDWARE_SETUP.md](HARDWARE_SETUP.md) for detailed wiring diagrams.

#### Quick Pin Reference (ESP8266 NodeMCU)
```
Component       ESP8266 Pin    NodeMCU Pin
===============================================
RFID MFRC522:
  - SDA/SS      GPIO15         D8
  - SCK         GPIO14         D5
  - MOSI        GPIO13         D7
  - MISO        GPIO12         D6
  - RST         GPIO16         D0
  - VCC         3.3V           3V3
  - GND         GND            GND

I2C LCD (PCF8574):
  - VCC         5V             VIN
  - GND         GND            GND
  - SDA         GPIO4          D2
  - SCL         GPIO5          D1

DS3231 RTC:
  - VCC         3.3V           3V3
  - GND         GND            GND
  - SDA         GPIO4          D2
  - SCL         GPIO5          D1

LEDs:
  - Green LED   GPIO2          D4
  - Red LED     GPIO0          D3

Buzzer:
  - Positive    GPIO16         D0
  - Negative    GND            GND
```

### 3.4 Firmware Configuration

#### Edit Configuration File
Open `firmware/attendance_terminal/config.h`:

```cpp
// Network Configuration
#define DEFAULT_BACKEND_URL "http://192.168.1.100:5000"  // Your backend IP
#define DEVICE_ID_PREFIX "LAUNCHLOG_"

// Hardware Pin Definitions (adjust if needed)
#define RFID_SS_PIN 15      // D8 on NodeMCU
#define RFID_RST_PIN 16     // D0 on NodeMCU
#define GREEN_LED 2         // D4 on NodeMCU
#define RED_LED 0           // D3 on NodeMCU
#define BUZZER_PIN 16       // D0 on NodeMCU

// I2C Configuration
#define LCD_ADDRESS 0x27    // Common I2C address for PCF8574
#define LCD_COLS 16
#define LCD_ROWS 2

// Timing Configuration
#define HEARTBEAT_INTERVAL 1800000    // 30 minutes
#define SYNC_RETRY_INTERVAL 60000     // 1 minute
#define CARD_SCAN_COOLDOWN 3000       // 3 seconds

// Debug Settings
#define DEBUG_BAUD_RATE 115200
#define ENABLE_SERIAL_DEBUG true
```

### 3.5 Upload Firmware

1. Connect ESP8266 to computer via USB
2. Open `firmware/attendance_terminal/attendance_terminal.ino`
3. Select **Tools** → **Board** → **ESP8266 Boards** → **NodeMCU 1.0 (ESP-12E Module)**
4. Select correct **Port** (e.g., COM3 on Windows, /dev/ttyUSB0 on Linux)
5. Configure upload settings:
   ```
   Upload Speed: 921600
   CPU Frequency: 80 MHz
   Flash Size: 4MB (FS:2MB OTA:~1019KB)
   Debug port: Disabled
   Debug Level: None
   IwIP Variant: v2 Lower Memory
   VTables: Flash
   Exceptions: Legacy (new can return nullptr)
   Erase Flash: Only Sketch
   ```
6. Click **Upload** button

### 3.6 Initial Device Setup

#### First Boot Configuration
1. After upload, open **Serial Monitor** (115200 baud)
2. Reset the ESP8266
3. Look for WiFi setup messages
4. If no WiFi configured, device creates captive portal:
   - Connect to WiFi network: `Attendee_XXXXXX`
   - Browser should open configuration page automatically
   - If not, navigate to: `http://192.168.4.1`
5. Configure WiFi credentials and backend URL
6. Device will restart and connect to your network

#### Verify Device Operation
1. Check Serial Monitor for successful connections:
   ```
   === Attendee Attendance Terminal v2.0 ===
   WiFi connected: 192.168.1.150
   Backend URL: http://192.168.1.100:5000
   RFID initialized successfully
   RTC initialized successfully
   === Ready for RFID scanning ===
   ```

2. Test RFID scanning:
   - Present RFID card to reader
   - LCD should show scanning progress
   - Serial Monitor shows scan results

3. Test web interface:
   - Navigate to device IP: `http://192.168.1.150`
   - Should see device administration page

## Part 4: System Integration

### 4.1 User Registration

#### Via Web Interface
1. Open frontend: `http://localhost:3000`
2. Click "Sign Up" (if enabled)
3. Create admin account
4. Log in and navigate to "Members" section
5. Add users with RFID card UIDs

#### Via Backend API
```bash
# Create user via API
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "rfidTag": "A1B2C3D4"
  }'
```

### 4.2 RFID Card Registration

#### Method 1: Scan and Register
1. Present unknown RFID card to device
2. Device logs "Unknown card" with UID
3. Use web interface to assign UID to user

#### Method 2: Manual Entry
1. Read RFID UID using Serial Monitor
2. Copy UID from device logs
3. Add to user profile in web interface

### 4.3 Testing Complete Workflow

#### Test Attendance Logging
1. Register RFID card to user
2. Present card to device
3. Verify LCD shows user name and status
4. Check web interface for attendance record
5. Test entry/exit cycle

#### Test Offline Mode
1. Disconnect device from internet
2. Scan RFID cards
3. Verify offline storage on device
4. Reconnect internet
5. Verify automatic sync of offline logs

## Part 5: Production Deployment

### 5.1 Backend Deployment

#### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendee
JWT_SECRET=your-production-secret-key
```

#### Deployment Options

**Option A: VPS/Cloud Server**
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Deploy application
git clone https://github.com/your-repo/attendance-terminal.git
cd attendance-terminal/backend
npm install --production
pm2 start server.js --name "attendance-backend"
pm2 save
pm2 startup
```

**Option B: Docker**
```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 5.2 Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

#### Deployment Options

**Option A: Static Hosting (Netlify, Vercel)**
```bash
# Build and deploy
npm run build
# Upload dist/ folder to hosting provider
```

**Option B: Web Server (Nginx)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/attendance-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5.3 Device Configuration for Production

#### Update Firmware Configuration
```cpp
// Production settings in config.h
#define DEFAULT_BACKEND_URL "https://your-domain.com/api"
#define ENABLE_SERIAL_DEBUG false  // Disable for production
#define HEARTBEAT_INTERVAL 3600000  // 1 hour for production
```

#### Secure Device Access
1. Change default WiFi configuration
2. Disable unnecessary debug features
3. Set up firewall rules if needed
4. Consider VPN for secure communication

## Part 6: Monitoring and Maintenance

### 6.1 System Monitoring

#### Backend Monitoring
```bash
# Check backend status
pm2 status
pm2 logs attendance-backend

# Monitor database
mongo
use attendee
db.users.count()
db.attendances.count()
```

#### Device Monitoring
- Check device web interface regularly
- Monitor WiFi connectivity
- Verify time synchronization
- Check offline log accumulation

### 6.2 Regular Maintenance

#### Database Backups
```bash
# MongoDB backup
mongodump --db attendee --out /backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db attendee --out /backup/mongodb_$DATE
find /backup -name "mongodb_*" -mtime +7 -exec rm -rf {} \;
```

#### Log Rotation
```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### Device Updates
1. Test firmware updates in development
2. Deploy via OTA updates (future feature)
3. Monitor device performance
4. Update configuration as needed

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Support

- **Documentation**: Complete guides in `/docs` folder
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join discussions on GitHub Discussions

---

**Setup Complete!** Your Attendee Attendance Terminal system should now be fully operational.
