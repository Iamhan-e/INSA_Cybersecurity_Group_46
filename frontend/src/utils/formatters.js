// src/utils/formatters.js
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

// ========================================
// DATE FORMATTING
// ========================================

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format pattern (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'Never';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

/**
 * Format timestamp to time only
 * @param {string|Date} date - Date to format
 * @returns {string} Time string
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm:ss');
};

// ========================================
// STATUS FORMATTING
// ========================================

/**
 * Get status badge classes based on status
 * @param {string} status - Status value ('active', 'blocked', etc.)
 * @returns {object} CSS classes for badge
 */
export const getStatusBadgeClasses = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  const classes = {
    active: 'bg-success-100 text-success-700 border-success-200',
    blocked: 'bg-danger-100 text-danger-700 border-danger-200',
    pending: 'bg-warning-100 text-warning-700 border-warning-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  return classes[statusLower] || classes.inactive;
};

/**
 * Format status text for display
 * @param {string} status - Status value
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// ========================================
// ROLE FORMATTING
// ========================================

/**
 * Get role badge classes
 * @param {string} role - User role ('admin', 'student')
 * @returns {string} CSS classes for badge
 */
export const getRoleBadgeClasses = (role) => {
  const roleLower = role?.toLowerCase() || '';
  
  const classes = {
    admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    student: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  return classes[roleLower] || classes.student;
};

/**
 * Format role text for display
 * @param {string} role - Role value
 * @returns {string} Formatted role
 */
export const formatRole = (role) => {
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

// ========================================
// MAC ADDRESS FORMATTING
// ========================================

/**
 * Format MAC address to consistent format
 * @param {string} mac - MAC address
 * @returns {string} Formatted MAC address
 */
export const formatMacAddress = (mac) => {
  if (!mac) return 'N/A';
  
  // Remove any existing separators and convert to uppercase
  const cleaned = mac.replace(/[:-]/g, '').toUpperCase();
  
  // Add colons every 2 characters
  return cleaned.match(/.{1,2}/g)?.join(':') || mac;
};

// ========================================
// NUMBER FORMATTING
// ========================================

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// ========================================
// TEXT FORMATTING
// ========================================

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Check if date is recent (within last 24 hours)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if recent
 */
export const isRecent = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return dateObj > oneDayAgo;
  } catch (error) {
    return false;
  }
};

/**
 * Check if device is online (last seen within 5 minutes)
 * @param {string|Date} lastSeen - Last seen timestamp
 * @returns {boolean} True if online
 */
export const isDeviceOnline = (lastSeen) => {
  if (!lastSeen) return false;
  
  try {
    const dateObj = typeof lastSeen === 'string' ? parseISO(lastSeen) : lastSeen;
    if (!isValid(dateObj)) return false;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return dateObj > fiveMinutesAgo;
  } catch (error) {
    return false;
  }
};

