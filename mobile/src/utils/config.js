// Environment configuration
// Update these URLs to match your backend setup

export const config = {
  development: {
    // For Expo development - choose based on your setup:
    
    // For Expo running on same machine (current IP):
    // apiUrl: 'http://172.20.10.2:3000',
    
    // Alternative URLs for Expo:
    // apiUrl: 'http://localhost:3000',     // Sometimes works with Expo
    // apiUrl: 'http://10.0.2.2:3000',     // For Android emulator (if using vanilla RN)
    // apiUrl: 'http://127.0.0.1:3000',    // Alternative localhost
    
    // If using Expo Go on physical device, use your computer's IP:
    // apiUrl: 'http://192.168.1.2:3000',  // Your computer's IP (current setting)
  },
  production: {
    apiUrl: 'https://api.xrocketry.in', // Replace with your production URL
  }
};

// Determine current environment
// const isDevelopment = __DEV__;
const isDevelopment = false;

export const API_BASE_URL = isDevelopment  
  ? config.development.apiUrl 
  : config.production.apiUrl;

export default config;
