// src/utils/constants.js

// ========================================
// API CONFIGURATION
// ========================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ========================================
// PROFESSIONAL COLOR SCHEME
// ========================================
export const COLORS = {
  // Status colors
  STATUS: {
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    blocked: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-700'
    },
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700'
    }
  },
  
  // Role colors
  ROLE: {
    admin: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-700'
    },
    student: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      badge: 'bg-slate-100 text-slate-700'
    }
  }
};

// ========================================
// PROFESSIONAL UI STYLES
// ========================================
export const UI = {
  // Layout
  SIDEBAR: {
    width: 'w-64',
    bg: 'bg-slate-900',
    text: 'text-slate-300',
    activeText: 'text-white',
    activeBg: 'bg-slate-800',
    hoverBg: 'hover:bg-slate-800'
  },
  
  HEADER: {
    bg: 'bg-white',
    border: 'border-b border-slate-200',
    text: 'text-slate-700'
  },
  
  // Cards
  CARD: {
    base: 'bg-white rounded-lg shadow-sm border border-slate-200',
    hover: 'hover:shadow-md transition-shadow duration-200',
    padding: 'p-6'
  },
  
  // Buttons
  BUTTON: {
    primary: 'bg-accent-600 hover:bg-accent-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2',
    success: 'bg-success-600 hover:bg-success-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2',
    outline: 'border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
    ghost: 'text-slate-700 hover:bg-slate-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200'
  },
  
  // Input
  INPUT: {
    base: 'w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors duration-200',
    error: 'border-danger-500 focus:ring-danger-500',
    disabled: 'bg-slate-50 text-slate-500 cursor-not-allowed'
  },
  
  // Table
  TABLE: {
    wrapper: 'overflow-hidden rounded-lg border border-slate-200',
    base: 'min-w-full divide-y divide-slate-200',
    header: 'bg-slate-50',
    headerCell: 'px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider',
    body: 'bg-white divide-y divide-slate-200',
    row: 'hover:bg-slate-50 transition-colors duration-150',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-slate-700'
  },
  
  // Badge
  BADGE: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  },
  
  // Modal
  MODAL: {
    overlay: 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50',
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    content: 'bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',
    header: 'px-6 py-4 border-b border-slate-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-slate-200 bg-slate-50'
  }
};

// ========================================
// APPLICATION CONSTANTS
// ========================================
export const APP = {
  NAME: 'ESP32 NAC Admin',
  MAX_DEVICES_PER_USER: 5,
  TOKEN_REFRESH_INTERVAL: 14 * 60 * 1000, // 14 minutes (token expires at 15)
  AUTO_REFRESH_INTERVAL: 30 * 1000, // 30 seconds for stats
};

// ========================================
// PAGINATION
// ========================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100]
};

// ========================================
// STATUS OPTIONS
// ========================================
export const STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked'
};

export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: STATUS.ACTIVE, label: 'Active' },
  { value: STATUS.BLOCKED, label: 'Blocked' }
];

// ========================================
// ROLE OPTIONS
// ========================================
export const ROLE = {
  ADMIN: 'admin',
  STUDENT: 'student'
};

export const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: ROLE.ADMIN, label: 'Admin' },
  { value: ROLE.STUDENT, label: 'Student' }
];

// ========================================
// DATE FORMATS
// ========================================
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy HH:mm',
  TIME: 'HH:mm:ss',
  FULL: 'yyyy-MM-dd HH:mm:ss'
};

// ========================================
// ERROR MESSAGES
// ========================================
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.'
};

// ========================================
// SUCCESS MESSAGES
// ========================================
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully.',
  USER_BLOCKED: 'User blocked successfully.',
  USER_UNBLOCKED: 'User unblocked successfully.',
  USER_DELETED: 'User deleted successfully.',
  DEVICE_BLOCKED: 'Device blocked successfully.',
  DEVICE_UNBLOCKED: 'Device unblocked successfully.',
  DEVICE_DELETED: 'Device deleted successfully.'
};