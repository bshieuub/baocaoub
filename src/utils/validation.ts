import { PatientFormData, TreatmentDirection } from '../types/patient';

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
  }

  // Room number validation
  if (!data.roomNumber || data.roomNumber.trim().length < 1) {
    errors.push({
      field: 'roomNumber',
      message: 'Số phòng không được để trống'
    });
  }

  // Reason validation
  if (!data.reason || data.reason.trim().length < 5) {
    errors.push({
      field: 'reason',
      message: 'Lý do vào viện phải có ít nhất 5 ký tự'
    });
  }

  // Diagnosis validation
  if (!data.diagnosis || data.diagnosis.trim().length < 3) {
    errors.push({
      field: 'diagnosis',
      message: 'Chẩn đoán phải có ít nhất 3 ký tự'
    });
  }

  // Surgery details validation
  if (data.treatmentDirection === TreatmentDirection.SURGERY && data.surgeryDetails) {
    if (!data.surgeryDetails.method || data.surgeryDetails.method.trim().length < 3) {
      errors.push({
        field: 'surgeryMethod',
        message: 'Phương pháp phẫu thuật phải có ít nhất 3 ký tự'
      });
    }

    if (!data.surgeryDetails.surgeryDate) {
      errors.push({
        field: 'surgeryDate',
        message: 'Ngày mổ không được để trống'
      });
    }

    if (!data.surgeryDetails.mainSurgeon || data.surgeryDetails.mainSurgeon.trim().length < 2) {
      errors.push({
        field: 'mainSurgeon',
        message: 'Phẫu thuật viên chính phải có ít nhất 2 ký tự'
      });
    }
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};