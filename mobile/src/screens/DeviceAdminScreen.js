import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { theme } from '../utils/theme';
import BaseScreen from '../components/BaseScreen';

const DeviceAdminScreen = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');

  const fetchDevices = async () => {
    try {
      // Mock devices data
      const mockDevices = [
        {
          id: 'RFID001',
          name: 'Main Entrance Reader',
          status: 'online',
          lastSeen: new Date(Date.now() - 30 * 1000).toISOString(),
          location: 'Main Entrance',
          type: 'RFID Reader'
        },
        {
          id: 'RFID002',
          name: 'Lab Access Reader',
          status: 'offline',
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'Lab Room',
          type: 'RFID Reader'
        }
      ];
      
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDevices();
    setRefreshing(false);
  };

  const handleAddDevice = () => {
    if (!newDeviceId.trim()) {
      Alert.alert('Error', 'Please enter a device ID');
      return;
    }

    // Mock adding device
    const newDevice = {
      id: newDeviceId.trim(),
      name: `Device ${newDeviceId.trim()}`,
      status: 'pending',
      lastSeen: new Date().toISOString(),
      location: 'Unknown',
      type: 'RFID Reader'
    };

    setDevices(prev => [...prev, newDevice]);
    setNewDeviceId('');
    setShowAddDevice(false);
    Alert.alert('Success', 'Device added successfully');
  };

  const handleRemoveDevice = (deviceId) => {
    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove device ${deviceId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(device => device.id !== deviceId));
            Alert.alert('Success', 'Device removed successfully');
          }
        }
      ]
    );
  };

  const handleTestDevice = (deviceId) => {
    Alert.alert('Test Device', `Testing connection to ${deviceId}...`);
    // Mock test result
    setTimeout(() => {
      Alert.alert('Test Result', 'Device responded successfully');
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return theme.colors.success;
      case 'offline':
        return theme.colors.error;
      case 'pending':
        return theme.colors.warning;
      default:
        return theme.colors.gray[400];
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) {
    return (
      <BaseScreen title="Device Admin">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.black} />
          <Text style={styles.loadingText}>Loading Devices...</Text>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen 
      title="Device Admin"
      rightAction={
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowAddDevice(!showAddDevice)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerButtonText}>+</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.container}>
        {/* Add Device Form */}
        {showAddDevice && (
          <View style={styles.addDeviceForm}>
            <Text style={styles.addDeviceTitle}>Add New Device</Text>
            <TextInput
              style={styles.deviceInput}
              placeholder="Enter Device ID"
              placeholderTextColor={theme.colors.gray[400]}
              value={newDeviceId}
              onChangeText={setNewDeviceId}
            />
            <View style={styles.addDeviceActions}>
              <TouchableOpacity
                style={[styles.addDeviceButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddDevice(false);
                  setNewDeviceId('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addDeviceButton}
                onPress={handleAddDevice}
                activeOpacity={0.8}
              >
                <Text style={styles.addDeviceButtonText}>Add Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Devices List */}
        <ScrollView
          style={styles.devicesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {devices.length > 0 ? (
            devices.map((device) => (
              <View key={device.id} style={styles.deviceCard}>
                {/* Device Header */}
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </View>
                  <View style={styles.deviceStatus}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(device.status) }
                    ]} />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(device.status) }
                    ]}>
                      {device.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Device Details */}
                <View style={styles.deviceDetails}>
                  <View style={styles.deviceDetailRow}>
                    <Text style={styles.deviceDetailLabel}>Type</Text>
                    <Text style={styles.deviceDetailValue}>{device.type}</Text>
                  </View>
                  <View style={styles.deviceDetailRow}>
                    <Text style={styles.deviceDetailLabel}>Location</Text>
                    <Text style={styles.deviceDetailValue}>{device.location}</Text>
                  </View>
                  <View style={styles.deviceDetailRow}>
                    <Text style={styles.deviceDetailLabel}>Last Seen</Text>
                    <Text style={styles.deviceDetailValue}>
                      {formatDateTime(device.lastSeen)}
                    </Text>
                  </View>
                </View>

                {/* Device Actions */}
                <View style={styles.deviceActions}>
                  <TouchableOpacity
                    style={styles.deviceActionButton}
                    onPress={() => handleTestDevice(device.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deviceActionButtonText}>Test</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deviceActionButton, styles.removeButton]}
                    onPress={() => handleRemoveDevice(device.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deviceActionButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No devices configured</Text>
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
  
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerButtonText: {
    fontSize: theme.fontSize['2xl'],
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold,
  },
  
  addDeviceForm: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.base,
  },
  
  addDeviceTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  deviceInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    marginBottom: theme.spacing.lg,
  },
  
  addDeviceActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  addDeviceButton: {
    flex: 1,
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  
  addDeviceButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  cancelButtonText: {
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  devicesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  
  deviceCard: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  
  deviceInfo: {
    flex: 1,
  },
  
  deviceName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs / 2,
  },
  
  deviceId: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  
  deviceStatus: {
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
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  deviceDetails: {
    marginBottom: theme.spacing.lg,
  },
  
  deviceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  
  deviceDetailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  deviceDetailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    fontWeight: theme.fontWeight.medium,
  },
  
  deviceActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  deviceActionButton: {
    flex: 1,
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  
  removeButton: {
    backgroundColor: theme.colors.error,
  },
  
  deviceActionButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
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

export default DeviceAdminScreen;
