import { PatientService } from '../services/patientService';
import { Patient, AdmissionStatus, TreatmentOption } from '../types/patient';

// Mock Firebase
jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      get: jest.fn(),
      add: jest.fn(),
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn()
      }))
    }))
  }
}));

describe('PatientService', () => {
  const mockPatient: Patient = {
    id: '1',
    name: 'Nguyễn Văn A',
    birthYear: 1990,
    patientCode: 'BN001',
    roomNumber: '101',
    reason: 'Khám sức khỏe',
    diagnosis: 'Ung thư phổi',
    status: AdmissionStatus.INPATIENT,
    treatmentOptions: [TreatmentOption.CHEMOTHERAPY],
    notes: 'Bệnh nhân ổn định',
    history: [{
      date: '2024-01-01T00:00:00.000Z',
      diagnosis: 'Ung thư phổi',
      notes: 'Bệnh nhân ổn định'
    }],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPatients', () => {
    it('should return patients array', async () => {
      const mockCollection = {
        get: jest.fn().mockResolvedValue({
          docs: [{
            id: '1',
            data: () => mockPatient
          }]
        })
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      const result = await PatientService.getAllPatients();
      expect(result).toEqual([mockPatient]);
    });

    it('should handle empty collection', async () => {
      const mockCollection = {
        get: jest.fn().mockResolvedValue({
          docs: []
        })
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      const result = await PatientService.getAllPatients();
      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const mockCollection = {
        get: jest.fn().mockRejectedValue(new Error('Firebase error'))
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await expect(PatientService.getAllPatients()).rejects.toThrow('Không thể tải danh sách bệnh nhân');
    });
  });

  describe('addPatient', () => {
    it('should add patient successfully', async () => {
      const mockCollection = {
        add: jest.fn().mockResolvedValue({
          id: '1'
        })
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      const result = await PatientService.addPatient(mockPatient);
      expect(result).toBe('1');
      expect(mockCollection.add).toHaveBeenCalledWith(mockPatient);
    });

    it('should handle errors', async () => {
      const mockCollection = {
        add: jest.fn().mockRejectedValue(new Error('Firebase error'))
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await expect(PatientService.addPatient(mockPatient)).rejects.toThrow('Không thể thêm bệnh nhân mới');
    });
  });

  describe('updatePatient', () => {
    it('should update patient successfully', async () => {
      const mockDoc = {
        set: jest.fn().mockResolvedValue(undefined)
      };

      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await PatientService.updatePatient('1', mockPatient);
      expect(mockCollection.doc).toHaveBeenCalledWith('1');
      expect(mockDoc.set).toHaveBeenCalledWith(mockPatient);
    });

    it('should handle errors', async () => {
      const mockDoc = {
        set: jest.fn().mockRejectedValue(new Error('Firebase error'))
      };

      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await expect(PatientService.updatePatient('1', mockPatient)).rejects.toThrow('Không thể cập nhật thông tin bệnh nhân');
    });
  });

  describe('deletePatient', () => {
    it('should delete patient successfully', async () => {
      const mockDoc = {
        delete: jest.fn().mockResolvedValue(undefined)
      };

      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await PatientService.deletePatient('1');
      expect(mockCollection.doc).toHaveBeenCalledWith('1');
      expect(mockDoc.delete).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const mockDoc = {
        delete: jest.fn().mockRejectedValue(new Error('Firebase error'))
      };

      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDoc)
      };

      const { db } = require('../config/firebase');
      db.collection.mockReturnValue(mockCollection);

      await expect(PatientService.deletePatient('1')).rejects.toThrow('Không thể xóa bệnh nhân');
    });
  });
});