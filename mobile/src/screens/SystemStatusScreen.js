import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/theme';
import BaseScreen from '../components/BaseScreen';

const SystemStatusScreen = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSystemStatus = async () => {
    try {
      // Mock system status data
      const mockStatus = {
        database: {
          status: 'connected',
          responseTime: '15ms',
          lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        server: {
          status: 'running',
          uptime: '7d 12h 45m',
          memoryUsage: '68%',
          cpuUsage: '24%'
        },
        hardware: {
          rfidReader: 'connected',
          lastHeartbeat: new Date(Date.now() - 30 * 1000).toISOString()
        },
        stats: {
          totalUsers: 42,
          activeToday: 18,
          totalAttendance: 1247
        }
      };
      
      setSystemStatus(mockStatus);
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSystemStatus();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'running':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
      case 'disconnected':
        return theme.colors.error;
      default:
        return theme.colors.gray[400];
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  if (loading) {
    return (
      <BaseScreen title="System Status">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.black} />
          <Text style={styles.loadingText}>Loading System Status...</Text>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="System Status">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{systemStatus?.stats?.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{systemStatus?.stats?.activeToday}</Text>
              <Text style={styles.statLabel}>Active Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{systemStatus?.stats?.totalAttendance}</Text>
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
          </View>
        </View>

        {/* Database Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={styles.statusValue}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(systemStatus?.database?.status) }
                ]} />
                <Text style={[styles.statusText, { color: getStatusColor(systemStatus?.database?.status) }]}>
                  {systemStatus?.database?.status?.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Response Time</Text>
              <Text style={styles.statusText}>{systemStatus?.database?.responseTime}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Last Backup</Text>
              <Text style={styles.statusText}>
                {formatDateTime(systemStatus?.database?.lastBackup)}
              </Text>
            </View>
          </View>
        </View>

        {/* Server Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={styles.statusValue}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(systemStatus?.server?.status) }
                ]} />
                <Text style={[styles.statusText, { color: getStatusColor(systemStatus?.server?.status) }]}>
                  {systemStatus?.server?.status?.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Uptime</Text>
              <Text style={styles.statusText}>{systemStatus?.server?.uptime}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Memory Usage</Text>
              <Text style={styles.statusText}>{systemStatus?.server?.memoryUsage}</Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>CPU Usage</Text>
              <Text style={styles.statusText}>{systemStatus?.server?.cpuUsage}</Text>
            </View>
          </View>
        </View>

        {/* Hardware Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hardware</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>RFID Reader</Text>
              <View style={styles.statusValue}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(systemStatus?.hardware?.rfidReader) }
                ]} />
                <Text style={[styles.statusText, { color: getStatusColor(systemStatus?.hardware?.rfidReader) }]}>
                  {systemStatus?.hardware?.rfidReader?.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Last Heartbeat</Text>
              <Text style={styles.statusText}>
                {formatDateTime(systemStatus?.hardware?.lastHeartbeat)}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Download Logs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.restartButton]} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Restart System</Text>
          </TouchableOpacity>
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
  
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    borderRadius: theme.borderRadius.base,
  },
  
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.black,
  },
  
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.xs,
  },
  
  statusCard: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.base,
  },
  
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  
  statusLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    flex: 1,
  },
  
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
  },
  
  actionButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing.md,
  },
  
  restartButton: {
    backgroundColor: theme.colors.error,
  },
  
  actionButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default SystemStatusScreen;
