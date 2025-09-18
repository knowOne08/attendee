import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { theme, commonStyles } from '../utils/theme';
import { testNetworkConnection, logNetworkInfo } from '../utils/networkTest';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login, isAuthenticated, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to dashboard/home screen
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleNetworkTest = async () => {
    logNetworkInfo();
    const result = await testNetworkConnection();
    
    Alert.alert(
      'Network Test',
      result.success ? '✅ ' + result.message : '❌ ' + result.message,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[commonStyles.title, styles.title]}>
                Login
              </Text>
              <Text style={[commonStyles.subtitle, styles.subtitle]}>
                Attendee1
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    commonStyles.input,
                    styles.input,
                    emailFocused && commonStyles.inputFocused
                  ]}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.gray[400]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    commonStyles.input,
                    styles.input,
                    passwordFocused && commonStyles.inputFocused
                  ]}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.gray[400]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={[commonStyles.errorText, styles.errorText]}>
                    {error}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    styles.button,
                    loading && styles.buttonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.colors.white} size="small" />
                  ) : (
                    <Text style={[commonStyles.buttonText, styles.buttonText]}>
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Network Test Button (Development only) */}
              {__DEV__ && (
                <View style={styles.debugContainer}>
                  <TouchableOpacity
                    style={styles.debugButton}
                    onPress={handleNetworkTest}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.debugButtonText}>
                      Test Network Connection
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  
  header: {
    marginBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  
  title: {
    marginBottom: theme.spacing.sm,
  },
  
  subtitle: {
    // Additional styling if needed
  },
  
  form: {
    // Additional styling if needed
  },
  
  inputContainer: {
    marginBottom: theme.spacing['2xl'],
  },
  
  input: {
    // Additional styling if needed
  },
  
  errorContainer: {
    paddingVertical: theme.spacing.md,
  },
  
  errorText: {
    // Additional styling if needed
  },
  
  buttonContainer: {
    paddingTop: theme.spacing['2xl'],
  },
  
  button: {
    // Additional styling if needed
  },
  
  buttonText: {
    // Additional styling if needed
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  debugContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  
  debugButton: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  
  debugButtonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default LoginScreen;
