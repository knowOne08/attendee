import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    // For React Native, we'll use Alert for immediate feedback
    // You could also implement a custom toast component here
    if (type === 'error') {
      Alert.alert('Error', message);
    } else if (type === 'success') {
      Alert.alert('Success', message);
    } else {
      Alert.alert('Info', message);
    }
  };

  const success = (message) => showToast(message, 'success');
  const error = (message) => showToast(message, 'error');
  const info = (message) => showToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
    </ToastContext.Provider>
  );
};
