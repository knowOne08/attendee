# Troubleshooting Guide

This guide covers common issues and their solutions for the Attendee Attendance Terminal system.

## Table of Contents

1. [General Troubleshooting](#general-troubleshooting)
2. [Hardware Issues](#hardware-issues)
3. [Network Problems](#network-problems)
4. [Software Issues](#software-issues)
5. [Database Problems](#database-problems)
6. [Performance Issues](#performance-issues)
7. [Security Concerns](#security-concerns)
8. [API Issues](#api-issues)

## General Troubleshooting

### Basic Diagnostics

Before diving into specific issues, perform these basic checks:

#### System Health Check
```bash
# Check if all services are running
cd /path/to/attendee

# Backend status
cd backend && npm run status
curl http://localhost:5000/api/health

# Frontend status
cd frontend && npm run build --dry-run

# Database connection
mongosh --eval "db.adminCommand('ping')"
```

#### Log File Locations
- **Backend logs**: `backend/logs/error.log`, `backend/logs/access.log`
- **Frontend logs**: Browser Developer Console
- **System logs**: `/var/log/nginx/` (if using nginx)
- **Database logs**: MongoDB log files

#### Common Error Codes

| Code | Component | Meaning | Quick Fix |
|------|-----------|---------|-----------|
| 500 | Backend | Server error | Check backend logs |
| 404 | Frontend | Route not found | Check URL and routing |
| 401 | Auth | Unauthorized | Check JWT token |
| 503 | Network | Service unavailable | Check network connection |

## Hardware Issues

### RFID Terminal Problems

#### Terminal Not Responding

**Symptoms**:
- No display on LCD
- LEDs not working
- No response to card scans

**Diagnostics**:
```bash
# Check USB connection
lsusb | grep "Serial"
dmesg | tail -20

# Test power supply
# Should show 5V DC output
multimeter readings across VIN and GND
```

**Solutions**:
1. **Power Issues**:
   ```
   - Check USB cable integrity
   - Test with different power adapter
   - Verify 5V output with multimeter
   - Check for loose connections
   ```

2. **ESP8266 Issues**:
   ```
   - Hold RESET button for 3 seconds
   - Check for proper USB driver installation
   - Try different USB port
   - Re-flash firmware if necessary
   ```

3. **Hardware Damage**:
   ```
   - Visual inspection for burnt components
   - Check for physical damage to PCB
   - Test individual components
   - Replace damaged parts
   ```

#### RFID Reader Not Working

**Symptoms**:
- Cards not detected
- Inconsistent reading
- Error messages on terminal

**Diagnostics**:
```cpp
// Add debug code to firmware
void debugRFID() {
  if (rfid.PICC_IsNewCardPresent()) {
    Serial.println("Card detected");
    if (rfid.PICC_ReadCardSerial()) {
      Serial.print("UID: ");
      for (byte i = 0; i < rfid.uid.size; i++) {
        Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Serial.print(rfid.uid.uidByte[i], HEX);
      }
      Serial.println();
    }
  }
}
```

**Solutions**:
1. **Physical Issues**:
   ```
   - Clean reader antenna with alcohol wipe
   - Check for proper 3.3V power supply
   - Verify SPI connections
   - Test with known good RFID cards
   ```

2. **Wiring Problems**:
   ```
   MFRC522 → ESP8266
   SDA → D8 (GPIO15)
   SCK → D5 (GPIO14)
   MOSI → D7 (GPIO13)
   MISO → D6 (GPIO12)
   RST → D0 (GPIO16)
   VCC → 3.3V (NOT 5V!)
   GND → GND
   ```

3. **Code Issues**:
   ```cpp
   // Verify RFID initialization
   if (!rfid.PCD_PerformSelfTest()) {
     Serial.println("RFID self-test failed");
     // Check wiring and power
   }
   ```

#### LCD Display Issues

**Symptoms**:
- Blank display
- Garbled characters
- Partial display

**Diagnostics**:
```cpp
// Test LCD directly
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void testLCD() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Test Display");
  lcd.setCursor(0, 1);
  lcd.print("Line 2 Test");
}
```

**Solutions**:
1. **I2C Address Issues**:
   ```cpp
   // Scan for I2C devices
   void i2cScanner() {
     for (byte address = 1; address < 127; address++) {
       Wire.beginTransmission(address);
       if (Wire.endTransmission() == 0) {
         Serial.print("I2C device at 0x");
         Serial.println(address, HEX);
       }
     }
   }
   ```

2. **Wiring Verification**:
   ```
   LCD → ESP8266
   VCC → 5V (VIN pin)
   GND → GND
   SDA → D2 (GPIO4)
   SCL → D1 (GPIO5)
   ```

3. **Power Problems**:
   ```
   - Ensure 5V power for LCD
   - Check current capacity of power supply
   - Verify stable voltage with multimeter
   ```

#### RTC Module Issues

**Symptoms**:
- Incorrect time display
- Time resets on power cycle
- Clock drift

**Diagnostics**:
```cpp
#include <RTClib.h>
RTC_DS3231 rtc;

void testRTC() {
  if (!rtc.begin()) {
    Serial.println("RTC not found");
    return;
  }
  
  DateTime now = rtc.now();
  Serial.print("Current time: ");
  Serial.println(now.timestamp());
  
  // Check if time is reasonable
  if (now.year() < 2020) {
    Serial.println("RTC needs time sync");
  }
}
```

**Solutions**:
1. **Battery Issues**:
   ```
   - Replace CR2032 backup battery
   - Verify battery voltage (>2.5V)
   - Check battery holder connections
   ```

2. **Time Sync**:
   ```cpp
   // Sync RTC with NTP
   void syncRTCWithNTP() {
     configTime(0, 0, "pool.ntp.org");
     time_t now = time(nullptr);
     while (now < 24 * 3600) {
       delay(100);
       now = time(nullptr);
     }
     rtc.adjust(DateTime(now));
   }
   ```

3. **I2C Conflicts**:
   ```
   - Check for multiple devices on same I2C bus
   - Verify unique I2C addresses
   - Add pull-up resistors if needed (4.7kΩ)
   ```

## Network Problems

### WiFi Connectivity Issues

#### Cannot Connect to WiFi

**Symptoms**:
- Terminal shows "WiFi Disconnected"
- No network communication
- Connection timeouts

**Diagnostics**:
```cpp
void diagnoseWiFi() {
  Serial.print("WiFi Status: ");
  Serial.println(WiFi.status());
  
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  Serial.print("Signal Strength: ");
  Serial.println(WiFi.RSSI());
}
```

**Solutions**:
1. **Network Configuration**:
   ```cpp
   // Check WiFi credentials in config.h
   const char* WIFI_SSID = "YourNetworkName";
   const char* WIFI_PASSWORD = "YourPassword";
   
   // Verify network settings
   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
   ```

2. **Signal Strength**:
   ```
   - Move closer to WiFi router
   - Check for interference (microwaves, other 2.4GHz devices)
   - Use WiFi analyzer to find best channel
   - Consider external antenna for ESP8266
   ```

3. **Network Security**:
   ```
   - Verify WPA2/WPA3 compatibility
   - Check MAC address filtering
   - Ensure DHCP is enabled
   - Test with mobile hotspot
   ```

#### Intermittent Connectivity

**Symptoms**:
- Connection drops randomly
- Slow data transmission
- Timeout errors

**Solutions**:
1. **Power Management**:
   ```cpp
   // Disable WiFi sleep mode
   WiFi.setSleep(false);
   
   // Monitor connection status
   void monitorWiFi() {
     if (WiFi.status() != WL_CONNECTED) {
       Serial.println("WiFi disconnected, reconnecting...");
       WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
     }
   }
   ```

2. **Router Configuration**:
   ```
   - Update router firmware
   - Change WiFi channel (1, 6, or 11 for 2.4GHz)
   - Increase DHCP lease time
   - Disable band steering if present
   ```

### Backend Communication Issues

#### Cannot Reach Backend Server

**Symptoms**:
- HTTP timeout errors
- 503 Service Unavailable
- Connection refused

**Diagnostics**:
```bash
# Test backend connectivity
curl -v http://localhost:5000/api/health

# Check port availability
netstat -tlnp | grep :5000

# Test from terminal device
ping backend-server-ip
telnet backend-server-ip 5000
```

**Solutions**:
1. **Backend Server**:
   ```bash
   # Check if backend is running
   ps aux | grep node
   
   # Restart backend service
   cd backend
   npm start
   
   # Check logs for errors
   tail -f logs/error.log
   ```

2. **Firewall Configuration**:
   ```bash
   # Check firewall rules
   sudo ufw status
   
   # Open required ports
   sudo ufw allow 5000
   sudo ufw allow 3000
   ```

3. **Network Configuration**:
   ```cpp
   // Update server URL in firmware
   const char* SERVER_URL = "http://192.168.1.100:5000";
   
   // Test connectivity
   HTTPClient http;
   http.begin(SERVER_URL + "/api/health");
   int httpCode = http.GET();
   Serial.println("HTTP Response: " + String(httpCode));
   ```

## Software Issues

### Frontend Problems

#### Page Not Loading

**Symptoms**:
- Blank white page
- Loading spinner never stops
- JavaScript errors in console

**Diagnostics**:
```bash
# Check frontend build
cd frontend
npm run build

# Check for JavaScript errors
# Open browser developer tools (F12)
# Look for errors in Console tab

# Test with development server
npm run dev
```

**Solutions**:
1. **Build Issues**:
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear build cache
   rm -rf dist/.vite
   npm run build
   ```

2. **Browser Compatibility**:
   ```
   - Clear browser cache and cookies
   - Try incognito/private mode
   - Test with different browser
   - Disable browser extensions
   ```

3. **Environment Variables**:
   ```bash
   # Check .env file in frontend
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

#### Real-time Updates Not Working

**Symptoms**:
- Data doesn't refresh automatically
- Manual refresh required
- WebSocket connection errors

**Diagnostics**:
```javascript
// Check WebSocket connection in browser console
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
socket.on('error', (error) => console.error('Socket error:', error));
```

**Solutions**:
1. **WebSocket Configuration**:
   ```javascript
   // Check socket.io client configuration
   const socket = io(process.env.VITE_SOCKET_URL, {
     auth: {
       token: localStorage.getItem('authToken')
     },
     transports: ['websocket', 'polling']
   });
   ```

2. **Backend WebSocket**:
   ```javascript
   // Verify server-side socket.io setup
   const io = require('socket.io')(server, {
     cors: {
       origin: process.env.FRONTEND_URL,
       credentials: true
     }
   });
   ```

### Backend Problems

#### Server Crashes

**Symptoms**:
- Backend server stops responding
- Process exits unexpectedly
- Database connection errors

**Diagnostics**:
```bash
# Check system resources
top
df -h
free -m

# Check Node.js process
ps aux | grep node

# Review crash logs
tail -f backend/logs/error.log
journalctl -u your-service-name
```

**Solutions**:
1. **Memory Issues**:
   ```bash
   # Monitor memory usage
   node --max-old-space-size=4096 server.js
   
   # Check for memory leaks
   npm install -g clinic
   clinic doctor -- node server.js
   ```

2. **Process Management**:
   ```bash
   # Use PM2 for production
   npm install -g pm2
   pm2 start server.js --name "attendance-backend"
   pm2 startup
   pm2 save
   ```

3. **Error Handling**:
   ```javascript
   // Add global error handlers
   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     process.exit(1);
   });
   
   process.on('unhandledRejection', (reason) => {
     console.error('Unhandled Rejection:', reason);
   });
   ```

#### Database Connection Issues

**Symptoms**:
- "Connection refused" errors
- Timeout connecting to database
- Authentication failures

**Diagnostics**:
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/attendee"

# Check MongoDB status
sudo systemctl status mongod

# Verify connection string
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attendee')
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
"
```

**Solutions**:
1. **MongoDB Service**:
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Check logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

2. **Connection Configuration**:
   ```javascript
   // Improve connection resilience
   mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
     maxPoolSize: 10,
     retryWrites: true
   });
   ```

3. **Authentication Issues**:
   ```bash
   # Create database user
   mongosh
   use admin
   db.createUser({
     user: "attendee_user",
     pwd: "secure_password",
     roles: [{ role: "readWrite", db: "attendee" }]
   })
   ```

## Database Problems

### Data Corruption

**Symptoms**:
- Inconsistent data retrieval
- Query errors
- Missing records

**Diagnostics**:
```bash
# Check database integrity
mongosh attendee
db.runCommand({validate: "users"})
db.runCommand({validate: "attendances"})

# Check collection statistics
db.users.stats()
db.attendances.stats()
```

**Solutions**:
1. **Repair Database**:
   ```bash
   # Stop MongoDB
   sudo systemctl stop mongod
   
   # Repair database
   mongod --repair --dbpath /var/lib/mongodb
   
   # Restart MongoDB
   sudo systemctl start mongod
   ```

2. **Restore from Backup**:
   ```bash
   # Restore specific collection
   mongorestore --db attendee --collection users backup/users.bson
   
   # Full database restore
   mongorestore --db attendee backup/attendee/
   ```

### Performance Issues

**Symptoms**:
- Slow query responses
- High CPU usage
- Memory consumption

**Diagnostics**:
```javascript
// Enable profiling
db.setProfilingLevel(2)

// Find slow queries
db.system.profile.find().sort({ts: -1}).limit(5)

// Check indexes
db.users.getIndexes()
db.attendances.getIndexes()
```

**Solutions**:
1. **Add Indexes**:
   ```javascript
   // Create performance indexes
   db.users.createIndex({ rfidTag: 1 }, { unique: true })
   db.users.createIndex({ email: 1 }, { unique: true })
   db.attendances.createIndex({ user: 1, date: 1 })
   db.attendances.createIndex({ date: 1 })
   ```

2. **Optimize Queries**:
   ```javascript
   // Use aggregation pipelines efficiently
   db.attendances.aggregate([
     { $match: { date: { $gte: startDate, $lte: endDate } } },
     { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "userInfo" } },
     { $project: { "userInfo.password": 0 } }
   ])
   ```

## Performance Issues

### High CPU Usage

**Symptoms**:
- System slowdown
- High load averages
- Unresponsive interface

**Diagnostics**:
```bash
# Monitor system performance
htop
iostat 1
sar -u 1

# Profile Node.js application
npm install -g 0x
0x server.js
```

**Solutions**:
1. **Optimize Code**:
   ```javascript
   // Use connection pooling
   const mongoose = require('mongoose');
   mongoose.connect(uri, {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000
   });
   
   // Implement caching
   const NodeCache = require('node-cache');
   const cache = new NodeCache({ stdTTL: 600 });
   ```

2. **Load Balancing**:
   ```bash
   # Use nginx for load balancing
   upstream backend {
     server 127.0.0.1:5000;
     server 127.0.0.1:5001;
   }
   ```

### Memory Leaks

**Symptoms**:
- Increasing memory usage over time
- System becomes unresponsive
- Out of memory errors

**Diagnostics**:
```bash
# Monitor memory usage
watch -n 1 'ps aux | grep node'

# Generate heap dump
kill -USR2 <node-process-pid>

# Analyze with clinic
clinic bubbleprof -- node server.js
```

**Solutions**:
1. **Fix Memory Leaks**:
   ```javascript
   // Properly close database connections
   process.on('SIGINT', async () => {
     await mongoose.connection.close();
     process.exit(0);
   });
   
   // Clear intervals and timeouts
   const interval = setInterval(() => {}, 1000);
   clearInterval(interval);
   ```

2. **Resource Management**:
   ```javascript
   // Implement request timeout
   app.use((req, res, next) => {
     res.setTimeout(30000, () => {
       res.status(408).json({ error: 'Request timeout' });
     });
     next();
   });
   ```

## Security Concerns

### Authentication Issues

**Symptoms**:
- Users can't log in
- JWT token errors
- Unauthorized access

**Diagnostics**:
```bash
# Verify JWT secret
node -e "console.log(process.env.JWT_SECRET)"

# Test token generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: '123'}, process.env.JWT_SECRET);
console.log('Token:', token);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Decoded:', decoded);
"
```

**Solutions**:
1. **JWT Configuration**:
   ```javascript
   // Ensure strong JWT secret
   const jwt = require('jsonwebtoken');
   const crypto = require('crypto');
   
   if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
     console.error('JWT_SECRET must be at least 32 characters');
     process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
   }
   ```

2. **Token Refresh**:
   ```javascript
   // Implement token refresh
   app.post('/auth/refresh', (req, res) => {
     const { refreshToken } = req.body;
     // Verify refresh token and issue new access token
   });
   ```

### HTTPS Configuration

**Issue**: Insecure HTTP connections

**Solutions**:
1. **SSL Certificate Setup**:
   ```bash
   # Using Let's Encrypt
   sudo apt install certbot
   sudo certbot --nginx -d yourdomain.com
   ```

2. **HTTPS Redirect**:
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

## API Issues

### Rate Limiting Problems

**Symptoms**:
- 429 Too Many Requests errors
- API calls being blocked
- Slow response times

**Solutions**:
1. **Adjust Rate Limits**:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 1000, // Limit each IP to 1000 requests per windowMs
     message: 'Too many requests, please try again later'
   });
   ```

2. **Implement Caching**:
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   
   // Cache frequent queries
   app.get('/api/users', async (req, res) => {
     const cacheKey = `users:${JSON.stringify(req.query)}`;
     const cached = await client.get(cacheKey);
     
     if (cached) {
       return res.json(JSON.parse(cached));
     }
     
     // Fetch from database and cache result
     const users = await User.find(req.query);
     await client.setex(cacheKey, 300, JSON.stringify(users));
     res.json(users);
   });
   ```

### CORS Issues

**Symptoms**:
- Cross-origin request blocked
- OPTIONS requests failing
- Frontend can't connect to backend

**Solutions**:
1. **Configure CORS Properly**:
   ```javascript
   const cors = require('cors');
   
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://yourdomain.com'
     ],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

## Emergency Procedures

### System Recovery

**Complete System Failure**:
1. **Assess Damage**:
   ```bash
   # Check system status
   systemctl status
   df -h
   free -m
   ```

2. **Recovery Steps**:
   ```bash
   # Stop all services
   sudo systemctl stop nginx
   sudo systemctl stop mongod
   
   # Backup current state
   sudo cp -r /var/lib/mongodb /backup/mongodb-emergency
   
   # Restore from backup
   sudo systemctl start mongod
   mongorestore /backup/latest/
   
   # Restart services
   sudo systemctl start nginx
   ```

### Data Recovery

**Database Corruption**:
1. **Emergency Backup**:
   ```bash
   # Create emergency backup
   mongodump --db attendee --out /emergency-backup/
   ```

2. **Recovery Process**:
   ```bash
   # Drop corrupted database
   mongosh attendee --eval "db.dropDatabase()"
   
   # Restore from backup
   mongorestore --db attendee /backup/latest/attendee/
   ```
