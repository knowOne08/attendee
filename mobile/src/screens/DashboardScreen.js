import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, attendanceAPI, systemAPI } from '../services/api';
import { theme, commonStyles } from '../utils/theme';
import BaseScreen from '../components/BaseScreen';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState({});

  // Get current month's first and last day
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    };
  };

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

  const fetchDashboardData = async () => {
    try {
      // Test connection first
      await systemAPI.testConnection();
      
      // Fetch current user profile directly
      const profileResponse = await userAPI.getMyProfile();
      setProfile(profileResponse);
      
      // Fetch recent attendance data
      try {
        const attendanceResponse = await attendanceAPI.getMyAttendance({ limit: 5 });
        setAttendanceData(attendanceResponse.attendance || []);
      } catch (attendanceError) {
        setAttendanceData([]);
      }
      
      // Fetch attendance stats
      try {
        const statsResponse = await attendanceAPI.getAttendanceStats();
        setAttendanceStats(statsResponse.stats || {
          attendanceDays: 0,
          workingDaysInMonth: 0,
          attendancePercentage: 0
        });
      } catch (statsError) {
        setAttendanceStats({
          attendanceDays: 0,
          workingDaysInMonth: 0,
          attendancePercentage: 0
        });
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <BaseScreen title="Dashboard">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.black} />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Dashboard">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
        </View>

        {/* Stats Cards */}
        {attendanceStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{attendanceStats.attendanceDays}</Text>
              <Text style={styles.statLabel}>Days Present</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{attendanceStats.attendancePercentage}%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
          </View>
        )}

        {/* Recent Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {attendanceData.length > 0 ? (
            attendanceData.map((record) => {
              const selectedSession = getSelectedSession(record._id, record.sessions);
              return (
                <View key={record._id} style={styles.attendanceCard}>
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
                      >
                        <Text style={styles.sessionButtonText}>
                          Session {(selectedSessions[record._id] || record.sessions.length - 1) + 1}/{record.sessions.length}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.attendanceDetails}>
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
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent attendance data</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {(user?.role === 'admin' || user?.role === 'mentor') && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('ManualAttendance')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>Manual Entry</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('AttendanceHistory')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>View History</Text>
                </TouchableOpacity>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Members')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>Manage Members</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Attendance')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>View Attendance</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
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
  
  welcomeSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing['2xl'],
    alignItems: 'center',
  },
  
  welcomeTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  
  userName: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  
  userRole: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    borderRadius: theme.borderRadius.base,
  },
  
  statNumber: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
    fontWeight: theme.fontWeight.medium,
  },
  
  attendanceCard: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  attendanceDate: {
    fontSize: theme.fontSize.base,
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
  
  attendanceDetails: {
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
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
  },
  
  emptyState: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  
  emptyStateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  actionsContainer: {
    gap: theme.spacing.md,
  },
  
  actionButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
  },
  
  actionButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default DashboardScreen;
