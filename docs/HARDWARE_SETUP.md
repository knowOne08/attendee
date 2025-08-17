# Hardware Setup Guide

This guide provides detailed instructions for assembling the hardware components of the Attendee Attendance Terminal.

## Required Components

### Core Components
| Component | Quantity | Purpose | Notes |
|-----------|----------|---------|-------|
| **ESP8266 NodeMCU** | 1 | Main microcontroller | WiFi-enabled, Arduino compatible |
| **MFRC522 RFID Reader** | 1 | Card/tag scanning | 13.56MHz, SPI interface |
| **16x2 I2C LCD** | 1 | Status display | With PCF8574 backpack |
| **DS3231 RTC Module** | 1 | Real-time clock | Battery-backed, I2C interface |
| **LEDs** | 2 | Status indication | Green (success), Red (error) |
| **Passive Buzzer** | 1 | Audio feedback | 5V compatible |
| **Breadboard** | 1 | Prototyping | Full-size recommended |
| **Jumper Wires** | 20+ | Connections | Male-to-male, various colors |

### Power Supply
| Component | Specification | Purpose |
|-----------|---------------|---------|
| **USB Power Supply** | 5V, 2A minimum | System power |
| **Micro USB Cable** | Data capable | ESP8266 programming/power |
| **Breadboard Power Supply** | 3.3V/5V rails | Component power distribution |

### Optional Components
| Component | Purpose | Notes |
|-----------|---------|-------|
| **Enclosure** | Protection | 3D printed or commercial |
| **PCB** | Permanent assembly | Custom design available |
| **External Antenna** | Better WiFi range | For ESP8266 variants with U.FL |
| **Level Shifters** | 5V/3.3V compatibility | If using 5V components |

## Pin Connections

### ESP8266 NodeMCU Pinout Reference

```
         +-----+
    A0   |  A0 | VIN  (5V Input)
    D0   | RSV | GND  
    D1   |  D1 | 3V3  (3.3V Output)
    D2   |  D2 | D8   
    D3   |  D3 | D7   
    D4   |  D4 | D6   
    3V3  | 3V3 | D5   
    GND  | GND | GND  
    D5   |  D5 | 3V3  
    D6   |  D6 | RST  
    D7   |  D7 | A0   
    D8   |  D8 | D0   
    RX   |  RX | D1   
    TX   |  TX | D2   
    GND  | GND | D3   
    VIN  | 3V3 | D4   
         +-----+
```

### Detailed Connection Table

#### MFRC522 RFID Reader
| MFRC522 Pin | ESP8266 GPIO | NodeMCU Pin | Wire Color | Notes |
|-------------|--------------|-------------|------------|-------|
| **SDA/SS** | GPIO15 | D8 | Blue | Slave Select |
| **SCK** | GPIO14 | D5 | Yellow | SPI Clock |
| **MOSI** | GPIO13 | D7 | Orange | Master Out Slave In |
| **MISO** | GPIO12 | D6 | Green | Master In Slave Out |
| **IRQ** | Not Connected | - | - | Not used |
| **GND** | GND | GND | Black | Ground |
| **RST** | GPIO16 | D0 | White | Reset pin |
| **VCC** | 3.3V | 3V3 | Red | Power (3.3V only!) |

**⚠️ Important:** MFRC522 is 3.3V only. Connecting to 5V will damage the module.

#### 16x2 I2C LCD (PCF8574 Backpack)
| LCD Pin | ESP8266 GPIO | NodeMCU Pin | Wire Color | Notes |
|---------|--------------|-------------|------------|-------|
| **VCC** | 5V | VIN | Red | 5V power required |
| **GND** | GND | GND | Black | Ground |
| **SDA** | GPIO4 | D2 | Green | I2C Data |
| **SCL** | GPIO5 | D1 | Blue | I2C Clock |

#### DS3231 RTC Module
| RTC Pin | ESP8266 GPIO | NodeMCU Pin | Wire Color | Notes |
|---------|--------------|-------------|------------|-------|
| **VCC** | 3.3V | 3V3 | Red | 3.3V or 5V compatible |
| **GND** | GND | GND | Black | Ground |
| **SDA** | GPIO4 | D2 | Green | I2C Data (shared with LCD) |
| **SCL** | GPIO5 | D1 | Blue | I2C Clock (shared with LCD) |

#### LED Indicators
| Component | ESP8266 GPIO | NodeMCU Pin | Wire Color | Resistor | Notes |
|-----------|--------------|-------------|------------|----------|-------|
| **Green LED (+)** | GPIO2 | D4 | Green | 220Ω | Success indicator |
| **Green LED (-)** | GND | GND | Black | - | Common cathode |
| **Red LED (+)** | GPIO0 | D3 | Red | 220Ω | Error indicator |
| **Red LED (-)** | GND | GND | Black | - | Common cathode |

#### Buzzer
| Buzzer Pin | ESP8266 GPIO | NodeMCU Pin | Wire Color | Notes |
|------------|--------------|-------------|------------|-------|
| **Positive** | GPIO16 | D0 | Purple | PWM control |
| **Negative** | GND | GND | Black | Ground |

## Wiring Diagrams

### Breadboard Layout

```
                    ESP8266 NodeMCU
                    +-------------+
                    |     USB     |
                    |             |
           3V3 ---- | 3V3     VIN | ---- 5V Rail
           GND ---- | GND     GND | ---- GND Rail
                    |             |
    LCD SDA ------- | D2      D8  | ------- RFID SDA
    LCD SCL ------- | D1      D7  | ------- RFID MOSI
                    | D0      D6  | ------- RFID MISO
    Red LED ------- | D3      D5  | ------- RFID SCK
    Green LED ----- | D4      3V3 | ---- 3V3 Rail
                    | 3V3     GND | ---- GND Rail
                    | GND     RST |
                    |             |
                    +-------------+

Power Rails:
5V  Rail: [+] ===============================
3V3 Rail: [+] ===============================
GND Rail: [-] ===============================
```

### Schematic Diagram

```
ESP8266 NodeMCU                    MFRC522 RFID
    D8  (GPIO15) -----> SDA/SS
    D7  (GPIO13) -----> MOSI
    D6  (GPIO12) <----- MISO
    D5  (GPIO14) -----> SCK
    D0  (GPIO16) -----> RST
    3V3          -----> VCC
    GND          -----> GND

ESP8266 NodeMCU                    I2C Devices (LCD + RTC)
    D2  (GPIO4)  <----> SDA
    D1  (GPIO5)  -----> SCL
    VIN (5V)     -----> LCD VCC
    3V3          -----> RTC VCC
    GND          -----> GND

ESP8266 NodeMCU                    Indicators
    D4  (GPIO2)  -----> Green LED ---[220Ω]--- GND
    D3  (GPIO0)  -----> Red LED   ---[220Ω]--- GND
    D0  (GPIO16) -----> Buzzer(+) Buzzer(-) --- GND
```

## Assembly Instructions

### Step 1: Prepare the Breadboard

1. **Set up power rails**:
   ```
   - Connect NodeMCU VIN to breadboard 5V rail
   - Connect NodeMCU 3V3 to breadboard 3.3V rail  
   - Connect NodeMCU GND to breadboard GND rail
   - Use jumper wires to distribute power
   ```

2. **Verify power connections**:
   - Use multimeter to check voltage rails
   - 5V rail should read ~4.8-5.2V
   - 3.3V rail should read ~3.2-3.4V

### Step 2: Mount Core Components

1. **Place ESP8266 NodeMCU**:
   - Insert into breadboard with USB port accessible
   - Ensure pins are not shorted across center gap
   - Leave space for other components

2. **Mount MFRC522 RFID Reader**:
   - Place on breadboard or connect via jumper wires
   - Keep antenna area clear of metal objects
   - Ensure 3.3V power connection only

3. **Install I2C LCD**:
   - Mount securely for visibility
   - Connect I2C backpack properly
   - Test contrast adjustment potentiometer

4. **Add DS3231 RTC**:
   - Insert coin battery if removable
   - Check battery polarity
   - Share I2C bus with LCD

### Step 3: Wire SPI Connections (RFID)

1. **SPI Data Lines**:
   ```
   MFRC522 SDA  --> NodeMCU D8  (GPIO15)
   MFRC522 MOSI --> NodeMCU D7  (GPIO13)
   MFRC522 MISO --> NodeMCU D6  (GPIO12)
   MFRC522 SCK  --> NodeMCU D5  (GPIO14)
   ```

2. **SPI Control Lines**:
   ```
   MFRC522 RST  --> NodeMCU D0  (GPIO16)
   ```

3. **Power Connections**:
   ```
   MFRC522 VCC  --> 3.3V Rail (NOT 5V!)
   MFRC522 GND  --> GND Rail
   ```

### Step 4: Wire I2C Connections

1. **I2C Bus (shared)**:
   ```
   LCD SDA    --> NodeMCU D2  (GPIO4)
   LCD SCL    --> NodeMCU D1  (GPIO5)
   RTC SDA    --> NodeMCU D2  (GPIO4)  [parallel]
   RTC SCL    --> NodeMCU D1  (GPIO5)  [parallel]
   ```

2. **Power Connections**:
   ```
   LCD VCC    --> 5V Rail
   LCD GND    --> GND Rail
   RTC VCC    --> 3.3V Rail
   RTC GND    --> GND Rail
   ```

### Step 5: Add Status Indicators

1. **LED Connections**:
   ```
   Green LED Anode --> 220Ω Resistor --> NodeMCU D4 (GPIO2)
   Green LED Cathode --> GND Rail
   
   Red LED Anode --> 220Ω Resistor --> NodeMCU D3 (GPIO0)
   Red LED Cathode --> GND Rail
   ```

2. **Buzzer Connection**:
   ```
   Buzzer Positive --> NodeMCU D0 (GPIO16)
   Buzzer Negative --> GND Rail
   ```

### Step 6: Final Assembly Check

1. **Visual Inspection**:
   - Check all connections against pin diagrams
   - Verify no shorts between power rails
   - Ensure proper polarity for LEDs and buzzer
   - Confirm I2C address conflicts resolved

2. **Power Test**:
   - Connect USB power to NodeMCU
   - Check LED power indicators on modules
   - Verify 3.3V and 5V rail voltages
   - Listen for any unusual sounds

3. **Continuity Test**:
   - Use multimeter to verify connections
   - Check for shorts between VCC and GND
   - Verify signal continuity on long wires

## I2C Address Configuration

### Default I2C Addresses
| Device | Default Address | Alternative Addresses | Notes |
|--------|----------------|----------------------|-------|
| **PCF8574 LCD** | 0x27 | 0x3F, 0x26, 0x20 | Configurable via jumpers |
| **DS3231 RTC** | 0x68 | Fixed | Non-configurable |

### Address Scanning Code
```cpp
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(4, 5); // SDA=D2, SCL=D1
  Serial.println("I2C Scanner");
}

void loop() {
  byte error, address;
  int deviceCount = 0;
  
  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Device found at 0x");
      Serial.println(address, HEX);
      deviceCount++;
    }
  }
  
  if (deviceCount == 0) {
    Serial.println("No I2C devices found");
  }
  
  delay(5000);
}
```

## Troubleshooting Hardware Issues

### Power Issues
| Problem | Symptoms | Solution |
|---------|----------|----------|
| **Insufficient Power** | Random resets, dim LCD | Use 2A+ power supply |
| **Voltage Drop** | Erratic behavior | Shorter wires, better connections |
| **Wrong Voltage** | Module damage | Check component voltage requirements |

### Communication Issues
| Problem | Symptoms | Solution |
|---------|----------|----------|
| **I2C Not Working** | LCD blank, no RTC | Check SDA/SCL connections |
| **SPI Issues** | RFID not detected | Verify MOSI/MISO/SCK/SS pins |
| **Address Conflicts** | Devices not responding | Use I2C scanner, change addresses |

### Component Issues
| Problem | Symptoms | Solution |
|---------|----------|----------|
| **LCD Not Displaying** | Blank screen | Check contrast pot, power, I2C |
| **RFID Not Reading** | No card detection | Check 3.3V power, antenna placement |
| **RTC Wrong Time** | Incorrect timestamps | Replace battery, check connections |

## Enclosure Design

### Mounting Considerations
1. **LCD Visibility**: Front-facing, angled for easy reading
2. **RFID Access**: Top-mounted or front panel access
3. **Ventilation**: Prevent overheating of electronics
4. **Cable Management**: Clean routing of power and antennas
5. **Accessibility**: Easy access to programming port

### 3D Printing Files
- Custom enclosure STL files available in `/hardware` folder
- Designed for common 3D printers
- Mounting holes for breadboard or custom PCB

### Commercial Enclosures
| Size | Recommended Models | Notes |
|------|-------------------|-------|
| **Small** | Hammond 1591XXBK | Desktop use |
| **Medium** | Serpac A26 | Wall mountable |
| **Large** | BUD Industries CN-5712 | Multiple devices |

## Safety Considerations

### Electrical Safety
- ⚠️ **Never exceed component voltage ratings**
- ⚠️ **Double-check polarity before powering on**
- ⚠️ **Use proper gauge wires for current requirements**
- ⚠️ **Avoid exposed connections in final assembly**

### ESD Protection
- Use anti-static wrist strap when handling components
- Store components in anti-static bags
- Work on grounded surface

### Fire Safety
- Don't leave system unattended during initial testing
- Use quality power supplies with safety certifications
- Install appropriate fuses if using high-current supplies

## PCB Design (Advanced)

### Custom PCB Benefits
- **Compact Design**: Smaller footprint than breadboard
- **Reliability**: Permanent connections, no loose wires
- **Professional Look**: Clean, commercial appearance
- **Easier Assembly**: Silk screen labels, standard spacing

### PCB Design Files
- **Schematic**: Available in Eagle/KiCad format
- **Layout**: Optimized for 2-layer PCB
- **Gerber Files**: Ready for PCB manufacturing
- **Assembly Guide**: Component placement and orientation

### Manufacturing Options
| Service | Quantity | Price Range | Delivery |
|---------|----------|-------------|----------|
| **JLCPCB** | 5-100 | $10-50 | 1-2 weeks |
| **PCBWay** | 5-100 | $15-60 | 1-2 weeks |
| **OSH Park** | 3 minimum | $20-40 | 2-3 weeks |

---

**Hardware setup complete!** Your Attendee Attendance Terminal hardware should now be ready for firmware upload and testing.
