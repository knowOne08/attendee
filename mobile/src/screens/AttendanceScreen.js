import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { attendanceAPI } from '../services/api';
import { theme } from '../utils/theme';
import BaseScreen from '../components/BaseScreen';

const AttendanceScreen = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState({});

  const formatDateIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getTodayAttendance();
      
      const attendanceRecords = response.data.attendance || response.data || [];
      setAttendanceData(attendanceRecords);
      setFilteredData(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      showError('Failed to load attendance data. Please try again.');
      
      // Fallback to empty data instead of mock data
      setAttendanceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceData();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === '') {
      setFilteredData(attendanceData);
    } else {
      const filtered = attendanceData.filter(record =>
        record.user.name.toLowerCase().includes(text.toLowerCase()) ||
        record.user.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const getSelectedSession = (recordId, sessions) => {
    const sessionIndex = selectedSessions[recordId];
    if (sessionIndex === undefined) {
      return sessions[sessions.length - 1];
    }
    return sessions[sessionIndex] || sessions[sessions.length - 1];
  };

  const handleSessionSelect = (recordId, sessionIndex) => {
    setSelectedSessions(prev => ({
      ...prev,
      [recordId]: sessionIndex
    }));
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (loading) {
    return (
      <BaseScreen title="Attendance">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.black} />
          <Text style={styles.loadingText}>Loading Attendance...</Text>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Attendance">
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor={theme.colors.gray[400]}
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>

        {/* Attendance List */}
        <ScrollView
          style={styles.attendanceList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredData.length > 0 ? (
            filteredData.map((record) => {
              const selectedSession = getSelectedSession(record._id, record.sessions);
              return (
                <View key={record._id} style={styles.attendanceCard}>
                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {record.user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{record.user.name}</Text>
                      <Text style={styles.userEmail}>{record.user.email}</Text>
                    </View>
                  </View>

                  {/* Attendance Details */}
                  <View style={styles.attendanceDetails}>
                    <View style={styles.attendanceHeader}>
                      <Text style={styles.attendanceDate}>
                        {formatDateIST(record.date)}
                      </Text>
                      {record.sessions.length > 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            const currentIndex = selectedSessions[record._id] || record.sessions.length - 1;
                            const nextIndex = (currentIndex + 1) % record.sessions.length;
                            handleSessionSelect(record._id, nextIndex);
                          }}
                          style={styles.sessionButton}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.sessionButtonText}>
                            Session {(selectedSessions[record._id] || record.sessions.length - 1) + 1}/{record.sessions.length}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.timeRow}>
                      <View style={styles.timeEntry}>
                        <Text style={styles.timeLabel}>Entry</Text>
                        <Text style={styles.timeValue}>
                          {formatTimeIST(selectedSession.entry)}
                        </Text>
                      </View>
                      <View style={styles.timeEntry}>
                        <Text style={styles.timeLabel}>Exit</Text>
                        <Text style={styles.timeValue}>
                          {selectedSession.exit ? formatTimeIST(selectedSession.exit) : '--'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchTerm ? 'No attendance records found' : 'No attendance data available'}
              </Text>
            </View>
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
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
  },
  
  attendanceList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  
  attendanceCard: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  userAvatarText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
  
  userDetails: {
    flex: 1,
  },
  
  userName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs / 2,
  },
  
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  
  attendanceDetails: {},
  
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  attendanceDate: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
  },
  
  sessionButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
  },
  
  sessionButtonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  timeEntry: {
    flex: 1,
  },
  
  timeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  
  timeValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
  },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  
  emptyStateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default AttendanceScreen;
