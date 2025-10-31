import { 
  validatePatientForm, 
  sanitizeInput, 
  validateVietnameseName, 
  validatePatientCode, 
  validateRoomNumber,
  validateEmail 
} from '../utils/validation';
import { PatientFormData, TreatmentOption, AdmissionStatus } from '../types/patient';

describe('Validation Utils', () => {
  describe('validatePatientForm', () => {
    const validFormData: PatientFormData = {
      name: 'Nguyễn Văn A',
      birthYear: '1990',
      patientCode: 'BN001',
      roomNumber: '101',
      reason: 'Khám sức khỏe định kỳ',
      diagnosis: 'Ung thư phổi',
      status: AdmissionStatus.INPATIENT,
      newNote: '',
      treatmentOptions: [TreatmentOption.CHEMOTHERAPY],
      surgeryProcedure: '',
      surgeryDate: '',
      surgeon: '',
      assistant1: '',
      assistant2: ''
    };

    it('should pass validation for valid data', () => {
      const errors = validatePatientForm(validFormData);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for empty name', () => {
      const data = { ...validFormData, name: '' };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Họ tên phải có ít nhất 2 ký tự'
      });
    });

    it('should fail validation for invalid name format', () => {
      const data = { ...validFormData, name: 'John123' };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
      });
    });

    it('should fail validation for invalid patient code', () => {
      const data = { ...validFormData, patientCode: 'bn-001' };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'patientCode',
        message: 'Mã số bệnh nhân chỉ được chứa chữ cái và số (3-20 ký tự)'
      });
    });

    it('should allow room numbers with special characters', () => {
      const data = { ...validFormData, roomNumber: 'Tầng 3 - Phòng #12/A' };
      const errors = validatePatientForm(data);
      expect(errors).not.toContainEqual(expect.objectContaining({ field: 'roomNumber' }));
    });

    it('should fail validation for room number that is too long', () => {
      const data = { ...validFormData, roomNumber: 'A'.repeat(51) };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'roomNumber',
        message: 'Số phòng không được vượt quá 50 ký tự'
      });
    });

    it('should fail validation for short reason', () => {
      const data = { ...validFormData, reason: 'OK' };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'reason',
        message: 'Lý do vào viện phải có ít nhất 5 ký tự'
      });
    });

    it('should fail validation for short diagnosis', () => {
      const data = { ...validFormData, diagnosis: 'OK' };
      const errors = validatePatientForm(data);
      expect(errors).toContainEqual({
        field: 'diagnosis',
        message: 'Chẩn đoán phải có ít nhất 3 ký tự'
      });
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
    });

    it('should remove javascript protocol', () => {
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      expect(sanitizeInput('onclick="alert(1)"')).toBe('alert(1)');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeInput(longString).length).toBe(1000);
    });

    it('should preserve Vietnamese characters', () => {
      expect(sanitizeInput('Nguyễn Văn A')).toBe('Nguyễn Văn A');
    });

    it('should keep additional characters when whitelist skipped', () => {
      expect(sanitizeInput('Phòng #12/A', { skipCharacterWhitelist: true, maxLength: 50 })).toBe('Phòng #12/A');
    });
  });

  describe('validateVietnameseName', () => {
    it('should accept valid Vietnamese names', () => {
      expect(validateVietnameseName('Nguyễn Văn A')).toBe(true);
      expect(validateVietnameseName('Trần Thị B')).toBe(true);
      expect(validateVietnameseName('Lê Hoàng C')).toBe(true);
    });

    it('should reject names with numbers', () => {
      expect(validateVietnameseName('Nguyễn Văn 123')).toBe(false);
    });

    it('should reject names with special characters', () => {
      expect(validateVietnameseName('Nguyễn@Văn')).toBe(false);
    });

    it('should reject short names', () => {
      expect(validateVietnameseName('A')).toBe(false);
    });
  });

  describe('validatePatientCode', () => {
    it('should accept valid patient codes', () => {
      expect(validatePatientCode('BN001')).toBe(true);
      expect(validatePatientCode('P123456')).toBe(true);
      expect(validatePatientCode('ABC123')).toBe(true);
    });

    it('should reject codes with special characters', () => {
      expect(validatePatientCode('BN-001')).toBe(false);
      expect(validatePatientCode('BN_001')).toBe(false);
    });

    it('should reject codes that are too short', () => {
      expect(validatePatientCode('AB')).toBe(false);
    });

    it('should reject codes that are too long', () => {
      expect(validatePatientCode('ABCDEFGHIJKLMNOPQRSTU')).toBe(false);
    });
  });

  describe('validateRoomNumber', () => {
    it('should accept room numbers with special characters', () => {
      expect(validateRoomNumber('Phòng #3A/2')).toBe(true);
      expect(validateRoomNumber('Tầng 5 - ICU')).toBe(true);
    });

    it('should reject empty room numbers', () => {
      expect(validateRoomNumber('')).toBe(false);
      expect(validateRoomNumber('   ')).toBe(false);
    });

    it('should reject room numbers that exceed length limit', () => {
      expect(validateRoomNumber('A'.repeat(51))).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });
});