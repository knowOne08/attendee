import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/contexts/ToastContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <AppNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}
