import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { attendanceAPI } from '../services/api';
import { theme } from '../utils/theme';
import BaseScreen from '../components/BaseScreen';

const ManualAttendanceScreen = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEntry = async () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a User ID');
      return;
    }

    try {
      setLoading(true);
      // Use the frontend's method signature: userId, timestamp, type
      await attendanceAPI.recordManualAttendance(userId.trim(), new Date().toISOString(), 'entry');
      Alert.alert('Success', 'Entry recorded successfully');
      setUserId('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to record entry');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a User ID');
      return;
    }

    try {
      setLoading(true);
      // Use the frontend's method signature: userId, timestamp, type
      await attendanceAPI.recordManualAttendance(userId.trim(), new Date().toISOString(), 'exit');
      Alert.alert('Success', 'Exit recorded successfully');
      setUserId('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to record exit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreen title="Manual Entry">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Manually record attendance entry or exit for a user by entering their User ID or RFID tag.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>User ID / RFID Tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter User ID or RFID tag"
              placeholderTextColor={theme.colors.gray[400]}
              value={userId}
              onChangeText={setUserId}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.entryButton, loading && styles.buttonDisabled]}
              onPress={handleEntry}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Record Entry</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.exitButton, loading && styles.buttonDisabled]}
              onPress={handleExit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Record Exit</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Instructions</Text>
            <Text style={styles.infoText}>
              • Enter the User ID or RFID tag of the person
              {'\n'}• Tap "Record Entry" when they arrive
              {'\n'}• Tap "Record Exit" when they leave
              {'\n'}• Multiple entries/exits are supported for the same day
            </Text>
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
  
  content: {
    padding: theme.spacing.md,
  },
  
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  inputLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.fontWeight.medium,
  },
  
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingVertical: theme.spacing.lg,
    fontSize: theme.fontSize.base,
    color: theme.colors.black,
    textAlign: 'center',
  },
  
  buttonContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  
  actionButton: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    borderRadius: theme.borderRadius.base,
  },
  
  entryButton: {
    backgroundColor: theme.colors.success,
  },
  
  exitButton: {
    backgroundColor: theme.colors.error,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  actionButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  infoCard: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.base,
  },
  
  infoTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
    fontWeight: theme.fontWeight.medium,
  },
  
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: 22,
  },
});

export default ManualAttendanceScreen;
