import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { theme, commonStyles } from '../utils/theme';

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const navigationGroups = {
    primary: [
      { name: 'Dashboard', title: 'Dashboard' },
      { name: 'Profile', title: 'Profile' }
    ],
    management: [
      { name: 'Attendance', title: 'Attendance', adminOnly: true },
      { name: 'Members', title: 'Members', adminOnly: true },
      { name: 'AddUser', title: 'Add User', adminOnly: true }
    ],
    tools: [
      { name: 'ManualAttendance', title: 'Manual Entry', adminOrMentor: true },
      { name: 'AttendanceHistory', title: 'History', adminOrMentor: true }
    ],
    system: [
      { name: 'SystemStatus', title: 'System Status', adminOnly: true },
      { name: 'DeviceAdmin', title: 'Device Admin', adminOnly: true }
    ]
  };

  const shouldShowLink = (link) => {
    if (link.adminOnly && user?.role !== 'admin') return false;
    if (link.adminOrMentor && !['admin', 'mentor'].includes(user?.role)) return false;
    return true;
  };

  const renderNavSection = (title, items) => {
    const visibleItems = items.filter(shouldShowLink);
    if (visibleItems.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {visibleItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.drawerItem,
              props.state.routeNames[props.state.index] === item.name && styles.activeDrawerItem
            ]}
            onPress={() => props.navigation.navigate(item.name)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.drawerItemText,
              props.state.routeNames[props.state.index] === item.name && styles.activeDrawerItemText
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Attendee1</Text>
          <Text style={styles.appSubtitle}>Mobile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Navigation Sections */}
        <View style={styles.navigation}>
          {renderNavSection('', navigationGroups.primary)}
          
          {user?.role === 'admin' && renderNavSection('Management', navigationGroups.management)}
          
          {(user?.role === 'admin' || user?.role === 'mentor') && 
            renderNavSection('Tools', navigationGroups.tools)}
          
          {user?.role === 'admin' && renderNavSection('System', navigationGroups.system)}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  
  appTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    letterSpacing: -0.5,
  },
  
  appSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: theme.spacing.xs / 2,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  userAvatarText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
  },
  
  userDetails: {
    flex: 1,
  },
  
  userName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs / 2,
  },
  
  userRole: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  navigation: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  
  section: {
    marginBottom: theme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: theme.fontWeight.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
  },
  
  activeDrawerItem: {
    backgroundColor: theme.colors.gray[100],
  },
  
  drawerItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: theme.fontWeight.medium,
  },
  
  activeDrawerItemText: {
    color: theme.colors.black,
    fontWeight: theme.fontWeight.semibold,
  },
  
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  
  logoutText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: theme.fontWeight.medium,
  },
});

export default CustomDrawerContent;
