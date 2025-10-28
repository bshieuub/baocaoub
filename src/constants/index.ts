import { AdmissionStatus, TreatmentOption } from '../types/patient';

// Patient Status Colors
export const PATIENT_STATUS_COLORS = {
  [AdmissionStatus.INPATIENT]: 'bg-blue-100 text-blue-800',
  [AdmissionStatus.DISCHARGE_TODAY]: 'bg-yellow-100 text-yellow-800',
  [AdmissionStatus.DISCHARGED]: 'bg-green-100 text-green-800',
} as const;

// Treatment Options
export const TREATMENT_OPTIONS = Object.values(TreatmentOption);

// Form Validation Limits
export const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  PATIENT_CODE_MIN: 3,
  PATIENT_CODE_MAX: 20,
  ROOM_NUMBER_MIN: 1,
  ROOM_NUMBER_MAX: 10,
  REASON_MIN: 5,
  REASON_MAX: 500,
  DIAGNOSIS_MIN: 3,
  DIAGNOSIS_MAX: 500,
  NOTES_MAX: 1000,
  SURGERY_PROCEDURE_MAX: 200,
  SURGEON_MAX: 100,
} as const;

// API Configuration
export const API_CONFIG = {
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  AUTO_HIDE_SUCCESS_DELAY: 3000,
  PAGINATION_SIZE: 50,
  SEARCH_MIN_LENGTH: 2,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  AUTH_ERROR: 'Lỗi xác thực. Vui lòng đăng nhập lại.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PATIENT_ADDED: 'Thêm bệnh nhân thành công',
  PATIENT_UPDATED: 'Cập nhật thông tin bệnh nhân thành công',
  PATIENT_DELETED: 'Xóa bệnh nhân thành công',
  DATA_SYNCED: 'Đồng bộ dữ liệu thành công',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DATA: 'offline_data',
  LAST_SYNC: 'last_sync',
  THEME: 'theme',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  VIETNAMESE_NAME: /^[a-zA-Z\u00C0-\u1EF9\s]+$/,
  PATIENT_CODE: /^[A-Z0-9]{3,20}$/,
  ROOM_NUMBER: /^[A-Z0-9]{1,10}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
} as const;

// Print Configuration
export const PRINT_CONFIG = {
  PAGE_SIZE: 'A4',
  MARGIN: '1.5cm',
  FONT_SIZE: '11pt',
  LINE_HEIGHT: 1.4,
} as const;