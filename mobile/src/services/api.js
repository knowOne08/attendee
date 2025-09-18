import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Log the API base URL for debugging
console.log('🔧 API Base URL:', API_BASE_URL);

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
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
      // You might want to navigate to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.multiRemove(['authToken', 'user']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// User API
export const userAPI = {
  getUsers: async (params) => {
    try {
      const response = await api.get('/users', { params });
    //   console.log('Get users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
  
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
  
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
  
  toggleUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  },
  
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },
  
  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get my profile error:', error);
      throw error;
    }
  },
  
  updateMyProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Update my profile error:', error);
      throw error;
    }
  },
  
  getMyAttendance: async (params) => {
    try {
      const response = await api.get('/users/myAttendance', { params });
      return response.data;
    } catch (error) {
      console.error('Get my attendance error:', error);
      throw error;
    }
  }
};

// Attendance API  
export const attendanceAPI = {
  getTodayAttendance: async () => {
    try {
      const response = await api.get('/attendance/today');
      return response.data;
    } catch (error) {
      console.error('Get today attendance error:', error);
      throw error;
    }
  },
  
  getMyAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance/my', { params });
      return response.data;
    } catch (error) {
      console.error('Get my attendance error:', error);
      throw error;
    }
  },
  
  getAttendanceHistory: async (params = {}) => {
    try {
      const response = await api.get('/attendance/history', { params });
      return response.data;
    } catch (error) {
      console.error('Get attendance history error:', error);
      throw error;
    }
  },
  
  getUserAttendance: async (userId, params = {}) => {
    try {
      const response = await api.get(`/attendance/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get user attendance error:', error);
      throw error;
    }
  },
  
  getAttendanceStats: async (params = {}) => {
    try {
      const response = await api.get('/attendance/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get attendance stats error:', error);
      throw error;
    }
  },
  
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete attendance error:', error);
      throw error;
    }
  },
  
  recordAttendance: async (rfidTag, timestamp) => {
    try {
      const response = await api.post('/attendance', { rfidTag, timestamp });
      return response.data;
    } catch (error) {
      console.error('Record attendance error:', error);
      throw error;
    }
  },
  
  // Manual attendance recording with type specification
  recordManualAttendance: async (userId, timestamp, type) => {
    try {
      const response = await api.post('/attendance/manual', { userId, timestamp, type });
      return response.data;
    } catch (error) {
      console.error('Record manual attendance error:', error);
      throw error;
    }
  }
};

// System API (for device admin and system status)
export const systemAPI = {
  // Test network connectivity
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

  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },
  
  getApiInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Get API info error:', error);
      throw error;
    }
  },
  
  getSystemStatus: async () => {
    try {
      const response = await api.get('/system/status');
      return response.data;
    } catch (error) {
      console.error('Get system status error:', error);
      throw error;
    }
  },
  
  getDeviceInfo: async () => {
    try {
      const response = await api.get('/system/device');
      return response.data;
    } catch (error) {
      console.error('Get device info error:', error);
      throw error;
    }
  },
  
  updateDeviceConfig: async (config) => {
    try {
      const response = await api.put('/system/device', config);
      return response.data;
    } catch (error) {
      console.error('Update device config error:', error);
      throw error;
    }
  }
};

export default api;
