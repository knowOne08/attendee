import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, typography } from '../utils/theme';
import { useToast } from '../contexts/ToastContext';

const MemberFormModal = ({ 
  isVisible, 
  onClose, 
  onSubmit, 
  member = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rfidTag: '',
    role: 'member',
    status: 'active',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const { error: showError } = useToast();

  useEffect(() => {
    if (member) {
      // Editing existing member
      setFormData({
        name: member.name || '',
        email: member.email || '',
        password: '', // Don't pre-fill password
        rfidTag: member.rfidTag || '',
        role: member.role || 'member',
        status: member.status || 'active',
        phone: member.phone || '',
      });
    } else {
      // Creating new member
      setFormData({
        name: '',
        email: '',
        password: '',
        rfidTag: '',
        role: 'member',
        status: 'active',
        phone: '',
      });
    }
    setErrors({});
  }, [member, isVisible]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.rfidTag.trim()) newErrors.rfidTag = 'RFID tag is required';
    
    // Password is required only for new members
    if (!member && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation (only if provided)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    try {
      const submitData = { ...formData };
      
      // Don't include password if it's empty (for updates)
      if (!submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>
            {member ? 'EDIT MEMBER' : 'ADD MEMBER'}
          </Text>
          
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Enter full name"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RFID Tag *</Text>
            <TextInput
              style={[styles.input, errors.rfidTag && styles.inputError]}
              value={formData.rfidTag}
              onChangeText={(value) => handleChange('rfidTag', value)}
              placeholder="Enter RFID tag"
              autoCapitalize="none"
            />
            {errors.rfidTag && <Text style={styles.errorText}>{errors.rfidTag}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Role *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                style={styles.picker}
              >
                <Picker.Item label="Member" value="member" />
                <Picker.Item label="Mentor" value="mentor" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Inactive" value="inactive" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Password {member ? '(leave blank to keep current)' : '*'}
            </Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder={member ? "Enter new password" : "Enter password"}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              * Required fields
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    letterSpacing: 2,
  },
  saveButton: {
    paddingVertical: spacing.sm,
  },
  saveText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontFamily: typography.fonts.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  form: {
    flex: 1,
    padding: spacing.lg,
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
  inputError: {
    borderBottomColor: colors.error,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  picker: {
    height: 50,
    color: colors.text.primary,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  noteContainer: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  noteText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MemberFormModal;
