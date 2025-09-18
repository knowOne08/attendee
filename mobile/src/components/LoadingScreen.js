import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, commonStyles } from '../utils/theme';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={commonStyles.centerContainer}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.black} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  text: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default LoadingScreen;
