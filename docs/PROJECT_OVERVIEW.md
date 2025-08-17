# Project Overview

## System Architecture

The Attendee Attendance Terminal is a comprehensive RFID-based attendance tracking system consisting of four main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Attendee                  │
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

## Component Details

### 1. Hardware Terminal
**Location**: Physical device at entry/exit points
**Purpose**: RFID card scanning and user feedback
**Components**:
- ESP8266 NodeMCU microcontroller
- MFRC522 RFID reader (13.56MHz)
- 16x2 I2C LCD display
- DS3231 RTC module
- LED indicators (green/red)
- Passive buzzer

### 2. Firmware (ESP8266)
**Location**: `firmware/attendance_terminal/`
**Purpose**: Control hardware and communicate with backend
**Key Features**:
- WiFi connectivity with auto-reconnection
- RFID card reading and validation
- Real-time LCD status display
- Offline data storage with sync
- Over-the-air (OTA) updates
- Error handling and recovery

### 3. Backend (Node.js)
**Location**: `backend/`
**Purpose**: API server, database management, business logic
**Key Features**:
- RESTful API endpoints
- JWT authentication system
- MongoDB database integration
- Real-time WebSocket communication
- User management and role-based access
- Attendance tracking with entry/exit logic
- Data export and reporting

### 4. Frontend (React)
**Location**: `frontend/`
**Purpose**: Web-based admin interface
**Key Features**:
- Responsive dashboard with real-time updates
- User management interface
- Attendance monitoring and reports
- Manual attendance entry
- Data visualization with charts
- Mobile-responsive design

### 5. Optional: WhatsApp Bot
**Location**: `whatsapp-bot/`
**Purpose**: WhatsApp notifications and queries
**Features**:
- Daily attendance summaries
- Absence notifications
- Query attendance status
- Admin commands

## Data Flow

### 1. RFID Scan Process
```
[RFID Card] → [Hardware] → [Firmware] → [Backend] → [Database]
                    ↓
              [LCD Display]
                    ↓
              [LED/Buzzer Feedback]
```

### 2. Real-time Updates
```
[Database Change] → [Backend WebSocket] → [Frontend] → [UI Update]
```

### 3. Offline Operation
```
[RFID Scan] → [Firmware] → [Local Storage] → [Sync when online] → [Backend]
```

## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, cors
- **Validation**: express-validator
- **Logging**: winston

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Firmware
- **Platform**: ESP8266 (Arduino framework)
- **WiFi**: ESP8266WiFi library
- **HTTP**: ESP8266HTTPClient
- **JSON**: ArduinoJson
- **RFID**: MFRC522 library
- **Display**: LiquidCrystal_I2C
- **RTC**: RTClib (DS3231)
- **Configuration**: WiFiManager

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  rfidTag: String (unique),
  role: String (admin/mentor/member),
  status: String (active/inactive),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Attendance Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  date: Date (YYYY-MM-DD),
  entryTime: Date,
  exitTime: Date,
  duration: Number (minutes),
  status: String (present/absent/late),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure authentication with expiration
- **Role-based Access**: Admin, Mentor, Member roles
- **Password Security**: bcrypt hashing with salt
- **Session Management**: Token refresh and invalidation

### Network Security
- **HTTPS Support**: SSL/TLS encryption
- **CORS Protection**: Cross-origin request validation
- **Rate Limiting**: API abuse prevention
- **Input Validation**: SQL injection prevention

### Hardware Security
- **Device Authentication**: Unique device tokens
- **Encrypted Communication**: HTTPS for API calls
- **Offline Security**: Local data encryption
- **OTA Security**: Secure firmware updates

## Scalability Considerations

### Horizontal Scaling
- **Load Balancer**: nginx for multiple backend instances
- **Database Clustering**: MongoDB replica sets
- **CDN**: Static asset distribution
- **Microservices**: Component separation

### Performance Optimization
- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequent data
- **Connection Pooling**: Database connections
- **Compression**: gzip response compression

### Monitoring & Analytics
- **Health Checks**: System status monitoring
- **Error Tracking**: Centralized error logging
- **Performance Metrics**: Response time tracking
- **Usage Analytics**: Attendance pattern analysis

## Deployment Options

### Development Environment
```bash
# Local development setup
Backend:  http://localhost:5000
Frontend: http://localhost:3000
Database: MongoDB local instance
```

### Production Environment Options

#### Option 1: Single Server
- All components on one server
- Suitable for small organizations (< 100 users)
- Easy setup and maintenance

#### Option 2: Cloud Deployment
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Frontend**: Vercel, Netlify, AWS S3
- **CDN**: CloudFlare, AWS CloudFront

#### Option 3: Docker Containers
```yaml
# docker-compose.yml structure
services:
  backend:
    image: launchlog/backend
    ports: ["5000:5000"]
  
  frontend:
    image: launchlog/frontend
    ports: ["3000:3000"]
  
  database:
    image: mongo:5.0
    ports: ["27017:27017"]
```

#### Option 4: Kubernetes
- Container orchestration
- Auto-scaling capabilities
- High availability setup
- Rolling updates

## Maintenance & Updates

### Regular Maintenance Tasks
- **Daily**: Monitor system health and logs
- **Weekly**: Database backups and cleanup
- **Monthly**: Security updates and patches
- **Quarterly**: Performance review and optimization

### Update Procedures
1. **Firmware Updates**: OTA deployment to terminals
2. **Backend Updates**: Rolling deployment with health checks
3. **Frontend Updates**: CDN cache invalidation
4. **Database Migration**: Schema updates with rollback plan

### Backup Strategy
- **Database**: Daily automated backups with 30-day retention
- **Configuration**: Version-controlled settings
- **Firmware**: Backup of all firmware versions
- **User Data**: Encrypted offsite storage

## Troubleshooting Resources

### Log Locations
- **Backend Logs**: `backend/logs/`
- **Firmware Logs**: Serial output via USB
- **Frontend Logs**: Browser developer console
- **System Logs**: `/var/log/` (Linux/macOS)

### Common Issues & Solutions
1. **RFID not working**: Check wiring and power supply
2. **WiFi connection issues**: Verify credentials and signal strength
3. **Backend API errors**: Check database connection and logs
4. **Frontend not loading**: Verify build process and web server

### Support Channels
- **Documentation**: Comprehensive guides in `docs/` folder
- **Issue Tracking**: GitHub Issues for bug reports
- **Community Support**: Forums and chat channels
- **Professional Support**: Commercial support available

## Development Workflow

### Version Control
```
main branch:     Production-ready code
develop branch:  Integration branch for features
feature/*:       Individual feature development
hotfix/*:        Critical production fixes
```

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Hardware Tests**: Physical device validation
- **End-to-End Tests**: Complete workflow testing

### CI/CD Pipeline
1. **Code Commit**: Git push triggers build
2. **Automated Testing**: Run test suites
3. **Build Artifacts**: Compile and package
4. **Deploy Staging**: Test in staging environment
5. **Deploy Production**: Release to production

## Future Enhancements

### Planned Features
- **Mobile App**: Native iOS/Android applications
- **Facial Recognition**: Alternative to RFID cards
- **Geofencing**: Location-based attendance validation
- **Integration APIs**: Third-party system integration
- **Advanced Analytics**: Machine learning insights
- **Multi-tenant**: Support for multiple organizations

### Hardware Improvements
- **Touch Screen**: Replace LCD with touchscreen
- **Biometric**: Fingerprint scanner integration
- **PoE Support**: Power over Ethernet capability
- **Wireless Charging**: For RFID cards/devices

### Software Enhancements
- **Progressive Web App**: Offline-capable web app
- **Push Notifications**: Browser notifications
- **Advanced Reporting**: Custom report builder
- **Workflow Automation**: Rules-based actions

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests for new features
5. Submit pull request

### Code Standards
- **JavaScript**: ESLint configuration
- **C++**: Arduino coding style
- **Documentation**: Markdown with clear examples
- **Commit Messages**: Conventional commit format

### Getting Involved
- **Bug Reports**: Submit detailed issue reports
- **Feature Requests**: Propose new functionality
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve guides and examples
- **Testing**: Help with quality assurance

For detailed setup instructions, see the individual component documentation in the `docs/` folder.
