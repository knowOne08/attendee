# Firmware Setup Guide

This guide provides detailed instructions for setting up, configuring, and deploying the ESP8266 firmware for the LaunchLog Attendance Terminal.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Firmware Configuration](#firmware-configuration)
4. [Compilation and Upload](#compilation-and-upload)
5. [Initial Setup](#initial-setup)
6. [WiFi Configuration](#wifi-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

## Prerequisites

### Hardware Requirements

- **ESP8266 Development Board** (NodeMCU, Wemos D1 Mini, or similar)
- **USB Cable** (Micro-USB or USB-C depending on board)
- **Computer** with USB port (Windows, macOS, or Linux)
- **RFID Hardware** (MFRC522, LCD, RTC, LEDs, buzzer as per [HARDWARE_SETUP.md](HARDWARE_SETUP.md))

### Software Requirements

- **Arduino IDE** 1.8.19+ or **PlatformIO** with VS Code
- **ESP8266 Board Package** for Arduino
- **USB Drivers** for your ESP8266 board
- **Git** for version control (optional)

## Development Environment Setup

### Option 1: Arduino IDE Setup

#### 1. Install Arduino IDE
```bash
# Download from: https://www.arduino.cc/en/software

# Verify installation
arduino --version
```

#### 2. Install ESP8266 Board Package
1. Open Arduino IDE
2. Go to **File** → **Preferences**
3. Add ESP8266 board URL to "Additional Boards Manager URLs":
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
4. Go to **Tools** → **Board** → **Boards Manager**
5. Search for "ESP8266" and install "ESP8266 by ESP8266 Community"

#### 3. Install Required Libraries
Go to **Sketch** → **Include Library** → **Manage Libraries** and install:

| Library | Version | Purpose |
|---------|---------|---------|
| `MFRC522` | 1.4.10+ | RFID reader control |
| `LiquidCrystal I2C` | 1.1.2+ | LCD display control |
| `RTClib` | 2.1.1+ | Real-time clock |
| `ESP8266WiFi` | Built-in | WiFi connectivity |
| `ESP8266HTTPClient` | Built-in | HTTP requests |
| `ArduinoJson` | 6.21.0+ | JSON parsing |
| `WiFiManager` | 2.0.16+ | WiFi configuration |

#### 4. Select Board and Port
1. **Tools** → **Board** → **ESP8266 Boards** → **NodeMCU 1.0 (ESP-12E Module)**
2. **Tools** → **Port** → Select your USB port (e.g., COM3, /dev/ttyUSB0)
3. **Tools** → **Upload Speed** → **115200**
4. **Tools** → **Flash Size** → **4MB (FS:2MB OTA:~1019KB)**

### Option 2: PlatformIO Setup

#### 1. Install VS Code and PlatformIO
```bash
# Install VS Code
# Download from: https://code.visualstudio.com/

# Install PlatformIO extension
# In VS Code: Extensions → Search "PlatformIO" → Install
```

#### 2. Create New Project
```bash
# Create project directory
mkdir attendee-firmware && cd attendee-firmware

# Initialize PlatformIO project
pio project init --board nodemcuv2 --project-option "framework=arduino"
```

#### 3. Configure platformio.ini
```ini
[env:nodemcuv2]
platform = espressif8266
board = nodemcuv2
framework = arduino
monitor_speed = 115200
upload_speed = 921600

; Library dependencies
lib_deps = 
    miguelbalboa/MFRC522@^1.4.10
    johnrickman/LiquidCrystal_I2C@^1.1.2
    adafruit/RTClib@^2.1.1
    bblanchon/ArduinoJson@^6.21.0
    tzapu/WiFiManager@^2.0.16-rc.2

; Build flags
build_flags = 
    -DDEBUG_ESP_PORT=Serial
    -DDEBUG_ESP_WIFI
    -DDEBUG_ESP_HTTP_CLIENT

; Monitor configuration
monitor_filters = esp8266_exception_decoder
```

## Firmware Configuration

### 1. Download Firmware Code

```bash
# Clone repository
git clone https://github.com/launchlog/attendance-terminal.git
cd attendance-terminal/firmware/attendance_terminal

# Or download zip and extract
```

### 2. Configure System Settings

Edit `config.h` file:

```cpp
#ifndef CONFIG_H
#define CONFIG_H

// ==========================================
// System Configuration
// ==========================================

// Hardware Pin Definitions
#define RFID_SS_PIN    15   // D8
#define RFID_RST_PIN   16   // D0
#define LCD_ADDRESS    0x27 // I2C address for LCD
#define LED_GREEN_PIN  2    // D4
#define LED_RED_PIN    0    // D3
#define BUZZER_PIN     14   // D5

// Network Configuration
#define WIFI_TIMEOUT   30000  // WiFi connection timeout (ms)
#define SERVER_TIMEOUT 10000  // HTTP request timeout (ms)
#define RETRY_DELAY    5000   // Delay between retries (ms)
#define MAX_RETRIES    3      // Maximum retry attempts

// Backend Server Configuration
// ⚠️ IMPORTANT: Update these values for your setup
#define DEFAULT_SERVER_URL    "http://192.168.1.100:5000"
#define API_ENDPOINT         "/api/attendance"
#define HEALTH_ENDPOINT      "/api/health"

// Device Configuration
#define DEVICE_NAME          "LaunchLog-Terminal"
#define FIRMWARE_VERSION     "2.0.0"
#define SERIAL_BAUD_RATE     115200

// LCD Display Configuration
#define LCD_COLUMNS          16
#define LCD_ROWS             2
#define DISPLAY_TIMEOUT      5000   // Auto-clear display (ms)
#define SCROLL_DELAY         300    // Text scrolling speed (ms)

// RFID Configuration
#define RFID_READ_INTERVAL   100    // RFID scan frequency (ms)
#define CARD_REMOVAL_DELAY   2000   // Wait before allowing re-scan (ms)

// Audio/Visual Feedback
#define BEEP_SUCCESS_FREQ    1000   // Success beep frequency (Hz)
#define BEEP_ERROR_FREQ      500    // Error beep frequency (Hz)
#define BEEP_DURATION        200    // Beep duration (ms)
#define LED_FLASH_DURATION   1000   // LED flash duration (ms)

// Data Storage
#define MAX_OFFLINE_RECORDS  100    // Maximum offline records to store
#define EEPROM_START_ADDRESS 0      // EEPROM storage start address

// Debug Configuration
#define DEBUG_MODE           1      // Enable debug output (0/1)
#define DEBUG_WIFI           1      // Enable WiFi debug (0/1)
#define DEBUG_RFID           1      // Enable RFID debug (0/1)

#endif // CONFIG_H
```

### 3. Network Configuration

Create `secrets.h` file (do not commit to version control):

```cpp
#ifndef SECRETS_H
#define SECRETS_H

// ==========================================
// Network Credentials (KEEP PRIVATE!)
// ==========================================

// Default WiFi Credentials (for initial setup)
// Note: WiFiManager allows runtime configuration
#define DEFAULT_WIFI_SSID     "YourWiFiNetwork"
#define DEFAULT_WIFI_PASSWORD "YourWiFiPassword"

// Backend Server Configuration
#define SERVER_HOST           "192.168.1.100"  // Your server IP
#define SERVER_PORT           5000             // Your server port
#define SERVER_PROTOCOL       "http"          // http or https

// API Authentication (if required)
#define API_KEY               ""               // Leave empty if not used
#define DEVICE_TOKEN          ""               // Device authentication token

// OTA Update Configuration (optional)
#define OTA_PASSWORD          "update123"     // Password for OTA updates
#define OTA_HOSTNAME          "launchlog-terminal"

#endif // SECRETS_H
```

### 4. Hardware Pin Mapping

Verify pin connections in `config.h` match your hardware setup:

```cpp
// Pin Mapping Reference
// 
// ESP8266 NodeMCU → Hardware Component
// =====================================
// D0 (GPIO16)     → MFRC522 RST
// D1 (GPIO5)      → I2C SCL (LCD + RTC)
// D2 (GPIO4)      → I2C SDA (LCD + RTC)
// D3 (GPIO0)      → Red LED
// D4 (GPIO2)      → Green LED
// D5 (GPIO14)     → Buzzer + MFRC522 SCK
// D6 (GPIO12)     → MFRC522 MISO
// D7 (GPIO13)     → MFRC522 MOSI
// D8 (GPIO15)     → MFRC522 SDA/SS
// 3V3             → MFRC522 VCC, RTC VCC
// 5V (VIN)        → LCD VCC
// GND             → Common Ground
```

## Compilation and Upload

### Using Arduino IDE

#### 1. Open Firmware
1. Open Arduino IDE
2. **File** → **Open** → Navigate to `firmware/attendance_terminal/attendance_terminal.ino`

#### 2. Verify Configuration
```cpp
// Check these includes are present
#include "config.h"
#include "secrets.h"  // Create this file with your credentials

// Verify board selection
#if !defined(ESP8266)
#error "This firmware is designed for ESP8266 boards only"
#endif
```

#### 3. Compile
1. Click **Verify** button (✓) or **Sketch** → **Verify/Compile**
2. Check for compilation errors in output window
3. Fix any missing libraries or configuration issues

#### 4. Upload
1. Connect ESP8266 via USB
2. Select correct **Port** in **Tools** menu
3. Click **Upload** button (→) or **Sketch** → **Upload**
4. Monitor upload progress in output window

#### 5. Monitor Serial Output
1. **Tools** → **Serial Monitor**
2. Set baud rate to **115200**
3. Watch initialization messages

### Using PlatformIO

#### 1. Build Firmware
```bash
# Build firmware
pio run

# Build and upload
pio run --target upload

# Build, upload, and monitor
pio run --target upload --target monitor
```

#### 2. Monitor Serial Output
```bash
# Monitor serial output
pio device monitor --baud 115200

# Monitor with filters
pio device monitor --filter esp8266_exception_decoder
```

### Build Verification

Successful compilation should show:
```
Sketch uses 295,432 bytes (28%) of program storage space. Maximum is 1,043,464 bytes.
Global variables use 31,640 bytes (38%) of dynamic memory, leaving 50,280 bytes for local variables.
```

Successful upload should show:
```
Hard resetting via RTS pin...
Leaving...
```

## Initial Setup

### 1. First Boot

After uploading firmware, the device will:

1. **Initialize Hardware**:
   ```
   LaunchLog Terminal v2.0.0
   Initializing hardware...
   [OK] RFID Reader initialized
   [OK] LCD Display initialized  
   [OK] RTC Module initialized
   [OK] LED indicators ready
   ```

2. **WiFi Configuration**:
   ```
   WiFi: Connecting to saved network...
   WiFi: No saved credentials found
   WiFi: Starting configuration portal
   Access Point: LaunchLog-Setup
   Password: 12345678
   IP: 192.168.4.1
   ```

### 2. Serial Monitor Output

Monitor the serial output for initialization status:

```
=====================================
LaunchLog Attendance Terminal v2.0.0
=====================================

[INIT] Starting system initialization...
[RFID] Initializing MFRC522...
[RFID] Reader version: 0x92
[LCD]  Initializing I2C LCD at 0x27...
[LCD]  Display ready: 16x2
[RTC]  Initializing DS3231...
[RTC]  Current time: 2023-12-15 14:30:25
[WIFI] Attempting to connect to saved network...
[WIFI] No saved credentials, starting AP mode
[AP]   Access Point started: LaunchLog-Setup
[AP]   IP Address: 192.168.4.1
[WEB]  Configuration portal active
[SYS]  System ready for configuration
```

### 3. Error Handling

If you see errors during initialization:

```cpp
// Common error messages and solutions:

// RFID Error
[ERROR] RFID initialization failed
// Solution: Check RFID wiring and power supply

// LCD Error  
[ERROR] LCD not found at I2C address 0x27
// Solution: Run I2C scanner to find correct address

// RTC Error
[ERROR] RTC initialization failed
// Solution: Check RTC wiring and battery

// Memory Error
[ERROR] Insufficient memory for offline storage
// Solution: Reduce MAX_OFFLINE_RECORDS in config.h
```

## WiFi Configuration

### Method 1: WiFi Manager (Recommended)

1. **Connect to Setup Network**:
   - SSID: `LaunchLog-Setup`
   - Password: `12345678`

2. **Open Configuration Portal**:
   - Navigate to: `http://192.168.4.1`
   - You'll see the WiFi Manager interface

3. **Configure WiFi**:
   - Click "Configure WiFi"
   - Select your network from the list
   - Enter WiFi password
   - Configure server settings:
     ```
     Server URL: http://192.168.1.100:5000
     Device Name: Terminal-01
     ```

4. **Save and Connect**:
   - Click "Save"
   - Device will restart and connect to your network

### Method 2: Hard-coded Credentials

1. **Edit secrets.h**:
   ```cpp
   #define DEFAULT_WIFI_SSID     "YourNetworkName"
   #define DEFAULT_WIFI_PASSWORD "YourPassword"
   ```

2. **Re-upload Firmware**:
   ```bash
   # Upload with new credentials
   pio run --target upload
   ```

### Method 3: Serial Configuration

1. **Open Serial Monitor** (115200 baud)

2. **Send Commands**:
   ```
   wifi_ssid:YourNetworkName
   wifi_password:YourPassword  
   server_url:http://192.168.1.100:5000
   save_config
   restart
   ```

### WiFi Connection Verification

Successful WiFi connection will show:
```
[WIFI] Connecting to: YourNetworkName
[WIFI] Connected successfully
[WIFI] IP Address: 192.168.1.150
[WIFI] Signal Strength: -45 dBm
[SERVER] Testing backend connection...
[SERVER] Backend reachable: 200 OK
[NTP] Syncing time with NTP server...
[NTP] Time synchronized: 2023-12-15 14:35:12
[SYS] System fully operational
```

## Advanced Configuration

### Over-The-Air (OTA) Updates

Enable OTA updates for remote firmware deployment:

1. **Enable OTA in config.h**:
   ```cpp
   #define ENABLE_OTA_UPDATE    1
   #define OTA_PASSWORD         "update123"
   #define OTA_PORT             8266
   ```

2. **Upload with OTA Support**:
   ```bash
   # Initial upload via USB
   pio run --target upload
   
   # Subsequent uploads via OTA
   pio run --target upload --upload-port 192.168.1.150
   ```

3. **OTA Update Process**:
   ```cpp
   // Device automatically advertises OTA service
   // Use Arduino IDE: Tools → Port → Network Port
   // Or use platformio with --upload-port IP
   ```

### Deep Sleep Mode

For battery-powered deployments:

```cpp
// Add to config.h
#define ENABLE_DEEP_SLEEP    1
#define SLEEP_DURATION_MIN   5     // Sleep for 5 minutes
#define WAKE_UP_PIN          D0    // External wake-up trigger

// Implementation in main loop
void enterDeepSleep() {
  Serial.println("Entering deep sleep mode...");
  
  // Save current state to EEPROM
  saveStateToEEPROM();
  
  // Configure wake-up
  ESP.deepSleep(SLEEP_DURATION_MIN * 60 * 1000000); // microseconds
}
```

### Custom Display Messages

Customize LCD display messages:

```cpp
// Add to config.h
struct DisplayMessages {
  const char* welcome = "Welcome!";
  const char* scan_card = "Scan your card";
  const char* success_entry = "Entry recorded";
  const char* success_exit = "Exit recorded";
  const char* error_unknown = "Unknown card";
  const char* error_network = "Network error";
  const char* system_ready = "System ready";
};

// Usage in code
DisplayMessages messages;
lcd.print(messages.welcome);
```

### Multi-Language Support

Add support for multiple languages:

```cpp
// Add to config.h
#define LANGUAGE_ENGLISH     0
#define LANGUAGE_SPANISH     1
#define LANGUAGE_FRENCH      2
#define DEFAULT_LANGUAGE     LANGUAGE_ENGLISH

// Language strings
const char* welcome_msg[] = {
  "Welcome!",        // English
  "¡Bienvenido!",   // Spanish  
  "Bienvenue!"      // French
};

// Usage
lcd.print(welcome_msg[current_language]);
```

### Data Encryption

For sensitive deployments, add data encryption:

```cpp
#include <AES.h>

// Add to config.h
#define ENABLE_ENCRYPTION    1
#define AES_KEY_SIZE         32

// Encrypt data before transmission
String encryptData(String plaintext, String key) {
  AES aes;
  // Implementation details
  return encryptedData;
}
```

### Watchdog Timer

Add system stability monitoring:

```cpp
#include <Ticker.h>

// Watchdog configuration
Ticker watchdog;
volatile bool watchdog_flag = false;

void watchdog_reset() {
  watchdog_flag = true;
}

void setup() {
  // Start watchdog (reset every 30 seconds)
  watchdog.attach(30, watchdog_reset);
}

void loop() {
  // Check watchdog
  if (watchdog_flag) {
    watchdog_flag = false;
    // System is alive, continue operation
  }
  
  // Your main code here
}
```

## Troubleshooting

### Compilation Errors

#### Missing Libraries
```
fatal error: MFRC522.h: No such file or directory
```
**Solution**: Install missing library via Library Manager

#### Board Not Selected
```
ESP8266WiFi.h: No such file or directory
```
**Solution**: Select ESP8266 board in Tools → Board

#### Out of Memory
```
region `iram1_0_seg' overflowed by X bytes
```
**Solution**: Reduce SPIFFS size or optimize code

### Upload Issues

#### Port Not Found
```
Error: no serial port found
```
**Solutions**:
- Install USB drivers for your ESP8266 board
- Check USB cable (data cable, not charge-only)
- Try different USB port

#### Upload Timeout
```
espcomm_upload_mem failed
```
**Solutions**:
- Hold BOOT/FLASH button during upload
- Reduce upload speed to 115200
- Check power supply stability

#### Permission Denied
```
Permission denied: '/dev/ttyUSB0'
```
**Solution** (Linux):
```bash
sudo usermod -a -G dialout $USER
# Logout and login again
```

### Runtime Issues

#### WiFi Connection Fails
```
[WIFI] Connection failed: No SSID available
```
**Solutions**:
- Verify SSID and password
- Check WiFi router settings
- Move closer to router
- Use WiFi Manager for configuration

#### RFID Not Working
```
[RFID] No card detected
```
**Solutions**:
- Check RFID wiring connections
- Verify 3.3V power supply (NOT 5V!)
- Test with different RFID cards
- Check for interference

#### Backend Connection Fails
```
[HTTP] Connection refused
```
**Solutions**:
- Verify server URL and port
- Check network connectivity
- Ensure backend server is running
- Check firewall settings

#### Time Sync Issues
```
[RTC] Time sync failed
```
**Solutions**:
- Check RTC battery (CR2032)
- Verify I2C connections
- Manually set time via NTP

### Debug Tools

#### Serial Debug Output
```cpp
// Enable detailed debugging
#define DEBUG_MODE           1
#define DEBUG_WIFI           1
#define DEBUG_RFID           1
#define DEBUG_HTTP           1

// Custom debug macro
#ifdef DEBUG_MODE
#define DEBUG_PRINT(x) Serial.print(x)
#define DEBUG_PRINTLN(x) Serial.println(x)
#else
#define DEBUG_PRINT(x)
#define DEBUG_PRINTLN(x)
#endif
```

#### I2C Scanner
```cpp
// Scan for I2C devices
void i2cScanner() {
  Serial.println("Scanning I2C bus...");
  for (byte address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    if (Wire.endTransmission() == 0) {
      Serial.print("Device found at 0x");
      Serial.println(address, HEX);
    }
  }
}
```

#### Memory Usage Monitor
```cpp
void printMemoryUsage() {
  Serial.print("Free heap: ");
  Serial.println(ESP.getFreeHeap());
  Serial.print("Heap fragmentation: ");
  Serial.println(ESP.getHeapFragmentation());
}
```

#### Network Diagnostics
```cpp
void networkDiagnostics() {
  Serial.println("=== Network Diagnostics ===");
  Serial.print("WiFi Status: ");
  Serial.println(WiFi.status());
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("Signal: ");
  Serial.println(WiFi.RSSI());
}
```

## Firmware Update Process

### Version Management

1. **Update Version in config.h**:
   ```cpp
   #define FIRMWARE_VERSION     "2.1.0"
   ```

2. **Document Changes**:
   - Update changelog in comments
   - Note breaking changes
   - List new features

3. **Test Thoroughly**:
   - Test all hardware functions
   - Verify network connectivity
   - Check backward compatibility

### Deployment Strategies

#### USB Update (Safe)
1. Connect device via USB
2. Upload new firmware
3. Verify functionality
4. Deploy to production devices

#### OTA Update (Convenient)
1. Test on development device
2. Enable OTA on production devices
3. Deploy incrementally
4. Monitor for issues

#### Rollback Plan
1. Keep previous firmware binary
2. Document rollback procedure
3. Test rollback process
4. Have emergency USB access

Remember to always test firmware changes thoroughly before deploying to production devices!
