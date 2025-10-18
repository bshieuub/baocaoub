export enum AdmissionStatus {
  INPATIENT = 'Nội trú',
  DISCHARGED = 'Ra viện',
  DISCHARGE_TODAY = 'Dự kiến ra viện',
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
}

export interface SyncStatus {
  status: 'idle' | 'loading' | 'syncing' | 'success' | 'error';
  error?: string;
}