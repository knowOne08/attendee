import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../components/LoadingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import MembersScreen from '../screens/MembersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddUserScreen from '../screens/AddUserScreen';
import SignupScreen from '../screens/SignupScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ManualAttendanceScreen from '../screens/ManualAttendanceScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';
import SystemStatusScreen from '../screens/SystemStatusScreen';
import DeviceAdminScreen from '../screens/DeviceAdminScreen';

// Custom Drawer
import CustomDrawerContent from '../components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: theme.colors.gray[50],
          width: 280,
        },
        overlayColor: 'rgba(0,0,0,0.3)',
      }}
    >
      {/* Primary Navigation */}
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

      {/* Admin/Mentor Only Screens */}
      {(user?.role === 'admin' || user?.role === 'mentor') && (
        <>
          <Drawer.Screen 
            name="ManualAttendance" 
            component={ManualAttendanceScreen}
            options={{ title: 'Manual Entry' }}
          />
          <Drawer.Screen 
            name="AttendanceHistory" 
            component={AttendanceHistoryScreen}
            options={{ title: 'History' }}
          />
        </>
      )}

      {/* Admin Only Screens */}
      {user?.role === 'admin' && (
        <>
          <Drawer.Screen 
            name="Attendance" 
            component={AttendanceScreen}
            options={{ title: 'Attendance' }}
          />
          <Drawer.Screen 
            name="Members" 
            component={MembersScreen}
            options={{ title: 'Members' }}
          />
          <Drawer.Screen 
            name="AddUser" 
            component={AddUserScreen}
            options={{ title: 'Add User' }}
          />
          <Drawer.Screen 
            name="SystemStatus" 
            component={SystemStatusScreen}
            options={{ title: 'System Status' }}
          />
          <Drawer.Screen 
            name="DeviceAdmin" 
            component={DeviceAdminScreen}
            options={{ title: 'Device Admin' }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.white },
      }}
    >
      <Stack.Screen name="DrawerNav" component={DrawerNavigator} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.white },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen
            name="Main"
            component={MainStackNavigator}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
