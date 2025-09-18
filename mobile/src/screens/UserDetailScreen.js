import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import { colors, spacing, typography } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userAPI, attendanceAPI } from '../services/api';
import { formatDateIST, formatTimeIST, getCurrentISTDate } from '../utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user: currentUser } = useAuth();
  const { error: showError } = useToast();
  
  const [user, setUser] = useState(null);
  const [userAttendance, setUserAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Check access permissions
  const canViewUserDetails = currentUser?.role === 'admin' || currentUser?.role === 'mentor' || currentUser?._id === id;

  // Redirect if not authorized
  useEffect(() => {
    if (currentUser && !canViewUserDetails) {
      navigation.goBack();
      showError('You do not have permission to view this user\'s details');
    }
  }, [currentUser, canViewUserDetails, navigation]);

  // Fetch user details
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.getUser(id);
      setUser(response.data.user || response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.error || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user attendance
  const fetchUserAttendance = async () => {
    setAttendanceLoading(true);
    
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        limit: 100
      };
      
      const response = await attendanceAPI.getUserAttendance(id, params);
      setUserAttendance(response.data.attendance || response.data || []);
    } catch (err) {
      console.error('Error fetching user attendance:', err);
      showError(err.response?.data?.error || 'Failed to fetch attendance records');
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // Fetch attendance when user or date range changes
  useEffect(() => {
    if (id) {
      fetchUserAttendance();
    }
  }, [id, dateRange]);

  const handleDateChange = (field, event, selectedDate) => {
    if (field === 'startDate') {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setDateRange(prev => ({ ...prev, [field]: dateString }));
    }
  };

  const calculateTotalHours = () => {
    return userAttendance.reduce((total, record) => {
      if (record.checkInTime && record.checkOutTime) {
        const checkIn = new Date(record.checkInTime);
        const checkOut = new Date(record.checkOutTime);
        const hours = (checkOut - checkIn) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <BaseScreen title="User Details" navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </BaseScreen>
    );
  }

  if (error) {
    return (
      <BaseScreen title="User Details" navigation={navigation}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUser}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </BaseScreen>
    );
  }

  if (!user) {
    return (
      <BaseScreen title="User Details" navigation={navigation}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title={user.name || 'User Details'} navigation={navigation}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <View style={styles.profileCard}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role?.toUpperCase()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE INFORMATION</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{user.role?.toUpperCase() || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[
              styles.value,
              { color: user.status === 'active' ? colors.success : colors.text.secondary }
            ]}>
              {user.status?.toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{user.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>RFID Tag</Text>
            <Text style={styles.value}>{user.rfidTag || 'N/A'}</Text>
          </View>
          {user.skills && user.skills.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Skills</Text>
              <Text style={styles.value}>{user.skills.join(', ')}</Text>
            </View>
          )}
          {user.bio && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bio</Text>
              <Text style={styles.value}>{user.bio}</Text>
            </View>
          )}
        </View>

        {/* Date Range Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ATTENDANCE RECORDS</Text>
          
          <View style={styles.dateFilterContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>From</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDateIST(dateRange.startDate)}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>To</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDateIST(dateRange.endDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={new Date(dateRange.startDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => handleDateChange('startDate', event, selectedDate)}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={new Date(dateRange.endDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => handleDateChange('endDate', event, selectedDate)}
            />
          )}

          {/* Attendance Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Days</Text>
              <Text style={styles.summaryValue}>{userAttendance.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Hours</Text>
              <Text style={styles.summaryValue}>{calculateTotalHours()}h</Text>
            </View>
          </View>

          {/* Attendance List */}
          {attendanceLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : userAttendance.length > 0 ? (
            userAttendance.map((record, index) => (
              <View key={index} style={styles.attendanceCard}>
                <View style={styles.attendanceHeader}>
                  <Text style={styles.attendanceDate}>
                    {formatDateIST(record.checkInTime)}
                  </Text>
                  <Text style={[
                    styles.attendanceStatus,
                    { color: record.checkOutTime ? colors.success : colors.warning }
                  ]}>
                    {record.checkOutTime ? 'COMPLETED' : 'ACTIVE'}
                  </Text>
                </View>
                <View style={styles.attendanceDetails}>
                  <Text style={styles.attendanceTime}>
                    Check In: {formatTimeIST(record.checkInTime)}
                  </Text>
                  {record.checkOutTime && (
                    <Text style={styles.attendanceTime}>
                      Check Out: {formatTimeIST(record.checkOutTime)}
                    </Text>
                  )}
                  {record.checkInTime && record.checkOutTime && (
                    <Text style={styles.attendanceDuration}>
                      Duration: {((new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60)).toFixed(2)}h
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No attendance records found for the selected date range</Text>
          )}
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 2,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  infoRow: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  dateLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  dateText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
  attendanceCard: {
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  attendanceDate: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
  attendanceStatus: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 1,
  },
  attendanceDetails: {
    padding: spacing.md,
  },
  attendanceTime: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  attendanceDuration: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.success,
    marginTop: spacing.xs,
  },
  noData: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});

export default UserDetailScreen;
