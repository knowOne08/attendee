import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';

// Create axios instance - exactly like frontend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for mobile
});

// Log the API base URL for debugging
console.log('🔧 API Base URL:', API_BASE_URL);

// Request interceptor to add auth token - adapted for React Native
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors - adapted for React Native
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await AsyncStorage.multiRemove(['authToken', 'user']);
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
      // In mobile, you might want to navigate to login screen here
      // This should be handled by the calling component
    }
    return Promise.reject(error);
  }
);

// Auth API calls - exactly like frontend
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/users/me'), // Fixed: backend uses /users/me not /auth/me
  
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
};

// User management API calls - exactly like frontend
export const userAPI = {
  getUsers: (params) => 
    api.get('/users', { params }),
  
  getUser: (id) => 
    api.get(`/users/${id}`),
  
  createUser: (userData) => 
    api.post('/users', userData),
  
  updateUser: (id, userData) => 
    api.put(`/users/${id}`, userData),
  
  deleteUser: (id) => 
    api.delete(`/users/${id}`),
  
  toggleUserStatus: (id, status) => 
    api.put(`/users/${id}/status`, { status }),
  
  getUserStats: () => 
    api.get('/users/stats/summary'),
  
  // Member profile endpoints
  getMyProfile: () => 
    api.get('/users/me'),
  
  updateMyProfile: (userData) => 
    api.put('/users/me', userData),
  
  getMyAttendance: (params) => 
    api.get('/users/myAttendance', { params }),
};

// Attendance API calls - exactly like frontend
export const attendanceAPI = {
  getTodayAttendance: () => 
    api.get('/attendance/today'),
  
  getMyAttendance: (params) => 
    api.get('/attendance/my', { params }),
  
  getAttendanceHistory: (params) => 
    api.get('/attendance/history', { params }),
  
  getUserAttendance: (userId, params) => 
    api.get(`/attendance/user/${userId}`, { params }),
  
  getAttendanceStats: (params) => 
    api.get('/attendance/stats', { params }),
  
  deleteAttendance: (id) => 
    api.delete(`/attendance/${id}`),
  
  recordAttendance: (rfidTag, timestamp) => 
    api.post('/attendance', { rfidTag, timestamp }),

  // Manual attendance recording with type specification
  recordManualAttendance: (userId, timestamp, type) => 
    api.post('/attendance/manual', { userId, timestamp, type }),

  // Auto-cleanup endpoints
  autoSetExitTimes: () => 
    api.post('/attendance/auto-exit'),
  
  checkLowAttendanceAndNotify: () => 
    api.post('/attendance/check-low-attendance'),
};

// System API calls (utility endpoints) - exactly like frontend
export const systemAPI = {
  healthCheck: () => 
    api.get('/health'),
  
  getApiInfo: () => 
    api.get('/'),

  // Test network connectivity (mobile-specific)
  testConnection: async () => {
    try {
      console.log('🔍 Testing connection to:', API_BASE_URL);
      const response = await api.get('/health');
      console.log('✅ Connection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('🔧 Check if backend is running and URL is correct:', API_BASE_URL);
      throw error;
    }
  },
};

// Utility functions - adapted for React Native AsyncStorage
export const auth = {
  setToken: async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },
  
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  removeToken: async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'user']);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
  
  setUser: async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },
  
  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },
  
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
  
  isAdmin: async () => {
    try {
      const user = await auth.getUser();
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  isMentorOrAdmin: async () => {
    try {
      const user = await auth.getUser();
      return user?.role === 'admin' || user?.role === 'mentor';
    } catch (error) {
      console.error('Error checking mentor/admin status:', error);
      return false;
    }
  },
};

export default api;
