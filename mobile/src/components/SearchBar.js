import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search" }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={searchTerm}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
  },
});

export default SearchBar;
