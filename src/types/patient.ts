export enum AdmissionStatus {
  INPATIENT = 'Nội trú',
  DISCHARGED = 'Ra viện',
  DISCHARGE_TODAY = 'Dự kiến ra viện',
}

export enum TreatmentOption {
  SURGERY = 'Phẫu thuật',
  CHEMOTHERAPY = 'Hóa trị',
  PALLIATIVE_CARE = 'Chăm sóc giảm nhẹ',
}

export interface SurgeryDetails {
  procedure: string;
  surgeryDate: string;
  surgeon: string;
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
  history?: PatientHistoryEntry[];
  // Treatment options
  treatmentOptions?: TreatmentOption[];
  surgeryDetails?: SurgeryDetails;
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
  // Treatment options
  treatmentOptions: TreatmentOption[];
  surgeryProcedure: string;
  surgeryDate: string;
  surgeon: string;
  assistant1: string;
  assistant2: string;
}

export interface SyncStatus {
  status: 'idle' | 'loading' | 'syncing' | 'success' | 'error';
  error?: string;
}