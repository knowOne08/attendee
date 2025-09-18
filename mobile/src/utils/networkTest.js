import { API_BASE_URL } from './config';

// Network test utility
export const testNetworkConnection = async () => {
  try {
    console.log('Testing connection to:', API_BASE_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ Network connection successful');
      return { success: true, message: 'Connection successful' };
    } else {
      console.log('❌ Server responded with error:', response.status);
      return { success: false, message: `Server error: ${response.status}` };
    }
  } catch (error) {
    console.log('❌ Network test failed:', error.message);
    
    if (error.name === 'AbortError') {
      return { success: false, message: 'Connection timeout - server not responding' };
    }
    
    return { success: false, message: `Network error: ${error.message}` };
  }
};

// Get suggested API URLs based on platform
export const getSuggestedAPIUrls = () => {
  const computerIP = '192.168.1.2'; // Your computer's IP
  
  return {
    'iOS Simulator': 'http://localhost:3000',
    'Android Emulator': 'http://10.0.2.2:3000',
    'Physical Device': `http://${computerIP}:3000`,
    'Current Setting': API_BASE_URL,
  };
};

export const logNetworkInfo = () => {
  console.log('=== NETWORK DEBUG INFO ===');
  console.log('Current API URL:', API_BASE_URL);
  console.log('Suggested URLs:', getSuggestedAPIUrls());
  console.log('========================');
};
