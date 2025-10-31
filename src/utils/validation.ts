import { PatientFormData, TreatmentOption } from '../types/patient';

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePatientForm = (data: PatientFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Họ tên phải có ít nhất 2 ký tự'
    });
  } else if (!validateVietnameseName(data.name)) {
    errors.push({
      field: 'name',
      message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
    });
  } else if (!validateInputLength(data.name, 2, 100)) {
    errors.push({
      field: 'name',
      message: 'Họ tên phải từ 2 đến 100 ký tự'
    });
  }

  // Birth year validation
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(data.birthYear);
  
  if (!data.birthYear || isNaN(birthYear)) {
    errors.push({
      field: 'birthYear',
      message: 'Năm sinh không hợp lệ'
    });
  } else if (birthYear < 1900 || birthYear > currentYear) {
    errors.push({
      field: 'birthYear',
      message: `Năm sinh phải từ 1900 đến ${currentYear}`
    });
  }

  // Patient code validation
  if (!data.patientCode || data.patientCode.trim().length < 3) {
    errors.push({
      field: 'patientCode',
      message: 'Mã số bệnh nhân phải có ít nhất 3 ký tự'
    });
  } else if (!validatePatientCode(data.patientCode.toUpperCase())) {
    errors.push({
      field: 'patientCode',
      message: 'Mã số bệnh nhân chỉ được chứa chữ cái và số (3-20 ký tự)'
    });
  }

  // Room number validation
  if (!data.roomNumber || data.roomNumber.trim().length < 1) {
    errors.push({
      field: 'roomNumber',
      message: 'Số phòng không được để trống'
    });
  } else if (!validateRoomNumber(data.roomNumber)) {
    errors.push({
      field: 'roomNumber',
      message: 'Số phòng không được vượt quá 50 ký tự'
    });
  }

  // Reason validation
  if (!data.reason || data.reason.trim().length < 5) {
    errors.push({
      field: 'reason',
      message: 'Lý do vào viện phải có ít nhất 5 ký tự'
    });
  } else if (!validateInputLength(data.reason, 5, 500)) {
    errors.push({
      field: 'reason',
      message: 'Lý do vào viện phải từ 5 đến 500 ký tự'
    });
  }

  // Diagnosis validation
  if (!data.diagnosis || data.diagnosis.trim().length < 3) {
    errors.push({
      field: 'diagnosis',
      message: 'Chẩn đoán phải có ít nhất 3 ký tự'
    });
  } else if (!validateInputLength(data.diagnosis, 3, 500)) {
    errors.push({
      field: 'diagnosis',
      message: 'Chẩn đoán phải từ 3 đến 500 ký tự'
    });
  }

  // Surgery details validation (if surgery is selected)
  if (data.treatmentOptions?.includes(TreatmentOption.SURGERY)) {
    if (data.surgeryProcedure && data.surgeryProcedure.trim().length > 0 && data.surgeryProcedure.trim().length < 3) {
      errors.push({
        field: 'surgeryProcedure',
        message: 'Xử trí phải có ít nhất 3 ký tự'
      });
    }
    
    if (data.surgeon && data.surgeon.trim().length > 0 && data.surgeon.trim().length < 2) {
      errors.push({
        field: 'surgeon',
        message: 'Tên phẫu thuật viên phải có ít nhất 2 ký tự'
      });
    }
  }

  return errors;
};

export interface SanitizeInputOptions {
  skipCharacterWhitelist?: boolean;
  maxLength?: number;
}

export const sanitizeInput = (input: string, options: SanitizeInputOptions = {}): string => {
  const { skipCharacterWhitelist = false, maxLength = 1000 } = options;

  let sanitized = input
    .replace(/^\s+/, '') // Only remove leading whitespace, allow trailing spaces during typing
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers

  // Normalize composed characters (e.g., Vietnamese tone marks) to preserve accents correctly
  // Use NFC normalization to ensure proper Vietnamese character composition
  sanitized = sanitized.normalize('NFC');

  sanitized = sanitized.replace(/script/gi, ''); // Remove script keywords after normalization

  if (!skipCharacterWhitelist) {
    // Enhanced Vietnamese character support including all Unicode ranges for Vietnamese
    // \u00C0-\u00FF: Latin Extended-A (basic accented characters)
    // \u0100-\u017F: Latin Extended-A (additional)
    // \u0180-\u024F: Latin Extended-B
    // \u1E00-\u1EFF: Latin Extended Additional (Vietnamese tone marks)
    // \u0300-\u036F: Combining Diacritical Marks
    sanitized = sanitized.replace(/[^\w\s\u00C0-\u00FF\u0100-\u024F\u1E00-\u1EFF\u0300-\u036F.,!?()/-]/gu, '');
  }

  return sanitized.substring(0, maxLength); // Limit length
};

export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const validateInputLength = (input: string, min: number, max: number): boolean => {
  return input.length >= min && input.length <= max;
};

export const validateVietnameseName = (name: string): boolean => {
  const vietnameseNameRegex = /^[a-zA-Z\u00C0-\u1EF9\s]+$/;
  return vietnameseNameRegex.test(name) && name.trim().length >= 2;
};

export const validatePatientCode = (code: string): boolean => {
  const patientCodeRegex = /^[A-Z0-9]{3,20}$/;
  return patientCodeRegex.test(code);
};

export const validateRoomNumber = (room: string): boolean => {
  if (typeof room !== 'string') {
    return false;
  }

  const trimmed = room.trim();
  return trimmed.length > 0 && trimmed.length <= 50;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};