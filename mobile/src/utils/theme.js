// Theme configuration matching the frontend design philosophy
export const theme = {
  colors: {
    // Primary colors
    black: '#000000',
    white: '#ffffff',
    
    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    // Status colors
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    
    // Background
    background: '#ffffff',
    surface: '#f9fafb',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  borderRadius: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
};

// Common styles used across components
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 16,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  
  inputFocused: {
    borderBottomColor: '#000000',
  },
  
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
};

// Additional theme for compatibility with existing code
export const colors = {
  // Primary colors
  primary: '#000000',
  secondary: '#333333',
  
  // Text colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    placeholder: '#999999',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
  },
  
  // Border colors
  border: {
    light: '#e5e5e5',
    medium: '#cccccc',
  },
  
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Common colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};
