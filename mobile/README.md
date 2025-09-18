# Attendee1 Mobile App

A React Native mobile application built with Expo for the Attendee1 attendance management system. This mobile app provides complete feature parity with the web frontend, offering a comprehensive attendance management solution on mobile devices.

## Complete Features

### 🔐 **Authentication & Security**
- JWT-based secure login/logout
- Role-based access control (Admin, Manager, Employee)
- Automatic token refresh and session management
- Secure storage using AsyncStorage

### 👥 **User Management**  
- Complete user profiles with editing capabilities
- Member directory with search and filtering
- User registration (admin-only)
- Detailed user information and attendance history
- Profile picture and contact information management

### 📊 **Attendance Tracking**
- Manual attendance entry/exit recording
- Comprehensive attendance history with date range filtering
- Real-time attendance status tracking
- Statistics and analytics dashboard
- Search and filter attendance records
- Export capabilities

### 📱 **Mobile-Optimized UI**
- Clean, minimalist design matching web frontend
- Responsive layout for all screen sizes  
- Native date/time pickers
- Search functionality across all screens
- Pull-to-refresh on data screens
- Loading states and error handling

### 🎯 **Admin Features**
- System status monitoring
- Device administration panel
- User management with CRUD operations
- Attendance data management
- System configuration

## Tech Stack

- **React Native (Expo)** - Cross-platform mobile development
- **React Navigation** - Drawer and stack navigation
- **React Context** - State management (Auth, Toast notifications)
- **AsyncStorage** - Secure local data persistence  
- **Axios** - HTTP client with interceptors
- **DateTimePicker** - Native date/time selection
- **Picker** - Native dropdown selections
- **Custom Components** - Reusable UI components

## Complete Screen Architecture

### 📱 **Main Screens**
- **LoginScreen** - Secure authentication with network testing
- **DashboardScreen** - Overview with quick stats and actions  
- **ProfileScreen** - Complete profile management with attendance history
- **MembersScreen** - User directory with search, filter, and CRUD operations
- **UserDetailScreen** - Detailed user view with full attendance records

### 📋 **Attendance Management**  
- **AttendanceScreen** - Real-time attendance overview
- **ManualAttendanceScreen** - Manual entry/exit recording
- **AttendanceHistoryScreen** - Advanced filtering, search, and analytics

### ⚙️ **Administration**
- **SignupScreen** - Admin-only user registration
- **SystemStatusScreen** - System monitoring and health checks
- **DeviceAdminScreen** - Device management and configuration
- **AddUserScreen** - Quick user addition form

### 🧩 **Components & Utilities**
- **BaseScreen** - Consistent screen layout and headers
- **CustomDrawerContent** - Role-based navigation drawer
- **SearchBar** - Universal search component  
- **MemberFormModal** - User creation/editing modal
- **LoadingScreen** - Loading states and error handling
- **ToastContext** - App-wide notifications
- **AuthContext** - Authentication state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator  
   - Scan QR code with Expo Go app on your phone

## Configuration

### Environment Setup

Create a `.env` file (copy from `.env.example`):
```
API_BASE_URL=http://localhost:3000
ENVIRONMENT=development
```

### API Base URL Configuration

The app automatically detects your testing environment:

**For iOS Simulator:**
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

**For Android Emulator:**  
```javascript  
const API_BASE_URL = 'http://10.0.2.2:3000';
```

**For Physical Device:**
```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000';
```

Update `src/utils/config.js` to match your environment. The app includes network testing tools to help with configuration.

### Backend Integration

Ensure your backend server is running on port 3000. The mobile app connects to all the same API endpoints as the web frontend:

- **Auth**: `/auth/login`, `/auth/logout`, `/auth/register`
- **Users**: `/users` (GET, POST, PUT, DELETE)
- **Attendance**: `/attendance` (GET, POST with filters)
- **System**: `/system/status`, `/system/config`

## Complete Project Structure

```
mobile/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── BaseScreen.js       # Consistent screen layout
│   │   ├── CustomDrawerContent.js # Role-based navigation  
│   │   ├── LoadingScreen.js    # Loading states
│   │   ├── SearchBar.js        # Universal search
│   │   └── MemberFormModal.js  # User creation/editing
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.js      # Authentication state
│   │   └── ToastContext.js     # App-wide notifications
│   ├── navigation/             # Navigation configuration  
│   │   └── AppNavigator.js     # Drawer + Stack navigation
│   ├── screens/               # All screen components
│   │   ├── LoginScreen.js     # Authentication
│   │   ├── DashboardScreen.js # Main dashboard
│   │   ├── ProfileScreen.js   # User profile management
│   │   ├── MembersScreen.js   # User directory
│   │   ├── UserDetailScreen.js # Detailed user view
│   │   ├── AttendanceScreen.js # Attendance overview
│   │   ├── ManualAttendanceScreen.js # Manual entry
│   │   ├── AttendanceHistoryScreen.js # History & analytics
│   │   ├── SignupScreen.js    # Admin user registration
│   │   ├── SystemStatusScreen.js # System monitoring
│   │   ├── DeviceAdminScreen.js # Device management
│   │   └── AddUserScreen.js   # Quick user addition
│   ├── services/              # API and external services
│   │   └── api.js            # Complete API integration
│   └── utils/                 # Utilities and configuration
│       ├── theme.js          # Design system
│       ├── config.js         # App configuration  
│       ├── dateUtils.js      # IST date/time formatting
│       └── networkTest.js    # Network troubleshooting
├── assets/                    # Static resources
├── App.js                    # Root component with providers
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment template
├── setup.sh                  # Quick setup script
├── README.md                 # This documentation
└── NETWORK_TROUBLESHOOTING.md # Network setup guide
```

## Design Philosophy & UI

The mobile app maintains complete design consistency with the web frontend:

### 🎨 **Visual Design**
- **Typography**: Clean, readable Inter font family with proper hierarchy
- **Colors**: Minimalist black (#000), white (#fff), and subtle grays
- **Layout**: Generous whitespace, centered content, clean borders
- **Icons**: Consistent iconography throughout the app

### 📱 **Mobile UX Optimizations**  
- **Touch-friendly**: Adequate touch targets (44px minimum)
- **Native Components**: Platform-specific date pickers, dropdowns
- **Gestures**: Pull-to-refresh, drawer navigation
- **Keyboard**: Automatic keyboard management and scroll adjustment
- **Loading States**: Smooth loading indicators and empty states

### 🔄 **Interactions**
- **Smooth Transitions**: Subtle animations for navigation
- **Visual Feedback**: Button press states, focus indicators
- **Error Handling**: Clear error messages with actionable steps
- **Toast Notifications**: Non-intrusive success/error messaging

### 📊 **Data Display**
- **Tables**: Mobile-optimized data tables with horizontal scroll
- **Cards**: Information cards for user profiles and attendance
- **Lists**: Efficient list rendering with search and filters
- **Forms**: Clean form layouts with validation feedback

## Building for Production

### Development Build
```bash
npx expo build
```

### Production Build with EAS
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure EAS: `eas build:configure`
3. Build: `eas build --platform all`

## API Integration & Features

The mobile app provides complete feature parity with the web frontend:

### 🔐 **Authentication System**
- Secure JWT-based login with automatic token refresh
- Role-based access control (Admin, Manager, Employee)  
- Session management with secure storage
- Logout and session cleanup

### 👥 **User Management (Admin/Manager)**
- View all users with search and filtering
- Create new user accounts with validation
- Edit user profiles and information
- Delete users with confirmation prompts
- Role management and permissions

### 📊 **Attendance Features**
- Manual attendance entry with timestamp validation
- Real-time attendance status updates
- Comprehensive attendance history with date ranges
- Advanced filtering by user, date, status
- Attendance statistics and analytics
- Data export capabilities

### 📱 **Profile Management**  
- Complete profile editing with form validation
- Profile picture management
- Personal attendance history view
- Contact information updates
- Security settings

### ⚡ **Real-time Updates**
- Live attendance status synchronization
- Automatic data refresh with pull-to-refresh
- Background sync when app returns to foreground
- Network-aware operation with offline indicators

## Security & Performance

### 🔐 **Security Features**
- JWT tokens stored securely using AsyncStorage
- Automatic token refresh with expiration handling
- Input validation and sanitization on all forms
- Role-based UI rendering and API access
- Secure HTTPS communication (production)
- Network request timeout and retry logic

### ⚡ **Performance Optimizations**
- Efficient list rendering with pagination
- Image optimization and caching
- Debounced search functionality  
- Lazy loading of non-critical data
- Memory management for large datasets
- Network request caching

### 🔧 **Development Tools**
- Network connection testing utilities
- Comprehensive error logging
- Debug mode with additional developer features
- Hot reloading for rapid development
- Environment-specific configurations

## Troubleshooting & Support

### 🔧 **Common Issues**
- **Network Connection**: See `NETWORK_TROUBLESHOOTING.md` for detailed setup
- **API Configuration**: Use the built-in network test feature
- **Platform Differences**: iOS vs Android specific configurations
- **Backend Integration**: Ensure server is running and accessible

### 🚀 **Quick Setup**
Run the setup script for automated configuration:
```bash
chmod +x setup.sh
./setup.sh
```

### 📞 **Getting Help**
1. Check the mobile app console logs in Expo DevTools
2. Use the "Test Network Connection" feature in development
3. Verify backend server is running and accessible
4. Consult `NETWORK_TROUBLESHOOTING.md` for network issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is part of the Attendee1 system. See the main project README for license information.
