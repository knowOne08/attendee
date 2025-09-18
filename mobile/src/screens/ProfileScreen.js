import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import { colors, spacing, typography } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userAPI, attendanceAPI } from '../services/api';
import { formatDateIST, formatTimeIST } from '../utils/dateUtils';

const ProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout } = useAuth();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    profilePicture: '',
    skills: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyProfile();
      const userData = response.data.user;
      setProfile(userData);
      
      // Initialize form data
      setFormData({
        email: userData.email || '',
        phone: userData.phone || '',
        profilePicture: userData.profilePicture || '',
        skills: userData.skills ? userData.skills.join(', ') : '',
        bio: userData.bio || '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      showError('Failed to load profile data');
      // Use current user data as fallback
      setProfile(user);
      setFormData({
        email: user?.email || '',
        phone: user?.phone || '',
        profilePicture: user?.profilePicture || '',
        skills: user?.skills ? user.skills.join(', ') : '',
        bio: user?.bio || '',
        password: '',
        confirmPassword: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      setAttendanceLoading(true);
      // Get last 10 attendance records
      const response = await attendanceAPI.getMyAttendance({ limit: 10 });
      setAttendanceData(response.data.attendance || []);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
      showError('Failed to load attendance history');
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAttendanceHistory();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic length check)
    if (formData.phone && (formData.phone.length < 10 || formData.phone.length > 15)) {
      newErrors.phone = 'Phone number should be 10-15 characters';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Profile picture URL validation (basic)
    if (formData.profilePicture && !formData.profilePicture.startsWith('http')) {
      newErrors.profilePicture = 'Please enter a valid URL (starting with http)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setUpdating(true);

    try {
      const updateData = { ...formData };
      
      // Parse skills
      if (updateData.skills) {
        updateData.skills = updateData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
      
      // Don't send password if empty
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      } else {
        delete updateData.confirmPassword;
      }

      const response = await userAPI.updateMyProfile(updateData);
      
      // Update profile state
      setProfile(response.data.user);
      updateUser(response.data.user);
      
      setIsEditing(false);
      success('Profile updated successfully');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <BaseScreen title="Profile" navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </BaseScreen>
    );
  }

  const currentProfile = profile || user;

  return (
    <BaseScreen title="Profile" navigation={navigation}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>{currentProfile?.name || 'User Name'}</Text>
          <Text style={styles.role}>{currentProfile?.role?.toUpperCase() || 'MEMBER'}</Text>
        </View>

        {!isEditing ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROFILE INFORMATION</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{currentProfile?.name || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{currentProfile?.email || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{currentProfile?.role?.toUpperCase() || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{currentProfile?.phone || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{currentProfile?.status?.toUpperCase() || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>RFID Tag</Text>
                <Text style={styles.value}>{currentProfile?.rfidTag || 'N/A'}</Text>
              </View>
              {currentProfile?.skills && currentProfile.skills.length > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Skills</Text>
                  <Text style={styles.value}>{currentProfile.skills.join(', ')}</Text>
                </View>
              )}
              {currentProfile?.bio && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Bio</Text>
                  <Text style={styles.value}>{currentProfile.bio}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RECENT ATTENDANCE</Text>
              {attendanceLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : attendanceData.length > 0 ? (
                attendanceData.slice(0, 5).map((record, index) => (
                  <View key={index} style={styles.attendanceRow}>
                    <Text style={styles.attendanceDate}>
                      {formatDateIST(record.checkInTime)}
                    </Text>
                    <Text style={styles.attendanceTime}>
                      {formatTimeIST(record.checkInTime)} - {record.checkOutTime ? formatTimeIST(record.checkOutTime) : 'Active'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noData}>No recent attendance records</Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDIT PROFILE</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Skills (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={formData.skills}
                onChangeText={(value) => handleInputChange('skills', value)}
                placeholder="e.g. React, Node.js, Python"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                multiline
                numberOfLines={3}
                placeholder="Tell us about yourself..."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password (leave blank to keep current)</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {formData.password && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setIsEditing(false);
                  setErrors({});
                  // Reset form data
                  setFormData({
                    email: currentProfile?.email || '',
                    phone: currentProfile?.phone || '',
                    profilePicture: currentProfile?.profilePicture || '',
                    skills: currentProfile?.skills ? currentProfile.skills.join(', ') : '',
                    bio: currentProfile?.bio || '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveButton, updating && styles.buttonDisabled]} 
                onPress={handleSubmit}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  attendanceRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  attendanceDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  attendanceTime: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
  },
  noData: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    fontStyle: 'italic',
    paddingVertical: spacing.lg,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  editButtonText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderBottomColor: colors.error,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
});

export default ProfileScreen;
