import { Patient, AdmissionStatus } from '../types/patient';

export const exportPatients = (patients: Patient[], filename?: string) => {
  const dataStr = JSON.stringify(patients, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `patients-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const exportPatientsCSV = (patients: Patient[], filename?: string) => {
  const headers = [
    'Tên',
    'Năm sinh',
    'MSBN',
    'Số phòng',
    'Lý do vào viện',
    'Chẩn đoán',
    'Tình trạng',
    'Ghi chú',
    'Hướng điều trị',
    'Ngày tạo',
    'Ngày cập nhật',
    'Ngày ra viện'
  ];

  const csvContent = [
    headers.join(','),
    ...patients.map(patient => [
      `"${patient.name || ''}"`,
      patient.birthYear || '',
      `"${patient.patientCode || ''}"`,
      `"${patient.roomNumber || ''}"`,
      `"${patient.reason || ''}"`,
      `"${patient.diagnosis || ''}"`,
      `"${patient.status || ''}"`,
      `"${patient.notes || ''}"`,
      `"${patient.treatmentOptions?.join('; ') || ''}"`,
      patient.createdAt || '',
      patient.updatedAt || '',
      patient.dischargedAt || ''
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `patients-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importPatients = (file: File): Promise<Patient[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const patients = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(patients)) {
          throw new Error('Dữ liệu không hợp lệ. File phải chứa danh sách bệnh nhân.');
        }
        
        // Basic validation for each patient
        const validatedPatients = patients.filter(patient => 
          patient && 
          typeof patient === 'object' && 
          patient.name && 
          patient.patientCode
        );
        
        if (validatedPatients.length !== patients.length) {
          console.warn('Một số bệnh nhân không hợp lệ đã bị loại bỏ.');
        }
        
        resolve(validatedPatients);
      } catch (error) {
        reject(new Error('Không thể đọc file. Vui lòng kiểm tra định dạng file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Không thể đọc file.'));
    };
    
    reader.readAsText(file);
  });
};

export const generateBackup = (patients: Patient[]) => {
  const backup = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: patients,
    metadata: {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status !== AdmissionStatus.DISCHARGED).length,
      dischargedPatients: patients.filter(p => p.status === AdmissionStatus.DISCHARGED).length,
    }
  };
  
  return backup;
};

export const restoreFromBackup = (backup: any): Patient[] => {
  if (!backup || !backup.data || !Array.isArray(backup.data)) {
    throw new Error('File backup không hợp lệ.');
  }
  
  return backup.data;
};