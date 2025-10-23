import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import { colors, spacing } from '../utils/theme';
import { systemAPI } from '../services/api';
import { API_BASE_URL } from '../utils/config';

const NetworkTestScreen = ({ navigation }) => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runNetworkTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    const results = [];
    
    // Test 1: Check API Base URL configuration
    results.push({
      test: 'API Configuration',
      status: 'info',
      message: `Using API Base URL: ${API_BASE_URL}`,
      timestamp: new Date().toISOString()
    });
    
    // Test 2: Basic connectivity test
    try {
      const startTime = Date.now();
      const response = await systemAPI.healthCheck();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      results.push({
        test: 'Health Check',
        status: 'success',
        message: `✅ Connected successfully (${responseTime}ms)`,
        data: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        test: 'Health Check',
        status: 'error',
        message: `❌ Connection failed: ${error.message}`,
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Test 3: API Info endpoint
    try {
      const response = await systemAPI.getApiInfo();
      results.push({
        test: 'API Info',
        status: 'success',
        message: '✅ API info retrieved successfully',
        data: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        test: 'API Info',
        status: 'error',
        message: `❌ API info failed: ${error.message}`,
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Test 4: Network speed test (multiple requests)
    try {
      const promises = Array.from({ length: 5 }, () => {
        const startTime = Date.now();
        return systemAPI.healthCheck().then(() => Date.now() - startTime);
      });
      
      const times = await Promise.all(promises);
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      results.push({
        test: 'Network Speed',
        status: avgTime < 1000 ? 'success' : 'warning',
        message: `⚡ Average response time: ${avgTime.toFixed(0)}ms`,
        data: { times, average: avgTime },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        test: 'Network Speed',
        status: 'error',
        message: `❌ Speed test failed: ${error.message}`,
        error: error.response?.data || error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    setTestResults(results);
    setTesting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.primary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <BaseScreen title="Network Test" navigation={navigation}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Test network connectivity to the backend server and diagnose any connection issues.
          </Text>

          <TouchableOpacity
            style={[styles.testButton, testing && styles.buttonDisabled]}
            onPress={runNetworkTests}
            disabled={testing}
          >
            {testing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.testButtonText}>Run Network Tests</Text>
            )}
          </TouchableOpacity>

          {testResults.map((result, index) => (
            <View key={index} style={[styles.resultCard, { borderLeftColor: getStatusColor(result.status) }]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultIcon}>{getStatusIcon(result.status)}</Text>
                <Text style={styles.resultTest}>{result.test}</Text>
              </View>
              
              <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
                {result.message}
              </Text>
              
              {result.data && (
                <Text style={styles.resultData}>
                  Data: {JSON.stringify(result.data, null, 2)}
                </Text>
              )}
              
              {result.error && (
                <Text style={styles.resultError}>
                  Error: {JSON.stringify(result.error, null, 2)}
                </Text>
              )}
              
              <Text style={styles.resultTimestamp}>
                {new Date(result.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}

          {testResults.length > 0 && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>Troubleshooting Tips:</Text>
              <Text style={styles.instructionText}>
                • Make sure your Mac and phone are on the same WiFi network{'\n'}
                • Check that the backend server is running on port 3000{'\n'}
                • Try restarting the Expo development server{'\n'}
                • If using physical device, ensure firewall allows port 3000{'\n'}
                • Current API URL: {API_BASE_URL}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  testButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  resultData: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 6,
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  resultError: {
    fontSize: 12,
    color: colors.error,
    backgroundColor: '#ffebee',
    padding: spacing.sm,
    borderRadius: 6,
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  resultTimestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  instructions: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.xl,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default NetworkTestScreen;
