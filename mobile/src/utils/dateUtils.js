/**
 * Date utilities for IST conversion and formatting
 * Since database stores UTC dates correctly, these functions convert to IST for display
 */

/**
 * Convert UTC date to IST and format as time string
 * @param {string|Date} dateString - UTC date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted IST time string
 */
export const formatTimeIST = (dateString, options = {}) => {
  if (!dateString) return '--';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--';
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  };
  
  return date.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

/**
 * Convert UTC date to IST and format as date string
 * @param {string|Date} dateString - UTC date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted IST date string
 */
export const formatDateIST = (dateString, options = {}) => {
  if (!dateString) return '--';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Convert UTC date to IST and format as full datetime string
 * @param {string|Date} dateString - UTC date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted IST datetime string
 */
export const formatDateTimeIST = (dateString, options = {}) => {
  if (!dateString) return '--';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  };
  
  return date.toLocaleString('en-US', { ...defaultOptions, ...options });
};

/**
 * Calculate duration between two UTC dates and format as readable string
 * @param {string|Date} startDate - Start UTC date
 * @param {string|Date} endDate - End UTC date
 * @returns {string} - Formatted duration string (e.g., "2h 30m")
 */
export const formatDurationIST = (startDate, endDate) => {
  if (!startDate || !endDate) return '--';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '--';
  
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return '--';
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

/**
 * Get current IST date in ISO format for API requests
 * @returns {string} - Current IST date in YYYY-MM-DD format
 */
export const getCurrentISTDate = () => {
  const now = new Date();
  const istDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  return istDate.toISOString().split('T')[0];
};

/**
 * Get start of day in IST as UTC ISO string
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Start of day in UTC ISO format
 */
export const getStartOfDayISTasUTC = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  // Get start of day in IST
  const istStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Convert IST to UTC (subtract 5.5 hours)
  const utcStart = new Date(istStart.getTime() - (5.5 * 60 * 60 * 1000));
  
  return utcStart.toISOString();
};

/**
 * Get end of day in IST as UTC ISO string
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - End of day in UTC ISO format
 */
export const getEndOfDayISTasUTC = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  // Get end of day in IST (23:59:59.999)
  const istEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  
  // Convert IST to UTC (subtract 5.5 hours)
  const utcEnd = new Date(istEnd.getTime() - (5.5 * 60 * 60 * 1000));
  
  return utcEnd.toISOString();
};

/**
 * Check if a date is today in IST
 * @param {string|Date} dateString - Date string or Date object
 * @returns {boolean} - True if date is today in IST
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Convert to IST and compare dates
  const dateIST = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const todayIST = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  
  return (
    dateIST.getFullYear() === todayIST.getFullYear() &&
    dateIST.getMonth() === todayIST.getMonth() &&
    dateIST.getDate() === todayIST.getDate()
  );
};

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '--';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return 'in the future';
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  // For older dates, return formatted date
  return formatDateIST(dateString);
};
