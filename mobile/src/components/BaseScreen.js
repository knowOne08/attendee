import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, commonStyles } from '../utils/theme';

const BaseScreen = ({ 
  children, 
  title, 
  showBackButton = false, 
  rightAction = null,
  showDrawerButton = true 
}) => {
  const navigation = useNavigation();

  const handleDrawerToggle = () => {
    navigation.toggleDrawer();
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleBackPress}
              activeOpacity={0.8}
            >
              <Text style={styles.headerButtonText}>←</Text>
            </TouchableOpacity>
          ) : showDrawerButton ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDrawerToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.headerButtonText}>☰</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerButton} />
          )}
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.headerRight}>
          {rightAction || <View style={styles.headerButton} />}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    backgroundColor: theme.colors.white,
  },
  
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerButtonText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.black,
  },
  
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  content: {
    flex: 1,
  },
});

export default BaseScreen;
