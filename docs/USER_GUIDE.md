# User Guide

This guide provides comprehensive instructions for using the Attendee Attendance Terminal system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Attendance Tracking](#attendance-tracking)
5. [Reports and Analytics](#reports-and-analytics)
6. [Hardware Terminal](#hardware-terminal)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Setup

1. **Access the System**
   - Open your web browser
   - Navigate to: `http://localhost:3000` (or your configured URL)
   - You'll see the login screen

2. **Default Admin Login**
   ```
   Email: admin@launchlog.com
   Password: admin123
   ```
   ⚠️ **Important**: Change the default admin password immediately after first login.

3. **Change Admin Password**
   - Click on your profile avatar (top right)
   - Select "Profile Settings"
   - Update your password in the "Security" section
   - Click "Save Changes"

### User Roles

The system has three user roles:

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | Full access | Can manage users, view all data, modify system settings |
| **Mentor** | Limited admin | Can manage members, view reports, cannot modify admin users |
| **Member** | Basic access | Can view own attendance, update profile |

## Dashboard Overview

### Main Dashboard

The dashboard provides a real-time overview of attendance:

![Dashboard Screenshot](images/dashboard.png)

#### Key Sections:

1. **Today's Summary**
   - Total users in system
   - Present users today
   - Attendance percentage
   - Quick stats

2. **Recent Activity**
   - Live feed of attendance entries
   - Entry/exit notifications
   - User status updates

3. **Quick Actions**
   - Manual attendance entry
   - Add new user
   - Export reports
   - System settings

4. **Charts and Graphs**
   - Weekly attendance trends
   - Monthly statistics
   - User activity patterns

### Real-time Updates

The dashboard automatically updates when:
- New attendance is recorded via RFID terminal
- Manual attendance is entered
- User information is modified
- System status changes

## User Management

### Adding New Users

**Admin/Mentor Only**

1. **Navigate to User Management**
   - Click "Users" in the sidebar
   - Click "Add New User" button

2. **Fill User Information**
   ```
   Name: John Doe
   Email: john.doe@example.com
   Phone: +1-234-567-8900
   RFID Tag: ABC123456
   Role: member/mentor/admin
   Status: active/inactive
   ```

3. **RFID Tag Assignment**
   - Each user must have a unique RFID tag
   - Tag format: Alphanumeric, 6-12 characters
   - Test the tag before assigning

4. **Account Setup**
   - System generates a temporary password
   - User receives email with login instructions
   - User must change password on first login

### Managing Existing Users

#### Edit User Information
1. Go to "Users" → Find user → Click "Edit"
2. Modify required fields
3. Click "Save Changes"

#### Deactivate/Activate Users
- **Deactivate**: User can't record attendance but data is preserved
- **Activate**: Restore full access
- **Delete**: Permanently removes user and all data (Admin only)

#### Bulk Operations
- Select multiple users using checkboxes
- Choose bulk action: Activate/Deactivate/Export
- Confirm action

### RFID Tag Management

#### Registering New Tags
1. **Using Hardware Terminal**:
   - Connect terminal to system
   - Hold unregistered RFID card near reader
   - Terminal displays "Unknown Card" message
   - Note the RFID tag number from terminal

2. **Assign to User**:
   - Go to user profile
   - Enter RFID tag number
   - Save changes

#### Replacing Lost Tags
1. **Deactivate Old Tag**:
   - Edit user profile
   - Clear RFID tag field
   - Save changes

2. **Assign New Tag**:
   - Follow new tag registration process
   - Update user profile with new tag

## Attendance Tracking

### Automatic Attendance (RFID Terminal)

#### How It Works
1. **Entry Process**:
   - User scans RFID card/tag
   - System records entry time
   - Terminal shows success message
   - Green LED and beep confirm entry

2. **Exit Process**:
   - User scans same RFID card/tag
   - System records exit time
   - Calculates total duration
   - Terminal confirms exit

#### Terminal Display Messages
```
┌─────────────────┐
│ Welcome!        │
│ John Doe        │
│ Entry: 09:15 AM │
│ Status: Present │
└─────────────────┘
```

### Manual Attendance Entry

**Admin/Mentor Only**

Use manual entry for:
- Correcting missed scans
- Recording attendance for users without RFID cards
- Backdating attendance records

#### Process:
1. **Access Manual Entry**
   - Dashboard → "Manual Entry" button
   - Or Attendance → "Add Manual Entry"

2. **Fill Details**
   ```
   User: Select from dropdown
   Date: YYYY-MM-DD
   Entry Time: HH:MM AM/PM
   Exit Time: HH:MM AM/PM (optional)
   Status: Present/Absent
   Notes: Reason for manual entry
   ```

3. **Submit Entry**
   - Click "Record Attendance"
   - System validates and saves entry
   - Notification confirms success

### Attendance Statuses

| Status | Description | When Used |
|--------|-------------|-----------|
| **Present** | User attended | Entry time recorded |
| **Absent** | User didn't attend | No entry recorded |
| **Late** | User arrived after cutoff | Entry after defined time |
| **Partial** | User left early | Exit before minimum duration |

### Attendance Rules

#### Default Settings
- **Grace Period**: 15 minutes late allowance
- **Minimum Duration**: 4 hours for full attendance
- **Cutoff Time**: 10:00 AM for late marking
- **Working Days**: Monday to Friday

#### Customizing Rules (Admin Only)
1. Settings → "Attendance Rules"
2. Modify time parameters
3. Set custom holidays
4. Define user-specific rules

## Reports and Analytics

### Dashboard Analytics

#### Today's Report
- Live attendance count
- Present vs. absent breakdown
- Real-time updates
- Quick export options

#### Weekly Summary
- Daily attendance trends
- Average attendance rate
- Top/bottom performers
- Comparative analysis

#### Monthly Overview
- Full month statistics
- Attendance patterns
- Holiday impacts
- Trend analysis

### Detailed Reports

#### Attendance Report
**Access**: Reports → "Attendance Report"

**Filters**:
- Date range (from/to)
- Specific users
- Department/role
- Status filter

**Output Options**:
- View in browser
- Export to CSV
- Export to Excel
- Print format

#### User Performance Report
**Features**:
- Individual attendance rates
- Duration analysis
- Punctuality metrics
- Absence patterns

#### Summary Reports
- Department-wise statistics
- Role-based analysis
- Seasonal trends
- Comparative metrics

### Exporting Data

#### CSV Export
```
Name,Date,Entry Time,Exit Time,Duration,Status
John Doe,2023-07-15,09:15 AM,05:30 PM,8h 15m,Present
Jane Smith,2023-07-15,09:45 AM,05:00 PM,7h 15m,Late
```

#### Excel Export
- Formatted spreadsheets
- Multiple sheets (summary, details)
- Charts and graphs included
- Ready for further analysis

#### PDF Reports
- Professional formatting
- Company branding
- Executive summaries
- Detailed appendices

## Hardware Terminal

### Daily Operations

#### Power On/Off
1. **Power On**:
   - Connect USB power cable
   - Wait for WiFi connection
   - LCD shows "System Ready"

2. **Power Off**:
   - Disconnect power cable
   - Data is automatically saved

#### Normal Operation
1. **Idle State**:
   ```
   ┌─────────────────┐
   │ Attendee v2.0  │
   │ Scan your card  │
   │ WiFi: Connected │
   │ Time: 09:15 AM  │
   └─────────────────┘
   ```

2. **Card Scanning**:
   - Hold RFID card near reader
   - Wait for beep and LED flash
   - Check LCD for confirmation

3. **Success Confirmation**:
   - Green LED lights up
   - Short beep sound
   - LCD shows user name and action

#### Error Handling

##### Common Issues:
1. **Unknown Card**:
   ```
   ┌─────────────────┐
   │ Unknown Card    │
   │ Please register │
   │ Card: ABC123456 │
   │ Contact admin   │
   └─────────────────┘
   ```

2. **Network Error**:
   ```
   ┌─────────────────┐
   │ Network Error   │
   │ Storing locally │
   │ Will sync later │
   │ Try again: 30s  │
   └─────────────────┘
   ```

3. **User Inactive**:
   ```
   ┌─────────────────┐
   │ Account Locked  │
   │ John Doe        │
   │ Contact admin   │
   │ Code: INACTIVE  │
   └─────────────────┘
   ```

### Maintenance

#### Weekly Checks
- Clean RFID reader surface
- Check LED indicators
- Verify LCD display clarity
- Test buzzer functionality

#### Monthly Maintenance
- Check power connections
- Update firmware if available
- Backup configuration
- Test network connectivity

#### Troubleshooting Hardware

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| No display | Power issue | Check USB connection |
| Cards not reading | Dirty reader | Clean with alcohol wipe |
| No network | WiFi down | Check router, restart device |
| Wrong time | RTC battery | Replace backup battery |

## Troubleshooting

### Common Issues

#### Login Problems

**Issue**: Can't log in with correct credentials
**Solutions**:
1. Check caps lock is off
2. Clear browser cache and cookies
3. Try incognito/private mode
4. Check with administrator

**Issue**: Forgot password
**Solutions**:
1. Click "Forgot Password" on login screen
2. Enter registered email address
3. Check email for reset link
4. Follow reset instructions

#### Attendance Issues

**Issue**: RFID card not working
**Diagnostics**:
1. Check if card is registered in system
2. Verify user account is active
3. Test card on different reader
4. Check for physical damage

**Solutions**:
1. Re-register card with user account
2. Activate user account if needed
3. Request replacement card
4. Use manual attendance entry temporarily

**Issue**: Attendance not showing on dashboard
**Checks**:
1. Verify time sync between terminal and server
2. Check network connectivity
3. Confirm user permissions
4. Refresh browser page

#### System Performance

**Issue**: Slow loading times
**Optimizations**:
1. Clear browser cache
2. Check internet connection speed
3. Close unnecessary browser tabs
4. Contact administrator for server status

**Issue**: Real-time updates not working
**Solutions**:
1. Refresh browser page
2. Check network connectivity
3. Verify WebSocket connection
4. Restart browser

### Getting Help

#### Self-Service Resources
1. **Documentation**: Check this user guide
2. **FAQ**: Visit FAQ section in settings
3. **Video Tutorials**: Access help → tutorials
4. **System Status**: Check status page

#### Contacting Support

**Internal Support**:
- Contact your system administrator
- Submit ticket through help desk
- Include error screenshots
- Provide step-by-step description

**Technical Support**:
- Email: support@launchlog.com
- Phone: +1-800-LAUNCH-LOG
- Include system version and error details
- Response within 24 hours

#### Reporting Bugs

**Bug Report Template**:
```
Title: Brief description of issue
Steps to reproduce:
1. First step
2. Second step
3. Error occurs

Expected behavior: What should happen
Actual behavior: What actually happens
Browser: Chrome/Firefox/Safari version
Screenshots: Attach if applicable
```

### Best Practices

#### For Administrators
1. **Regular Backups**:
   - Schedule daily database backups
   - Test restore procedures monthly
   - Store backups in multiple locations

2. **User Management**:
   - Review user accounts quarterly
   - Deactivate unused accounts
   - Update roles as needed

3. **System Monitoring**:
   - Check system logs daily
   - Monitor attendance patterns
   - Review error reports

#### For Users
1. **RFID Cards**:
   - Keep cards clean and undamaged
   - Don't share cards with others
   - Report lost cards immediately

2. **Account Security**:
   - Use strong passwords
   - Log out after use
   - Don't share login credentials

3. **Attendance Accuracy**:
   - Scan in/out consistently
   - Report missed scans promptly
   - Verify attendance records regularly

## Advanced Features

### API Integration

For developers wanting to integrate with external systems:

- **REST API**: Full REST API available
- **WebSocket**: Real-time event streaming
- **Webhooks**: Push notifications to external systems
- **SDKs**: JavaScript and Python SDKs available

See [API_REFERENCE.md](API_REFERENCE.md) for complete documentation.

### Custom Reports

Create custom reports using the query builder:
1. Reports → "Custom Report"
2. Select data fields
3. Set filters and conditions
4. Choose output format
5. Save for reuse

### Automated Notifications

Set up automatic notifications for:
- Daily attendance summaries
- Absence alerts
- System status updates
- Performance reports

Configure in Settings → "Notifications"

## Appendices

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open search | Ctrl/Cmd + K |
| Quick attendance | Ctrl/Cmd + A |
| New user | Ctrl/Cmd + U |
| Export data | Ctrl/Cmd + E |
| Refresh page | F5 |

### System Requirements

#### Minimum Browser Requirements
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

#### Network Requirements
- Minimum: 1 Mbps internet connection
- Recommended: 10 Mbps for multiple concurrent users
- Ports: 80 (HTTP), 443 (HTTPS), 3000 (WebSocket)

### Glossary

**RFID**: Radio Frequency Identification - wireless technology for card scanning
**JWT**: JSON Web Token - secure authentication method
**API**: Application Programming Interface - system integration method
**WebSocket**: Real-time communication protocol
**CSV**: Comma Separated Values - data export format
