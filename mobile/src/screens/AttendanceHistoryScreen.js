import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import SearchBar from '../components/SearchBar';
import { colors, spacing, typography } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { attendanceAPI, userAPI } from '../services/api';
import { formatDateIST, formatTimeIST, getCurrentISTDate } from '../utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

const AttendanceHistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users for attendance history...');
      const response = await userAPI.getUsers();
      
      // Handle different response structures
      let usersData;
      if (Array.isArray(response)) {
        usersData = response;
      } else if (response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data.users) {
          usersData = response.data.users;
        } else {
          usersData = [];
        }
      } else {
        usersData = [];
      }
      
      console.log('👥 Users for attendance loaded:', usersData.length);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        limit: 100
      };
      
      const response = await attendanceAPI.getAttendanceHistory(params);
      const attendanceList = response.data.attendance || response.data || [];
      
      // Enrich with user data
      const enrichedData = attendanceList.map(record => {
        const userData = users.find(u => u._id === record.userId);
        return {
          ...record,
          userName: userData?.name || 'Unknown User',
          userEmail: userData?.email || '',
          userRole: userData?.role || 'member'
        };
      });
      
      setAttendanceData(enrichedData);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
      showError('Failed to load attendance history');
      
      // Set empty data instead of mock data for production readiness
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchAttendanceHistory()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchAttendanceHistory();
    }
  }, [users, dateRange]);

  useEffect(() => {
    let filtered = [...attendanceData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(record => !record.checkOutTime);
    } else if (filter === 'completed') {
      filtered = filtered.filter(record => record.checkOutTime);
    }
    
    // Sort by check-in time (newest first)
    filtered.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
    
    setFilteredData(filtered);
  }, [searchTerm, attendanceData, filter]);

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

  const calculateDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return '--';
    
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut - checkIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  const getTotalStats = () => {
    const totalRecords = filteredData.length;
    const activeRecords = filteredData.filter(r => !r.checkOutTime).length;
    const completedRecords = filteredData.filter(r => r.checkOutTime).length;
    const totalHours = filteredData.reduce((sum, record) => {
      if (record.checkInTime && record.checkOutTime) {
        const duration = (new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60);
        return sum + duration;
      }
      return sum;
    }, 0);

    return { totalRecords, activeRecords, completedRecords, totalHours: totalHours.toFixed(1) };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <BaseScreen title="Attendance History" navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Attendance History" navigation={navigation}>
      <View style={styles.container}>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          placeholder="Search by name or email..."
        />

        {/* Date Range Filter */}
        <View style={styles.filtersContainer}>
          <View style={styles.dateFilters}>
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

          {/* Status Filter */}
          <View style={styles.statusFilters}>
            {['all', 'active', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.filterButtonActive
                ]}
                onPress={() => setFilter(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === status && styles.filterButtonTextActive
                ]}>
                  {status.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
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

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalRecords}</Text>
            <Text style={styles.statLabel}>Total Records</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.activeRecords}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedRecords}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalHours}h</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.attendanceList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredData.length === 0 ? (
            <Text style={styles.noData}>
              {searchTerm || filter !== 'all' 
                ? 'No attendance records found matching your criteria' 
                : 'No attendance records found for the selected date range'
              }
            </Text>
          ) : (
            filteredData.map((record) => (
              <TouchableOpacity 
                key={record._id} 
                style={styles.attendanceCard}
                onPress={() => navigation.navigate('UserDetail', { id: record.userId })}
              >
                <View style={styles.attendanceHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{record.userName}</Text>
                    <Text style={styles.userEmail}>{record.userEmail}</Text>
                  </View>
                  <Text style={[
                    styles.attendanceStatus,
                    { 
                      color: record.checkOutTime ? colors.success : colors.warning,
                      backgroundColor: record.checkOutTime ? colors.success + '20' : colors.warning + '20'
                    }
                  ]}>
                    {record.checkOutTime ? 'COMPLETED' : 'ACTIVE'}
                  </Text>
                </View>
                
                <View style={styles.attendanceDetails}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Date:</Text>
                    <Text style={styles.timeValue}>{formatDateIST(record.checkInTime)}</Text>
                  </View>
                  
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Check In:</Text>
                    <Text style={styles.timeValue}>{formatTimeIST(record.checkInTime)}</Text>
                  </View>
                  
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Check Out:</Text>
                    <Text style={styles.timeValue}>
                      {record.checkOutTime ? formatTimeIST(record.checkOutTime) : 'Still active'}
                    </Text>
                  </View>
                  
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Duration:</Text>
                    <Text style={[styles.timeValue, styles.duration]}>
                      {calculateDuration(record.checkInTime, record.checkOutTime)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
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
  },
  filtersContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  dateFilters: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
  statusFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 1,
  },
  attendanceList: {
    flex: 1,
  },
  attendanceCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  attendanceStatus: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  attendanceDetails: {
    padding: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  timeLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  timeValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
  duration: {
    color: colors.success,
  },
  noData: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    fontStyle: 'italic',
  },
});

export default AttendanceHistoryScreen;
