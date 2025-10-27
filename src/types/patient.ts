export enum AdmissionStatus {
  INPATIENT = 'Nội trú',
  DISCHARGED = 'Ra viện',
  DISCHARGE_TODAY = 'Dự kiến ra viện',
}

export enum TreatmentDirection {
  SURGERY = 'phẫu thuật',
  CHEMOTHERAPY = 'hoá trị',
  PALLIATIVE_CARE = 'chăm sóc giảm nhẹ',
}

export interface SurgeryDetails {
  method: string;
  surgeryDate: string;
  mainSurgeon: string;
  assistant1: string;
  assistant2: string;
}

export interface PatientHistoryEntry {
  date: string;
  diagnosis: string;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  birthYear: number;
  patientCode: string;
  roomNumber: string;
  reason: string;
  diagnosis: string;
  status: AdmissionStatus;
  notes: string;
  treatmentDirection?: TreatmentDirection;
  surgeryDetails?: SurgeryDetails;
  history?: PatientHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormData {
  name: string;
  birthYear: string;
  patientCode: string;
  roomNumber: string;
  reason: string;
  diagnosis: string;
  status: AdmissionStatus;
  newNote: string;
  treatmentDirection?: TreatmentDirection;
  surgeryDetails?: SurgeryDetails;
}

export interface SyncStatus {
  status: 'idle' | 'loading' | 'syncing' | 'success' | 'error';
  error?: string;
}